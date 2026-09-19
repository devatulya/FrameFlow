import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import crypto from "crypto";

import { getUploadsDir, getGeneratedDir } from "@/lib/storage";

const execFileAsync = promisify(execFile);

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_");
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
    const tempJsonPath = path.join(uploadsDir, tempJsonName);
    const outputPptxPath = path.join(generatedDir, fileName);

    await writeFile(tempJsonPath, JSON.stringify(pythonData, null, 2), "utf-8");

    const pythonScript = path.join(process.cwd(), "python", "main.py");
    const pythonCmd = process.env.PYTHON_PATH || "python";

    try {
      // Execute Python generator
      try {
        await execFileAsync(pythonCmd, [pythonScript, tempJsonPath, outputPptxPath], {
          cwd: process.cwd(),
        });
      } catch (execErr: any) {
        if (execErr?.code === "ENOENT" && pythonCmd === "python") {
          // Fallback to python3 if python executable is not found on Linux/hosting environments
          await execFileAsync("python3", [pythonScript, tempJsonPath, outputPptxPath], {
            cwd: process.cwd(),
          });
        } else {
          throw execErr;
        }
      }

      return NextResponse.json({
        success: true,
        fileName,
        downloadUrl: `/api/download/${encodeURIComponent(fileName)}`,
      });
    } finally {
      // Clean up temporary input JSON file
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
