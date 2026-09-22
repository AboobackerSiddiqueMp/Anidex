"use client";

import React, { useState, useEffect } from "react";
import { Camera, Images, Volume2, VolumeX, Sparkles, Compass, Radio } from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { audioPlayer } from "@/lib/audio-player";

interface AnidexHeaderProps {
  activeTab: "scanner" | "gallery";
  onTabChange: (tab: "scanner" | "gallery") => void;
  galleryCount: number;
  onOpenIntro: () => void;
  isScanning?: boolean;
}

export function AnidexHeader({
  activeTab,
  onTabChange,
  galleryCount,
  onOpenIntro,
  isScanning = false,
}: AnidexHeaderProps) {
  const [muted, setMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const unsub = audioPlayer.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
    return unsub;
  }, []);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playButtonBeep();
    }
  };

  return (
    <header className="relative w-full bg-gradient-to-b from-[#b91c1c] via-[#dc2626] to-[#991b1b] border-b-4 border-slate-900 shadow-xl select-none">
      {/* Top Pokédex chassis curved ridge */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Classic Big Pokédex Lens + 3 Mini LEDs */}
          <div className="flex items-center gap-3">
            {/* Main Blue Sensor Lens with Paw */}
            <button
              id="header-lens-btn"
              onClick={() => {
                soundEffects.playButtonBeep();
                onOpenIntro();
              }}
              title="AniDex Central Sensor Lens (Tap for System Specs)"
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900 p-1 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer border-2 border-slate-300/40"
            >
              <div
                className={`w-full h-full rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-400 to-sky-200 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] ${
                  isScanning || isPlayingAudio ? "lens-glow ring-2 ring-cyan-300" : ""
                }`}
              >
                <svg
                  className="w-7 h-7 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 13.5c-1.8 0-3.5 1.2-3.5 3s1.5 3.5 3.5 3.5 3.5-1.7 3.5-3.5-1.7-3-3.5-3zm-5.5-3c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </button>

            {/* 3 Status Indicator LEDs */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Red LED */}
              <div
                title="Power Indicator"
                className={`w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm transition-all ${
                  isScanning
                    ? "bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping"
                    : "bg-red-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]"
                }`}
              />
              {/* Yellow/Amber LED */}
              <div
                title="Processing Indicator"
                className={`w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm transition-all ${
                  isScanning
                    ? "bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce"
                    : "bg-amber-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]"
                }`}
              />
              {/* Green Voice LED */}
              <div
                title="Speech / Audio Active Indicator"
                className={`w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm transition-all ${
                  isPlayingAudio
                    ? "bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse ring-2 ring-emerald-300"
                    : "bg-emerald-600 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]"
                }`}
              />
            </div>

            {/* App branding */}
            <div className="hidden sm:block ml-2">
              <div className="flex items-center gap-2">
                <span className="font-pokedex font-bold text-xl tracking-wider text-white drop-shadow-md">
                  ANI<span className="text-cyan-300">DEX</span>
                </span>
                <span className="bg-slate-900/60 text-emerald-400 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-emerald-500/30 tracking-widest">
                  GEN-01
                </span>
              </div>
              <p className="text-[10px] text-red-100 font-mono tracking-wider">
                NATURAL FAUNA SCANNER // FIELD UNIT
              </p>
            </div>
          </div>

          {/* Right Controls: Audio Mute, Live Audio Pulse, Info */}
          <div className="flex items-center gap-2">
            {isPlayingAudio && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/70 rounded-full border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>VOICE ACTIVE</span>
                <div className="flex items-end gap-0.5 h-3.5 ml-1">
                  <span className="w-1 bg-emerald-400 rounded-full soundwave-bar" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 bg-emerald-400 rounded-full soundwave-bar" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 bg-emerald-400 rounded-full soundwave-bar" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Audio Mute Toggle */}
            <button
              id="sound-fx-toggle-btn"
              onClick={toggleSound}
              className="p-2 bg-slate-900/50 hover:bg-slate-900/80 active:scale-95 text-white rounded-lg border border-white/20 transition-colors cursor-pointer"
              title={muted ? "Unmute Sound FX" : "Mute Sound FX"}
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar - Styled like classic Pokédex buttons */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-red-500/40">
          <div className="flex items-center gap-2">
            <button
              id="nav-scanner-tab"
              onClick={() => {
                soundEffects.playButtonBeep();
                onTabChange("scanner");
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-t-lg font-pokedex text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "scanner"
                  ? "bg-slate-900 text-cyan-300 border-t-2 border-l-2 border-r-2 border-cyan-400/50 shadow-md translate-y-[2px]"
                  : "bg-red-900/40 hover:bg-red-900/60 text-white/90 border border-red-900/50"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>FAUNA SCANNER</span>
            </button>

            <button
              id="nav-gallery-tab"
              onClick={() => {
                soundEffects.playButtonBeep();
                onTabChange("gallery");
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-t-lg font-pokedex text-xs sm:text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "gallery"
                  ? "bg-slate-900 text-cyan-300 border-t-2 border-l-2 border-r-2 border-cyan-400/50 shadow-md translate-y-[2px]"
                  : "bg-red-900/40 hover:bg-red-900/60 text-white/90 border border-red-900/50"
              }`}
            >
              <Images className="w-4 h-4" />
              <span>FIELD GALLERY</span>
              <span
                suppressHydrationWarning
                className="ml-1 px-1.5 py-0.2 bg-cyan-900/70 text-cyan-300 text-[10px] font-mono rounded-full border border-cyan-500/40"
              >
                {galleryCount}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-red-100/90 hidden sm:flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-300" />
            <span>OUTDOOR EXPLORER MODE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
