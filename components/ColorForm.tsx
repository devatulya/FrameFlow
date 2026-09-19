import React from "react";
import { FrameworkData } from "@/lib/types";

interface ColorFormProps {
  data: FrameworkData["colors"];
  onChange: (updated: FrameworkData["colors"]) => void;
}

export const ColorForm: React.FC<ColorFormProps> = ({ data, onChange }) => {
  const accentCount: 1 | 2 | 3 = data.accentColorCount ||
    (data.accentColors && data.accentColors.length > 0
      ? (Math.min(3, Math.max(1, data.accentColors.length)) as 1 | 2 | 3)
      : 1);

  const accentColors = data.accentColors || [];

  const handlePrimaryChange = (value: string) => {
    let formatted = value.toUpperCase();
    if (formatted && !formatted.startsWith("#")) formatted = "#" + formatted;
    onChange({ ...data, primary: formatted });
  };

  const handleSecondaryChange = (value: string) => {
    let formatted = value.toUpperCase();
    if (formatted && !formatted.startsWith("#")) formatted = "#" + formatted;
    onChange({ ...data, secondary: formatted });
  };

  const handleAccentCountChange = (newCount: 1 | 2 | 3) => {
    const defaultAccents = ["#F5F1E8", "#D71920", "#111111"];
    let updatedAccents = [...accentColors];

    if (newCount > updatedAccents.length) {
      for (let i = updatedAccents.length; i < newCount; i++) {
        updatedAccents.push(defaultAccents[i] || "#F5F1E8");
      }
    } else {
      // Trim strictly to newCount so no stale trailing colors remain
      updatedAccents = updatedAccents.slice(0, newCount);
    }

    onChange({
      ...data,
      accentColorCount: newCount,
      accentColors: updatedAccents,
      accent: updatedAccents[0] || "",
    });
  };

  const handleAccentColorChange = (index: number, value: string) => {
    let formatted = value.toUpperCase();
    if (formatted && !formatted.startsWith("#")) formatted = "#" + formatted;

    const updatedAccents = [...accentColors];
    updatedAccents[index] = formatted;

    onChange({
      ...data,
      accentColorCount: accentCount,
      accentColors: updatedAccents,
      accent: updatedAccents[0] || "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5">
        <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
          STEP 02 — COLOUR PALETTE
        </span>
        <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
          Select primary, secondary, and dynamic accent colors (1 to 3 accent slots).
        </p>
      </div>

      <div className="space-y-4">
        {/* Primary Color */}
        <div className="card-brutal p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] block">
                PRIMARY COLOR <span className="text-[#C41E24]">*</span>
              </span>
              <span className="font-grotesk text-[11px] text-gray-600 block">
                Main brand color & headlines
              </span>
            </div>
            <div
              className="w-12 h-12 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-none shrink-0"
              style={{ backgroundColor: data.primary || "#FFFFFF" }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.primary?.startsWith("#") && data.primary.length === 7 ? data.primary : "#000000"}
              onChange={(e) => handlePrimaryChange(e.target.value)}
              className="w-12 h-11 border-2 border-[#111111] cursor-pointer p-0 bg-transparent rounded-none"
            />
            <input
              type="text"
              value={data.primary}
              onChange={(e) => handlePrimaryChange(e.target.value)}
              maxLength={7}
              placeholder="#0B0B0B"
              className="input-brutal flex-1 px-4 py-2.5 font-mono text-sm font-bold uppercase text-[#111111]"
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div className="card-brutal p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] block">
                SECONDARY COLOR <span className="text-[#C41E24]">*</span>
              </span>
              <span className="font-grotesk text-[11px] text-gray-600 block">
                Supporting accent & banners
              </span>
            </div>
            <div
              className="w-12 h-12 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] rounded-none shrink-0"
              style={{ backgroundColor: data.secondary || "#FFFFFF" }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.secondary?.startsWith("#") && data.secondary.length === 7 ? data.secondary : "#000000"}
              onChange={(e) => handleSecondaryChange(e.target.value)}
              className="w-12 h-11 border-2 border-[#111111] cursor-pointer p-0 bg-transparent rounded-none"
            />
            <input
              type="text"
              value={data.secondary}
              onChange={(e) => handleSecondaryChange(e.target.value)}
              maxLength={7}
              placeholder="#8F1117"
              className="input-brutal flex-1 px-4 py-2.5 font-mono text-sm font-bold uppercase text-[#111111]"
            />
          </div>
        </div>

        {/* Dynamic Accent Colors Card */}
        <div className="card-brutal p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
            <div>
              <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] block">
                ACCENT COLORS <span className="text-[#C41E24]">*</span>
              </span>
              <span className="font-grotesk text-[11px] text-gray-600 block">
                Highlight swatches (Select 1, 2, or 3 colors)
              </span>
            </div>
            {/* Accent Count Selector Pills */}
            <div className="flex items-center gap-1">
              {([1, 2, 3] as const).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleAccentCountChange(num)}
                  className={`px-3 py-1 text-xs font-extrabold font-syne border-2 border-[#111111] transition-all ${
                    accentCount === num
                      ? "bg-[#C41E24] text-white shadow-[2px_2px_0px_#111111]"
                      : "bg-white text-[#111111] hover:bg-[#F5F2EB]"
                  }`}
                >
                  {num} {num === 1 ? "COLOR" : "COLORS"}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Color Pickers (renders max accentCount) */}
          <div className="space-y-3">
            {Array.from({ length: accentCount }).map((_, idx) => {
              const currentColor = accentColors[idx] || "";
              return (
                <div key={idx} className="p-3 bg-[#F5F2EB] border-2 border-[#111111] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-grotesk text-[11px] font-bold text-[#111111] uppercase">
                      ACCENT COLOR SLOT {idx + 1}
                    </span>
                    <div
                      className="w-7 h-7 border border-[#111111] shrink-0"
                      style={{ backgroundColor: currentColor || "#FFFFFF" }}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={currentColor.startsWith("#") && currentColor.length === 7 ? currentColor : "#000000"}
                      onChange={(e) => handleAccentColorChange(idx, e.target.value)}
                      className="w-10 h-10 border-2 border-[#111111] cursor-pointer p-0 bg-transparent rounded-none"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => handleAccentColorChange(idx, e.target.value)}
                      maxLength={7}
                      placeholder={`#ACCENT${idx + 1}`}
                      className="input-brutal flex-1 px-3 py-2 font-mono text-xs font-bold uppercase text-[#111111]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Palette Visual Preview Card */}
      <div className="card-brutal p-4 bg-[#F5F2EB]">
        <span className="font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] block mb-2">
          LIVE PALETTE PREVIEW
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 h-16">
          {/* Primary */}
          <div
            className="border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-end p-1.5"
            style={{ backgroundColor: data.primary || "#FFFFFF" }}
          >
            <span className="text-[10px] font-mono font-bold bg-white/90 px-1 border border-[#111111]">
              PRI
            </span>
          </div>
          {/* Secondary */}
          <div
            className="border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-end p-1.5"
            style={{ backgroundColor: data.secondary || "#FFFFFF" }}
          >
            <span className="text-[10px] font-mono font-bold bg-white/90 px-1 border border-[#111111]">
              SEC
            </span>
          </div>
          {/* Accent Slots */}
          {Array.from({ length: accentCount }).map((_, idx) => (
            <div
              key={idx}
              className="border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-end p-1.5"
              style={{ backgroundColor: accentColors[idx] || "#FFFFFF" }}
            >
              <span className="text-[10px] font-mono font-bold bg-white/90 px-1 border border-[#111111]">
                ACC {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
