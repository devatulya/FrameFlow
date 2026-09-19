import React, { useState, useEffect, useMemo } from "react";
import { FontItem } from "@/services/fontProvider";
import { FontCard } from "./FontCard";
import { FontPreview } from "./FontPreview";

interface FontPickerProps {
  label: string;
  value: string;
  onChange: (fontFamily: string) => void;
}

const CATEGORIES = ["ALL", "SERIF", "SANS SERIF", "DISPLAY", "HANDWRITING", "MONOSPACE"];
const PAGE_SIZE = 35;

export const FontPicker: React.FC<FontPickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState<"alphabetical" | "popular">("popular");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchCatalog = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/fonts");
      if (!res.ok) throw new Error("Catalog fetch failed");
      const data = await res.json();
      if (data.fonts && Array.isArray(data.fonts) && data.fonts.length > 0) {
        setFonts(data.fonts);
      } else {
        throw new Error("Empty fonts response");
      }
    } catch (err) {
      console.error("[FontPicker] Failed to load font catalog:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && fonts.length === 0 && !loading) {
      fetchCatalog();
    }
  }, [isOpen]);

  // Reset pagination when search/filter/sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCategory, sortBy]);

  const filteredFonts = useMemo(() => {
    let result = [...fonts];

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter((f) => f.family.toLowerCase().includes(query));
    }

    // Category filter
    if (selectedCategory !== "ALL") {
      const catKey = selectedCategory.toLowerCase().replace(" ", "-");
      result = result.filter((f) => {
        const fontCat = f.category.toLowerCase().replace(" ", "-");
        if (catKey === "sans-serif") {
          return fontCat === "sans-serif" || fontCat === "sans";
        }
        return fontCat.includes(catKey);
      });
    }

    // Sort
    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.family.localeCompare(b.family));
    } else {
      result.sort((a, b) => (a.popularity || 9999) - (b.popularity || 9999));
    }

    return result;
  }, [fonts, searchTerm, selectedCategory, sortBy]);

  const visibleFonts = useMemo(() => {
    return filteredFonts.slice(0, visibleCount);
  }, [filteredFonts, visibleCount]);

  const handleSelect = (family: string) => {
    onChange(family);
    setIsOpen(false);
  };

  return (
    <div className="card-brutal p-4 space-y-3">
      {/* Selector Label */}
      <div className="flex items-center justify-between">
        <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111]">
          {label} <span className="text-[#8F1117]">*</span>
        </label>
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#111111] text-white">
          GOOGLE FONTS
        </span>
      </div>

      {/* Selected Font Display Box / Trigger */}
      <div
        onClick={() => setIsOpen(true)}
        className="p-3 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] hover:bg-[#F5F2EB] cursor-pointer transition-all flex items-center justify-between gap-3 group"
      >
        <div className="overflow-hidden">
          <span className="font-syne font-extrabold text-sm text-[#111111] block truncate">
            {value || "Select Font..."}
          </span>
          <FontPreview
            family={value}
            text="Creative Blueprint 2026"
            className="text-lg font-bold text-[#8F1117] truncate mt-0.5"
          />
        </div>
        <button
          type="button"
          className="shrink-0 px-3 py-2 bg-[#8F1117] text-white font-syne text-xs font-bold border border-[#111111] group-hover:bg-[#111111] transition-colors"
        >
          SELECT FONT ➔
        </button>
      </div>

      {/* Full Screen / Mobile Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4">
          <div className="bg-[#FCF9F2] w-full h-[100dvh] sm:h-[90vh] sm:max-w-2xl sm:mx-auto border-t-4 sm:border-4 border-[#111111] shadow-[6px_6px_0px_#111111] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-[#8F1117] border-b-4 border-[#111111] flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-black text-xl hover:opacity-80 px-2"
                >
                  ←
                </button>
                <h3 className="font-syne font-extrabold text-base uppercase tracking-wider">
                  SELECT {label.toUpperCase()}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-[#111111] text-white font-bold border border-white flex items-center justify-center hover:bg-white hover:text-[#111111] transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Sticky Search & Filter Bar */}
            <div className="p-3 bg-[#FCF9F2] border-b-2 border-[#111111] space-y-3 shrink-0 shadow-xs">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search fonts (e.g. Cormorant, Inter)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border-2 border-[#111111] text-sm font-bold text-[#111111] shadow-[2px_2px_0px_#111111] focus:outline-none focus:bg-[#FFE800]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-xs font-bold bg-[#111111] text-white px-1.5 py-0.5"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Category Filter Pills & Sort Options */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 text-[11px] font-extrabold tracking-wider border-2 border-[#111111] whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? "bg-[#111111] text-white shadow-[2px_2px_0px_#8F1117]"
                          : "bg-white text-[#111111] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#111111] pt-1">
                  <span>Showing {filteredFonts.length} fonts</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#111111]/70">SORT:</span>
                    <button
                      type="button"
                      onClick={() => setSortBy("popular")}
                      className={`px-2 py-0.5 text-[10px] border border-[#111111] ${
                        sortBy === "popular" ? "bg-[#8F1117] text-white" : "bg-white text-[#111111]"
                      }`}
                    >
                      POPULAR
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortBy("alphabetical")}
                      className={`px-2 py-0.5 text-[10px] border border-[#111111] ${
                        sortBy === "alphabetical" ? "bg-[#8F1117] text-white" : "bg-white text-[#111111]"
                      }`}
                    >
                      A-Z
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog List / Content Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {loading && fonts.length === 0 && (
                <div className="p-8 text-center space-y-3">
                  <div className="inline-block animate-spin w-8 h-8 border-4 border-[#8F1117] border-t-transparent rounded-full" />
                  <p className="font-syne font-bold text-sm text-[#111111]">
                    LOADING GOOGLE FONTS CATALOG...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-6 bg-[#FFD7D7] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-center space-y-3">
                  <p className="font-syne font-extrabold text-sm text-[#8F1117]">
                    FONT LIBRARY UNAVAILABLE
                  </p>
                  <p className="text-xs text-[#111111]">
                    Could not connect to Google Fonts API. Please check network connection.
                  </p>
                  <button
                    type="button"
                    onClick={fetchCatalog}
                    className="px-4 py-2 bg-[#8F1117] text-white font-bold text-xs border border-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#111111]"
                  >
                    TRY AGAIN
                  </button>
                </div>
              )}

              {!loading && filteredFonts.length === 0 && !error && (
                <div className="p-8 text-center bg-white border-2 border-[#111111]">
                  <p className="font-syne font-bold text-sm text-[#111111]">
                    NO FONTS FOUND MATCHING "{searchTerm}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("ALL");
                    }}
                    className="mt-3 px-3 py-1.5 bg-[#8F1117] text-white font-bold text-xs border border-[#111111]"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}

              {visibleFonts.map((font) => (
                <FontCard
                  key={font.family}
                  font={font}
                  isSelected={value === font.family}
                  onSelect={handleSelect}
                />
              ))}

              {visibleCount < filteredFonts.length && (
                <div className="pt-2 pb-4 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="w-full py-3 bg-[#111111] text-white font-syne font-extrabold text-xs uppercase tracking-wider border-2 border-[#111111] hover:bg-[#8F1117] transition-colors shadow-[2px_2px_0px_#111111]"
                  >
                    LOAD MORE FONTS ({filteredFonts.length - visibleCount} REMAINING)
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#FCF9F2] border-t-2 border-[#111111] flex items-center justify-between text-xs font-bold text-[#111111] shrink-0">
              <span>CURRENT: <strong className="text-[#8F1117]">{value}</strong></span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[#111111] text-white font-bold border border-[#111111]"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
