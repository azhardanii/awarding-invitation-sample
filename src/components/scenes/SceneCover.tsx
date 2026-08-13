"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Sparkles } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";

export const SceneCover: React.FC = () => {
  const { setScene, startMusic } = useAwardingStore();

  const handleOpenInvitation = () => {
    // Trigger jazz music on user gesture (browser autoplay policy requires user interaction)
    startMusic();
    setScene("form");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container px-6 text-center justify-between py-12 md:py-16"
    >
      {/* Top Eyebrow Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-black/40 backdrop-blur-xl shadow-gold-glow"
      >
        <Sparkles size={13} className="text-gold-400 animate-pulse" />
        <span className="text-[11px] font-semibold tracking-[0.25em] text-gold-300 uppercase">
          Undangan Resmi Awarding Night
        </span>
      </motion.div>

      {/* Main Cover Content */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-6 my-auto z-10">
        {/* Organizer Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-xs md:text-sm tracking-[0.3em] uppercase text-gold-400/80 font-medium"
        >
          {EVENT_CONFIG.organizer}
        </motion.p>

        {/* Massive Serif Event Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-normal leading-[1.1] text-gold-gradient tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          {EVENT_CONFIG.eventName}
        </motion.h1>

        {/* Secondary Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-xl text-gray-300 text-sm md:text-base font-light leading-relaxed tracking-wide"
        >
          {EVENT_CONFIG.subTitle}
        </motion.p>

        {/* Date & Venue Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 text-xs md:text-sm text-gold-200/90 font-light"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md">
            <Calendar size={15} className="text-gold-400" />
            <span>{EVENT_CONFIG.date} • {EVENT_CONFIG.time}</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md">
            <MapPin size={15} className="text-gold-400" />
            <span>{EVENT_CONFIG.venue}, {EVENT_CONFIG.city}</span>
          </div>
        </motion.div>

        {/* Single Primary High-Impact CTA Button (Nested Button-in-Button Architecture) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-6"
        >
          <button
            onClick={handleOpenInvitation}
            className="btn-gold-luxury group relative flex items-center gap-4 px-8 py-4 rounded-full text-sm md:text-base tracking-wider uppercase font-semibold cursor-pointer"
          >
            <span>Buka Undangan</span>
            {/* Trailing Icon Circle Enclosure */}
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Footer Minimalist Notice */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[10px] text-gray-500 tracking-widest uppercase font-mono z-10"
      >
        VIP Access Only • Non-Transferable Invitation
      </motion.p>
    </motion.div>
  );
};
