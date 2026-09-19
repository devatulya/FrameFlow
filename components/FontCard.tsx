import React from "react";
import { FontItem } from "@/services/fontProvider";
import { FontPreview } from "./FontPreview";

interface FontCardProps {
  font: FontItem;
  isSelected: boolean;
  onSelect: (family: string) => void;
}

export const FontCard: React.FC<FontCardProps> = ({ font, isSelected, onSelect }) => {
  const categoryLabel = font.category.toUpperCase().replace("-", " ");

  return (
    <div
      onClick={() => onSelect(font.family)}
      className={`p-3.5 border-2 border-[#111111] transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-[#FFE800] shadow-[4px_4px_0px_#111111] translate-x-[-1px] translate-y-[-1px]"
          : "bg-white hover:bg-[#F5F2EB] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px]"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="font-syne font-bold text-sm text-[#111111] truncate">
          {font.family}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold tracking-wider bg-[#111111] text-white px-2 py-0.5 uppercase">
            {categoryLabel}
          </span>
          {isSelected && (
            <span className="bg-[#8F1117] text-white text-xs font-black w-5 h-5 flex items-center justify-center border border-[#111111]">
              ✓
            </span>
          )}
        </div>
      </div>

      <FontPreview
        family={font.family}
        text="The quick brown fox jumps over the lazy dog."
        className="text-base text-[#111111] mt-1 leading-snug truncate"
      />
    </div>
  );
};
