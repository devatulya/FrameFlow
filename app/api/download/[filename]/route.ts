import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { getGeneratedDir } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFileName = decodeURIComponent(filename);
    const filePath = path.join(getGeneratedDir(), decodedFileName);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "Requested presentation file not found." },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${decodedFileName}"`,
      },
    });
  } catch (err: any) {
    console.error("Download endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to download presentation file." },
      { status: 500 }
    );
  }
}
