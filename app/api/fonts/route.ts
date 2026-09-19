import { NextResponse } from "next/server";
import { GoogleFontsProvider } from "@/services/googleFontsProvider";

const provider = new GoogleFontsProvider();

export async function GET() {
  try {
    const fonts = await provider.getFonts();
    return NextResponse.json({
      fonts,
      total: fonts.length,
      source: provider.name,
    });
  } catch (error) {
    console.error("[GET /api/fonts] Error fetching font catalog:", error);
    return NextResponse.json(
      { error: "Font library unavailable", fonts: [] },
      { status: 500 }
    );
  }
}
