import React from "react";
import { FrameworkData } from "@/lib/types";
import { FontPicker } from "./FontPicker";
import { FontPreview } from "./FontPreview";

interface TypographyFormProps {
  data: FrameworkData["typography"];
  onChange: (updated: FrameworkData["typography"]) => void;
}

export const TypographyForm: React.FC<TypographyFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5">
        <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
          STEP 03 — TYPOGRAPHY HIERARCHY
        </span>
        <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
          Select typography pairings for 3 Hook & Style title layers and 1 Caption metadata layer.
        </p>
      </div>

      <div className="space-y-5">
        {/* Hook & Style Font 1 */}
        <FontPicker
          label="Hook & Style Font 1"
          value={data.display || "Playfair Display"}
          onChange={(font) => onChange({ ...data, display: font })}
        />

        {/* Hook & Style Font 2 */}
        <FontPicker
          label="Hook & Style Font 2"
          value={data.secondary || "Montserrat"}
          onChange={(font) => onChange({ ...data, secondary: font })}
        />

        {/* Hook & Style Font 3 */}
        <FontPicker
          label="Hook & Style Font 3"
          value={data.tertiary || "Permanent Marker"}
          onChange={(font) => onChange({ ...data, tertiary: font })}
        />

        {/* Caption Font */}
        <FontPicker
          label="Caption Font"
          value={data.caption || "Inter"}
          onChange={(font) => onChange({ ...data, caption: font })}
        />
      </div>

      {/* Combined 4-Tier Typography Pairing Live Preview Card */}
      <div className="card-brutal p-4 space-y-3 bg-[#FCF9F2]">
        <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
          <span className="font-syne font-extrabold text-xs uppercase tracking-wider text-[#8F1117]">
            LIVE PAIRING PREVIEW
          </span>
          <span className="text-[10px] font-bold bg-[#111111] text-white px-2 py-0.5 uppercase">
            4-TIER HIERARCHY
          </span>
        </div>

        <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
          {/* Hook & Style 1 Preview */}
          <div>
            <span className="text-[10px] font-bold text-[#8F1117] block mb-0.5">
              HOOK & STYLE 1 ({data.display})
            </span>
            <FontPreview
              family={data.display}
              text="CREATIVE BLUEPRINT 2026"
              className="text-2xl font-bold text-[#111111] leading-tight"
            />
          </div>

          {/* Hook & Style 2 Preview */}
          <div className="pt-2 border-t border-dashed border-[#111111]/30">
            <span className="text-[10px] font-bold text-[#8F1117] block mb-0.5">
              HOOK & STYLE 2 ({data.secondary})
            </span>
            <FontPreview
              family={data.secondary}
              text="Editorial Aesthetic & Visual Storytelling"
              className="text-lg font-semibold text-[#111111] leading-snug"
            />
          </div>

          {/* Hook & Style 3 Preview */}
          <div className="pt-2 border-t border-dashed border-[#111111]/30">
            <span className="text-[10px] font-bold text-[#8F1117] block mb-0.5">
              HOOK & STYLE 3 ({data.tertiary || "Permanent Marker"})
            </span>
            <FontPreview
              family={data.tertiary || "Permanent Marker"}
              text="Dynamic Visual Direction Board"
              className="text-base font-semibold text-[#111111] leading-snug"
            />
          </div>

          {/* Caption Font Preview */}
          <div className="pt-2 border-t border-dashed border-[#111111]/30">
            <span className="text-[10px] font-bold text-[#8F1117] block mb-0.5">
              CAPTION ({data.caption})
            </span>
            <FontPreview
              family={data.caption}
              text="Camera Specs: 4K 60fps | Aspect Ratio 9:16 | Color Profile Log-C"
              className="text-xs font-normal text-[#111111]/80 leading-normal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
