import React from "react";
import { FrameworkData } from "@/lib/types";
import { TagInput } from "./TagInput";

interface EditingFormProps {
  data: FrameworkData["editing"];
  onChange: (updated: FrameworkData["editing"]) => void;
}

const STANDARD_EDIT_STYLES = [
  "Bold text overlays",
  "Beat-sync transitions",
  "Transitions",
  "Clean cuts",
  "Dynamic text",
  "Speed ramps",
  "Color grading pop",
  "Split screen grid",
];

export const EditingForm: React.FC<EditingFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5">
        <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
          STEP 04 — EDITING STYLE & PACING
        </span>
        <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
          Define editing pacing scale and select up to 3 edit vibe tags for the presentation.
        </p>
      </div>

      {/* Pacing Range Slider */}
      <div className="card-brutal p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111]">
            Editing Pacing (0 - 100) <span className="text-[#C41E24]">*</span>
          </label>
          <span className="bg-[#C41E24] text-white border-2 border-[#111111] px-3 py-1 font-mono font-bold text-sm shadow-[2px_2px_0px_#111111]">
            {data.pacing ?? 50} / 100
          </span>
        </div>

        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0"
            max="100"
            value={data.pacing ?? 50}
            onChange={(e) => onChange({ ...data, pacing: parseInt(e.target.value, 10) })}
            className="w-full h-4 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] accent-[#C41E24] cursor-pointer"
          />
          <div className="flex justify-between font-grotesk text-[11px] font-bold text-[#111111]">
            <span>SLOW (0)</span>
            <span>BALANCED (50)</span>
            <span>FAST (100)</span>
          </div>
        </div>
      </div>

      {/* Edit Vibe & Transitions Tag Input - MAX 3 TAGS */}
      <TagInput
        label="Edit Vibe & Transitions"
        sublabel="Select or type up to 3 edit vibes (matches the 3 presentation cards)."
        required
        tags={data.styles}
        maxTags={3}
        onChange={(updatedStyles) => onChange({ ...data, styles: updatedStyles.slice(0, 3) })}
        presetSuggestions={STANDARD_EDIT_STYLES}
        placeholder="Type custom edit vibe & press Enter..."
      />
    </div>
  );
};
