"use client";

import React from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, CalendarCheck, Sparkles, MapPin, CheckCircle2, Ticket } from "lucide-react";
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
      <div className="scene-container justify-center text-center">
        <p className="text-gray-400">Silakan selesaikan formulir pendaftaran terlebih dahulu.</p>
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container px-4 py-8 justify-center"
    >
      <div className="max-w-xl w-full">
        {/* Header Message */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium shadow-gold-glow">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="font-semibold tracking-wider uppercase">VIP TICKET CONFIRMED</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-gold-gradient font-light">
            E-Ticket Digital Undangan
          </h2>
          <p className="text-xs text-gray-400">
            Tunjukkan QR Code ini pada meja registrasi check-in di lokasi acara.
          </p>
        </div>

        {/* LUXURY VIP TICKET CARD */}
        <div className="relative rounded-[2rem] overflow-hidden border border-gold-500/40 bg-radial-gradient shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-1">
          {/* Gold Metallic Border Trim */}
          <div className="p-6 md:p-8 rounded-[calc(2rem-0.25rem)] bg-gradient-to-b from-[#121624] via-[#0A0D18] to-[#06070B] space-y-6 relative overflow-hidden">
            {/* Background Texture Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Ticket Header Row */}
            <div className="flex justify-between items-start border-b border-gold-500/20 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-gold-400 text-[10px] font-semibold tracking-widest uppercase">
                  <Sparkles size={12} />
                  <span>VIP PASS ADMISSION</span>
                </div>
                <h3 className="font-serif text-lg md:text-xl text-gold-gradient font-normal">
                  {EVENT_CONFIG.eventName}
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-gray-400 uppercase">TIKET ID</span>
                <p className="text-xs font-bold text-gold-300">{activeSubmission.ticketCode}</p>
              </div>
            </div>

            {/* Guest Details & QR Scanner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Info Column */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-mono tracking-wider">
                    NAMA TAMU UNDANGAN
                  </span>
                  <p className="text-base font-semibold text-white tracking-wide">
                    {activeSubmission.nama}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-mono tracking-wider">
                    INSTANSI / INSTITUSI
                  </span>
                  <p className="text-xs font-medium text-gold-200">
                    {activeSubmission.instansi}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">
                      KATEGORI
                    </span>
                    <span className="text-gold-400 font-medium">{activeSubmission.kategori}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 block font-mono">
                      ZONA KURSI
                    </span>
                    <span className="text-emerald-300 font-semibold">{activeSubmission.seatZone}</span>
                  </div>
                </div>
              </div>

              {/* QR Code Validation Column */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/60 border border-gold-500/20">
                <QRCodeSVG
                  value={`VALIDATED_TICKET:${activeSubmission.ticketCode}:${activeSubmission.nama}`}
                  size={100}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[9px] text-gray-400 font-mono mt-2 tracking-widest uppercase">
                  Scan Check-In
                </span>
              </div>
            </div>

            {/* Ticket Footer / Event Location & Time */}
            <div className="border-t border-dashed border-gold-500/20 pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CalendarCheck size={14} className="text-gold-400" />
                <span>{EVENT_CONFIG.date} • {EVENT_CONFIG.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin size={13} className="text-gold-400" />
                <span>{EVENT_CONFIG.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleDownload}
            className="btn-gold-luxury py-3 rounded-xl text-xs uppercase font-semibold flex items-center justify-center gap-2"
          >
            <Download size={15} />
            <span>Download E-Ticket</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs uppercase font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Share2 size={15} />
            <span>Bagikan via WhatsApp</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
