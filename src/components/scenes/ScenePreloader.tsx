"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";

// ─── Assets to preload ────────────────────────────────────────────────────────
// Pre-fetch all winner photos so they're cached before the cinematic scene
const PRELOAD_IMAGES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=85&crop=faces",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=85&crop=faces",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&auto=format&fit=crop&q=85&crop=faces",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // resolve even on error so loading doesn't stall
    img.src = src;
  });
}

export const ScenePreloader: React.FC = () => {
  const { setScene } = useAwardingStore();
  const [progress, setProgress] = useState(0);
  const [loadMsg, setLoadMsg] = useState("Mempersiapkan tampilan…");
  const didStart = useRef(false);

  useEffect(() => {
    if (didStart.current) return;
    didStart.current = true;

    const total = PRELOAD_IMAGES.length;
    let loaded = 0;

    // Step through: 0–10% instantly (DOM ready), 10–90% while images load, 90–100% settle
    setProgress(10);
    setLoadMsg("Memuat aset gambar…");

    const promises = PRELOAD_IMAGES.map((src) =>
      preloadImage(src).then(() => {
        loaded++;
        // Each image loaded = chunk of 0–80% range
        const imgProgress = Math.round(10 + (loaded / total) * 75);
        setProgress(imgProgress);
        if (loaded === total) {
          setLoadMsg("Rendering komponen…");
        }
      })
    );

    Promise.all(promises).then(() => {
      // Small settle delay so browser completes first paint of cinematic scene
      setProgress(92);
      setLoadMsg("Hampir siap…");

      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setScene("cinematic"), 450);
      }, 350);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container bg-[#06070B] px-6 text-center justify-center"
    >
      <div className="max-w-md w-full flex flex-col items-center gap-8 relative z-10">
        {/* Animated Royal Laurel Monogram SVG */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-gold-500 filter drop-shadow-[0_0_15px_rgba(201,169,97,0.4)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeDasharray="280"
              strokeDashoffset={280 - (280 * progress) / 100}
              className="transition-all duration-500"
            />
            <path
              d="M30 65 L40 45 L50 55 L60 45 L70 65 Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="36" r="3" fill="#C9A961" />
            <circle cx="35" cy="40" r="2" fill="#E6C675" />
            <circle cx="65" cy="40" r="2" fill="#E6C675" />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 font-semibold px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5">
            VIP Digital Invitation
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-gold-gradient tracking-wide">
            {EVENT_CONFIG.eventName}
          </h1>
          <p className="text-xs text-gray-400 font-light tracking-wider uppercase">
            {EVENT_CONFIG.organizer}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gold-gradient shadow-[0_0_10px_#C9A961]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gold-400/70 tracking-widest font-mono">
            <span>{loadMsg}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
