"use client";

import React, { useEffect, useState } from "react";
import { NatureBackground } from "./NatureBackground";

interface AnalyzingViewProps {
  previewImage: string;
}

export function AnalyzingView({ previewImage }: AnalyzingViewProps) {
  const [stage, setStage] = useState<"identifying" | "gathering">("identifying");
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    // Stage 1: Identifying (0-2.5s)
    const t1 = setTimeout(() => {
      setProgress(65);
    }, 800);

    // Stage 2: Gathering Details (2.5s+)
    const t2 = setTimeout(() => {
      setStage("gathering");
      setProgress(92);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <NatureBackground
      variant={stage === "identifying" ? "blue" : "peach"}
      showMascots={true}
      mascotType="deer"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full">
        {/* Tilted Photo Card with Sweeping Laser Scan Line (as seen in video 00:02-00:04) */}
        <div className="relative mb-10 w-64 sm:w-72 aspect-4/3 rounded-2xl bg-white p-2.5 shadow-2xl transform -rotate-3 transition-transform duration-500 hover:rotate-0">
          {/* Photo frame */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Scanning Fauna"
              className="w-full h-full object-cover"
            />

            {/* Glowing Laser Scan Line sweeping up and down */}
            <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#ffffff] laser-beam" />
            <div className="absolute inset-0 bg-cyan-400/10 pointer-events-none" />
          </div>
        </div>

        {/* Progress Card (exact match with video 00:02-00:04) */}
        <div className="w-full max-w-xs rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-5 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider uppercase">
            <span>
              {stage === "identifying" ? "IDENTIFYING" : "GATHERING DETAILS"}
            </span>
          </div>

          {/* Yellow Progress Bar */}
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_#f59e0b]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Friendly Subtitle Status */}
          <p className="text-sm font-medium text-white/90">
            {stage === "identifying"
              ? "Looking it over..."
              : "Found something! Gathering the details..."}
          </p>
        </div>
      </div>
    </NatureBackground>
  );
}
