"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  SwitchCamera,
  Zap,
  ZapOff,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";

interface ScannerViewProps {
  onCaptureImage: (base64: string, mimeType: string) => void;
  isScanning: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  onRetryLastScan: () => void;
  hasRetryPayload: boolean;
}

export function ScannerView({
  onCaptureImage,
  isScanning,
  errorMessage,
  onClearError,
  onRetryLastScan,
  hasRetryPayload,
}: ScannerViewProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [targetLocked, setTargetLocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let isCancelled = false;

    async function initCamera() {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser environment.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setCameraError(null);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn("Camera feed notice:", err?.message);
          setCameraError(
            "Live camera feed unavailable. You can upload an animal photo using the gallery button below!"
          );
          setCameraActive(false);
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Periodic simulated target lock effect for aesthetic realism (turns brackets lime green like video)
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetLocked((prev) => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const toggleCameraFacing = () => {
    soundEffects.playButtonBeep();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const toggleTorch = async () => {
    soundEffects.playButtonBeep();
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities?.() as any;
        if (capabilities?.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: !torchOn }],
          });
          setTorchOn(!torchOn);
        } else {
          setTorchOn(!torchOn);
        }
      } catch {}
    }
  };

  // Capture snapshot from live camera
  const captureSnapshot = () => {
    soundEffects.playScanBeep();

    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        onCaptureImage(dataUrl, "image/jpeg");
        return;
      }
    }

    // If live camera is not running (e.g. desktop without webcam), trigger file upload
    fileInputRef.current?.click();
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playButtonBeep();
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onCaptureImage(dataUrl, file.type || "image/jpeg");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full h-[calc(100vh-68px)] max-h-[920px] bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Feed or Atmospheric Nature Backdrop */}
      <div className="absolute inset-0 z-0">
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-black flex items-center justify-center">
            {/* Atmospheric nature photo background when camera is initializing or denied */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=1280&q=80"
              alt="Fauna Finder Viewfinder"
              className="w-full h-full object-cover opacity-60"
            />
            {cameraError && (
              <div className="absolute inset-x-4 top-20 max-w-sm mx-auto p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-center text-white space-y-2 z-30">
                <p className="text-xs text-slate-300">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Upload Wildlife Photo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top HUD Controls (Torch, Flip Camera) */}
      <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={toggleTorch}
          className={`p-3 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            torchOn
              ? "bg-amber-400 text-slate-900"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
          title="Toggle Torch / Flashlight"
        >
          {torchOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleCameraFacing}
          className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
          title="Switch Camera (Front/Rear)"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>
      </div>

      {/* Center Targeting Reticle (Exact replica from video frames 00:00 - 00:01) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none px-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Outer Corner Brackets: White -> Lime-Green on detection */}
          <div
            className={`absolute inset-0 transition-colors duration-500 ${
              targetLocked ? "text-lime-400" : "text-white/90"
            }`}
          >
            {/* Top-Left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-current rounded-tl-sm" />
            {/* Top-Right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-current rounded-tr-sm" />
            {/* Bottom-Left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-current rounded-bl-sm" />
            {/* Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-current rounded-br-sm" />
          </div>

          {/* Concentric Circular HUD Radar with Ticks (video 00:00-00:01) */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center opacity-70">
            {/* Outer dotted circle */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/60" />
            {/* Middle thin circle */}
            <div className="absolute inset-3 rounded-full border border-white/40" />
            {/* Small inner circle with crosshairs */}
            <div className="w-6 h-6 rounded-full border border-white/80 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-white/80" />
              <div className="h-3 w-0.5 bg-white/80 absolute" />
            </div>
          </div>

          {/* Sweeping Horizontal Laser Line (video 00:00-00:01) */}
          <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#ffffff] laser-beam" />
        </div>

        {/* ANIMAL FOUND text banner below reticle (video 00:01) */}
        <div
          className={`mt-6 text-center transition-all duration-300 ${
            targetLocked ? "opacity-100 scale-100" : "opacity-75 scale-95"
          }`}
        >
          <span className="font-pokedex text-xs sm:text-sm font-bold tracking-[0.25em] text-lime-300 drop-shadow-[0_0_10px_rgba(163,230,53,0.8)]">
            ANIMAL FOUND
          </span>
        </div>
      </div>

      {/* Error alert notice if previous analysis had issues */}
      {errorMessage && (
        <div className="relative z-30 mx-4 mb-3 p-3.5 rounded-2xl bg-red-950/90 border border-red-500/60 backdrop-blur-md text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="line-clamp-2 leading-relaxed">{errorMessage}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasRetryPayload && (
              <button
                onClick={onRetryLastScan}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
                <span>Retry</span>
              </button>
            )}
            <button
              onClick={onClearError}
              className="text-[11px] text-slate-400 hover:text-white px-1.5 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Bottom Shutter Controls Bar (Video 00:00 - 00:01) */}
      <div className="relative z-20 pb-8 pt-4 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
        {/* Photo Upload / Gallery trigger icon */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Upload Animal Photo from Gallery"
        >
          <ImageIcon className="w-6 h-6 text-white" />
        </button>

        {/* Video Signature Shutter Button (Purple dashed outer ring + purple circle + white inner) */}
        <button
          id="video-shutter-button"
          onClick={captureSnapshot}
          disabled={isScanning}
          className="relative group p-1.5 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Snap Photo"
        >
          {/* Dashed outer ring */}
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-purple-400/80 flex items-center justify-center animate-spin-slow">
            {/* Middle lavender / purple solid circle */}
            <div className="w-16 h-16 rounded-full bg-purple-500 group-hover:bg-purple-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-colors">
              {/* Inner white circle with purple pill / center */}
              <div className="w-10 h-10 rounded-full border-2 border-white/90 bg-purple-400/30 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </button>

        {/* Quick Upload Alternate */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Upload image"
        >
          <Upload className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
