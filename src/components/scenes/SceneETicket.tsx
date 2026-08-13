"use client";

import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, CalendarCheck, Sparkles, MapPin, CheckCircle2 } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { EVENT_CONFIG } from "@/config/eventConfig";

export const SceneETicket: React.FC = () => {
  const { activeSubmission, setScene } = useAwardingStore();

  const handleShareWhatsApp = () => {
    if (!activeSubmission) return;
    const text = `Halo, saya telah menerima E-Ticket resmi *${EVENT_CONFIG.eventName}*!\n\nNama: ${activeSubmission.nama}\nInstansi: ${activeSubmission.instansi}\nKode Tiket: ${activeSubmission.ticketCode}\n\nSampai jumpa di lokasi acara!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDownload = () => {
    alert("E-Ticket berhasil diproses untuk didownload sebagai file Gambar High-Res PDF/PNG.");
  };

  if (!activeSubmission) {
    return (
      <div className="scene-container justify-center text-center px-4">
        <p className="text-gray-400 text-sm">Silakan selesaikan formulir pendaftaran terlebih dahulu.</p>
        <button
          onClick={() => setScene("cover")}
          className="mt-4 px-6 py-2 rounded-xl bg-gold-500 text-black font-semibold text-xs"
        >
          Ke Halaman Utama
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container px-3 sm:px-6 py-6 sm:py-8 justify-center"
    >
      <div className="max-w-xl w-full">
        {/* Header Message */}
        <div className="text-center space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] sm:text-xs font-medium shadow-gold-glow">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold tracking-wider uppercase">VIP TICKET CONFIRMED</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gold-gradient font-light leading-tight text-balance">
            E-Ticket Digital Undangan
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 text-balance max-w-md mx-auto">
            Tunjukkan QR Code ini pada meja registrasi check-in di lokasi acara.
          </p>
        </div>

        {/* LUXURY VIP TICKET CARD */}
        <div className="relative rounded-[1.8rem] sm:rounded-[2rem] overflow-hidden border border-gold-500/40 bg-radial-gradient shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-1">
          {/* Gold Metallic Border Trim */}
          <div className="p-4 sm:p-6 md:p-8 rounded-[calc(1.8rem-0.25rem)] bg-gradient-to-b from-[#121624] via-[#0A0D18] to-[#06070B] space-y-4 sm:space-y-6 relative overflow-hidden">
            {/* Background Texture Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Ticket Header Row */}
            <div className="flex justify-between items-start border-b border-gold-500/20 pb-3 sm:pb-4 gap-2">
              <div>
                <div className="flex items-center gap-1 text-gold-400 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase">
                  <Sparkles size={11} />
                  <span>VIP PASS ADMISSION</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg md:text-xl text-gold-gradient font-normal leading-snug">
                  {EVENT_CONFIG.eventName}
                </h3>
              </div>
              <div className="text-right font-mono shrink-0">
                <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase block">TIKET ID</span>
                <p className="text-[11px] sm:text-xs font-bold text-gold-300">{activeSubmission.ticketCode}</p>
              </div>
            </div>

            {/* Guest Details & QR Scanner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Info Column */}
              <div className="sm:col-span-2 space-y-2.5">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-mono tracking-wider block">
                    NAMA TAMU UNDANGAN
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">
                    {activeSubmission.nama}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase text-gray-400 font-mono tracking-wider block">
                    INSTANSI / INSTITUSI
                  </span>
                  <p className="text-xs font-medium text-gold-200 truncate">
                    {activeSubmission.instansi}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase text-gray-400 block font-mono">
                      KATEGORI
                    </span>
                    <span className="text-gold-400 font-medium text-[11px] sm:text-xs truncate block">
                      {activeSubmission.kategori}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase text-gray-400 block font-mono">
                      ZONA KURSI
                    </span>
                    <span className="text-emerald-300 font-semibold text-[11px] sm:text-xs truncate block">
                      {activeSubmission.seatZone}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Validation Column */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/60 border border-gold-500/20">
                <QRCodeSVG
                  value={`VALIDATED_TICKET:${activeSubmission.ticketCode}:${activeSubmission.nama}`}
                  size={90}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[9px] text-gray-400 font-mono mt-1.5 tracking-widest uppercase">
                  Scan Check-In
                </span>
              </div>
            </div>

            {/* Ticket Footer / Event Location & Time */}
            <div className="border-t border-dashed border-gold-500/20 pt-3 flex flex-col sm:flex-row justify-between items-center gap-1.5 text-[11px] sm:text-xs text-gray-300">
              <div className="flex items-center gap-1.5">
                <CalendarCheck size={13} className="text-gold-400 shrink-0" />
                <span className="truncate">{EVENT_CONFIG.date}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={12} className="text-gold-400 shrink-0" />
                <span className="truncate">{EVENT_CONFIG.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 sm:mt-6">
          <button
            onClick={handleDownload}
            className="btn-gold-luxury py-2.5 sm:py-3 rounded-xl text-xs uppercase font-semibold flex items-center justify-center gap-2"
          >
            <Download size={14} />
            <span>Download E-Ticket</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 sm:py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs uppercase font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Share2 size={14} />
            <span>Bagikan via WhatsApp</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
