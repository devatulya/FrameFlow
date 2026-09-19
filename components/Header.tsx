import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  stepText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  title = "CREATIVE FRAMEWORK",
  stepText,
}) => {
  return (
    <header className="w-full bg-[#FCF9F2] border-b-2 border-[#111111] px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 bg-[#C41E24] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center text-white font-syne font-extrabold text-sm">
              FF
            </div>
          </Link>
        )}
        <div>
          <span className="font-syne font-extrabold text-lg leading-none tracking-tight block text-[#111111]">
            FRAMEFLOW
          </span>
          <span className="font-grotesk text-[10px] font-bold text-[#C41E24] tracking-widest uppercase block">
            {stepText || "AGENCY GENERATOR"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="bg-[#FFE800] text-[#111111] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          v1.0 MVP
        </span>
      </div>
    </header>
  );
};
