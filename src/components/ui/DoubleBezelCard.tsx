import React from "react";
import { clsx } from "clsx";

interface DoubleBezelCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export const DoubleBezelCard: React.FC<DoubleBezelCardProps> = ({
  children,
  className = "",
  innerClassName = "",
}) => {
  return (
    <div
      className={clsx(
        "double-bezel-outer p-2 md:p-3 rounded-[2rem] relative overflow-hidden transition-all duration-500",
        className
      )}
    >
      {/* Decorative Gold Ambient Glow Orb in background */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Inner Core Enclosure */}
      <div
        className={clsx(
          "double-bezel-inner rounded-[calc(2rem-0.6rem)] p-6 md:p-8 relative z-10 text-foreground",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
