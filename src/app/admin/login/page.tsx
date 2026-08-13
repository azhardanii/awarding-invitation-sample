"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/config/eventConfig";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mahameru.id");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      if (email && password) {
        // Save session flag for demo authentication
        localStorage.setItem("admin_session", "authenticated");
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Email dan password harus diisi");
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 relative z-10">
      <div className="max-w-md w-full">
        {/* Admin Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-gold-400" />
            <span>Verification Command Center</span>
          </div>
          <h1 className="font-serif text-3xl text-gold-gradient font-light">
            Login Admin Verification
          </h1>
          <p className="text-xs text-gray-400">
            {EVENT_CONFIG.organizer}
          </p>
        </div>

        {/* Double Bezel Card Container */}
        <DoubleBezelCard innerClassName="p-6 md:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Mail size={13} className="text-gold-400" />
                Email Administrator
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.id"
                required
                className="w-full bg-black/60 border border-gold-500/20 focus:border-gold-400 rounded-xl px-4 py-3 text-sm text-foreground outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                <Lock size={13} className="text-gold-400" />
                Password Access
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-black/60 border border-gold-500/20 focus:border-gold-400 rounded-xl px-4 py-3 text-sm text-foreground outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold-luxury w-full py-3.5 rounded-xl text-xs uppercase font-semibold flex items-center justify-center gap-2 mt-2 shadow-gold-glow cursor-pointer"
            >
              <span>{isLoading ? "Authenticating..." : "Masuk ke Dashboard Admin"}</span>
              <ArrowRight size={15} />
            </button>

            {/* Quick Demo Bypass */}
            <div className="pt-3 border-t border-gold-500/15 text-center">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("admin_session", "authenticated");
                  router.push("/admin/dashboard");
                }}
                className="text-[11px] text-gold-400/80 hover:text-gold-300 underline font-mono flex items-center justify-center gap-1 mx-auto"
              >
                <Sparkles size={12} />
                <span>Masuk Demo Admin (Bypass Login)</span>
              </button>
            </div>
          </form>
        </DoubleBezelCard>
      </div>
    </div>
  );
}
