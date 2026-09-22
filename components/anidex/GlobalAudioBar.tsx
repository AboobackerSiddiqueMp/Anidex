"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Square, Loader2 } from "lucide-react";
import { audioPlayer, AudioPlaybackState } from "@/lib/audio-player";
import { soundEffects } from "@/lib/sound-effects";

export function GlobalAudioBar() {
  const [audioState, setAudioState] = useState<AudioPlaybackState>(() =>
    audioPlayer.getState()
  );

  useEffect(() => {
    return audioPlayer.subscribe((state) => {
      setAudioState(state);
    });
  }, []);

  if (!audioState.isPlaying && !audioState.isLoading) {
    return null;
  }

  const handleStop = () => {
    soundEffects.playButtonBeep();
    audioPlayer.stop();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 shadow-[0_8px_30px_rgba(6,182,212,0.3)] text-white text-xs font-mono">
        <div className="flex items-center gap-2">
          {audioState.isLoading ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <Volume2 className="w-4 h-4 text-emerald-400 relative z-10" />
            </div>
          )}
          <span className="text-slate-200 max-w-[140px] sm:max-w-[200px] truncate">
            {audioState.isLoading ? "Synthesizing voice..." : "Voice Guide Playing"}
          </span>
        </div>

        <button
          onClick={handleStop}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 hover:bg-red-500 text-white font-bold text-[11px] tracking-wide transition-all active:scale-95 cursor-pointer shadow-xs"
          title="Stop voice audio immediately"
        >
          <Square className="w-3 h-3 fill-current" />
          <span>STOP VOICE</span>
        </button>
      </div>
    </div>
  );
}
