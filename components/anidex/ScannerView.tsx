"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  SwitchCamera,
  Zap,
  ZapOff,
  AlertCircle,
  RefreshCw,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { soundEffects } from "@/lib/sound-effects";
import { compressImageFile } from "@/lib/image-compressor";

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
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [targetLocked, setTargetLocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream with multi-tiered fallback for mobile and desktop
  const startCamera = async (targetFacing: "environment" | "user") => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera API is not supported in this browser environment.");
      return;
    }

    setIsRequestingCamera(true);

    // Stop any existing tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Constraints ordered specifically for mobile back/front camera compatibility:
    // Avoid hardcoding landscape 1280x720 first, which causes mobile portrait sensors to hang or display black frames!
    const constraintOptions: MediaStreamConstraints[] = [
      // 1. Mobile natural ideal facing mode (instant on iOS Safari & Android Chrome)
      {
        video: {
          facingMode: { ideal: targetFacing },
        },
        audio: false,
      },
      // 2. Strict mobile facing mode
      {
        video: {
          facingMode: targetFacing,
        },
        audio: false,
      },
      // 3. Fallback with ideal resolution preferences
      {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      },
      // 4. Generic video device fallback (for laptops/desktops without rear cameras)
      {
        video: true,
        audio: false,
      },
    ];

    let acquiredStream: MediaStream | null = null;
    let lastErr: any = null;

    for (const constraints of constraintOptions) {
      try {
        acquiredStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (acquiredStream) break;
      } catch (err: any) {
        lastErr = err;
      }
    }

    setIsRequestingCamera(false);

    if (acquiredStream) {
      streamRef.current = acquiredStream;

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = acquiredStream;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.muted = true;
        try {
          await video.play();
        } catch (playErr) {
          console.warn("video.play() notice:", playErr);
        }
      }

      // Do NOT set cameraActive to true here prematurely.
      // Wait for onPlaying or onLoadedData so the video is actually rendering real frames,
      // completely eliminating any brief black screen!
      setCameraError(null);
    } else {
      console.warn("Camera stream could not be started:", lastErr?.message || lastErr);
      setCameraActive(false);
      setCameraError(
        "Could not access live camera. Tap the button below to grant permission or upload a photo!"
      );
    }
  };

  // Auto-start camera on component mount or when facing mode changes
  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [facingMode]);

  // Keep video.srcObject attached if videoRef becomes ready
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [cameraActive]);

  // Periodic simulated target lock effect for aesthetic realism (turns brackets lime green like video)
  useEffect(() => {
    const interval = setInterval(() => {
      setTargetLocked((prev) => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const toggleCameraFacing = () => {
    soundEffects.playButtonBeep();
    setCameraActive(false);
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

  // Handle uploaded file with client-side compression to prevent 403 payload limit errors
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playButtonBeep();
    try {
      // Compress and optimize image to max 1280px (prevents 403/413 HTTP payload rejection)
      const { base64, mimeType } = await compressImageFile(file, 1280, 0.85);
      onCaptureImage(base64, mimeType);
    } catch (err: any) {
      console.warn("Image upload preprocessing notice:", err);
      // Fallback to basic file reader if canvas fails
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          onCaptureImage(dataUrl, file.type || "image/jpeg");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      // Clear file input so the user can re-upload the same photo if desired
      if (e.target) {
        e.target.value = "";
      }
    }
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

      {/* Camera Feed with Atmospheric Nature Backdrop Underneath (completely avoids black screen) */}
      <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
        {/* Layer 1: Atmospheric Nature Viewfinder Backdrop (Always present in background) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=1280&q=80"
            alt="Fauna Finder Viewfinder"
            className="w-full h-full object-cover opacity-60"
          />
        </div>

        {/* Layer 2: Live Camera Video Stream (Smoothly fades in once real frames are decoded) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlaying={() => {
            setCameraActive(true);
            setCameraError(null);
          }}
          onLoadedData={() => {
            setCameraActive(true);
            setCameraError(null);
          }}
          className={`w-full h-full object-cover transition-opacity duration-500 relative z-10 ${
            cameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Layer 3: Connection & Permission Overlay (Visible only while camera is activating or denied) */}
        {!cameraActive && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="max-w-xs sm:max-w-sm w-full p-5 rounded-3xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-center text-white space-y-3.5 shadow-2xl">
              {isRequestingCamera ? (
                <div className="flex flex-col items-center gap-2.5 py-2">
                  <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                    ACTIVATING FAUNA CAMERA...
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Connecting to {facingMode === "environment" ? "rear" : "front"} optical lens
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Camera Access</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {cameraError || "Tap below to enable your mobile camera for real-time fauna scanning."}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => startCamera(facingMode)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Tap to Enable Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-400" /> Or Choose Photo from Gallery
                    </button>
                  </div>
                </div>
              )}
            </div>
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
