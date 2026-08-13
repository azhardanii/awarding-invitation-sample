"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
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
  UserCheck,
  UserX,
  X,
  ScanLine,
  ListOrdered,
  Activity,
} from "lucide-react";
import { SubmissionData, AttendanceStatus } from "@/types/awarding";
import {
  subscribeToAllSubmissions,
  updateAttendanceStatus,
  getSubmissionByTicketCode,
} from "@/lib/firebase";
import { EVENT_CONFIG } from "@/config/eventConfig";

// ─── Status Badge Component ───────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
  if (status === "attended") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold">
        <CheckCircle2 size={11} />
        Sudah Hadir
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-300 text-[11px] font-semibold">
      <Clock size={11} />
      Belum Hadir
    </span>
  );
};

// ─── Detail Modal Component ───────────────────────────────────────────────────
const DetailModal: React.FC<{
  submission: SubmissionData;
  onClose: () => void;
  onMarkAttend: () => void;
}> = ({ submission, onClose, onMarkAttend }) => (
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/15">
        <div>
          <h3 className="font-serif text-xl text-gold-gradient font-light">Detail Tamu</h3>
          <p className="text-xs text-gray-400 font-mono">{submission.ticketCode}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            ["Nama Lengkap", submission.nama],
            ["Instansi", submission.instansi],
            ["Email", submission.email],
            ["WhatsApp", submission.whatsapp],
            ["Kategori", submission.kategori],
            ["Jml. Tamu", String(submission.jumlahTamu)],
            ["Zona Kursi", submission.seatZone],
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

        {submission.catatan && (
          <div className="p-3 rounded-xl bg-gold-500/5 border border-gold-500/15 text-xs text-gray-300">
            <span className="text-gold-400 font-semibold uppercase text-[10px] tracking-wider">Catatan: </span>
            {submission.catatan}
          </div>
        )}
      </div>

      {submission.status === "registered" && (
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onMarkAttend}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <CheckCircle2 size={15} /> Check-In Tamu Manual
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
  const [activeTab, setActiveTab] = useState<"list" | "scan" | "summary">("list");
  
  // List Tab States
  const [filterStatus, setFilterStatus] = useState<"all" | AttendanceStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scanner States
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<{ type: "success" | "error" | "warning"; message: string; guest?: SubmissionData } | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = subscribeToAllSubmissions((data) => {
      setSubmissions(data);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin/login");
  };

  const handleMarkAttend = useCallback((id: string) => {
    updateAttendanceStatus(id, "attended");
    setIsModalOpen(false);
    setSelectedSubmission(null);
  }, []);

  const handleExportCSV = () => {
    const headers = ["ID", "Nama", "Email", "WhatsApp", "Instansi", "Kategori", "Tamu", "Status", "Waktu Hadir"];
    const rows = submissions.map((s) => [
      s.ticketCode,
      s.nama,
      s.email,
      s.whatsapp,
      s.instansi,
      s.kategori,
      s.jumlahTamu,
      s.status === "attended" ? "Sudah Hadir" : "Belum Hadir",
      s.attendedAt ? new Date(s.attendedAt).toLocaleString("id-ID") : "-",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kehadiran_awarding_2026_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // QR Scanner Initialization
  useEffect(() => {
    if (activeTab === "scan") {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Pause scanning on successful read
          scannerRef.current?.pause();
          
          const guest = getSubmissionByTicketCode(decodedText);
          if (!guest) {
            setScanResult({ type: "error", message: `Tiket tidak ditemukan (${decodedText}). Pastikan kode valid.` });
            setTimeout(() => scannerRef.current?.resume(), 3000);
            return;
          }

          if (guest.status === "attended") {
            setScanResult({ type: "warning", message: `Tamu sudah melakukan Check-in sebelumnya.`, guest });
            setTimeout(() => scannerRef.current?.resume(), 3000);
            return;
          }

          // Mark as attended
          updateAttendanceStatus(guest.id, "attended");
          setScanResult({ type: "success", message: "Check-in Berhasil!", guest });
          setTimeout(() => scannerRef.current?.resume(), 3000);
        },
        (error) => {
          // Ignore frequent scan errors
        }
      );
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setScanResult(null);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [activeTab]);


  // Computed Data
  const filtered = submissions.filter((s) => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.nama.toLowerCase().includes(q) ||
      s.ticketCode.toLowerCase().includes(q) ||
      s.instansi.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: submissions.length,
    attended: submissions.filter((s) => s.status === "attended").length,
    registered: submissions.filter((s) => s.status === "registered").length,
  };
  const attendanceRate = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen w-full relative z-10 px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck size={12} className="text-gold-400" />
              <span>Admin Center</span>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl text-gold-gradient font-light">
              Manajemen Kehadiran Tamu
            </h1>
            <p className="text-xs text-gray-400 mt-1">{EVENT_CONFIG.eventName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium transition-all"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-black/40 border border-gold-500/20 max-w-fit">
          {[
            { id: "list", label: "Daftar Tamu", icon: ListOrdered },
            { id: "scan", label: "Scan QR Check-In", icon: ScanLine },
            { id: "summary", label: "Ringkasan Kehadiran", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-gold-500 text-black shadow-lg"
                  : "text-gray-400 hover:text-gold-300 hover:bg-white/5"
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Daftar Tamu */}
        {activeTab === "list" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, tiket, instansi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/60 border border-gold-500/20 focus:border-gold-400 rounded-xl text-sm text-foreground outline-none placeholder:text-gray-500"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5">
                  <Filter size={13} className="text-gray-400 ml-1.5" />
                  {(["all", "registered", "attended"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-all ${
                        filterStatus === s ? "bg-gold-500 text-black" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {s === "all" ? "Semua" : s === "attended" ? "Hadir" : "Belum"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs font-medium transition-all"
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-gold-500/20 bg-[#0A0D18]/80 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-500/15 text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                      <th className="text-left px-4 py-3 pl-6">Kode Tiket & Nama</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Instansi</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Kategori</th>
                      <th className="text-left px-4 py-3 pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-gray-500 text-sm">Tidak ada data.</td>
                      </tr>
                    ) : (
                      filtered.map((sub, i) => (
                        <tr
                          key={sub.id}
                          className="border-b border-white/5 hover:bg-gold-500/5 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setIsModalOpen(true);
                          }}
                        >
                          <td className="px-4 py-3.5 pl-6">
                            <div>
                              <p className="font-semibold text-gray-100 text-xs">{sub.nama}</p>
                              <p className="text-gold-400 text-[10px] font-mono">{sub.ticketCode}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell text-xs text-gray-300">{sub.instansi}</td>
                          <td className="px-4 py-3.5"><StatusBadge status={sub.status} /></td>
                          <td className="px-4 py-3.5 hidden sm:table-cell text-[11px] text-gray-400">{sub.kategori}</td>
                          <td className="px-4 py-3.5 pr-6">
                            <button className="p-2 rounded-xl bg-gold-500/10 text-gold-300"><Eye size={13} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content: Scanner */}
        {activeTab === "scan" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 rounded-[2rem] border border-gold-500/30 bg-[#0A0D18] p-4 sm:p-6 text-center">
              <h3 className="text-lg font-serif text-gold-300 mb-4">Arahkan QR Code Tiket Tamu</h3>
              <div className="mx-auto max-w-sm rounded-2xl overflow-hidden border-2 border-gold-500/40 bg-black aspect-square">
                <div id="qr-reader" className="w-full h-full"></div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Scanner akan secara otomatis mendeteksi dan melakukan verifikasi check-in.</p>
            </div>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {scanResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`rounded-[2rem] border p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px] ${
                      scanResult.type === "success" ? "bg-emerald-500/10 border-emerald-500/40" :
                      scanResult.type === "warning" ? "bg-amber-500/10 border-amber-500/40" :
                      "bg-red-500/10 border-red-500/40"
                    }`}
                  >
                    {scanResult.type === "success" && <CheckCircle2 size={64} className="text-emerald-400 mb-4" />}
                    {scanResult.type === "warning" && <Clock size={64} className="text-amber-400 mb-4" />}
                    {scanResult.type === "error" && <XCircle size={64} className="text-red-400 mb-4" />}
                    
                    <h2 className={`text-xl font-bold mb-2 ${scanResult.type === "success" ? "text-emerald-300" : scanResult.type === "warning" ? "text-amber-300" : "text-red-300"}`}>
                      {scanResult.message}
                    </h2>
                    
                    {scanResult.guest && (
                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 w-full text-left space-y-1">
                        <p className="text-[10px] text-gray-400 font-mono">TIKET: {scanResult.guest.ticketCode}</p>
                        <p className="font-semibold text-white text-lg">{scanResult.guest.nama}</p>
                        <p className="text-xs text-gold-300">{scanResult.guest.instansi}</p>
                        <p className="text-[11px] text-gray-400 mt-2">Zona: <span className="text-white">{scanResult.guest.seatZone}</span></p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-[2rem] border border-white/10 bg-black/40 p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px] text-gray-500"
                  >
                    <ScanLine size={48} className="mb-4 opacity-50" />
                    <p>Menunggu pemindaian...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Tab Content: Summary */}
        {activeTab === "summary" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl border bg-white/5 border-white/10 text-center">
                <Users size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Tamu</p>
              </div>
              <div className="p-6 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-center">
                <UserCheck size={24} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-3xl font-bold text-emerald-300">{stats.attended}</p>
                <p className="text-xs text-emerald-400/80 uppercase tracking-wider mt-1">Sudah Hadir</p>
              </div>
              <div className="p-6 rounded-2xl border bg-amber-500/10 border-amber-500/20 text-center">
                <UserX size={24} className="mx-auto text-amber-400 mb-2" />
                <p className="text-3xl font-bold text-amber-300">{stats.registered}</p>
                <p className="text-xs text-amber-400/80 uppercase tracking-wider mt-1">Belum Hadir</p>
              </div>
              <div className="p-6 rounded-2xl border bg-gold-500/10 border-gold-500/20 text-center">
                <Activity size={24} className="mx-auto text-gold-400 mb-2" />
                <p className="text-3xl font-bold text-gold-300">{attendanceRate}%</p>
                <p className="text-xs text-gold-400/80 uppercase tracking-wider mt-1">Tingkat Kehadiran</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedSubmission && (
          <DetailModal
            submission={selectedSubmission}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedSubmission(null);
            }}
            onMarkAttend={() => handleMarkAttend(selectedSubmission.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
