"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  MotionValue,
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

// ─── Winner Spotlight Card (Ultra-cinematic 3D) ───────────────────────────────
const WinnerSpotlight: React.FC<{
  winner: typeof PAST_WINNERS[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}> = ({ winner, index, scrollYProgress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse parallax 3D effect
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 160, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 160, damping: 28 });
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-10, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Scroll mapping for this specific winner (sections 2, 3, 4)
  const sectionIdx = index + 2;
  const start = (sectionIdx - 1) / TOTAL_SECTIONS;
  const peak = sectionIdx / TOTAL_SECTIONS;
  const end = (sectionIdx + 1) / TOTAL_SECTIONS;

  // Synergistic In-Out animations tied directly to scroll
  const opacity = useTransform(scrollYProgress, [start, start + 0.05, peak - 0.02, peak + 0.05], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [start, peak, peak + 0.05], [150, 0, -150]);
  const scale = useTransform(scrollYProgress, [start, peak, end], [0.85, 1, 1.15]);
  const blur = useTransform(scrollYProgress, [start, start + 0.05, peak - 0.02, peak + 0.05], [20, 0, 0, 20]);

  // Image zoom specifically (zooms continuously as user scrolls)
  const imageZoom = useTransform(scrollYProgress, [start, end], [1.05, 1.45]);

  return (
    <motion.div
      style={{ opacity, y, scale, filter: useTransform(blur, v => `blur(${v}px)`), perspective: "1200px" }}
      className="absolute inset-0 flex flex-col items-center justify-center w-full px-4 sm:px-8 pointer-events-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto pointer-events-auto cursor-pointer"
      >
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

        <div
          className="relative rounded-[2rem] overflow-hidden"
          style={{
            boxShadow: `0 40px 80px rgba(0,0,0,0.85), 0 0 0 1px ${winner.accent}35, 0 0 60px rgba(${winner.accentRgb},0.15)`,
          }}
        >
          <div className="relative h-[300px] sm:h-[380px] md:h-[440px] overflow-hidden">
            <motion.img
              src={winner.photo}
              alt={winner.name}
              className="w-full h-full object-cover object-top"
              style={{ scale: imageZoom }}
            />

            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 35%, rgba(6,7,11,0.55) 60%, #060711 100%)" }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 110%, rgba(${winner.accentRgb},0.22) 0%, transparent 60%)`, mixBlendMode: "screen" }} />
            <div className="absolute inset-y-0 left-0 w-1" style={{ background: `linear-gradient(to bottom, transparent, ${winner.accent}90, transparent)` }} />

            <div className="absolute top-4 left-4" style={{ transform: "translateZ(40px)" }}>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase backdrop-blur-md"
                style={{ background: `rgba(${winner.accentRgb},0.18)`, border: `1px solid ${winner.accent}80`, color: winner.accent, boxShadow: `0 4px 20px rgba(${winner.accentRgb},0.3)` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {winner.award}
              </div>
            </div>

            <div className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.3em]" style={{ color: `${winner.accent}90` }}>
              {winner.year}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ transform: "translateZ(20px)" }}>
              <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.35em] uppercase mb-1" style={{ color: `${winner.accent}AA` }}>
                Pemenang · Awarding 2025
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-white leading-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}>
                {winner.name}
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: `${winner.accent}CC` }}>
                {winner.suffix} · {winner.institution}
              </p>
            </div>
          </div>

          <div
            className="px-5 py-4"
            style={{ background: "linear-gradient(to bottom, rgba(8,10,20,1), rgba(4,6,14,1))", borderTop: `1px solid ${winner.accent}25` }}
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
}> = ({ winner }) => (
  <div
    className="relative rounded-2xl overflow-hidden border flex-1 min-w-0"
    style={{ borderColor: `${winner.accent}30`, boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${winner.accent}20, 0 0 30px rgba(${winner.accentRgb},0.1)` }}
  >
    <div className="relative h-36 sm:h-44 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={winner.photo} alt={winner.name} className="w-full h-full object-cover object-top" style={{ transform: "scale(1.06)" }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #06070f 0%, rgba(6,7,15,0.4) 55%, transparent 100%)` }} />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 100%, rgba(${winner.accentRgb},0.2) 0%, transparent 65%)` }} />
      <div className="absolute bottom-2.5 left-2.5 right-2.5">
        <p className="font-serif text-xs sm:text-sm text-white leading-tight truncate">{winner.name}</p>
        <p className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: winner.accent }}>{winner.award}</p>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const SceneCinematicIntro: React.FC = () => {
  const { setScene, startMusic } = useAwardingStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use Scroll to drive everything seamlessly without snaps
  const { scrollYProgress } = useScroll({ target: containerRef });

  const handleOpenInvitation = () => {
    startMusic();
    setScene("cover");
  };

  // ─── Map Opacities and Transforms for Each Phase ───
  // Phase 0: Brand Opener
  const p0Op = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);
  const p0Scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.4]);
  const p0Blur = useTransform(scrollYProgress, [0, 0.08, 0.12], [0, 0, 20]);

  // Phase 1: Setahun yang lalu
  const p1Op = useTransform(scrollYProgress, [0.08, 0.12, 0.2, 0.25], [0, 1, 1, 0]);
  const p1Y = useTransform(scrollYProgress, [0.08, 0.15, 0.25], [100, 0, -150]);
  const p1Scale = useTransform(scrollYProgress, [0.08, 0.25], [0.9, 1.1]);

  // Phase 5: Montage
  const p5Op = useTransform(scrollYProgress, [0.55, 0.6, 0.68, 0.73], [0, 1, 1, 0]);
  const p5Y = useTransform(scrollYProgress, [0.55, 0.62, 0.73], [200, 0, -100]);
  const p5Scale = useTransform(scrollYProgress, [0.55, 0.73], [0.85, 1.1]);

  // Phase 6: 2026 Reveal
  const p6Op = useTransform(scrollYProgress, [0.68, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const p6Y = useTransform(scrollYProgress, [0.68, 0.78, 0.9], [150, 0, -150]);
  
  // Phase 7: Final CTA
  const p7Op = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);
  const p7Scale = useTransform(scrollYProgress, [0.85, 0.95, 1], [1.3, 1, 1]);
  const p7Blur = useTransform(scrollYProgress, [0.85, 0.92, 1], [20, 0, 0]);

  // Skip btn visibility
  const skipOp = useTransform(scrollYProgress, [0, 0.8, 0.85], [1, 1, 0]);

  const scrollToPhase = (progressRatio: number) => {
    if (!containerRef.current) return;
    const scrollH = containerRef.current.scrollHeight - window.innerHeight;
    containerRef.current.scrollTo({ top: scrollH * progressRatio, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(15px)" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-[#06070B] overflow-hidden"
    >
      {/* ── Scrollable container (800vh tall to scrub through) ── */}
      <div ref={containerRef} className="absolute inset-0 overflow-y-auto" style={{ height: "100vh" }}>
        <div style={{ height: `${TOTAL_SECTIONS * 100}vh` }}>
          
          {/* ── Sticky Viewport where all animations happen ── */}
          <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
            
            {/* Persistent 3D background */}
            <div className="absolute inset-0 z-0">
              <ThreeGoldScene />
            </div>

            {/* Cinematic vignette */}
            <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_50%_45%,transparent_25%,rgba(0,0,0,0.72)_100%)]" />

            {/* ═══ SECTION 0: Brand opener ═══════════════════════════════ */}
            <motion.div
              style={{ opacity: p0Op, scale: p0Scale, filter: useTransform(p0Blur, v => `blur(${v}px)`) }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
            >
              <div className="h-px mb-8 w-20 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
              <p className="text-[10px] sm:text-xs font-mono uppercase text-[#C9A961] mb-4 tracking-[0.3em]">
                Dewan Kehormatan Inovasi &amp; Teknologi Indonesia
              </p>
              <h1
                className="font-serif font-light leading-none tracking-tight text-balance bg-clip-text text-transparent"
                style={{ fontSize: "clamp(2.8rem,7vw,6rem)", backgroundImage: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)" }}
              >
                Malam Anugerah
                <br />
                <em>Inovasi Nusantara</em>
              </h1>
              <div className="h-px mt-8 mb-5 w-20 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
              
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-1 mt-6 text-white/30"
              >
                <span className="text-[10px] font-mono tracking-widest uppercase">Scroll ke bawah</span>
                <ChevronDown size={14} />
              </motion.div>
            </motion.div>

            {/* ═══ SECTION 1: "Setahun yang lalu…" ═══════════════════════ */}
            <motion.div
              style={{ opacity: p1Op, y: p1Y, scale: p1Scale }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
            >
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
              <p className="font-serif font-light italic text-white/85 my-5" style={{ fontSize: "clamp(1.6rem,4.5vw,3.5rem)" }}>
                Setahun yang lalu…
              </p>
              <p className="text-[11px] sm:text-xs text-white/35 font-mono tracking-[0.25em] uppercase mb-5">
                Para pejuang yang mengukir sejarah
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
            </motion.div>

            {/* ═══ SECTIONS 2-4: Winner spotlight ════════════════════════ */}
            {PAST_WINNERS.map((winner, idx) => (
              <WinnerSpotlight key={winner.id} winner={winner} index={idx} scrollYProgress={scrollYProgress} />
            ))}

            {/* ═══ SECTION 5: Montage ════════════════════════════════════ */}
            <motion.div
              style={{ opacity: p5Op, y: p5Y, scale: p5Scale }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 gap-5 z-10"
            >
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-[#C9A961]">
                Para Pemenang Awarding 2025
              </p>
              <div className="flex gap-2 sm:gap-3 w-full max-w-lg">
                {PAST_WINNERS.map((w) => <WinnerMini key={w.id} winner={w} />)}
              </div>
              <p className="text-[10px] text-white/30 font-mono tracking-widest mt-2">
                Mereka telah mengukir sejarah.
              </p>
            </motion.div>

            {/* ═══ SECTION 6: 2026 Event reveal ══════════════════════════ */}
            <motion.div
              style={{ opacity: p6Op, y: p6Y }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 gap-5 sm:gap-7 z-10"
            >
              <p className="font-serif font-light italic text-white/80" style={{ fontSize: "clamp(1.4rem,3.5vw,2.4rem)" }}>
                Dan kini, giliran 2026…
              </p>
              <div className="w-full max-w-sm sm:max-w-md p-5 sm:p-7 rounded-[1.8rem] border backdrop-blur-xl bg-[#080a16e6] border-[#C9A961]/30 shadow-[0_40px_80px_rgba(0,0,0,0.75),0_0_0_1px_rgba(201,169,97,0.18),0_0_60px_rgba(201,169,97,0.07)]">
                <div className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-[#C9A961] mb-2">
                  Edisi Ketiga · 2026
                </div>
                <h2 className="font-serif font-normal leading-snug text-balance bg-clip-text text-transparent" style={{ fontSize: "clamp(1.3rem,3.5vw,2rem)", backgroundImage: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)" }}>
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
                      <div className="font-serif text-base sm:text-xl font-bold text-[#C9A961]">{h.label}</div>
                      <div className="text-[9px] text-gray-400 leading-tight mt-0.5">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ═══ SECTION 7: Final CTA ══════════════════════════════════ */}
            <motion.div
              style={{ opacity: p7Op, scale: p7Scale, filter: useTransform(p7Blur, v => `blur(${v}px)`) }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-6 sm:gap-10 z-10 pointer-events-auto"
            >
              <p className="text-[9px] sm:text-[10px] font-mono uppercase text-[#C9A961] tracking-[0.28em]">
                {EVENT_2026.organizer}
              </p>
              <div className="space-y-2">
                <h1 className="font-serif font-light leading-none tracking-tight text-balance bg-clip-text text-transparent" style={{ fontSize: "clamp(2.5rem,7vw,5.5rem)", backgroundImage: "linear-gradient(135deg, #f5e6c3 0%, #C9A961 45%, #f0d898 100%)" }}>
                  Malam Anugerah
                  <br />
                  <em>Inovasi Nusantara</em>
                </h1>
                <p className="font-serif font-light tracking-widest" style={{ fontSize: "clamp(1.4rem,4vw,3rem)", color: "rgba(255,255,255,0.45)" }}>2026</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#C9A961]/80">
                <span>{EVENT_2026.date}</span>
                <span className="hidden sm:inline text-[#C9A961]/30">·</span>
                <span className="text-gray-400 text-[11px] sm:text-xs text-balance">{EVENT_2026.venue}</span>
              </div>
              
              <button
                onClick={handleOpenInvitation}
                className="group relative flex items-center gap-3 sm:gap-4 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-xs sm:text-sm tracking-wider uppercase font-semibold cursor-pointer overflow-hidden shadow-[0_0_40px_rgba(201,169,97,0.45),0_4px_24px_rgba(201,169,97,0.35)]"
                style={{ background: "linear-gradient(135deg, #C9A961 0%, #f0d898 50%, #C9A961 100%)", color: "#0a0c16" }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.3)_50%,transparent_70%)]" />
                <span className="relative z-10">Buka Undangan Saya</span>
                <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </div>
              </button>
              
              <button
                onClick={() => scrollToPhase(0)}
                className="text-[10px] text-gray-500 hover:text-[#C9A961] transition-colors font-mono tracking-widest uppercase flex items-center gap-1 mt-4"
              >
                <ChevronRight size={12} className="rotate-180" />
                Putar Ulang Intro
              </button>
            </motion.div>

            {/* Skip Button */}
            <motion.button
              style={{ opacity: skipOp, pointerEvents: useTransform(skipOp, v => v > 0.5 ? "auto" : "none") as any }}
              onClick={() => scrollToPhase(1)}
              className="absolute bottom-6 right-4 sm:right-6 z-50 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl text-[10px] sm:text-xs text-gray-400 hover:text-[#C9A961] hover:border-[#C9A961]/30 transition-all font-mono tracking-wider uppercase pointer-events-auto cursor-pointer"
            >
              Lewati Intro →
            </motion.button>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};
