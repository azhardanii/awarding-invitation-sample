"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";
import { ThreeGoldScene } from "@/components/ui/ThreeGoldScene";

export const SceneCover: React.FC = () => {
  const { setScene } = useAwardingStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center"
    >
      {/* Three.js 3D Background */}
      <ThreeGoldScene />

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-5 sm:gap-7 max-w-3xl w-full">
        {/* Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-black/50 backdrop-blur-xl shadow-gold-glow"
        >
          <Sparkles size={12} className="text-gold-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase">
            Undangan Resmi Awarding Night 2026
          </span>
        </motion.div>

        {/* Organizer */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gold-400/80 font-medium"
        >
          {EVENT_CONFIG.organizer}
        </motion.p>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-normal leading-[1.1] text-gold-gradient tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] text-balance"
        >
          {EVENT_CONFIG.eventName}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="max-w-md text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed text-balance"
        >
          {EVENT_CONFIG.subTitle}
        </motion.p>

        {/* Date & Venue Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full max-w-lg"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md text-xs text-gold-200/90 w-full sm:w-auto justify-center">
            <Calendar size={13} className="text-gold-400 shrink-0" />
            <span>{EVENT_CONFIG.date}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md text-xs text-gold-200/90 w-full sm:w-auto justify-center">
            <MapPin size={13} className="text-gold-400 shrink-0" />
            <span>{EVENT_CONFIG.venue}</span>
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2"
        >
          <button
            onClick={() => setScene("form")}
            className="btn-gold-luxury group flex items-center gap-3 sm:gap-4 px-7 sm:px-9 py-4 sm:py-5 rounded-full text-xs sm:text-sm tracking-wider uppercase font-semibold cursor-pointer shadow-gold-glow"
          >
            <span>Isi Formulir Kehadiran</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 flex items-center justify-center text-black group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Bottom notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-6 text-[10px] text-gray-500 tracking-widest uppercase font-mono z-10"
      >
        VIP Access Only · Non-Transferable Invitation
      </motion.p>
    </motion.div>
  );
};
