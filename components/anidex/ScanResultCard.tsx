"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Camera, ArrowRight, Volume2, VolumeX, Loader2, X } from "lucide-react";
import { AnimalDexEntry } from "@/types/anidex";
import { NatureBackground } from "./NatureBackground";
import { soundEffects } from "@/lib/sound-effects";
import { audioPlayer, AudioPlaybackState } from "@/lib/audio-player";

interface ScanResultCardProps {
  entry: AnimalDexEntry;
  onViewDetails: () => void;
  onTakeAnotherSnap: () => void;
}

export function ScanResultCard({
  entry,
  onViewDetails,
  onTakeAnotherSnap,
}: ScanResultCardProps) {
  const [audioState, setAudioState] = useState<AudioPlaybackState>(() => audioPlayer.getState());

  // Stop voice narration immediately when this animal card is dismissed or unmounted
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state) => setAudioState(state));
    return () => {
      unsubscribe();
      audioPlayer.stop();
    };
  }, []);

  const handleDismissCard = () => {
    soundEffects.playButtonBeep();
    audioPlayer.stop();
    onTakeAnotherSnap();
  };

  const handleToggleAudio = () => {
    if (audioState.isPlaying) {
      audioPlayer.stop();
    } else {
      soundEffects.playButtonBeep();
      audioPlayer.speakText(entry.handsFreeSpeechSummary);
    }
  };

  const isSafe =
    !entry.outdoorEncounterTips.toLowerCase().includes("danger") &&
    !entry.outdoorEncounterTips.toLowerCase().includes("venom");

  const rarityLabel =
    entry.conservationStatus.code === "EN"
      ? "ENDANGERED"
      : entry.conservationStatus.code === "CR"
      ? "CRITICALLY RARE"
      : entry.conservationStatus.code === "VU"
      ? "VULNERABLE"
      : "COMMON";

  return (
    <NatureBackground variant="peach" showMascots={true} mascotType="deer">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-sm sm:max-w-md mx-auto w-full space-y-4">
        {/* Main Animal Identified White Card (video 00:05-00:07) */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-2xl space-y-3 text-slate-800">
          {/* Card Top Bar with Close X Button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Fauna Scan Match
            </span>
            <button
              onClick={handleDismissCard}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Close card (stops voice and returns to scanner)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animal Image with Floating Sparkles */}
          <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.imageUrl}
              alt={entry.commonName}
              className="w-full h-full object-cover"
            />

            {/* Sparkles / Magic discovery particle effect from video */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-28 h-28">
                <Sparkles className="w-8 h-8 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute bottom-2 left-1 animate-ping" />
                <Sparkles className="w-5 h-5 text-yellow-200 absolute top-6 -left-2" />
              </div>
            </div>

            {/* Dex number badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-mono font-bold backdrop-blur-xs">
              {entry.dexNumber}
            </div>
          </div>

          {/* Animal Name & Taxonomy */}
          <div className="text-center pt-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {entry.commonName}
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {entry.category} · <span className="italic">{entry.scientificName}</span>
            </p>

            {/* Listen to Voice Narration Button */}
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <button
                id="listen-fauna-voice-btn"
                onClick={handleToggleAudio}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                  audioState.isPlaying
                    ? "bg-emerald-600 text-white shadow-emerald-500/30 animate-pulse ring-2 ring-emerald-400"
                    : audioState.isLoading
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
                title="Hear animal details read aloud by voice guide"
              >
                {audioState.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                ) : audioState.isPlaying ? (
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>
                  {audioState.isLoading
                    ? "Generating Voice..."
                    : audioState.isPlaying
                    ? "Pause Voice Briefing"
                    : "Hear Animal Details"}
                </span>
              </button>
            </div>
          </div>

          {/* Diagnostics Card (CONFIDENCE / RARITY / SAFETY) */}
          <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-4 space-y-2.5">
            <div className="grid grid-cols-2 gap-4">
              {/* Confidence */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  CONFIDENCE
                </span>
                <span className="block text-sm font-extrabold text-emerald-600">
                  {entry.confidence >= 90 ? "HIGH" : "GOOD"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${entry.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {entry.confidence}%
                  </span>
                </div>
              </div>

              {/* Rarity */}
              <div>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  RARITY
                </span>
                <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
                  {rarityLabel}
                </span>
                {/* Safety Shield */}
                <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {isSafe ? "No safety warnings" : "Observe from safe distance"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Stitched Buttons (exact match with video 00:06-00:07) */}
        <div className="w-full space-y-3 pt-1">
          {/* Button 1: View Snap Details (Blue with white dashed stitches) */}
          <button
            onClick={() => {
              soundEffects.playButtonBeep();
              onViewDetails();
            }}
            className="w-full py-3.5 px-6 rounded-2xl btn-stitched-blue text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>View Snap Details</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Button 2: Take another snap (Purple with white dashed stitches) */}
          <button
            onClick={() => {
              soundEffects.playButtonBeep();
              audioPlayer.stop();
              onTakeAnotherSnap();
            }}
            className="w-full py-3.5 px-6 rounded-2xl btn-stitched-purple text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Camera className="w-5 h-5" />
            <span>Take another snap</span>
          </button>
        </div>
      </div>
    </NatureBackground>
  );
}
