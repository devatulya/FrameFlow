"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { StickyBottomNav } from "@/components/StickyBottomNav";
import { BrutalistButton } from "@/components/BrutalistButton";
import { BrandForm } from "@/components/BrandForm";
import { ColorForm } from "@/components/ColorForm";
import { TypographyForm } from "@/components/TypographyForm";
import { EditingForm } from "@/components/EditingForm";
import { WardrobeForm } from "@/components/WardrobeForm";
import { BackgroundForm } from "@/components/BackgroundForm";
import { Review } from "@/components/Review";
import { FrameworkData, StepNumber, INITIAL_FRAMEWORK_DATA } from "@/lib/types";
import { Download, Sparkles, AlertTriangle, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";

export default function CreateFrameworkPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [formData, setFormData] = useState<FrameworkData>(INITIAL_FRAMEWORK_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<{ fileName: string; downloadUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("frameflow_form_data");
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load form data from localStorage");
    }
  }, []);

  // Persist state on change
  useEffect(() => {
    try {
      localStorage.setItem("frameflow_form_data", JSON.stringify(formData));
    } catch (e) {
      console.warn("Could not save form data to localStorage");
    }
  }, [formData]);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as StepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Step 7 -> Generate PPT
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress(1);

    // Simulate animated generation progress steps
    const timer1 = setTimeout(() => setGenerationProgress(2), 600);
    const timer2 = setTimeout(() => setGenerationProgress(3), 1200);
    const timer3 = setTimeout(() => setGenerationProgress(4), 1800);
    const timer4 = setTimeout(() => setGenerationProgress(5), 2400);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setDownloadInfo({
          fileName: resData.fileName,
          downloadUrl: resData.downloadUrl,
        });
        setIsGenerating(false);
      } else {
        throw new Error(resData.error || "Failed to generate presentation.");
      }
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMessage(
        err.message || "Something went wrong while generating your framework."
      );
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FRAMEWORK_DATA);
    setCurrentStep(1);
    setDownloadInfo(null);
    setErrorMessage(null);
    localStorage.removeItem("frameflow_form_data");
  };

  // GENERATION LOADING OVERLAY
  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col bg-[#FCF9F2] justify-center p-6 space-y-6">
        <div className="card-brutal p-6 bg-white space-y-6 text-center">
          <div className="w-16 h-16 bg-[#C41E24] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mx-auto flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin stroke-[2.5]" />
          </div>

          <div>
            <h2 className="font-syne text-2xl font-extrabold text-[#111111]">
              BUILDING FRAMEWORK...
            </h2>
            <p className="font-grotesk text-xs font-bold text-[#C41E24] uppercase tracking-widest mt-1">
              REPLACING BLUEPRINT PLACEHOLDERS
            </p>
          </div>

          <div className="card-brutal p-4 bg-[#F5F2EB] text-left space-y-2 font-grotesk text-xs font-bold">
            <div className={`flex items-center gap-2 ${generationProgress >= 1 ? "text-[#111111]" : "text-gray-400"}`}>
              <span>{generationProgress >= 1 ? "✓" : "○"}</span> Brand Identifiers
            </div>
            <div className={`flex items-center gap-2 ${generationProgress >= 2 ? "text-[#111111]" : "text-gray-400"}`}>
              <span>{generationProgress >= 2 ? "✓" : "○"}</span> Colour Swatches & Fills
            </div>
            <div className={`flex items-center gap-2 ${generationProgress >= 3 ? "text-[#111111]" : "text-gray-400"}`}>
              <span>{generationProgress >= 3 ? "✓" : "○"}</span> Typography Hierarchy
            </div>
            <div className={`flex items-center gap-2 ${generationProgress >= 4 ? "text-[#111111]" : "text-gray-400"}`}>
              <span>{generationProgress >= 4 ? "✓" : "○"}</span> Editing Pacing Marker
            </div>
            <div className={`flex items-center gap-2 ${generationProgress >= 5 ? "text-[#111111]" : "text-gray-400"}`}>
              <span>{generationProgress >= 5 ? "✓" : "○"}</span> Reference Imagery
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DOWNLOAD READY SCREEN
  if (downloadInfo) {
    return (
      <div className="flex-1 flex flex-col bg-[#FCF9F2]">
        <Header title="FRAMEWORK READY" />

        <main className="flex-1 p-5 space-y-6 flex flex-col justify-center">
          <div className="card-brutal p-6 bg-white space-y-6 text-center">
            <div className="w-16 h-16 bg-[#FFE800] border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mx-auto flex items-center justify-center text-[#111111]">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="font-syne text-2xl font-extrabold text-[#111111]">
                FRAMEWORK READY ✓
              </h2>
              <p className="font-grotesk text-xs font-semibold text-gray-600 mt-1">
                Your PowerPoint presentation was compiled cleanly from the master blueprint.
              </p>
            </div>

            <div className="p-3 bg-[#F5F2EB] border-2 border-[#111111] font-mono text-xs font-bold break-all text-[#111111]">
              {downloadInfo.fileName}
            </div>

            <div className="space-y-3 pt-2">
              <a href={downloadInfo.downloadUrl} download={downloadInfo.fileName} className="block w-full">
                <BrutalistButton variant="primary" fullWidth size="lg" className="gap-2">
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>DOWNLOAD PPT</span>
                </BrutalistButton>
              </a>

              <BrutalistButton
                variant="secondary"
                fullWidth
                onClick={handleReset}
                className="gap-2 text-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>CREATE ANOTHER</span>
              </BrutalistButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ERROR FALLBACK SCREEN
  if (errorMessage) {
    return (
      <div className="flex-1 flex flex-col bg-[#FCF9F2]">
        <Header title="ERROR" />

        <main className="flex-1 p-5 space-y-6 flex flex-col justify-center">
          <div className="card-brutal p-6 bg-white space-y-5 text-center">
            <div className="w-14 h-14 bg-red-100 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] mx-auto flex items-center justify-center text-[#C41E24]">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="font-syne text-xl font-extrabold text-[#111111]">
                SOMETHING WENT WRONG
              </h2>
              <p className="font-grotesk text-xs text-red-700 font-semibold mt-1">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <BrutalistButton variant="primary" fullWidth onClick={handleGenerate}>
                TRY AGAIN
              </BrutalistButton>
              <BrutalistButton variant="secondary" fullWidth onClick={() => setErrorMessage(null)}>
                BACK TO REVIEW
              </BrutalistButton>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // WIZARD STEPS RENDER
  return (
    <div className="flex-1 flex flex-col bg-[#FCF9F2]">
      <Header
        showBack
        onBack={handleBack}
        stepText={`STEP 0${currentStep} OF 07`}
      />

      <StepIndicator
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      <main className="flex-1 p-4 sm:p-5 pb-8 space-y-6">
        {currentStep === 1 && (
          <BrandForm
            data={formData.brand}
            onChange={(brand) => setFormData({ ...formData, brand })}
          />
        )}

        {currentStep === 2 && (
          <ColorForm
            data={formData.colors}
            onChange={(colors) => setFormData({ ...formData, colors })}
          />
        )}

        {currentStep === 3 && (
          <TypographyForm
            data={formData.typography}
            onChange={(typography) => setFormData({ ...formData, typography })}
          />
        )}

        {currentStep === 4 && (
          <EditingForm
            data={formData.editing}
            onChange={(editing) => setFormData({ ...formData, editing })}
          />
        )}

        {currentStep === 5 && (
          <WardrobeForm
            data={formData.wardrobe}
            onChange={(wardrobe) => setFormData({ ...formData, wardrobe })}
          />
        )}

        {currentStep === 6 && (
          <BackgroundForm
            data={formData.background}
            onChange={(background) => setFormData({ ...formData, background })}
          />
        )}

        {currentStep === 7 && (
          <Review
            data={formData}
            onEditStep={(step) => setCurrentStep(step)}
          />
        )}
      </main>

      <StickyBottomNav
        onBack={handleBack}
        onNext={handleNext}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 7}
        nextText={currentStep === 7 ? "GENERATE PPT" : "NEXT STEP"}
      />
    </div>
  );
}
