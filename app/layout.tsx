import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FrameFlow | Creative Framework Generator",
  description: "Generate agency-standard PowerPoint creative frameworks in minutes.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FCF9F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#FCF9F2]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,600;1,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FCF9F2] text-[#111111] font-grotesk antialiased selection:bg-[#FFE800]">
        <div className="max-w-[480px] w-full mx-auto min-h-screen flex flex-col bg-[#FCF9F2] border-x-0 sm:border-x-2 border-[#111111] shadow-none sm:shadow-brutal-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
