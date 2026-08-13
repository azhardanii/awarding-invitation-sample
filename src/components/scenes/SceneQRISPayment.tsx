"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { Upload, CheckCircle2, Clock, ShieldCheck, FileCheck, ArrowRight, ExternalLink } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { EVENT_CONFIG } from "@/config/eventConfig";
import { subscribeToSubmission } from "@/lib/firebase";

export const SceneQRISPayment: React.FC = () => {
  const { activeSubmission, setScene, uploadPaymentProof, setActiveSubmissionStatus } =
    useAwardingStore();

  const [isUploading, setIsUploading] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(
    activeSubmission?.buktiBayarUrl || null
  );

  // Real-time synchronization listener
  useEffect(() => {
    if (!activeSubmission) return;

    const unsubscribe = subscribeToSubmission(activeSubmission.id, (updated) => {
      if (updated.status === "verified" && activeSubmission.status !== "verified") {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#C9A961", "#F5E6AD", "#FFFFFF", "#E9C757"],
        });

        setTimeout(() => {
          setScene("ticket");
        }, 2200);
      }
    });

    return () => unsubscribe();
  }, [activeSubmission, setScene]);

  if (!activeSubmission) {
    return (
      <div className="scene-container justify-center text-center px-4">
        <p className="text-gray-400 text-sm">Data pendaftaran tidak ditemukan.</p>
        <button
          onClick={() => setScene("form")}
          className="mt-4 px-6 py-2 rounded-xl bg-gold-500 text-black font-semibold text-xs"
        >
          Kembali ke Form
        </button>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setProofPreview(url);
      uploadPaymentProof(url);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSimulateAdminApproval = () => {
    setActiveSubmissionStatus("verified");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", y: -20 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="scene-container px-3 sm:px-6 py-6 sm:py-8 justify-center"
    >
      <div className="max-w-3xl w-full">
        {/* Header & Status Indicator */}
        <div className="mb-4 sm:mb-6 text-center space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-[10px] sm:text-xs text-gold-300 font-medium shadow-gold-glow">
            {activeSubmission.status === "verified" ? (
              <>
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-semibold tracking-wider uppercase">
                  PEMBAYARAN TERVERIFIKASI
                </span>
              </>
            ) : (
              <>
                <Clock size={13} className="text-amber-400 animate-spin shrink-0" />
                <span className="tracking-wider uppercase">MENUNGGU KONFIRMASI PEMBAYARAN</span>
              </>
            )}
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-gold-gradient font-light leading-tight text-balance">
            Pembayaran QRIS Undangan
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 text-balance max-w-md mx-auto">
            Scan kode QRIS di bawah ini untuk menyelesaikan konfirmasi kehadiran.
          </p>
        </div>

        {/* Double Bezel Layout Grid */}
        <DoubleBezelCard innerClassName="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Column: QRIS Card */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-black/60 border border-gold-500/25 shadow-gold-glow relative">
              <div className="text-center space-y-0.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-gold-400 block truncate max-w-[240px]">
                  {EVENT_CONFIG.bankInfo.qrisTitle}
                </span>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-200">
                  NMID: ID1029384756102
                </p>
              </div>

              {/* QR Code Frame */}
              <div className="p-3 sm:p-4 bg-white rounded-xl shadow-2xl relative border-4 border-gold-500/30">
                <QRCodeSVG
                  value={`00020101021126580016ID.CO.QRIS.WWW0118936009180000000000520458125303360540${EVENT_CONFIG.nominalPayment}5802ID5925PANITIA MAHAMERU 20266007JAKARTA630489AB`}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="text-center space-y-0.5 w-full border-t border-gold-500/15 pt-2.5 font-mono text-xs">
                <div className="text-gray-400 text-[10px]">Total Pembayaran:</div>
                <div className="text-lg sm:text-xl font-bold text-gold-400">
                  {EVENT_CONFIG.formattedNominal}
                </div>
              </div>
            </div>

            {/* Right Column: Order Info & Proof Upload */}
            <div className="space-y-4 sm:space-y-5">
              <div className="p-3 sm:p-4 rounded-xl bg-gold-500/5 border border-gold-500/20 space-y-1.5 text-[11px] sm:text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nomor Registrasi:</span>
                  <span className="font-mono font-semibold text-gold-300">
                    {activeSubmission.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nama Tamu:</span>
                  <span className="font-semibold text-gray-200 truncate ml-2 max-w-[160px]">
                    {activeSubmission.nama}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Instansi:</span>
                  <span className="text-gray-300 truncate ml-2 max-w-[160px]">
                    {activeSubmission.instansi}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Kategori:</span>
                  <span className="text-gold-300 truncate ml-2 max-w-[160px]">
                    {activeSubmission.kategori}
                  </span>
                </div>
              </div>

              {/* File Upload Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-semibold tracking-wider text-gold-300 uppercase flex items-center gap-1.5">
                  <Upload size={13} className="text-gold-400 shrink-0" />
                  <span>Upload Bukti Pembayaran</span>
                </label>

                <div className="relative border-2 border-dashed border-gold-500/30 hover:border-gold-400 rounded-xl p-3.5 sm:p-4 bg-black/40 text-center transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {proofPreview ? (
                    <div className="flex items-center justify-between text-xs text-gold-300">
                      <span className="flex items-center gap-2 font-medium">
                        <FileCheck size={16} className="text-emerald-400 shrink-0" />
                        <span>Bukti bayar tersimpan!</span>
                      </span>
                      <span className="text-[10px] text-gray-400 underline shrink-0">Ganti File</span>
                    </div>
                  ) : (
                    <div className="space-y-1 py-1">
                      <Upload size={20} className="mx-auto text-gold-400 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium text-gray-300">
                        Klik atau seret bukti transfer
                      </p>
                      <p className="text-[10px] text-gray-500">Format JPG, PNG, atau PDF (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Message & Action Buttons */}
              {activeSubmission.status === "verified" ? (
                <button
                  onClick={() => setScene("ticket")}
                  className="btn-gold-luxury w-full py-3 rounded-xl text-xs uppercase font-semibold flex items-center justify-center gap-2 shadow-gold-glow"
                >
                  <span>Lihat E-Ticket Digital</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] sm:text-xs text-center font-medium">
                    <ShieldCheck size={14} className="shrink-0" />
                    <span>Status terhubung langsung dengan Dashboard Admin.</span>
                  </div>

                  <button
                    onClick={handleSimulateAdminApproval}
                    className="w-full py-2.5 rounded-xl border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-[11px] sm:text-xs font-medium tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ExternalLink size={13} />
                    <span>Simulasi Verifikasi Instant</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </DoubleBezelCard>
      </div>
    </motion.div>
  );
};
