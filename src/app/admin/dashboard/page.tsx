"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Filter,
  Download,
  LogOut,
  Users,
  TrendingUp,
  BarChart3,
  X,
  ExternalLink,
} from "lucide-react";
import { SubmissionData, PaymentStatus } from "@/types/awarding";
import {
  subscribeToAllSubmissions,
  updateLocalSubmissionStatus,
} from "@/lib/firebase";
import { EVENT_CONFIG } from "@/config/eventConfig";

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const map = {
    pending: { label: "Menunggu", color: "bg-amber-500/15 text-amber-300 border-amber-500/30", icon: Clock },
    verified: { label: "Terverifikasi", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", icon: CheckCircle2 },
    rejected: { label: "Ditolak", color: "bg-red-500/15 text-red-300 border-red-500/30", icon: XCircle },
  };
  const { label, color, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${color}`}>
      <Icon size={11} />
      {label}
    </span>
  );
};

// ─── Detail Modal Component ───────────────────────────────────────────────────
const DetailModal: React.FC<{
  submission: SubmissionData;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}> = ({ submission, onClose, onVerify, onReject }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl rounded-[2rem] border border-gold-500/30 bg-gradient-to-b from-[#0F1220] to-[#06070B] shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/15">
        <div>
          <h3 className="font-serif text-xl text-gold-gradient font-light">Detail Pendaftar</h3>
          <p className="text-xs text-gray-400 font-mono">{submission.id}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-5">
        {/* Personal Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["Nama Lengkap", submission.nama],
            ["Email", submission.email],
            ["WhatsApp", submission.whatsapp],
            ["Instansi", submission.instansi],
            ["Kategori", submission.kategori],
            ["Jml. Tamu", String(submission.jumlahTamu)],
            ["Nominal", EVENT_CONFIG.formattedNominal],
            ["Status", "—"],
          ].map(([label, value], i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-mono">{label}</span>
              <p className="font-semibold text-gray-100 truncate">
                {label === "Status" ? <StatusBadge status={submission.status} /> : value}
              </p>
            </div>
          ))}
        </div>

        {/* Proof of Payment Preview */}
        {submission.buktiBayarUrl && (
          <div className="space-y-2">
            <span className="text-xs text-gold-300 font-semibold tracking-wider uppercase flex items-center gap-1.5">
              <Eye size={13} /> Bukti Pembayaran
            </span>
            <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 bg-black/40 max-h-64 flex items-center justify-center">
              {submission.buktiBayarUrl.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={submission.buktiBayarUrl}
                  alt="Bukti Bayar"
                  className="max-h-64 w-auto object-contain"
                />
              ) : (
                <div className="p-4 text-center space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submission.buktiBayarUrl}
                    alt="Bukti Bayar"
                    className="max-h-48 w-auto object-contain mx-auto rounded-xl"
                  />
                  <a
                    href={submission.buktiBayarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gold-400 underline flex items-center gap-1 justify-center"
                  >
                    <ExternalLink size={12} /> Buka di Tab Baru
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {submission.catatan && (
          <div className="p-3 rounded-xl bg-gold-500/5 border border-gold-500/15 text-xs text-gray-300">
            <span className="text-gold-400 font-semibold uppercase text-[10px] tracking-wider">Catatan: </span>
            {submission.catatan}
          </div>
        )}
      </div>

      {/* Modal Actions */}
      {submission.status === "pending" && (
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onReject}
            className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold uppercase flex items-center justify-center gap-2 transition-all"
          >
            <XCircle size={15} /> Tolak
          </button>
          <button
            onClick={onVerify}
            className="flex-2 flex-grow-[2] py-3 rounded-xl bg-gold-gradient hover:opacity-90 text-black text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-gold-glow"
          >
            <CheckCircle2 size={15} /> Verifikasi Pembayaran
          </button>
        </div>
      )}
    </motion.div>
  </motion.div>
);

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin/login");
    }
  }, [router]);

  // Subscribe to real-time data
  useEffect(() => {
    const unsubscribe = subscribeToAllSubmissions((data) => {
      setSubmissions(data);
    });
    return () => unsubscribe();
  }, []);

  const handleVerify = useCallback(
    (id: string) => {
      updateLocalSubmissionStatus(id, "verified", "Admin Mahameru 2026");
      setIsModalOpen(false);
      setSelectedSubmission(null);
    },
    []
  );

  const handleReject = useCallback(
    (id: string) => {
      updateLocalSubmissionStatus(id, "rejected", "Admin Mahameru 2026");
      setIsModalOpen(false);
      setSelectedSubmission(null);
    },
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nama", "Email", "WhatsApp", "Instansi", "Kategori", "Tamu", "Status", "Tanggal"];
    const rows = submissions.map((s) => [
      s.id,
      s.nama,
      s.email,
      s.whatsapp,
      s.instansi,
      s.kategori,
      s.jumlahTamu,
      s.status,
      new Date(s.createdAt).toLocaleDateString("id-ID"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pendaftaran_awarding_2026_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = submissions.filter((s) => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.nama.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.instansi.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    verified: submissions.filter((s) => s.status === "verified").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const statCards = [
    { label: "Total Pendaftar", value: stats.total, icon: Users, color: "text-gold-400", bg: "bg-gold-500/10 border-gold-500/20" },
    { label: "Menunggu Verifikasi", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Terverifikasi", value: stats.verified, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Ditolak", value: stats.rejected, icon: BarChart3, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  ];

  return (
    <div className="min-h-screen w-full relative z-10 px-4 md:px-6 py-8">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={12} className="text-gold-400" />
              <span>Verification Command Center</span>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl text-gold-gradient font-light">
              Admin Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">{EVENT_CONFIG.eventName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>

        {/* ─── Stats Cards Row ───────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`p-4 rounded-2xl border ${bg} flex items-center gap-3`}>
              <Icon size={20} className={color} />
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-mono">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Table Toolbar ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-black/60 border border-gold-500/20 focus:border-gold-400 rounded-xl text-sm text-foreground outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
              <Filter size={13} className="text-gray-400 ml-1.5" />
              {(["all", "pending", "verified", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-all ${
                    filterStatus === s
                      ? "bg-gold-500 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {s === "all" ? "Semua" : s === "pending" ? "Pending" : s === "verified" ? "Verified" : "Tolak"}
                </button>
              ))}
            </div>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs font-medium transition-all"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* ─── Data Table ────────────────────────────────────── */}
        <div className="rounded-[1.5rem] border border-gold-500/20 bg-[#0A0D18]/80 backdrop-blur-sm overflow-hidden shadow-luxury-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-500/15 text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                  <th className="text-left px-4 py-3 pl-6">Nama Tamu</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Instansi</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Tanggal</th>
                  <th className="text-left px-4 py-3 pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-500 text-sm">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((submission, i) => (
                    <motion.tr
                      key={submission.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-white/5 hover:bg-gold-500/5 transition-all cursor-pointer group"
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3.5 pl-6">
                        <div>
                          <p className="font-semibold text-gray-100 text-xs leading-tight">{submission.nama}</p>
                          <p className="text-gray-500 text-[11px] font-mono">{submission.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-gray-300">{submission.instansi}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-gold-300/80">{submission.kategori}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={submission.status} />
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(submission.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 pr-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubmission(submission);
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-xl border border-gold-500/20 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 transition-all"
                          >
                            <Eye size={13} />
                          </button>
                          {submission.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerify(submission.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-semibold transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} />
                              <span className="hidden sm:inline">Verifikasi</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-500 font-mono">
          Real-time sync aktif via BroadcastChannel API • {filtered.length} dari {submissions.length} pendaftar ditampilkan
        </p>
      </div>

      {/* ─── Detail Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && selectedSubmission && (
          <DetailModal
            submission={selectedSubmission}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedSubmission(null);
            }}
            onVerify={() => handleVerify(selectedSubmission.id)}
            onReject={() => handleReject(selectedSubmission.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
