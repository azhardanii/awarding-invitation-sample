import type { Metadata } from "next";
import "./globals.css";
import { GoldParticlesCanvas } from "@/components/ui/GoldParticlesCanvas";
import { AmbientAudioToggle } from "@/components/ui/AmbientAudioToggle";
import { EVENT_CONFIG } from "@/config/eventConfig";

export const metadata: Metadata = {
  title: `${EVENT_CONFIG.eventName} — Undangan Digital Awarding`,
  description: EVENT_CONFIG.subTitle,
  keywords: ["Undangan Digital", "Awarding Night", "QRIS Payment", "E-Ticket", "VIP Pass"],
  authors: [{ name: "Sekolah WFA" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#06070B] text-[#F5F1E8] antialiased selection:bg-gold-500 selection:text-black">
        {/* Background Gold Dust Ambient Particles */}
        <GoldParticlesCanvas />

        {/* Floating Ambient Audio Synth Control */}
        <AmbientAudioToggle />

        {/* Main Content Viewport */}
        <main className="relative z-10 min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
