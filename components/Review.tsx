import React from "react";
import { FrameworkData, StepNumber } from "@/lib/types";
import { Edit2, CheckCircle2 } from "lucide-react";

interface ReviewProps {
  data: FrameworkData;
  onEditStep: (step: StepNumber) => void;
}

export const Review: React.FC<ReviewProps> = ({ data, onEditStep }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5 flex items-center justify-between">
        <div>
          <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
            STEP 07 — FINAL REVIEW
          </span>
          <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
            Review all framework parameters before generating PowerPoint deck.
          </p>
        </div>
        <CheckCircle2 className="w-7 h-7 text-[#111111] shrink-0" />
      </div>

      <div className="space-y-4">
        {/* BRAND SUMMARY */}
        <div className="card-brutal p-4 space-y-2 relative">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              01 BRAND & LOGO
            </span>
            <button
              onClick={() => onEditStep(1)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="pt-1 flex items-start justify-between">
            <div>
              <h3 className="font-syne text-xl font-extrabold text-[#111111]">
                {data.brand.name || "UNNAMED BRAND"}
              </h3>
              <p className="font-grotesk text-sm font-semibold text-gray-700">
                {data.brand.projectName || "UNTITLED PROJECT"}
              </p>
              <span className="inline-block mt-1 font-mono text-xs font-bold bg-[#111111] text-white px-2 py-0.5">
                {data.brand.year}
              </span>
            </div>
            {data.brand.logoImage && (
              <img
                src={data.brand.logoImage}
                alt="Brand Logo"
                className="h-12 max-w-[120px] object-contain border border-[#111111] p-1 bg-white"
              />
            )}
          </div>
        </div>

        {/* COLOURS SUMMARY */}
        <div className="card-brutal p-4 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              02 COLOUR PALETTE
            </span>
            <button
              onClick={() => onEditStep(2)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500 block">
                Primary
              </span>
              <div
                className="h-10 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-[10px] font-mono font-bold text-white uppercase"
                style={{ backgroundColor: data.colors.primary || "#FFFFFF" }}
              >
                {data.colors.primary || "—"}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-500 block">
                Secondary
              </span>
              <div
                className="h-10 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-[10px] font-mono font-bold text-white uppercase"
                style={{ backgroundColor: data.colors.secondary || "#FFFFFF" }}
              >
                {data.colors.secondary || "—"}
              </div>
            </div>
            {(data.colors.accentColors && data.colors.accentColors.length > 0
              ? data.colors.accentColors
              : data.colors.accent ? [data.colors.accent] : []
            ).map((accColor, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500 block">
                  Accent {idx + 1}
                </span>
                <div
                  className="h-10 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-[10px] font-mono font-bold text-[#111111] uppercase"
                  style={{ backgroundColor: accColor || "#FFFFFF" }}
                >
                  {accColor || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TYPOGRAPHY SUMMARY */}
        <div className="card-brutal p-4 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              03 TYPOGRAPHY
            </span>
            <button
              onClick={() => onEditStep(3)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="space-y-1.5 pt-1 text-xs font-grotesk">
            <div>
              <span className="text-gray-500 uppercase font-bold">Hook & Style 1: </span>
              <span className="font-bold text-[#111111]">{data.typography.display}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-bold">Hook & Style 2: </span>
              <span className="font-bold text-[#111111]">{data.typography.secondary}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-bold">Hook & Style 3: </span>
              <span className="font-bold text-[#111111]">{data.typography.tertiary || "Permanent Marker"}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-bold">Caption: </span>
              <span className="font-bold text-[#111111]">{data.typography.caption}</span>
            </div>
          </div>
        </div>

        {/* EDITING SUMMARY */}
        <div className="card-brutal p-4 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              04 EDITING STYLE & PACING
            </span>
            <button
              onClick={() => onEditStep(4)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Pacing Scale:</span>
              <span className="bg-[#C41E24] text-white px-2 py-0.5 font-mono">
                {data.editing.pacing} / 100
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.editing.styles.map((s, i) => (
                <span
                  key={i}
                  className="bg-[#111111] text-white text-[11px] font-bold px-2 py-0.5 uppercase"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* WARDROBE SUMMARY */}
        <div className="card-brutal p-4 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              05 WARDROBE
            </span>
            <button
              onClick={() => onEditStep(5)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="text-xs space-y-1.5 font-grotesk">
            {data.wardrobe.tone.length > 0 && (
              <div>
                <span className="text-gray-500 font-bold uppercase block mb-1">Tone: </span>
                <div className="flex flex-wrap gap-1">
                  {data.wardrobe.tone.map((t, idx) => (
                    <span key={idx} className="bg-gray-200 text-[#111111] px-2 py-0.5 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.wardrobe.colors.length > 0 && (
              <div>
                <span className="text-gray-500 font-bold uppercase block mb-1">Colours: </span>
                <div className="flex flex-wrap gap-1">
                  {data.wardrobe.colors.map((c, idx) => (
                    <span key={idx} className="bg-gray-100 text-[#111111] px-2 py-0.5 font-semibold border border-gray-400">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.wardrobe.images.length > 0 && (
              <div className="grid grid-cols-4 gap-1.5 pt-2">
                {data.wardrobe.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Wardrobe"
                    className="w-full h-12 object-cover border border-[#111111]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BACKGROUND SUMMARY */}
        <div className="card-brutal p-4 space-y-2">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#C41E24]">
              06 BACKGROUND & LOCATIONS
            </span>
            <button
              onClick={() => onEditStep(6)}
              className="bg-white hover:bg-[#F5F2EB] text-[#111111] border-2 border-[#111111] px-2.5 py-1 text-[11px] font-bold uppercase flex items-center gap-1 shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
          <div className="text-xs space-y-1.5 font-grotesk">
            {data.background.tone.length > 0 && (
              <div>
                <span className="text-gray-500 font-bold uppercase block mb-1">Tone: </span>
                <div className="flex flex-wrap gap-1">
                  {data.background.tone.map((t, idx) => (
                    <span key={idx} className="bg-gray-200 text-[#111111] px-2 py-0.5 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.background.locations.length > 0 && (
              <div>
                <span className="text-gray-500 font-bold uppercase block mb-1">Locations: </span>
                <div className="flex flex-wrap gap-1">
                  {data.background.locations.map((l, idx) => (
                    <span key={idx} className="bg-blue-100 text-[#111111] px-2 py-0.5 font-semibold border border-blue-300">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.background.images.length > 0 && (
              <div className="grid grid-cols-4 gap-1.5 pt-2">
                {data.background.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Background"
                    className="w-full h-12 object-cover border border-[#111111]"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
