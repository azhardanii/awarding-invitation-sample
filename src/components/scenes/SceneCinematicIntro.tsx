"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useAwardingStore } from "@/store/useAwardingStore";
import { ThreeGoldScene } from "@/components/ui/ThreeGoldScene";
import { ArrowUpRight, ChevronRight, ChevronDown } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAST_WINNERS = [
  {
    id: 1,
    name: "Prof. Dr. Ir. Raymond Pratama",
    suffix: "M.Sc.",
    award: "Best Digital Innovator",
    year: "2025",
    institution: "Lembaga Riset Terpadu Nusantara",
    quote:
      "Pelopor sistem AI keamanan infrastruktur nasional yang mengubah paradigma pertahanan siber.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=90&crop=faces",
    accent: "#C9A961",
    accentRgb: "201,169,97",
  },
  {
    id: 2,
    name: "Dr. Sarah Amelia",
    suffix: "M.B.A.",
    award: "Outstanding Public Leadership",
    year: "2025",
    institution: "Badan Transformasi Layanan Publik",
    quote:
      "Pelopor tata kelola pelayanan publik berbasis digital yang menyentuh 50 juta warga.",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=90&crop=faces",
    accent: "#E8D5A0",
    accentRgb: "232,213,160",
  },
  {
    id: 3,
    name: "Drs. Hendra Wijaya",
    suffix: "Ph.D.",
    award: "National Corporate Transformation",
    year: "2025",
    institution: "PT Sinergi Industri Indonesia",
    quote:
      "Visioner di balik transformasi ekosistem manufaktur modern yang menciptakan 12.000 lapangan kerja baru.",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&auto=format&fit=crop&q=90&crop=faces",
    accent: "#D4B46E",
    accentRgb: "212,180,110",
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

const TOTAL_SECTIONS = 8;
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Winner Spotlight Card (Ultra-cinematic 3D) ───────────────────────────────
const WinnerSpotlight: React.FC<{
  winner: typeof PAST_WINNERS[0];
  direction: "left" | "right" | "up";
}> = ({ winner, direction }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), {
    stiffness: 200,
    damping: 25,
  });
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-10, 20]);
  const scale = useSpring(1, { stiffness: 300, damping: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.03);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  const enterVariants = {
    left: { x: -120, opacity: 0, rotateY: -25, filter: "blur(16px)" },
    right: { x: 120, opacity: 0, rotateY: 25, filter: "blur(16px)" },
    up: { y: 80, opacity: 0, scale: 0.88, filter: "blur(12px)" },
  };

  return (
    <motion.div
      initial={enterVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        scale: 0.92,
        filter: "blur(14px)",
        transition: { duration: 0.6, ease: EASE_EXPO },
      }}
      transition={{ duration: 1.1, ease: EASE_EXPO }}
      style={{ perspective: "1200px" }}
      className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
        className="cursor-pointer select-none"
      >
        {/* Dramatic depth shadow */}
        <motion.div
          className="absolute inset-0 rounded-[2.2rem] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 80%, rgba(${winner.accentRgb},0.35) 0%, transparent 70%)`,
            filter: "blur(40px)",
            transform: "translateZ(-60px) translateY(30px) scale(0.85)",
            x: shadowX,
            y: shadowY,
          }}
        />

        {/* Main card body */}
        <div
          className="relative rounded-[2rem] overflow-hidden"
          style={{
            boxShadow: `0 40px 80px rgba(0,0,0,0.85), 0 0 0 1px ${winner.accent}35, 0 0 60px rgba(${winner.accentRgb},0.15)`,
          }}
        >
          {/* Photo container */}
          <div className="relative h-[300px] sm:h-[380px] md:h-[440px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={winner.photo}
              alt={winner.name}
              className="w-full h-full object-cover object-top"
              style={{ transform: "scale(1.08)" }}
            />

            {/* Cinematic gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 35%, rgba(6,7,11,0.55) 60%, #060711 100%)",
              }}
            />

            {/* Accent colour wash */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 110%, rgba(${winner.accentRgb},0.22) 0%, transparent 60%)`,
                mixBlendMode: "screen",
              }}
            />

            {/* Left rim light */}
            <div
              className="absolute inset-y-0 left-0 w-1"
              style={{
                background: `linear-gradient(to bottom, transparent, ${winner.accent}90, transparent)`,
              }}
            />

            {/* Floating award badge */}
            <div className="absolute top-4 left-4" style={{ transform: "translateZ(40px)" }}>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase backdrop-blur-md"
                style={{
                  background: `rgba(${winner.accentRgb},0.18)`,
                  border: `1px solid ${winner.accent}80`,
                  color: winner.accent,
                  boxShadow: `0 4px 20px rgba(${winner.accentRgb},0.3)`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: winner.accent }}
                />
                {winner.award}
              </div>
            </div>

            {/* Year stamp */}
            <div
              className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.3em]"
              style={{ color: `${winner.accent}90` }}
            >
              {winner.year}
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ transform: "translateZ(20px)" }}>
              <div
                className="text-[8px] sm:text-[9px] font-mono tracking-[0.35em] uppercase mb-1"
                style={{ color: `${winner.accent}AA` }}
              >
                Pemenang · Awarding 2025
              </div>
              <h3
                className="font-serif text-xl sm:text-2xl text-white leading-tight"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
              >
                {winner.name}
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: `${winner.accent}CC` }}>
                {winner.suffix} · {winner.institution}
              </p>
            </div>
          </div>

          {/* Quote panel */}
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(to bottom, rgba(8,10,20,1), rgba(4,6,14,1))",
              borderTop: `1px solid ${winner.accent}25`,
            }}
          >
            <p className="text-[11px] sm:text-xs text-gray-300/75 italic leading-relaxed">
              &ldquo;{winner.quote}&rdquo;
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Mini winner card (montage) ───────────────────────────────────────────────
const WinnerMini: React.FC<{
  winner: typeof PAST_WINNERS[0];
  delay: number;
}> = ({ winner, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.82, rotateY: -20 }}
    animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
    transition={{ duration: 0.85, delay, ease: EASE_EXPO }}
    className="relative rounded-2xl overflow-hidden border flex-1 min-w-0"
    style={{
      borderColor: `${winner.accent}30`,
      boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${winner.accent}20, 0 0 30px rgba(${winner.accentRgb},0.1)`,
    }}
  >
    <div className="relative h-36 sm:h-44 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={winner.photo}
        alt={winner.name}
        className="w-full h-full object-cover object-top"
        style={{ transform: "scale(1.06)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, #06070f 0%, rgba(6,7,15,0.4) 55%, transparent 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, rgba(${winner.accentRgb},0.2) 0%, transparent 65%)`,
        }}
      />
      <div className="absolute bottom-2.5 left-2.5 right-2.5">
        <p className="font-serif text-xs sm:text-sm text-white leading-tight truncate">
          {winner.name}
        </p>
        <p className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: winner.accent }}>
          {winner.award}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const SceneCinematicIntro: React.FC = () => {
  const { setScene, startMusic } = useAwardingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [winnerIdx, setWinnerIdx] = useState(0);
  const [isCtaPhase, setIsCtaPhase] = useState(false);

  // Scroll-driven phase tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const totalHeight = container.scrollHeight - container.clientHeight;
      const progress = totalHeight > 0 ? scrollTop / totalHeight : 0;
      const rawPhase = Math.round(progress * (TOTAL_SECTIONS - 1));
      const newPhase = Math.min(rawPhase, TOTAL_SECTIONS - 1);

      setPhase((prev) => {
        if (newPhase !== prev) {
          if (newPhase === 2) setWinnerIdx(0);
          if (newPhase === 3) setWinnerIdx(1);
          if (newPhase === 4) setWinnerIdx(2);
          setIsCtaPhase(newPhase >= 7);
          return newPhase;
        }
        return prev;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPhase = (targetPhase: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalHeight = container.scrollHeight - container.clientHeight;
    const targetScroll = (targetPhase / (TOTAL_SECTIONS - 1)) * totalHeight;
    container.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const handleOpenInvitation = () => {
    startMusic();
    setScene("cover");
  };

  const winnerDirections: Array<"left" | "right" | "up"> = ["left", "right", "up"];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {/* Persistent 3D background */}
      <div className="fixed inset-0 z-0">
        <ThreeGoldScene />
      </div>

      {/* Cinematic vignette */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 25%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Skip button */}
      <AnimatePresence>
        {!isCtaPhase && (
          <motion.button
            key="skip-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5 }}
            onClick={() => scrollToPhase(7)}
            className="fixed bottom-6 right-4 sm:right-6 z-50 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl text-[10px] sm:text-xs text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961]/30 transition-all font-mono tracking-wider uppercase"
          >
            Lewati Intro →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Phase progress dots */}
      <AnimatePresence>
        {!isCtaPhase && (
          <motion.div
            key="progress-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
          >
            {Array.from({ length: TOTAL_SECTIONS - 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPhase(i)}
                className={`rounded-full transition-all duration-500 ${
                  phase === i
                    ? "w-5 h-1.5 bg-[#C9A961]"
                    : phase > i
                    ? "w-1.5 h-1.5 bg-[#C9A961]/50"
                    : "w-1.5 h-1.5 bg-white/15"
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1], y: [0, 6, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 text-white/30 pointer-events-none"
          >
            <span className="text-[9px] font-mono tracking-widest uppercase">Scroll</span>
            <ChevronDown size={14} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SECTION 0: Brand opener — ZOOM IN ═══════════════════════════════ */}
      <section
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 z-10"
        style={{ scrollSnapAlign: "start" }}
      >
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, scale: 0.75, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.18, filter: "blur(20px)", y: -40 }}
              transition={{ duration: 1.2, ease: EASE_EXPO }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "5rem", opacity: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: EASE_EXPO }}
                className="h-px mb-8"
                style={{ background: "linear-gradient(to right, transparent, #C9A961, transparent)" }}
              />
              <motion.p
                initial={{ opacity: 0, letterSpacing: "0.6em", y: 8 }}
                animate={{ opacity: 1, letterSpacing: "0.3em", y: 0 }}
                transition={{ delay: 0.55, duration: 0.9 }}
                className="text-[10px] sm:text-xs font-mono uppercase text-[#C9A961] mb-4"
              >
                Dewan Kehormatan Inovasi &amp; Teknologi Indonesia
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.75, duration: 1.1, ease: EASE_EXPO }}
                className="font-serif font-light leading-none tracking-tight text-balance"
                style={{
                  fontSize: "clamp(2.8rem,7vw,6rem)",
                  background: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Malam Anugerah
                <br />
                <em>Inovasi Nusantara</em>
              </motion.h1>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "5rem", opacity: 1 }}
                transition={{ delay: 1, duration: 1, ease: EASE_EXPO }}
                className="h-px mt-8 mb-5"
                style={{ background: "linear-gradient(to right, transparent, #C9A961, transparent)" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-[11px] sm:text-xs text-white/30 font-mono tracking-[0.2em]"
              >
                SCROLL UNTUK MEMULAI
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ SECTION 1: "Setahun yang lalu…" — PARALLAX PUSH ════════════════ */}
      <section
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 z-10"
        style={{ scrollSnapAlign: "start" }}
      >
        <AnimatePresence>
          {phase === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 60, scale: 0.9, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -50, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 1.0, ease: EASE_EXPO }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-24 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(201,169,97,0.5), transparent)" }}
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9, ease: EASE_EXPO }}
                className="font-serif font-light italic text-white/85"
                style={{ fontSize: "clamp(1.6rem,4.5vw,3.5rem)" }}
              >
                Setahun yang lalu…
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-[11px] sm:text-xs text-white/35 font-mono tracking-[0.25em] uppercase"
              >
                Para pejuang yang mengukir sejarah
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-24 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(201,169,97,0.5), transparent)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ SECTIONS 2-4: Winner spotlight — cinematic 3D per winner ════════ */}
      {PAST_WINNERS.map((winner, idx) => (
        <section
          key={winner.id}
          className="relative w-full h-[100dvh] flex items-center justify-center px-4 sm:px-8 z-10"
          style={{ scrollSnapAlign: "start" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 60% 50%, rgba(${winner.accentRgb},0.06) 0%, transparent 65%)`,
            }}
          />
          <AnimatePresence mode="wait">
            {phase === idx + 2 && (
              <motion.div
                key={`winner-${idx}`}
                className="flex flex-col items-center gap-5 w-full"
              >
                <motion.div
                  initial={{ opacity: 0, y: -12, letterSpacing: "0.6em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: EASE_EXPO }}
                  className="text-[9px] sm:text-[10px] font-mono uppercase"
                  style={{ color: `${winner.accent}90` }}
                >
                  {idx + 1} dari 3 Pemenang &nbsp;&middot;&nbsp; Awarding 2025
                </motion.div>
                <WinnerSpotlight winner={winner} direction={winnerDirections[idx]} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex gap-2"
                >
                  {PAST_WINNERS.map((_, i) => (
                    <div
                      key={i}
                      className="h-0.5 rounded-full transition-all duration-700"
                      style={{
                        width: i === idx ? "1.5rem" : "0.5rem",
                        background: i <= idx ? winner.accent : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      ))}

      {/* ═══ SECTION 5: Montage — ZOOM IN from bottom ════════════════════════ */}
      <section
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 gap-5 z-10"
        style={{ scrollSnapAlign: "start" }}
      >
        <AnimatePresence>
          {phase === 5 && (
            <motion.div
              key="s5"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
              transition={{ duration: 0.9, ease: EASE_EXPO }}
              className="flex flex-col items-center gap-5 w-full"
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#C9A961]"
              >
                Para Pemenang Awarding 2025
              </motion.p>
              <div className="flex gap-2 sm:gap-3 w-full max-w-lg">
                {PAST_WINNERS.map((w, i) => (
                  <WinnerMini key={w.id} winner={w} delay={i * 0.14} />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-[10px] text-white/30 font-mono tracking-widest"
              >
                Mereka telah mengukir sejarah.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ SECTION 6: 2026 Event reveal — PARALLAX PUSH UP ════════════════ */}
      <section
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 gap-5 sm:gap-7 z-10"
        style={{ scrollSnapAlign: "start" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(201,169,97,0.08) 0%, transparent 65%)",
          }}
        />
        <AnimatePresence>
          {phase === 6 && (
            <motion.div
              key="s6"
              initial={{ opacity: 0, y: 80, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -60, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 1.1, ease: EASE_EXPO }}
              className="flex flex-col items-center gap-5 sm:gap-6 w-full"
            >
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: EASE_EXPO }}
                className="font-serif font-light italic text-white/80"
                style={{ fontSize: "clamp(1.4rem,3.5vw,2.4rem)" }}
              >
                Dan kini, giliran 2026…
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 1.0, ease: EASE_EXPO }}
                className="w-full max-w-sm sm:max-w-md p-5 sm:p-7 rounded-[1.8rem] border backdrop-blur-xl"
                style={{
                  background: "rgba(8,10,22,0.9)",
                  borderColor: "rgba(201,169,97,0.28)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(201,169,97,0.18), 0 0 60px rgba(201,169,97,0.07)",
                }}
              >
                <div className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#C9A961] mb-2">
                  Edisi Ketiga · 2026
                </div>
                <h2
                  className="font-serif font-normal leading-snug text-balance"
                  style={{
                    fontSize: "clamp(1.3rem,3.5vw,2rem)",
                    background: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {EVENT_2026.name}
                </h2>
                <div className="mt-4 pt-4 border-t border-[#C9A961]/15 space-y-1.5">
                  <p className="text-xs sm:text-sm text-gray-200">{EVENT_2026.date}</p>
                  <p className="text-xs text-gray-400">{EVENT_2026.time}</p>
                  <p className="text-[11px] sm:text-xs text-[#C9A961]/80">{EVENT_2026.venue}</p>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
                  {EVENT_2026.highlights.map((h, i) => (
                    <div key={i} className="text-center">
                      <div className="font-serif text-base sm:text-xl font-bold text-[#C9A961]">
                        {h.label}
                      </div>
                      <div className="text-[9px] text-gray-400 leading-tight mt-0.5">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══ SECTION 7: Final CTA — ZOOM OUT reveal ══════════════════════════ */}
      <section
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-6 sm:gap-10 z-10"
        style={{ scrollSnapAlign: "start" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,97,0.06) 0%, transparent 60%)",
          }}
        />
        <AnimatePresence>
          {phase >= 7 && (
            <motion.div
              key="s7"
              initial={{ opacity: 0, scale: 1.2, filter: "blur(24px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: EASE_EXPO }}
              className="flex flex-col items-center gap-6 sm:gap-8 w-full"
            >
              <motion.p
                initial={{ opacity: 0, y: -12, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.28em" }}
                transition={{ delay: 0.1, duration: 0.9 }}
                className="text-[9px] sm:text-[10px] font-mono uppercase text-[#C9A961]"
              >
                {EVENT_2026.organizer}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.2, duration: 1.0, ease: EASE_EXPO }}
                className="space-y-2"
              >
                <h1
                  className="font-serif font-light leading-none tracking-tight text-balance"
                  style={{
                    fontSize: "clamp(2.5rem,7vw,5.5rem)",
                    background: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Malam Anugerah
                  <br />
                  <em>Inovasi Nusantara</em>
                </h1>
                <p
                  className="font-serif font-light tracking-widest"
                  style={{ fontSize: "clamp(1.4rem,4vw,3rem)", color: "rgba(255,255,255,0.45)" }}
                >
                  2026
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#C9A961]/80"
              >
                <span>{EVENT_2026.date}</span>
                <span className="hidden sm:inline text-[#C9A961]/30">·</span>
                <span className="text-gray-400 text-[11px] sm:text-xs text-balance">{EVENT_2026.venue}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.58, duration: 0.9, ease: EASE_EXPO }}
              >
                <button
                  onClick={handleOpenInvitation}
                  className="group relative flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-xs sm:text-sm tracking-wider uppercase font-semibold cursor-pointer overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #C9A961 0%, #f0d898 50%, #C9A961 100%)",
                    boxShadow: "0 0 40px rgba(201,169,97,0.45), 0 4px 24px rgba(201,169,97,0.35)",
                    color: "#0a0c16",
                  }}
                >
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                    }}
                  />
                  <span className="relative z-10">Buka Undangan Saya</span>
                  <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </div>
                </button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                onClick={() => {
                  const container = containerRef.current;
                  if (container) container.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[10px] text-gray-500 hover:text-[#C9A961] transition-colors font-mono tracking-widest uppercase flex items-center gap-1"
              >
                <ChevronRight size={12} className="rotate-180" />
                Putar Ulang Intro
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
