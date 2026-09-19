const loadedFonts = new Set<string>();

export function loadGoogleFont(family: string): void {
  if (typeof window === "undefined" || !family) return;

  const fontName = family.trim();
  if (loadedFonts.has(fontName)) return;

  loadedFonts.add(fontName);

  try {
    const formattedFamily = fontName.replace(/ /g, "+");
    const linkId = `google-font-${fontName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@400;600;700&display=swap`;
    link.onerror = () => {
      console.warn(`[fontLoader] Failed to load font stylesheet for '${fontName}', using fallback.`);
    };

    document.head.appendChild(link);
  } catch (err) {
    console.warn(`[fontLoader] Error injecting stylesheet for '${fontName}':`, err);
  }
}
