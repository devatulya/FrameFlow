import { FontProvider, FontItem } from "./fontProvider";
import { FALLBACK_GOOGLE_FONTS } from "./fallbackFonts";

let cachedFonts: FontItem[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hour cache

export class GoogleFontsProvider implements FontProvider {
  name = "google";

  async getFonts(): Promise<FontItem[]> {
    const now = Date.now();
    if (cachedFonts && now - lastCacheTime < CACHE_TTL_MS) {
      return cachedFonts;
    }

    const apiKey = process.env.GOOGLE_FONTS_API_KEY;

    if (apiKey) {
      try {
        console.log("[GoogleFontsProvider] Fetching live fonts catalog from Google Web Fonts API...");
        const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`);
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const mapped: FontItem[] = data.items.map((item: any, idx: number) => ({
              family: item.family,
              category: (item.category || "sans-serif").toLowerCase(),
              variants: item.variants || ["regular"],
              subsets: item.subsets || [],
              version: item.version,
              lastModified: item.lastModified,
              popularity: idx + 1,
              source: "google",
            }));

            cachedFonts = mapped;
            lastCacheTime = now;
            console.log(`[GoogleFontsProvider] Successfully cached ${mapped.length} Google Fonts.`);
            return mapped;
          }
        }
      } catch (err) {
        console.warn("[GoogleFontsProvider] Failed to fetch from Google Fonts API, falling back:", err);
      }
    }

    // Secondary fallback: Try fetching public Google Fonts metadata endpoint if available
    try {
      const pubRes = await fetch("https://fonts.google.com/metadata/fonts");
      if (pubRes.ok) {
        const text = await pubRes.text();
        // Google metadata endpoint returns JSON prefixed with anti-xss code `)]}'\n`
        const cleanJson = text.replace(/^\)\]\}'\n/, "");
        const pubData = JSON.parse(cleanJson);
        if (pubData.familyMetadataList && Array.isArray(pubData.familyMetadataList)) {
          const mapped: FontItem[] = pubData.familyMetadataList.map((item: any, idx: number) => ({
            family: item.family,
            category: (item.category || "sans-serif").toLowerCase().replace(" ", "-"),
            variants: item.fonts ? Object.keys(item.fonts) : ["regular"],
            popularity: idx + 1,
            source: "google",
          }));

          cachedFonts = mapped;
          lastCacheTime = now;
          console.log(`[GoogleFontsProvider] Cached ${mapped.length} fonts from public Google metadata endpoint.`);
          return mapped;
        }
      }
    } catch (err) {
      console.warn("[GoogleFontsProvider] Secondary public metadata fetch failed, using fallback catalog:", err);
    }

    // Ultimate fallback: Curated catalog
    cachedFonts = FALLBACK_GOOGLE_FONTS;
    lastCacheTime = now;
    return FALLBACK_GOOGLE_FONTS;
  }
}
