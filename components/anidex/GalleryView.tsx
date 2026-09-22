"use client";

import React, { useState, useMemo } from "react";
import {
  Camera,
  Search,
  Volume2,
  Trash2,
  Heart,
  Sparkles,
} from "lucide-react";
import { AnimalDexEntry } from "@/types/anidex";
import { soundEffects } from "@/lib/sound-effects";
import { audioPlayer } from "@/lib/audio-player";
import { NatureBackground } from "./NatureBackground";

interface GalleryViewProps {
  entries: AnimalDexEntry[];
  onSelectEntry: (entry: AnimalDexEntry) => void;
  onDeleteEntry: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onGoToScanner: () => void;
}

// 151 Collection Target species placeholders (like video: Cat, Robin, Cow, Bumblebee, Pigeon, Fox, Rabbit, Frog, etc.)
const COLLECTION_TARGETS = [
  "Robin",
  "Cat",
  "Cow",
  "Bumblebee",
  "Pigeon",
  "Red Fox",
  "Rabbit",
  "Tree Frog",
  "Barn Owl",
  "Chameleon",
  "Bengal Tiger",
  "Monarch Butterfly",
  "Sea Turtle",
  "Goldfish",
  "Hedgehog",
  "Squirrel",
  "Bald Eagle",
  "Dolphin",
  "Otter",
  "Koala",
  "Panda",
  "Wolf",
  "Giraffe",
  "Zebra",
];

const TOTAL_SLOTS = 151;

export function GalleryView({
  entries,
  onSelectEntry,
  onDeleteEntry,
  onToggleFavorite,
  onGoToScanner,
}: GalleryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "favorites" | "recent">("all");

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filterMode === "favorites" && !entry.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = entry.commonName.toLowerCase().includes(q);
        const matchesSci = entry.scientificName.toLowerCase().includes(q);
        const matchesBiome = entry.habitat.biome.toLowerCase().includes(q);
        return matchesName || matchesSci || matchesBiome;
      }
      return true;
    });
  }, [entries, filterMode, searchQuery]);

  // Combine discovered items with remaining empty target slots up to display length
  const emptyTargets = useMemo(() => {
    const discoveredNames = new Set(entries.map((e) => e.commonName.toLowerCase()));
    return COLLECTION_TARGETS.filter(
      (target) => !discoveredNames.has(target.toLowerCase())
    );
  }, [entries]);

  const handleQuickPlayAudio = (e: React.MouseEvent, entry: AnimalDexEntry) => {
    e.stopPropagation();
    soundEffects.playRadioVoiceChirp();
    audioPlayer.speakText(entry.handsFreeSpeechSummary);
  };

  return (
    <NatureBackground variant="light" showMascots={true} mascotType="all">
      <div id="wunderwild-collection-container" className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-8 w-full">
        {/* Header from video frames 00:08 - 00:11 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
            Let&apos;s find them all.
          </h1>
          <p className="text-sm sm:text-base text-emerald-800/80 font-medium">
            Every snap you take fills a slot in your Collection.
          </p>

          {/* Species Discovered Counter (video 00:09) */}
          <div className="pt-4 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-1.5 text-emerald-900">
              <span
                suppressHydrationWarning
                className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-700"
              >
                {entries.length}
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-900/60">
                of {TOTAL_SLOTS}
              </span>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-emerald-800 uppercase mt-0.5">
              SPECIES DISCOVERED
            </span>

            {/* Dotted indicator bar */}
            <div className="flex items-center gap-1.5 mt-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i < Math.min(entries.length, 8)
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-emerald-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discovered species or biomes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-emerald-200/80 text-sm text-slate-800 placeholder-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundEffects.playButtonBeep();
                setFilterMode(filterMode === "favorites" ? "all" : "favorites");
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                filterMode === "favorites"
                  ? "bg-rose-500 text-white border-rose-400 shadow-sm"
                  : "bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              ★ Starred ({entries.filter((e) => e.isFavorite).length})
            </button>

            <button
              onClick={() => {
                soundEffects.playButtonBeep();
                onGoToScanner();
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl btn-stitched-blue text-white text-xs font-bold tracking-wide shadow-md cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>SNAP FAUNA</span>
            </button>
          </div>
        </div>

        {/* Collection Grid (Dashed border slots from video frames 00:08 - 00:11) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-5 pb-12">
          {/* 1. Filled slots (User's real captured animals) */}
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => {
                soundEffects.playButtonBeep();
                onSelectEntry(entry);
              }}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Photo Box with solid white border & soft shadow */}
              <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl bg-white p-1.5 sm:p-2 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-emerald-100 overflow-hidden">
                <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.imageUrl}
                    alt={entry.commonName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Audio badge */}
                  <button
                    onClick={(e) => handleQuickPlayAudio(e, entry)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-cyan-500 text-white backdrop-blur-xs transition-colors"
                    title="Play Hands-Free Briefing"
                  >
                    <Volume2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Animal Name label below */}
              <span className="mt-2 text-xs sm:text-sm font-bold text-emerald-950 text-center truncate max-w-full px-1">
                {entry.commonName}
              </span>
            </div>
          ))}

          {/* 2. Undiscovered Slots (Dashed borders with faint paw icon like video 00:08-00:11) */}
          {emptyTargets.map((name, idx) => (
            <div
              key={`empty-${idx}`}
              onClick={() => {
                soundEffects.playButtonBeep();
                onGoToScanner();
              }}
              className="flex flex-col items-center opacity-65 hover:opacity-100 transition-opacity cursor-pointer"
              title={`Undiscovered slot: ${name}. Tap to open camera and search!`}
            >
              {/* Dashed square slot */}
              <div className="aspect-square w-full rounded-2xl sm:rounded-3xl border-2 border-dashed border-emerald-300/80 bg-white/40 flex items-center justify-center p-3 hover:bg-white/80 transition-colors shadow-xs">
                {/* Faint Paw Print Icon */}
                <svg viewBox="0 0 50 50" className="w-8 h-8 text-emerald-300/80">
                  <circle cx="25" cy="32" r="9" fill="currentColor" />
                  <circle cx="14" cy="18" r="4.5" fill="currentColor" />
                  <circle cx="25" cy="13" r="4.5" fill="currentColor" />
                  <circle cx="36" cy="18" r="4.5" fill="currentColor" />
                </svg>
              </div>

              {/* Slot Target Name */}
              <span className="mt-2 text-xs font-medium text-emerald-700/60 text-center truncate max-w-full">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </NatureBackground>
  );
}
