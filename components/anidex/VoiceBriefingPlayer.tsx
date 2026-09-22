"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Headphones,
  Zap,
  Sparkles,
  Gauge,
  Radio,
} from "lucide-react";
import { audioPlayer, AudioPlaybackState } from "@/lib/audio-player";
import { soundEffects } from "@/lib/sound-effects";

interface VoiceBriefingPlayerProps {
  speechText: string;
  speciesName: string;
  dexNumber: string;
  autoPlay?: boolean;
}

export function VoiceBriefingPlayer({
  speechText,
  speciesName,
  dexNumber,
  autoPlay = false,
}: VoiceBriefingPlayerProps) {
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentText: "",
    source: null,
  });

  const autoPlayTriggeredRef = useRef(false);

  const handlePlay = useCallback(async () => {
    soundEffects.playRadioVoiceChirp();
    await audioPlayer.speakText(speechText);
  }, [speechText]);

  useEffect(() => {
    const unsub = audioPlayer.subscribe((state) => {
      setPlaybackState(state);
    });

    if (autoPlay && speechText && !autoPlayTriggeredRef.current) {
      autoPlayTriggeredRef.current = true;
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);
      return () => {
        clearTimeout(timer);
        unsub();
      };
    }

    return () => {
      unsub();
    };
  }, [speechText, autoPlay, handlePlay]);

  const handlePause = () => {
    soundEffects.playButtonBeep();
    audioPlayer.pause();
  };

  const handleResume = () => {
    soundEffects.playButtonBeep();
    audioPlayer.resume();
  };

  const handleReplay = async () => {
    soundEffects.playRadioVoiceChirp();
    audioPlayer.stop();
    await audioPlayer.speakText(speechText);
  };

  const handleStop = () => {
    soundEffects.playButtonBeep();
    audioPlayer.stop();
  };

  const isCurrentTextPlaying =
    playbackState.isPlaying && playbackState.currentText === speechText;
  const isCurrentTextPaused =
    playbackState.isPaused && playbackState.currentText === speechText;
  const isLoading =
    playbackState.isLoading && playbackState.currentText === speechText;

  return (
    <div
      id="hands-free-voice-player"
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/50 p-4 shadow-[0_4px_25px_rgba(6,182,212,0.15)]"
    >
      {/* Background scanline & subtle glow */}
      <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header telemetry */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-pokedex text-xs uppercase tracking-widest text-cyan-300 font-bold">
                  Hands-Free Voice Field Guide
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-1.5 py-0.2 rounded border border-cyan-700/60">
                  {dexNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audio telemetry for outdoor hiking & exploration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isCurrentTextPlaying && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                <Radio className="w-3 h-3 animate-spin" />
                <span>NARRATING</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
              {playbackState.source === "gemini" ? "Gemini Neural TTS" : "Web Speech Engine"}
            </span>
          </div>
        </div>

        {/* Spoken Narration Script Box */}
        <div className="relative bg-slate-950/90 rounded-lg p-3 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mb-3">
          <p className="italic text-slate-300">
            &ldquo;{speechText}&rdquo;
          </p>

          {/* Audio Waveform visualization */}
          {isCurrentTextPlaying && (
            <div className="flex items-end justify-center gap-1 h-6 mt-3 pt-1 border-t border-slate-800">
              {[40, 70, 90, 60, 100, 45, 80, 55, 95, 65, 85, 50, 75].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full soundwave-bar"
                  style={{
                    animationDelay: `${i * 70}ms`,
                    animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Player Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            {!isCurrentTextPlaying && !isCurrentTextPaused && (
              <button
                id="voice-play-briefing-btn"
                onClick={handlePlay}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-pokedex text-xs sm:text-sm font-bold tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>SYNTHESIZING...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>PLAY FIELD BRIEFING</span>
                  </>
                )}
              </button>
            )}

            {isCurrentTextPlaying && (
              <button
                id="voice-pause-btn"
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-pokedex text-xs font-bold tracking-wider shadow-md transition-colors cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>PAUSE</span>
              </button>
            )}

            {isCurrentTextPaused && (
              <button
                id="voice-resume-btn"
                onClick={handleResume}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-pokedex text-xs font-bold tracking-wider shadow-md transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RESUME</span>
              </button>
            )}

            {(isCurrentTextPlaying || isCurrentTextPaused) && (
              <button
                id="voice-stop-btn"
                onClick={handleStop}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                title="Stop Audio"
              >
                STOP
              </button>
            )}

            <button
              id="voice-replay-btn"
              onClick={handleReplay}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Replay from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optimal with headphones on trails</span>
          </div>
        </div>
      </div>
    </div>
  );
}
