import React from "react";
import { BrutalistButton } from "./BrutalistButton";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface StickyBottomNavProps {
  onBack?: () => void;
  onNext?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextText?: string;
  disabledNext?: boolean;
}

export const StickyBottomNav: React.FC<StickyBottomNavProps> = ({
  onBack,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  nextText,
  disabledNext = false,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-[#F5F2EB] border-t-3 border-[#111111] p-4 shadow-[0px_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 max-w-[440px] mx-auto">
        {!isFirstStep && onBack && (
          <BrutalistButton
            type="button"
            variant="secondary"
            onClick={onBack}
            className="w-14 px-0 shrink-0"
            aria-label="Back Step"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </BrutalistButton>
        )}

        <BrutalistButton
          type="button"
          variant={isLastStep ? "primary" : "black"}
          onClick={onNext}
          fullWidth
          disabled={disabledNext}
          className="flex items-center justify-center gap-2 text-sm sm:text-base tracking-widest"
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>{nextText || "GENERATE PPT"}</span>
            </>
          ) : (
            <>
              <span>{nextText || "NEXT STEP"}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </BrutalistButton>
      </div>
    </div>
  );
};
