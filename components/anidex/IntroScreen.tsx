"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { soundEffects } from "@/lib/sound-effects";

interface IntroScreenProps {
  onEnter: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setReady(true);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    soundEffects.playSuccessChime();
    onEnter();
  };

  return (
    <div
      id="anidex-intro-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#6b1515] via-[#851818] to-[#450d0d] px-4 select-none"
    >
      {/* Subtle CRT scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-md w-full text-center"
      >
        {/* Iconic Pokédex Ball with center paw icon - replicating user's mockup */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="relative w-44 h-44 rounded-full bg-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] border-4 border-slate-900/60 overflow-hidden flex flex-col">
            {/* Top red hemisphere */}
            <div className="w-full h-1/2 bg-gradient-to-b from-[#dc2626] to-[#b91c1c] border-b-[5px] border-slate-900" />
            {/* Bottom white hemisphere */}
            <div className="w-full h-1/2 bg-gradient-to-b from-slate-100 to-slate-200" />

            {/* Center circular button with glowing cyan paw */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center p-1.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-400 to-sky-300 lens-glow flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                {/* Paw icon SVG */}
                <svg
                  className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 13.5c-1.8 0-3.5 1.2-3.5 3s1.5 3.5 3.5 3.5 3.5-1.7 3.5-3.5-1.7-3-3.5-3zm-5.5-3c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Title & Gen Code */}
        <h1 className="font-pokedex text-4xl sm:text-5xl font-extrabold tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
          ANI<span className="text-cyan-400">DEX</span>
        </h1>
        <p className="font-pokedex text-xs sm:text-sm tracking-[0.25em] text-emerald-400 font-semibold mt-2 mb-8 drop-shadow-sm uppercase">
          Natural Fauna Scanner // Gen-01
        </p>

        {/* Progress Bar & Status */}
        <div className="w-64 sm:w-72 mb-8">
          <div className="w-full h-2.5 bg-slate-950/80 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-sky-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-pokedex text-slate-300 mt-2">
            <span className="tracking-widest uppercase">
              {progress < 100 ? "Initializing Sensors" : "Sensors Online"}
            </span>
            <span className="text-cyan-400 font-mono">
              {(progress * 0.021).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Enter Button */}
        <AnimatePresence>
          {ready && (
            <motion.button
              id="tap-to-enter-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleEnter}
              className="font-pokedex tracking-widest text-sm uppercase px-8 py-3 rounded-lg border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-colors cursor-pointer flex items-center gap-2 group"
            >
              <span>Tap to Enter</span>
              <span className="text-cyan-300 group-hover:translate-x-1 transition-transform">
                &gt;
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <p className="mt-12 text-[10px] text-slate-400/80 uppercase tracking-widest font-mono">
          Powered by Gemini Vision & Text-to-Speech
        </p>
      </motion.div>
    </div>
  );
}
