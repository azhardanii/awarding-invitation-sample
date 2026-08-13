import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard — Awarding Verification Portal",
  description: "Protected Admin Panel for Verification of QRIS Payment",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      {/* Admin Nav Pill */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2 rounded-full border border-gold-500/30 bg-black/70 backdrop-blur-xl shadow-gold-glow">
        <ShieldCheck size={14} className="text-gold-400" />
        <span className="text-xs font-semibold text-gold-300 tracking-widest uppercase">
          Admin Portal — Verification Mode
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {children}

      {/* Back to Invitation Link */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/20 bg-black/60 backdrop-blur-md text-[10px] text-gray-400 hover:text-gold-300 hover:border-gold-500/40 transition-all"
        >
          ← Kembali ke Undangan Publik
        </Link>
      </div>
    </div>
  );
}
