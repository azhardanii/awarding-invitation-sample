"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
  Trophy,
  Award,
  Clock,
  ChevronRight,
  Users,
} from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";
import { ThreeGoldScene } from "@/components/ui/ThreeGoldScene";

// 3 Past Laureates (Formal Suits Data)
const PAST_WINNERS = [
  {
    id: 1,
    name: "Prof. Dr. Ir. Raymond Pratama, M.Sc.",
    role: "Pemenang Best Digital Innovator 2025",
    institution: "Lembaga Riset Terpadu Nusantara",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    achievement: "Pelopor sistem AI keamanan infrastruktur nasional",
  },
  {
    id: 2,
    name: "Dr. Sarah Amelia, M.B.A.",
    role: "Pemenang Public Leadership 2025",
    institution: "Badan Transformasi Layanan Publik",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    achievement: "Inovator tata kelola pelayanan publik berbasis digital",
  },
  {
    id: 3,
    name: "Drs. Hendra Wijaya, Ph.D.",
    role: "Pemenang Corporate Transformation 2025",
    institution: "PT Sinergi Industri Indonesia",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
    achievement: "Pemimpin transformasi ekosistem manufaktur modern",
  },
];

// Agenda Highlights 2026
const AGENDA_2026 = [
  { time: "18.30 WIB", title: "Red Carpet & VIP Welcome Reception", desc: "Penyambutan tamu VIP & pendaftaran narasumber" },
  { time: "19.30 WIB", title: "Grand Opening & Keynote Speech", desc: "Pidato kehormatan dari Ketua Dewan Juri" },
  { time: "20.30 WIB", title: "Penganugerahan Trofi Laureate 2026", desc: "Penyerahan piala mahkota untuk 4 kategori utama" },
  { time: "21.30 WIB", title: "Gala Dinner & Executive Networking", desc: "Santap malam eksklusif bersama para pemenang" },
];

export const SceneCover: React.FC = () => {
  const { setScene, startMusic } = useAwardingStore();
  const [activeTab, setActiveTab] = useState<"cover" | "winners" | "agenda">("cover");

  const handleOpenInvitation = () => {
    startMusic();
    setScene("form");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden"
    >
      {/* Three.js 3D Floating Motion Background */}
      <ThreeGoldScene />

      {/* Top Floating Nav Tabs (Full Motion Switcher) */}
      <div className="z-20 w-full max-w-xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-full border border-gold-500/30 bg-black/60 backdrop-blur-xl shadow-gold-glow">
        <button
          onClick={() => setActiveTab("cover")}
          className={`flex-1 py-1.5 sm:py-2 px-3 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === "cover"
              ? "bg-gold-gradient text-black shadow-md"
              : "text-gold-300/70 hover:text-white"
          }`}
        >
          Beranda Acara
        </button>
        <button
          onClick={() => setActiveTab("winners")}
          className={`flex-1 py-1.5 sm:py-2 px-3 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1 ${
            activeTab === "winners"
              ? "bg-gold-gradient text-black shadow-md"
              : "text-gold-300/70 hover:text-white"
          }`}
        >
          <Trophy size={12} />
          <span>Pemenang 2025</span>
        </button>
        <button
          onClick={() => setActiveTab("agenda")}
          className={`flex-1 py-1.5 sm:py-2 px-3 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all ${
            activeTab === "agenda"
              ? "bg-gold-gradient text-black shadow-md"
              : "text-gold-300/70 hover:text-white"
          }`}
        >
          Agenda 2026
        </button>
      </div>

      {/* Dynamic Content Views */}
      <div className="w-full max-w-4xl mx-auto my-auto z-10 py-6 text-center">
        {/* TAB 1: HERO COVER MAIN */}
        {activeTab === "cover" && (
          <motion.div
            key="tab-cover"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 sm:gap-6"
          >
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-black/40 backdrop-blur-xl shadow-gold-glow">
              <Sparkles size={13} className="text-gold-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase text-balance">
                Undangan Resmi Awarding Night
              </span>
            </div>

            {/* Organizer Subtitle */}
            <p className="text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-gold-400/90 font-medium text-balance max-w-2xl">
              {EVENT_CONFIG.organizer}
            </p>

            {/* Massive Serif Event Title (Mobile Breakline Safe) */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.15] text-gold-gradient tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-w-3xl text-balance">
              {EVENT_CONFIG.eventName}
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-gray-300 text-xs sm:text-sm md:text-base font-light leading-relaxed tracking-wide text-balance">
              {EVENT_CONFIG.subTitle}
            </p>

            {/* Date & Location Badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-1 text-xs text-gold-200/90 font-light w-full max-w-lg">
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md w-full sm:w-auto">
                <Calendar size={14} className="text-gold-400 shrink-0" />
                <span className="truncate">{EVENT_CONFIG.date}</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20 backdrop-blur-md w-full sm:w-auto">
                <MapPin size={14} className="text-gold-400 shrink-0" />
                <span className="truncate">{EVENT_CONFIG.venue}</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-4 sm:mt-6">
              <button
                onClick={handleOpenInvitation}
                className="btn-gold-luxury group relative flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm md:text-base tracking-wider uppercase font-semibold cursor-pointer shadow-gold-glow"
              >
                <span>Buka Undangan</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 flex items-center justify-center text-black group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: PAST WINNERS (3 FORMAL SUITS PORTRAITS) */}
        {activeTab === "winners" && (
          <motion.div
            key="tab-winners"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400">
                HALL OF FAME
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-gold-gradient font-light">
                Pemenang Awarding Tahun Sebelumnya (2025)
              </h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto text-balance">
                Penghormatan kepada para inovator & pemimpin terbaik penerima trofi kehormatan.
              </p>
            </div>

            {/* 3 Formal Suit Winner Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {PAST_WINNERS.map((winner) => (
                <div
                  key={winner.id}
                  className="double-bezel-outer p-2 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="double-bezel-inner rounded-[calc(1rem-0.2rem)] p-4 space-y-3 bg-gradient-to-b from-[#121624] to-[#06070B]">
                    {/* Formal Suit Image */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gold-500/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={winner.photo}
                        alt={winner.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="px-2 py-0.5 rounded-md bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[9px] font-semibold tracking-wider uppercase block truncate">
                          {winner.role}
                        </span>
                      </div>
                    </div>

                    {/* Winner Info */}
                    <div>
                      <h3 className="font-semibold text-white text-xs leading-snug line-clamp-1">
                        {winner.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{winner.institution}</p>
                    </div>

                    <p className="text-[10px] text-gold-200/80 italic border-t border-gold-500/15 pt-2 line-clamp-2">
                      &quot;{winner.achievement}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="btn-gold-luxury px-6 py-3 rounded-full text-xs uppercase font-semibold inline-flex items-center gap-2 mt-2"
            >
              <span>Daftar Tahun Ini (2026)</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        {/* TAB 3: AGENDA & INFORMASI KEGIATAN TAHUN INI */}
        {activeTab === "agenda" && (
          <motion.div
            key="tab-agenda"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400">
                AGENDA UTAMA 2026
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-gold-gradient font-light">
                Rangkaian Kegiatan Malam Anugerah 2026
              </h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto text-balance">
                Susunan acara resmi penganugerahan penghargaan berstandar internasional.
              </p>
            </div>

            {/* Timeline List */}
            <div className="max-w-xl mx-auto space-y-3 text-left">
              {AGENDA_2026.map((agenda, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-gold-500/20 bg-black/50 backdrop-blur-md"
                >
                  <div className="px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-mono font-bold shrink-0">
                    {agenda.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white leading-tight">
                      {agenda.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{agenda.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleOpenInvitation}
              className="btn-gold-luxury px-6 py-3 rounded-full text-xs uppercase font-semibold inline-flex items-center gap-2 mt-2"
            >
              <span>Konfirmasi Kehadiran Sekarang</span>
              <ChevronRight size={14} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer Minimalist Notice */}
      <div className="z-10 text-center">
        <p className="text-[10px] text-gray-500 tracking-widest uppercase font-mono">
          VIP Access Only • {EVENT_CONFIG.organizer}
        </p>
      </div>
    </motion.div>
  );
};
