import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BrutalistButton } from "@/components/BrutalistButton";
import { Sparkles, FileText, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col bg-[#FCF9F2]">
      <Header />

      <main className="flex-1 p-5 space-y-6 flex flex-col justify-between">
        {/* HERO CARD */}
        <div className="card-brutal p-6 bg-white space-y-4">
          <div className="inline-block bg-[#FFE800] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#111111]">
            ⚡ INTERNAL AGENCY TOOL
          </div>

          <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight tracking-tight">
            CREATIVE FRAMEWORK <span className="text-[#C41E24]">GENERATOR</span>
          </h1>

          <p className="font-grotesk text-sm font-medium text-gray-700 leading-relaxed">
            Eliminate repetitive PowerPoint editing. Transform visual shoot direction into agency-standard PowerPoint frameworks in 5 minutes.
          </p>

          <div className="pt-2">
            <Link href="/create" className="block w-full">
              <BrutalistButton variant="primary" fullWidth size="lg" className="gap-2">
                <Sparkles className="w-5 h-5 fill-current" />
                <span>+ CREATE FRAMEWORK</span>
              </BrutalistButton>
            </Link>
          </div>
        </div>

        {/* METRICS & FEATURES */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-brutal p-3.5 bg-[#F5F2EB]">
            <span className="font-syne text-2xl font-extrabold text-[#C41E24] block">
              30m → 5m
            </span>
            <span className="font-grotesk text-xs font-bold uppercase text-[#111111] block mt-0.5">
              Speed Creation
            </span>
          </div>

          <div className="card-brutal p-3.5 bg-[#F5F2EB]">
            <span className="font-syne text-2xl font-extrabold text-[#111111] block">
              100%
            </span>
            <span className="font-grotesk text-xs font-bold uppercase text-[#111111] block mt-0.5">
              Template Fidelity
            </span>
          </div>
        </div>

        {/* PRESERVED TEMPLATE NOTICE */}
        <div className="card-brutal p-4 bg-white space-y-2">
          <div className="flex items-center gap-2 text-[#C41E24] font-grotesk font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>IMMUTABLE MASTER TEMPLATE</span>
          </div>
          <p className="font-grotesk text-xs text-gray-600">
            Generates compliant PowerPoint decks directly from the official agency <span className="font-mono font-bold text-[#111111]">AMORE</span> master blueprint.
          </p>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-4 pb-2">
          <span className="font-grotesk text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            FRAMEFLOW ENGINE v1.0 • MOBILE FIRST
          </span>
        </div>
      </main>
    </div>
  );
}
