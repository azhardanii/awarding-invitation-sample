"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";

export const ScenePreloader: React.FC = () => {
  const { setScene } = useAwardingStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScene("cinematic"), 400);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [setScene]);

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
            {/* Outer Circle Ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeDasharray="280"
              strokeDashoffset={280 - (280 * progress) / 100}
              className="transition-all duration-300"
            />
            {/* Inner Crown / Crest Motif */}
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

        {/* Minimal Gold Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gold-gradient shadow-[0_0_10px_#C9A961]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-gold-400/70 tracking-widest font-mono">
            <span>LOADING ASSETS</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
