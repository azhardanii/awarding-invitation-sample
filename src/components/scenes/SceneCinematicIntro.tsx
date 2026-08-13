"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useAwardingStore } from "@/store/useAwardingStore";
import { ThreeGoldScene } from "@/components/ui/ThreeGoldScene";
import { ArrowUpRight, ChevronRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAST_WINNERS = [
  {
    id: 1,
    name: "Prof. Dr. Ir. Raymond Pratama",
    suffix: "M.Sc.",
    award: "Best Digital Innovator",
    year: "2025",
    institution: "Lembaga Riset Terpadu Nusantara",
    quote: "Pelopor sistem AI keamanan infrastruktur nasional yang mengubah paradigma pertahanan siber.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=90&crop=faces",
    accent: "#C9A961",
  },
  {
    id: 2,
    name: "Dr. Sarah Amelia",
    suffix: "M.B.A.",
    award: "Outstanding Public Leadership",
    year: "2025",
    institution: "Badan Transformasi Layanan Publik",
    quote: "Pelopor tata kelola pelayanan publik berbasis digital yang menyentuh 50 juta warga.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=90&crop=faces",
    accent: "#E8D5A0",
  },
  {
    id: 3,
    name: "Drs. Hendra Wijaya",
    suffix: "Ph.D.",
    award: "National Corporate Transformation",
    year: "2025",
    institution: "PT Sinergi Industri Indonesia",
    quote: "Visioner di balik transformasi ekosistem manufaktur modern yang menciptakan 12.000 lapangan kerja baru.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=90&crop=faces",
    accent: "#D4B46E",
  },
];

const EVENT_2026 = {
  name: "Malam Anugerah Inovasi Nusantara 2026",
  organizer: "Dewan Kehormatan Inovasi & Teknologi Indonesia",
  date: "Rabu, 28 Oktober 2026",
  time: "18.30 – 22.00 WIB",
  venue: "Grand Ballroom Hotel Indonesia Kempinski, Jakarta",
  highlights: [
    { label: "4", desc: "Kategori Penghargaan Utama" },
    { label: "200+", desc: "Tamu VIP Undangan" },
    { label: "Live", desc: "Grand Keynote & Gala Dinner" },
    { label: "2026", desc: "Edisi Ketiga Penganugerahan" },
  ],
};

// ─── Phase durations (ms) ────────────────────────────────────────────────────
const PHASES = [
  { id: 0, duration: 2200 },  // Cinematic brand opener
  { id: 1, duration: 600 },   // Transition text "Setahun yang lalu..."
  { id: 2, duration: 3800 },  // Winner 1
  { id: 3, duration: 3800 },  // Winner 2
  { id: 4, duration: 3800 },  // Winner 3
  { id: 5, duration: 600 },   // All 3 brief montage
  { id: 6, duration: 3800 },  // "Dan kini, 2026..." event reveal
  { id: 7, duration: Infinity }, // CTA — stays until user clicks
];

// ─── 3D Winner Card ───────────────────────────────────────────────────────────
const WinnerCard3D: React.FC<{
  winner: typeof PAST_WINNERS[0];
  isActive: boolean;
  delay?: number;
}> = ({ winner, isActive, delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1.0, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.04);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1.0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
      animate={isActive ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.3, y: 20, filter: "blur(4px)" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        className="relative cursor-pointer select-none"
      >
        {/* Deep Shadow Layer (3D depth simulation) */}
        <div
          className="absolute inset-0 rounded-[1.6rem] sm:rounded-[2rem]"
          style={{
            transform: "translateZ(-20px) translateY(16px) scale(0.92)",
            background: "rgba(0,0,0,0.5)",
            filter: "blur(24px)",
          }}
        />

        {/* Main Card */}
        <div className="relative rounded-[1.4rem] sm:rounded-[1.8rem] overflow-hidden border border-white/10"
          style={{ boxShadow: `0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px ${winner.accent}40, inset 0 1px 0 ${winner.accent}30` }}>

          {/* Photo */}
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={winner.photo}
              alt={winner.name}
              className="w-full h-full object-cover object-top"
              style={{ transform: "scale(1.05)" }}
            />
            {/* Multi-layer cinematic gradient overlay */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to top, #06070B 0%, rgba(6,7,11,0.7) 45%, rgba(6,7,11,0.1) 100%)`
            }} />
            <div className="absolute inset-0" style={{
              background: `radial-gradient(ellipse at 50% 0%, ${winner.accent}15, transparent 65%)`
            }} />

            {/* Award Badge — floats in 3D above photo */}
            <div
              className="absolute top-3 sm:top-4 left-3 sm:left-4"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase"
                style={{ background: `${winner.accent}25`, border: `1px solid ${winner.accent}70`, color: winner.accent }}>
                🏆 {winner.award}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="p-4 sm:p-5 space-y-2 sm:space-y-3"
            style={{ background: "linear-gradient(to bottom, rgba(10,12,20,0.98), rgba(6,7,11,1))" }}>
            <div>
              <div className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase mb-1"
                style={{ color: `${winner.accent}90` }}>
                Pemenang Tahun {winner.year}
              </div>
              <h3 className="font-serif text-base sm:text-lg md:text-xl text-white leading-snug">
                {winner.name}
              </h3>
              <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: `${winner.accent}CC` }}>
                {winner.suffix} · {winner.institution}
              </p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-300/80 italic leading-relaxed border-t border-white/10 pt-2 sm:pt-3 line-clamp-2">
              &quot;{winner.quote}&quot;
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Mini Card (for montage phase) ───────────────────────────────────────────
const WinnerMiniCard: React.FC<{ winner: typeof PAST_WINNERS[0]; delay: number }> = ({ winner, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className="relative rounded-2xl overflow-hidden border border-white/10 flex-1 min-w-0"
    style={{ perspective: "600px", boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px ${winner.accent}30` }}
  >
    <div className="relative h-32 sm:h-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={winner.photo} alt={winner.name} className="w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <p className="font-serif text-xs sm:text-sm text-white leading-tight truncate">{winner.name}</p>
        <p className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: winner.accent }}>
          {winner.award}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export const SceneCinematicIntro: React.FC = () => {
  const { setScene, startMusic } = useAwardingStore();
  const [phase, setPhase] = useState(0);
  const [winnerIdx, setWinnerIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Advance phase automatically
  const advancePhase = (current: number) => {
    const p = PHASES[current];
    if (!p || p.duration === Infinity) return;

    timerRef.current = setTimeout(() => {
      const next = current + 1;
      if (next < PHASES.length) {
        setPhase(next);
        // Track which winner to highlight
        if (next === 2) setWinnerIdx(0);
        if (next === 3) setWinnerIdx(1);
        if (next === 4) setWinnerIdx(2);
        advancePhase(next);
      }
    }, p.duration);
  };

  useEffect(() => {
    advancePhase(0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipToEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase(7);
  };

  const handleOpenInvitation = () => {
    startMusic();
    setScene("cover");
  };

  const restartIntro = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase(0);
    setWinnerIdx(0);
    // tiny delay to let state flush before re-starting timers
    setTimeout(() => advancePhase(0), 60);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* Three.js 3D Gold Ambient Background */}
      <ThreeGoldScene />

      {/* Cinematic dark vignette overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />

      {/* ─── PHASE 0: Cinematic Brand Opener ──────────────────────────────── */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            key="phase0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Decorative top line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gold-gradient mb-6 sm:mb-8"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-gold-400 mb-3"
            >
              Dewan Kehormatan Inovasi & Teknologi Indonesia
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl text-gold-gradient font-light tracking-tight leading-none text-balance"
            >
              Malam Anugerah
              <br />
              <span className="italic">Inovasi Nusantara</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gold-gradient mt-6 sm:mt-8"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASES 1 (Transition "Setahun yang lalu...") ──────────────────── */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 font-light italic"
            >
              Setahun yang lalu…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASES 2-4: Individual Winner Spotlight ────────────────────────── */}
      <AnimatePresence mode="wait">
        {(phase === 2 || phase === 3 || phase === 4) && (
          <motion.div
            key={`phase-winner-${phase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-8"
          >
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center gap-3 sm:gap-4">
              <WinnerCard3D winner={PAST_WINNERS[winnerIdx]} isActive={true} />
              {/* "X of 3" progress indicator */}
              <div className="flex gap-1.5">
                {PAST_WINNERS.map((_, i) => (
                  <div key={i}
                    className={`h-0.5 transition-all duration-500 rounded-full ${i === winnerIdx ? "w-6 bg-gold-400" : "w-2 bg-white/20"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE 5: All 3 Together (Montage) ──────────────────────────────── */}
      <AnimatePresence>
        {phase === 5 && (
          <motion.div
            key="phase5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-3 sm:px-6 gap-3"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-gold-400"
            >
              Para Pemenang Awarding 2025
            </motion.p>
            <div className="flex gap-2 sm:gap-3 w-full max-w-lg">
              {PAST_WINNERS.map((w, i) => (
                <WinnerMiniCard key={w.id} winner={w} delay={i * 0.12} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE 6: "Dan kini, 2026" Event Reveal ─────────────────────────── */}
      <AnimatePresence>
        {phase === 6 && (
          <motion.div
            key="phase6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-4 sm:gap-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7 }}
              className="font-serif text-xl sm:text-2xl md:text-3xl text-white/80 italic"
            >
              Dan kini, giliran 2026…
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-[1.8rem] border border-gold-500/30 backdrop-blur-xl"
              style={{ background: "rgba(10,13,22,0.88)", boxShadow: "0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,97,0.2)" }}
            >
              <div className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-gold-400 mb-2">
                Edisi Ketiga · 2026
              </div>
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-gradient font-normal leading-snug text-balance">
                {EVENT_2026.name}
              </h2>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gold-500/20 space-y-1.5">
                <p className="text-xs sm:text-sm text-gray-200">{EVENT_2026.date}</p>
                <p className="text-xs text-gray-400">{EVENT_2026.time}</p>
                <p className="text-[11px] sm:text-xs text-gold-300/80">{EVENT_2026.venue}</p>
              </div>
              {/* Stats Row */}
              <div className="mt-3 sm:mt-4 grid grid-cols-4 gap-2 pt-3 sm:pt-4 border-t border-white/5">
                {EVENT_2026.highlights.map((h, i) => (
                  <div key={i} className="text-center">
                    <div className="font-serif text-base sm:text-xl font-bold text-gold-400">{h.label}</div>
                    <div className="text-[9px] text-gray-400 leading-tight mt-0.5">{h.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE 7: Final CTA ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase >= 7 && (
          <motion.div
            key="phase7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-5 sm:gap-8"
          >
            {/* Organizer */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-gold-400"
            >
              {EVENT_2026.organizer}
            </motion.p>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-gold-gradient font-light leading-none tracking-tight text-balance">
                Malam Anugerah
                <br />
                <em>Inovasi Nusantara</em>
              </h1>
              <p className="text-2xl sm:text-4xl md:text-5xl font-serif font-light text-white/60 tracking-widest">
                2026
              </p>
            </motion.div>

            {/* Date & Venue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gold-200/80"
            >
              <span>{EVENT_2026.date}</span>
              <span className="hidden sm:inline text-gold-500/40">·</span>
              <span className="text-gray-400 text-[11px] sm:text-xs text-balance">{EVENT_2026.venue}</span>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={handleOpenInvitation}
                className="btn-gold-luxury group flex items-center gap-3 sm:gap-4 px-7 sm:px-10 py-4 sm:py-5 rounded-full text-xs sm:text-sm tracking-wider uppercase font-semibold cursor-pointer shadow-gold-glow"
              >
                <span>Buka Undangan Saya</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/20 flex items-center justify-center text-black group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </button>
            </motion.div>

            {/* Replay / Return */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={restartIntro}
              className="text-[10px] text-gray-500 hover:text-gold-400 transition-colors font-mono tracking-widest uppercase flex items-center gap-1"
            >
              <ChevronRight size={12} className="rotate-180" />
              Putar Ulang Intro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Skip Button (always visible during phases 0-6) ─────────────────── */}
      {phase < 7 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={skipToEnd}
          className="fixed bottom-6 right-4 sm:right-6 z-50 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl text-[10px] sm:text-xs text-gray-400 hover:text-gold-300 hover:border-gold-500/30 transition-all font-mono tracking-wider uppercase"
        >
          Lewati Intro →
        </motion.button>
      )}

      {/* ─── Phase Progress Dots (phases 0-6) ──────────────────────────────── */}
      {phase < 7 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
          {PHASES.slice(0, 7).map((p, i) => (
            <div
              key={p.id}
              className={`rounded-full transition-all duration-500 ${
                phase === i
                  ? "w-4 h-1.5 bg-gold-400"
                  : phase > i
                  ? "w-1.5 h-1.5 bg-gold-500/50"
                  : "w-1.5 h-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

