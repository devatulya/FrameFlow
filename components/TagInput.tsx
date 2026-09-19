import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface TagInputProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  tags: string[];
  onChange: (updatedTags: string[]) => void;
  presetSuggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  sublabel,
  required = false,
  tags,
  onChange,
  presetSuggestions = [],
  placeholder = "Type custom tag and press Enter...",
  maxTags,
}) => {
  const [inputValue, setInputValue] = useState("");

  const isMaxReached = maxTags !== undefined && tags.length >= maxTags;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isMaxReached) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const togglePreset = (preset: string) => {
    if (tags.includes(preset)) {
      removeTag(preset);
    } else {
      if (isMaxReached) return;
      onChange([...tags, preset]);
    }
  };

  return (
    <div className="card-brutal p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111]">
            {label} {required && <span className="text-[#C41E24]">*</span>}
          </label>
          {sublabel && (
            <p className="font-grotesk text-[11px] text-gray-600 mt-0.5">{sublabel}</p>
          )}
        </div>
        {maxTags && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 border border-[#111111] ${
              isMaxReached ? "bg-[#C41E24] text-white" : "bg-[#111111] text-white"
            }`}
          >
            {tags.length} / {maxTags} MAX
          </span>
        )}
      </div>

      {/* Input box for typing custom tags */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? `Maximum ${maxTags} tags reached` : placeholder}
          disabled={isMaxReached}
          className="input-brutal flex-1 px-3.5 py-2.5 text-xs font-bold font-grotesk text-[#111111] placeholder:font-normal placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={isMaxReached || !inputValue.trim()}
          className="bg-[#111111] text-white border-2 border-[#111111] px-3.5 py-2.5 text-xs font-bold font-grotesk shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> ADD
        </button>
      </div>

      {/* Selected Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#111111] text-white border-2 border-[#111111] px-3 py-1.5 text-xs font-bold font-grotesk flex items-center gap-1.5 shadow-[2px_2px_0px_#111111]"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-[#FFE800] transition-colors p-0.5"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Optional Preset Suggestions */}
      {presetSuggestions.length > 0 && (
        <div className="pt-2 border-t border-[#111111]/15">
          <span className="font-grotesk text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            QUICK SUGGESTIONS {isMaxReached && "(MAX 3 REACHED)"}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetSuggestions.map((preset) => {
              const isSelected = tags.includes(preset);
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => togglePreset(preset)}
                  disabled={!isSelected && isMaxReached}
                  className={`px-2.5 py-1 text-[11px] font-bold font-grotesk border border-[#111111] transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? "bg-[#C41E24] text-white shadow-none"
                      : "bg-white text-[#111111] shadow-[1px_1px_0px_#111111] hover:bg-[#F5F2EB]"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "}
                  {preset}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
