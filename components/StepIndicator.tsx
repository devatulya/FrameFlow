import React from "react";
import { StepNumber } from "@/lib/types";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: StepNumber;
  onStepClick: (step: StepNumber) => void;
}

const STEPS = [
  { num: 1, label: "Brand" },
  { num: 2, label: "Colours" },
  { num: 3, label: "Typography" },
  { num: 4, label: "Editing" },
  { num: 5, label: "Wardrobe" },
  { num: 6, label: "Background" },
  { num: 7, label: "Review" },
] as const;

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full bg-[#F5F2EB] border-b-2 border-[#111111] px-4 py-2.5 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max">
        {STEPS.map((s) => {
          const isActive = s.num === currentStep;
          const isCompleted = s.num < currentStep;

          return (
            <button
              key={s.num}
              onClick={() => onStepClick(s.num as StepNumber)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#111111] font-grotesk text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#C41E24] text-white shadow-[2px_2px_0px_#111111] scale-[1.02]"
                  : isCompleted
                  ? "bg-white text-[#111111] shadow-[2px_2px_0px_#111111]"
                  : "bg-white/60 text-[#111111]/50 border-[#111111]/40 shadow-none"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-none flex items-center justify-center text-[10px] ${
                  isActive
                    ? "bg-white text-[#C41E24]"
                    : isCompleted
                    ? "bg-[#111111] text-white"
                    : "bg-[#111111]/20 text-[#111111]"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
              </span>
              <span className="uppercase tracking-wider">
                0{s.num} {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
