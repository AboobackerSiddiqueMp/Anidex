"use client";

import React, { useState, useSyncExternalStore } from "react";
import { IntroScreen } from "@/components/anidex/IntroScreen";
import { AnidexHeader } from "@/components/anidex/AnidexHeader";
import { ScannerView } from "@/components/anidex/ScannerView";
import { AnalyzingView } from "@/components/anidex/AnalyzingView";
import { ScanResultCard } from "@/components/anidex/ScanResultCard";
import { GalleryView } from "@/components/anidex/GalleryView";
import { DexDetailModal } from "@/components/anidex/DexDetailModal";
import { GlobalAudioBar } from "@/components/anidex/GlobalAudioBar";
import { AnimalDexEntry } from "@/types/anidex";
import { soundEffects } from "@/lib/sound-effects";
import { audioPlayer } from "@/lib/audio-player";
import {
  subscribeToEntries,
  getEntriesSnapshot,
  getServerSnapshot,
  saveEntryToStorage,
  deleteEntryFromStorage,
  toggleFavoriteInStorage,
} from "@/lib/storage";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<"scanner" | "gallery">("scanner");
  const [scannerSubState, setScannerSubState] = useState<"viewfinder" | "analyzing" | "result">("viewfinder");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultEntry, setResultEntry] = useState<AnimalDexEntry | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastAnalyzedPayload, setLastAnalyzedPayload] = useState<{ base64: string; mimeType: string } | null>(null);

  const entries = useSyncExternalStore(subscribeToEntries, getEntriesSnapshot, getServerSnapshot);
  const [selectedEntry, setSelectedEntry] = useState<AnimalDexEntry | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isNewlyDiscovered, setIsNewlyDiscovered] = useState(false);

  // Process and analyze image with multi-model fallback on backend
  const handleProcessImage = async (base64Data: string, mimeType: string = "image/jpeg") => {
    setLastAnalyzedPayload({ base64: base64Data, mimeType });
    setCapturedImage(base64Data);
    setScannerSubState("analyzing");
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/analyze-animal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType,
        }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Unable to analyze image. Image has been automatically compressed and optimized. Please tap 'Retry'!");
        }
        const errorData = await res.json().catch(() => ({}));
        let rawMsg = errorData.message || `Server responded with ${res.status}`;
        try {
          const parsed = JSON.parse(rawMsg);
          if (parsed?.error?.message) rawMsg = parsed.error.message;
          else if (parsed?.message) rawMsg = parsed.message;
        } catch {}
        if (rawMsg.includes("503") || rawMsg.includes("high demand") || rawMsg.includes("UNAVAILABLE")) {
          rawMsg = "The AI vision model is temporarily experiencing high global traffic. Please tap 'Retry' to reconnect.";
        }
        throw new Error(rawMsg);
      }

      const data = await res.json();

      if (data.isAnimal === false) {
        soundEffects.playErrorBuzzer();
        setErrorMessage(
          data.message || "No animal detected in frame. Align the fauna in the crosshairs and capture again!"
        );
        setScannerSubState("viewfinder");
        return;
      }

      const result: AnimalDexEntry = data.entry || data;
      if (!result || !result.commonName) {
        throw new Error(data.message || "Unable to identify specimen details.");
      }

      // Successfully identified fauna!
      soundEffects.playPokedexChime();
      saveEntryToStorage(result);
      setResultEntry(result);
      setScannerSubState("result");

      // Auto-narrate animal details so user hears the spoken naturalist field briefing
      if (result.handsFreeSpeechSummary) {
        audioPlayer.speakText(result.handsFreeSpeechSummary);
      }
    } catch (err: any) {
      console.warn("Scanner analysis notice:", err?.message || err);
      soundEffects.playErrorBuzzer();
      let displayMsg = err?.message || "Failed to analyze image. Please try again.";
      try {
        const parsed = JSON.parse(displayMsg);
        if (parsed?.error?.message) displayMsg = parsed.error.message;
      } catch {}
      if (displayMsg.includes("503") || displayMsg.includes("high demand") || displayMsg.includes("UNAVAILABLE")) {
        displayMsg = "The AI vision model is experiencing temporary peak demand. Tap 'Retry' to rescan!";
      }
      setErrorMessage(displayMsg);
      setScannerSubState("viewfinder");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetryLastScan = () => {
    if (lastAnalyzedPayload) {
      handleProcessImage(lastAnalyzedPayload.base64, lastAnalyzedPayload.mimeType);
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntryFromStorage(id);
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
    if (resultEntry?.id === id) {
      setResultEntry(null);
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteInStorage(id);
    if (selectedEntry?.id === id) {
      setSelectedEntry((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
    if (resultEntry?.id === id) {
      setResultEntry((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  // Stop audio playback if navigating between tabs or if user leaves/minimizes browser
  React.useEffect(() => {
    audioPlayer.stop();
  }, [activeTab]);

  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        audioPlayer.stop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      audioPlayer.stop();
    };
  }, []);

  const handleReturnToViewfinder = () => {
    audioPlayer.stop();
    setScannerSubState("viewfinder");
    setResultEntry(null);
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Intro Screen - Only mounts scanner after user taps Enter to guarantee camera permissions on mobile */}
      {showIntro ? (
        <IntroScreen
          onEnter={() => {
            audioPlayer.stop();
            setShowIntro(false);
          }}
        />
      ) : (
        /* Main Application Shell */
        <div className="flex-1 flex flex-col">
          {/* Header Bar */}
          <AnidexHeader
            activeTab={activeTab}
            onTabChange={(tab) => {
              audioPlayer.stop();
              setActiveTab(tab);
              if (tab === "scanner" && scannerSubState === "result") {
                setScannerSubState("viewfinder");
              }
            }}
            galleryCount={entries.length}
            onOpenIntro={() => {
              audioPlayer.stop();
              setShowIntro(true);
            }}
            isScanning={isScanning}
          />

          {/* Dynamic View Body */}
          <main className="flex-1">
            {activeTab === "scanner" ? (
              <>
                {/* 1. Inside Scanner Viewfinder (video 00:00 - 00:01) */}
                {scannerSubState === "viewfinder" && (
                  <ScannerView
                    onCaptureImage={handleProcessImage}
                    isScanning={isScanning}
                    errorMessage={errorMessage}
                    onClearError={() => setErrorMessage(null)}
                    onRetryLastScan={handleRetryLastScan}
                    hasRetryPayload={!!lastAnalyzedPayload}
                  />
                )}

                {/* 2. Analyzing Screen (video 00:02 - 00:04) */}
                {scannerSubState === "analyzing" && capturedImage && (
                  <AnalyzingView previewImage={capturedImage} />
                )}

                {/* 3. Animal Result Card Screen (video 00:05 - 00:07) */}
                {scannerSubState === "result" && resultEntry && (
                  <ScanResultCard
                    entry={resultEntry}
                    onViewDetails={() => {
                      audioPlayer.stop();
                      setIsNewlyDiscovered(false);
                      setSelectedEntry(resultEntry);
                    }}
                    onTakeAnotherSnap={handleReturnToViewfinder}
                  />
                )}
              </>
            ) : (
              /* Collection Gallery Screen (video 00:08 - 00:11) */
              <GalleryView
                entries={entries}
                onSelectEntry={(entry) => {
                  audioPlayer.stop();
                  setIsNewlyDiscovered(false);
                  setSelectedEntry(entry);
                }}
                onDeleteEntry={handleDeleteEntry}
                onToggleFavorite={handleToggleFavorite}
                onGoToScanner={() => {
                  audioPlayer.stop();
                  setActiveTab("scanner");
                  setScannerSubState("viewfinder");
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Animal Detail & Hands-Free Audio Telemetry Modal */}
      {selectedEntry && (
        <DexDetailModal
          entry={selectedEntry}
          onClose={() => {
            audioPlayer.stop();
            setSelectedEntry(null);
            setIsNewlyDiscovered(false);
          }}
          onToggleFavorite={handleToggleFavorite}
          autoPlayVoice={isNewlyDiscovered}
        />
      )}

      {/* Persistent Audio Controls Bar - shows when voice is synthesizing or playing */}
      <GlobalAudioBar />
    </div>
  );
}
