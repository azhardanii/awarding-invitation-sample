"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { useAwardingStore } from "@/store/useAwardingStore";
import { ScenePreloader } from "@/components/scenes/ScenePreloader";
import { SceneCinematicIntro } from "@/components/scenes/SceneCinematicIntro";
import { SceneCover } from "@/components/scenes/SceneCover";
import { SceneFormRegistration } from "@/components/scenes/SceneFormRegistration";
import { SceneETicket } from "@/components/scenes/SceneETicket";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Page() {
  const { currentScene } = useAwardingStore();

  const renderScene = () => {
    switch (currentScene) {
      case "preloader":
        return <ScenePreloader key="scene-preloader" />;
      case "cinematic":
        return <SceneCinematicIntro key="scene-cinematic" />;
      case "cover":
        return <SceneCover key="scene-cover" />;
      case "form":
        return <SceneFormRegistration key="scene-form" />;
      case "ticket":
        return <SceneETicket key="scene-ticket" />;
      default:
        return <SceneCinematicIntro key="scene-default" />;
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between">
      <AnimatePresence mode="wait">{renderScene()}</AnimatePresence>

      {/* Floating Admin Portal Link */}
      <div className="fixed bottom-4 left-4 z-40">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/20 bg-black/60 backdrop-blur-md text-[10px] text-gray-400 hover:text-gold-300 hover:border-gold-500/40 transition-all"
        >
          <ShieldCheck size={12} className="text-gold-400" />
          <span>Portal Admin</span>
        </Link>
      </div>
    </div>
  );
}
