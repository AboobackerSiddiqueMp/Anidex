"use client";

import React from "react";

interface NatureBackgroundProps {
  variant?: "blue" | "peach" | "light";
  showMascots?: boolean;
  mascotType?: "deer" | "bunny" | "all";
  children?: React.ReactNode;
}

export function NatureBackground({
  variant = "blue",
  showMascots = true,
  mascotType = "deer",
  children,
}: NatureBackgroundProps) {
  const bgClass =
    variant === "blue"
      ? "bg-nature-blue text-white"
      : variant === "peach"
      ? "bg-nature-peach text-white"
      : "bg-[#f8faf6] text-slate-800";

  const iconColor =
    variant === "blue"
      ? "text-blue-200/20"
      : variant === "peach"
      ? "text-amber-200/20"
      : "text-emerald-900/10";

  return (
    <div className={`relative min-h-screen w-full overflow-hidden flex flex-col ${bgClass}`}>
      {/* SVG Nature Icon Repeating Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 select-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="nature-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Leaf */}
              <path
                d="M15 15 C 25 10, 30 25, 25 30 C 20 35, 10 25, 15 15 Z M 15 15 L 25 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className={iconColor}
              />
              {/* Cloud */}
              <path
                d="M50 20 a 5 5 0 0 1 8 0 a 6 6 0 0 1 6 6 a 4 4 0 0 1 -4 4 l -12 0 a 5 5 0 0 1 2 -10 z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={iconColor}
              />
              {/* Paw Print */}
              <circle cx="20" cy="62" r="3.5" fill="currentColor" className={iconColor} />
              <circle cx="14" cy="55" r="1.5" fill="currentColor" className={iconColor} />
              <circle cx="20" cy="53" r="1.5" fill="currentColor" className={iconColor} />
              <circle cx="26" cy="55" r="1.5" fill="currentColor" className={iconColor} />
              {/* Mountain */}
              <path
                d="M55 65 L 63 50 L 71 65 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className={iconColor}
              />
              {/* Sun / Star */}
              <circle cx="70" cy="15" r="2.5" fill="currentColor" className={iconColor} />
              {/* Water drop */}
              <path
                d="M38 42 C 34 46, 42 46, 38 42 Z"
                fill="currentColor"
                className={iconColor}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nature-pattern)" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>

      {/* Rolling Green Hills at bottom with Mascot (as seen in video) */}
      {showMascots && (
        <div className="relative z-20 pointer-events-none mt-auto">
          {/* Cute Illustrated Mascot Animal peeking out */}
          <div className="relative max-w-md mx-auto h-0">
            {mascotType === "deer" || mascotType === "all" ? (
              <div className="absolute -top-24 right-4 sm:right-10 w-24 h-24 sm:w-28 sm:h-28 animate-bounce-gentle">
                {/* SVG Cute Deer Fawn / Animal Buddy */}
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                  {/* Antlers / Ears */}
                  <ellipse cx="40" cy="35" rx="8" ry="16" fill="#ca8a04" transform="rotate(-30 40 35)" />
                  <ellipse cx="80" cy="35" rx="8" ry="16" fill="#ca8a04" transform="rotate(30 80 35)" />
                  <ellipse cx="40" cy="35" rx="4" ry="10" fill="#fef08a" transform="rotate(-30 40 35)" />
                  <ellipse cx="80" cy="35" rx="4" ry="10" fill="#fef08a" transform="rotate(30 80 35)" />
                  {/* Head */}
                  <ellipse cx="60" cy="55" rx="32" ry="28" fill="#eab308" />
                  <ellipse cx="60" cy="58" rx="28" ry="24" fill="#facc15" />
                  {/* White face patches */}
                  <ellipse cx="45" cy="58" rx="10" ry="12" fill="#fffbeb" />
                  <ellipse cx="75" cy="58" rx="10" ry="12" fill="#fffbeb" />
                  {/* Big cute anime eyes */}
                  <circle cx="48" cy="56" r="6" fill="#1e293b" />
                  <circle cx="72" cy="56" r="6" fill="#1e293b" />
                  <circle cx="50" cy="54" r="2" fill="#ffffff" />
                  <circle cx="74" cy="54" r="2" fill="#ffffff" />
                  {/* Cute black button nose */}
                  <ellipse cx="60" cy="67" rx="4" ry="3" fill="#1e293b" />
                  {/* Smile */}
                  <path d="M 56 71 Q 60 74 64 71" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Cheeks */}
                  <ellipse cx="40" cy="64" rx="4" ry="2.5" fill="#f87171" opacity="0.6" />
                  <ellipse cx="80" cy="64" rx="4" ry="2.5" fill="#f87171" opacity="0.6" />
                  {/* White spots */}
                  <circle cx="52" cy="38" r="2" fill="#ffffff" />
                  <circle cx="68" cy="38" r="2" fill="#ffffff" />
                  <circle cx="60" cy="33" r="2" fill="#ffffff" />
                </svg>
              </div>
            ) : null}

            {mascotType === "bunny" || mascotType === "all" ? (
              <div className="absolute -top-22 left-4 sm:left-10 w-20 h-20 sm:w-24 sm:h-24">
                {/* SVG Cute Bunny Buddy */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Long Bunny Ears */}
                  <ellipse cx="38" cy="22" rx="7" ry="20" fill="#e2e8f0" transform="rotate(-10 38 22)" />
                  <ellipse cx="62" cy="22" rx="7" ry="20" fill="#e2e8f0" transform="rotate(10 62 22)" />
                  <ellipse cx="38" cy="22" rx="4" ry="14" fill="#f472b6" transform="rotate(-10 38 22)" />
                  <ellipse cx="62" cy="22" rx="4" ry="14" fill="#f472b6" transform="rotate(10 62 22)" />
                  {/* Head */}
                  <circle cx="50" cy="52" r="26" fill="#f1f5f9" />
                  {/* Eyes */}
                  <circle cx="40" cy="50" r="4.5" fill="#1e293b" />
                  <circle cx="60" cy="50" r="4.5" fill="#1e293b" />
                  <circle cx="41.5" cy="48.5" r="1.5" fill="#ffffff" />
                  <circle cx="61.5" cy="48.5" r="1.5" fill="#ffffff" />
                  {/* Nose */}
                  <polygon points="50,56 47,53 53,53" fill="#f472b6" />
                  {/* Mouth */}
                  <path d="M 46 59 Q 50 62 54 59" stroke="#1e293b" strokeWidth="1.5" fill="none" />
                  {/* Blush */}
                  <circle cx="34" cy="56" r="3.5" fill="#fbcfe8" />
                  <circle cx="66" cy="56" r="3.5" fill="#fbcfe8" />
                </svg>
              </div>
            ) : null}
          </div>

          {/* Layered Wavy Rolling Hills (from video) */}
          <svg
            className="w-full h-16 sm:h-24 block"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {/* Back Hill */}
            <path
              d="M0,50 C180,90 350,15 600,45 C850,75 1020,20 1200,60 L1200,120 L0,120 Z"
              fill="#4ade80"
              opacity="0.85"
            />
            {/* Front Hill */}
            <path
              d="M0,80 C240,30 480,95 720,60 C960,25 1100,75 1200,50 L1200,120 L0,120 Z"
              fill="#22c55e"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
