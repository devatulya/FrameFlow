import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getUploadsDir } from "@/lib/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in request" },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/") || file.name.match(/\.(png|jpe?g|webp|svg|gif|bmp)$/i);
    if (!isImage) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files (PNG, JPG, WEBP, SVG) are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = getUploadsDir();

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomBytes(8).toString("hex")}${ext}`;
    const filePath = path.join(/*turbopackIgnore: true*/ uploadsDir, filename);

    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: relativeUrl, filename });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
