"use client";

import React, { useState } from "react";
import {
  X,
  Volume2,
  Heart,
  Share2,
  MapPin,
  Shield,
  Gauge,
  Utensils,
  Eye,
  AlertTriangle,
  Lightbulb,
  Check,
  Compass,
} from "lucide-react";
import { AnimalDexEntry } from "@/types/anidex";
import { VoiceBriefingPlayer } from "./VoiceBriefingPlayer";
import { soundEffects } from "@/lib/sound-effects";

interface DexDetailModalProps {
  entry: AnimalDexEntry;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  autoPlayVoice?: boolean;
}

export function DexDetailModal({
  entry,
  onClose,
  onToggleFavorite,
  autoPlayVoice = false,
}: DexDetailModalProps) {
  const [isFav, setIsFav] = useState(entry.isFavorite || false);
  const [copied, setCopied] = useState(false);

  const handleFavoriteClick = () => {
    soundEffects.playButtonBeep();
    setIsFav(!isFav);
    if (onToggleFavorite) {
      onToggleFavorite(entry.id);
    }
  };

  const handleShare = async () => {
    soundEffects.playButtonBeep();
    const shareText = `AniDex [${entry.dexNumber}]: ${entry.commonName} (${entry.scientificName})\nCategory: ${entry.category}\nHabitat: ${entry.habitat.biome}\nIUCN Status: ${entry.conservationStatus.label}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  // IUCN status color mapping
  const getIucnColor = (code: string) => {
    switch (code) {
      case "CR":
        return "bg-red-950 text-red-400 border-red-600";
      case "EN":
        return "bg-orange-950 text-orange-400 border-orange-600";
      case "VU":
        return "bg-amber-950 text-amber-400 border-amber-500";
      case "NT":
        return "bg-yellow-950 text-yellow-300 border-yellow-600";
      case "LC":
        return "bg-emerald-950 text-emerald-400 border-emerald-500";
      default:
        return "bg-slate-800 text-slate-300 border-slate-600";
    }
  };

  return (
    <div
      id="dex-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="dex-detail-modal-card"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-900 border-4 border-red-700/80 shadow-[0_10px_50px_rgba(0,0,0,0.8)] text-slate-100 flex flex-col"
      >
        {/* Retro Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-700 via-red-600 to-red-800 border-b-2 border-slate-950 shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-pokedex font-bold text-lg text-white tracking-widest">
              ANIDEX TELEMETRY
            </span>
            <span className="font-mono text-xs px-2 py-0.5 bg-black/40 text-cyan-300 rounded border border-white/20">
              {entry.dexNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFav
                  ? "bg-red-500 text-white border-white/40"
                  : "bg-black/30 text-white/80 border-white/20 hover:bg-black/50"
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 border border-white/20 transition-colors cursor-pointer"
              title="Share Species Telemetry"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundEffects.playButtonBeep();
                onClose();
              }}
              className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white border border-white/20 transition-colors cursor-pointer"
              title="Close Entry"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Hero Section: Photo + Quick Bio */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Captured Animal Photo Frame with Pokédex Bezel */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black border-4 border-slate-800 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.imageUrl}
                  alt={entry.commonName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-cyan-400 font-mono text-[11px] border border-cyan-500/30">
                  {entry.dexNumber}
                </div>
                {entry.locationName && (
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/80 text-slate-300 font-mono text-[10px] flex items-center gap-1.5 border border-slate-700 backdrop-blur-xs truncate">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{entry.locationName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Core Classification & Stats */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/50 rounded-full text-xs font-mono font-semibold">
                    {entry.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${getIucnColor(
                      entry.conservationStatus.code
                    )}`}
                  >
                    IUCN: {entry.conservationStatus.code} – {entry.conservationStatus.label}
                  </span>
                </div>

                <h2 className="font-pokedex text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {entry.commonName}
                </h2>
                <p className="text-sm font-mono text-cyan-300 italic">
                  {entry.scientificName}
                </p>
              </div>

              {/* Elemental Traits */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.elementalTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-mono"
                  >
                    #{type}
                  </span>
                ))}
              </div>

              {/* Classic Pokédex Flavor Description */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans relative">
                <span className="font-pokedex text-[10px] uppercase tracking-widest text-emerald-400 block mb-1">
                  {"// OFFICIAL DEX ENTRY LOG:"}
                </span>
                <p>{entry.dexEntryText}</p>
              </div>
            </div>
          </div>

          {/* Dedicated Hands-Free Voice Player Component */}
          <VoiceBriefingPlayer
            speechText={entry.handsFreeSpeechSummary}
            speciesName={entry.commonName}
            dexNumber={entry.dexNumber}
            autoPlay={autoPlayVoice}
          />

          {/* Section: Habitat & Biome Telemetry */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="font-pokedex text-sm uppercase tracking-wider text-emerald-400 font-bold">
                Habitat & Biogeography
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px] uppercase">
                  Primary Biome
                </span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {entry.habitat.biome}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px] uppercase">
                  Geographic Range
                </span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {entry.habitat.geographicRange}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px] uppercase">
                  Micro-Habitat & Shelter
                </span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {entry.habitat.microHabitat}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono block text-[10px] uppercase">
                  Climate Adaptations
                </span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {entry.habitat.climate}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Physical Diagnostics & Diet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Physical Specs */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <h3 className="font-pokedex text-sm uppercase tracking-wider text-cyan-400 font-bold">
                  Physical Diagnostics
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 font-mono">Dimensions / Size:</span>
                  <span className="font-semibold text-slate-200">{entry.physicalStats.size}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 font-mono">Weight Range:</span>
                  <span className="font-semibold text-slate-200">{entry.physicalStats.weight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 font-mono">Lifespan:</span>
                  <span className="font-semibold text-slate-200">{entry.physicalStats.lifespan}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-mono">Speed / Agility:</span>
                  <span className="font-semibold text-cyan-300">{entry.physicalStats.speed}</span>
                </div>
              </div>
            </div>

            {/* Diet & Foraging */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <h3 className="font-pokedex text-sm uppercase tracking-wider text-amber-400 font-bold">
                  Diet & Foraging Strategy
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-amber-300 font-mono font-bold block mb-0.5">
                    {entry.diet.type}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {entry.diet.details}
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 font-mono text-[10px] uppercase block mb-0.5">
                    Behavior Pattern
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {entry.behavior}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Outdoor Encounter & Safety Guide */}
          <div className="rounded-xl bg-amber-950/30 border border-amber-700/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="font-pokedex text-xs uppercase tracking-wider text-amber-300 font-bold">
                Outdoor Encounter & Field Safety Protocol
              </h3>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
              {entry.outdoorEncounterTips}
            </p>
          </div>

          {/* Section: Fascinating Trivia */}
          {entry.funFacts && entry.funFacts.length > 0 && (
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <h3 className="font-pokedex text-sm uppercase tracking-wider text-yellow-400 font-bold">
                  Fauna Telemetry Notes
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {entry.funFacts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono">▸</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 z-20 px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-400">
            Recorded in AniDex Field Log
          </span>
          <button
            onClick={() => {
              soundEffects.playButtonBeep();
              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-pokedex text-xs tracking-wider border border-slate-600 cursor-pointer"
          >
            RETURN TO SCANNER
          </button>
        </div>
      </div>
    </div>
  );
}
