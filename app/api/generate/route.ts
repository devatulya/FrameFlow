import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import crypto from "crypto";
import { getUploadsDir, getGeneratedDir } from "@/lib/storage";

const execFileAsync = promisify(execFile);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function generateViaPythonApi(req: NextRequest, pythonData: any, outputPptxPath: string) {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const pyApiUrl = process.env.PYTHON_GENERATOR_URL || `${protocol}://${host}/api/generate_ppt`;

  console.log(`[PPT Generator] Invoking Python engine at: ${pyApiUrl}`);
  const resp = await fetch(pyApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pythonData),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Python API responded with status ${resp.status}: ${errText}`);
  }

  const result = await resp.json();
  if (!result.success || !result.pptx_base64) {
    throw new Error(result.error || "Failed to receive valid presentation payload from Python engine.");
  }

  const pptxBuffer = Buffer.from(result.pptx_base64, "base64");
  await writeFile(outputPptxPath, pptxBuffer);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const brandName = sanitizeFileName(data.brand?.name || "Brand");
    const projectName = sanitizeFileName(data.brand?.projectName || "Framework");
    const year = data.brand?.year || new Date().getFullYear();

    const fileName = `${brandName}_${projectName}_Creative_Framework_${year}.pptx`;
    const uploadsDir = getUploadsDir();
    const generatedDir = getGeneratedDir();

    // Map relative upload URLs to absolute filesystem paths for Python engine
    const processImages = (images: string[]) => {
      if (!Array.isArray(images)) return [];
      return images.map((img) => {
        if (img.startsWith("/uploads/")) {
          const rel = img.replace("/uploads/", "");
          return path.join(uploadsDir, rel);
        }
        return img;
      });
    };

    const pythonData = {
      ...data,
      wardrobe: {
        ...data.wardrobe,
        images: processImages(data.wardrobe?.images || []),
      },
      background: {
        ...data.background,
        images: processImages(data.background?.images || []),
      },
    };

    const tempJsonName = `input_${crypto.randomBytes(6).toString("hex")}.json`;
    const tempJsonPath = path.join(/*turbopackIgnore: true*/ uploadsDir, tempJsonName);
    const outputPptxPath = path.join(/*turbopackIgnore: true*/ generatedDir, fileName);

    await writeFile(tempJsonPath, JSON.stringify(pythonData, null, 2), "utf-8");

    try {
      const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.PYTHON_GENERATOR_URL);

      if (isServerless) {
        await generateViaPythonApi(req, pythonData, outputPptxPath);
      } else {
        const pythonScript = path.join(process.cwd(), "python", "main.py");
        const pythonCmd = process.env.PYTHON_PATH || "python";

        try {
          await execFileAsync(pythonCmd, [pythonScript, tempJsonPath, outputPptxPath], {
            cwd: process.cwd(),
          });
        } catch (execErr: any) {
          if (execErr?.code === "ENOENT") {
            // Fallback to internal Vercel Python API if python binary is not installed in child_process path
            await generateViaPythonApi(req, pythonData, outputPptxPath);
          } else {
            throw execErr;
          }
        }
      }

      return NextResponse.json({
        success: true,
        fileName,
        downloadUrl: `/api/download/${encodeURIComponent(fileName)}`,
      });
    } finally {
      try {
        const { unlink } = await import("fs/promises");
        await unlink(tempJsonPath);
      } catch (_) {}
    }
  } catch (err: any) {
    console.error("PPT Generation Error:", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong while generating your framework. Please check your data and try again.",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
