import React, { useState } from "react";
import { FrameworkData } from "@/lib/types";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface BrandFormProps {
  data: FrameworkData["brand"];
  onChange: (updated: FrameworkData["brand"]) => void;
}

export const BrandForm: React.FC<BrandFormProps> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingLogo(true);
    setLogoError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();
      if (res.ok && resData.url) {
        onChange({ ...data, logoImage: resData.url });
      } else {
        setLogoError(resData.error || "Failed to upload logo.");
      }
    } catch (err) {
      setLogoError("Failed to upload logo.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const removeLogo = () => {
    onChange({ ...data, logoImage: "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFE800] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3.5">
        <span className="font-syne font-extrabold text-sm uppercase text-[#111111] block">
          STEP 01 — BRAND IDENTIFIER & LOGO
        </span>
        <p className="font-grotesk text-xs text-[#111111]/80 mt-0.5">
          Enter brand details, campaign title, and upload your brand logo for Slide 1 of the deck.
        </p>
      </div>

      <div className="card-brutal p-5 space-y-5">
        {/* Brand Name Input */}
        <div>
          <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Brand Name <span className="text-[#C41E24]">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Type Brand Name..."
            className="input-brutal w-full px-4 py-3 text-base font-syne font-bold uppercase text-[#111111] placeholder:text-gray-400 placeholder:font-normal"
            required
          />
        </div>

        {/* Brand Logo Upload */}
        <div>
          <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Brand Logo Image (Slide 1 Cover)
          </label>

          {logoError && (
            <div className="p-2.5 bg-red-100 border border-red-500 text-red-800 text-xs font-bold mb-2">
              {logoError}
            </div>
          )}

          {data.logoImage ? (
            <div className="relative border-2 border-[#111111] shadow-[2px_2px_0px_#111111] bg-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={data.logoImage}
                  alt="Brand Logo"
                  className="h-12 max-w-[140px] object-contain border border-[#111111] p-1 bg-gray-50"
                />
                <span className="font-grotesk text-xs font-bold text-[#111111]">
                  Logo Uploaded ✓
                </span>
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="bg-[#C41E24] text-white border-2 border-[#111111] px-2.5 py-1 text-xs font-bold shadow-[1px_1px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> REMOVE
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#111111] bg-[#F5F2EB] hover:bg-white p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploadingLogo}
              />
              {uploadingLogo ? (
                <Loader2 className="w-7 h-7 text-[#C41E24] animate-spin" />
              ) : (
                <ImageIcon className="w-7 h-7 text-[#111111]" />
              )}
              <span className="font-grotesk font-bold text-xs uppercase text-[#111111]">
                {uploadingLogo ? "UPLOADING LOGO..." : "+ UPLOAD BRAND LOGO IMAGE"}
              </span>
              <span className="font-grotesk text-[10px] text-gray-500">
                PNG, JPG, WEBP, SVG (Replaces Slide 1 Logo Box)
              </span>
            </label>
          )}
        </div>

        {/* Campaign / Project Name Input */}
        <div>
          <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Campaign / Project Name <span className="text-[#C41E24]">*</span>
          </label>
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => onChange({ ...data, projectName: e.target.value })}
            placeholder="Type Campaign / Project Name..."
            className="input-brutal w-full px-4 py-3 text-base font-grotesk font-semibold text-[#111111] placeholder:text-gray-400 placeholder:font-normal"
            required
          />
        </div>

        {/* Year Select */}
        <div>
          <label className="block font-grotesk text-xs font-bold uppercase tracking-wider text-[#111111] mb-2">
            Year <span className="text-[#C41E24]">*</span>
          </label>
          <select
            value={data.year}
            onChange={(e) => onChange({ ...data, year: parseInt(e.target.value, 10) })}
            className="input-brutal w-full px-4 py-3 text-base font-grotesk font-bold text-[#111111] bg-white cursor-pointer"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
