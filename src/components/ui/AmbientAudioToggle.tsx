"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Music2, SkipForward } from "lucide-react";
import { useAwardingStore } from "@/store/useAwardingStore";
import { getAudioManager } from "@/lib/audioManager";

export const AmbientAudioToggle: React.FC = () => {
  const { soundEnabled, toggleSound, musicStarted } = useAwardingStore();
  const [showTrackLabel, setShowTrackLabel] = useState(false);

  // Keep AudioManager state in sync with store on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const am = getAudioManager();
    // If music was started but we navigate away and back, re-sync
    if (musicStarted && soundEnabled && !am.isPlaying) {
      am.play();
    }
  }, [musicStarted, soundEnabled]);

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    getAudioManager().nextTrack();
    setShowTrackLabel(true);
    setTimeout(() => setShowTrackLabel(false), 2000);
  };

  // Only show the button if music has been started (after user clicked "Buka Undangan")
  if (!musicStarted) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      {/* Track Label Flash */}
      {showTrackLabel && (
        <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-gold-500/20 text-[10px] text-gold-300 font-mono tracking-wider animate-pulse">
          ♪ Next Jazz Track
        </div>
      )}

      {/* Skip Track Button */}
      {soundEnabled && (
        <button
          onClick={handleNextTrack}
          title="Ganti Track Jazz"
          className="flex items-center justify-center w-8 h-8 rounded-full border border-gold-500/20 bg-black/50 backdrop-blur-xl text-gold-400/70 hover:text-gold-300 hover:border-gold-400/40 transition-all duration-300 hover:scale-110"
          aria-label="Next Jazz Track"
        >
          <SkipForward size={13} />
        </button>
      )}

      {/* Main Play/Pause Toggle */}
      <button
        onClick={toggleSound}
        className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold-500/30 bg-black/50 backdrop-blur-xl text-xs font-medium text-gold-300 hover:border-gold-400 hover:bg-black/70 transition-all duration-300 group shadow-lg"
        aria-label="Toggle Jazz Music"
      >
        {/* Waveform animation when playing */}
        <div className="w-5 h-5 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform relative">
          {soundEnabled ? (
            <Volume2 size={13} />
          ) : (
            <VolumeX size={13} className="text-gray-400" />
          )}
        </div>

        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="tracking-wider uppercase font-semibold text-[10px]">
            {soundEnabled ? "Jazz — On" : "Musik Off"}
          </span>
          {soundEnabled && (
            <span className="text-[9px] text-gold-400/60 font-mono tracking-widest">
              Bensound Jazz
            </span>
          )}
        </div>

        {/* Live indicator dot */}
        {soundEnabled && (
          <span className="flex h-2 w-2 relative ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
          </span>
        )}

        {!soundEnabled && (
          <Music2 size={12} className="text-gray-500 ml-0.5" />
        )}
      </button>
    </div>
  );
};
