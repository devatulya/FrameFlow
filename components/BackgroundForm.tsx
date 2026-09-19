import React, { useState } from "react";
import { FrameworkData } from "@/lib/types";
import { TagInput } from "./TagInput";
import { Upload, X, Loader2 } from "lucide-react";

interface BackgroundFormProps {
  data: FrameworkData["background"];
  onChange: (updated: FrameworkData["background"]) => void;
}

const PRESET_TONES = ["Urban", "Natural", "Social", "Minimalist", "Industrial", "Architectural"];
const PRESET_LOCATIONS = ["Street", "Cafe", "College", "Outdoor", "Store", "Studio", "Rooftop", "Beach"];

export const BackgroundForm: React.FC<BackgroundFormProps> = ({ data, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (data.images.length + files.length > 5) {
      setErrorMsg("Maximum 5 reference images allowed per section.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const resData = await res.json();
        if (res.ok && resData.url) {
          uploadedUrls.push(resData.url);
        } else {
          setErrorMsg(resData.error || "Failed to upload image.");
        }
      } catch (err) {
        setErrorMsg("Failed to upload image.");
      }
    }

    if (uploadedUrls.length > 0) {
      onChange({ ...data, images: [...data.images, ...uploadedUrls] });
    }
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updated = data.images.filter((_, i) => i !== index);
    onChange({ ...data, images: updated });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5">
        <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
          STEP 06 — BACKGROUND & LOCATIONS
        </span>
        <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
          Set the shoot environment vibe, key shoot locations, and background imagery.
        </p>
      </div>

      <div className="space-y-5">
        {/* Background Tone Tag Input */}
        <TagInput
          label="Background Tone"
          sublabel="Type background tone and press Enter to save."
          required
          tags={data.tone}
          onChange={(newTones) => onChange({ ...data, tone: newTones })}
          presetSuggestions={PRESET_TONES}
          placeholder="Type custom background tone & press Enter..."
        />

        {/* Key Locations Tag Input */}
        <TagInput
          label="Key Locations"
          sublabel="Type location and press Enter to save."
          tags={data.locations}
          onChange={(newLocs) => onChange({ ...data, locations: newLocs })}
          presetSuggestions={PRESET_LOCATIONS}
          placeholder="Type custom key location & press Enter..."
        />

        {/* Reference Imagery Upload */}
        <div className="card-brutal p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111]">
              Background Reference Photos (Max 5)
            </label>
            <span className="text-[11px] font-bold text-gray-600">
              {data.images.length} / 5 Uploaded
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {data.images.length < 5 && (
            <label className="border-2 border-dashed border-[#111111] bg-[#F5F2EB] hover:bg-white p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="w-8 h-8 text-[#C41E24] animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-[#111111]" />
              )}
              <span className="font-grotesk font-bold text-xs uppercase text-[#111111]">
                {uploading ? "UPLOADING IMAGE..." : "+ UPLOAD BACKGROUND REF"}
              </span>
              <span className="font-grotesk text-[10px] text-gray-500">
                JPG, PNG, WEBP (Max 10MB per image)
              </span>
            </label>
          )}

          {data.images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {data.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group border-2 border-[#111111] shadow-[2px_2px_0px_#111111] bg-black aspect-video overflow-hidden"
                >
                  <img
                    src={imgUrl}
                    alt={`Background ref ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-[#C41E24] text-white border border-[#111111] p-1 text-xs shadow-[1px_1px_0px_#111111] hover:bg-black"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
