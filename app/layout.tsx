import "./globals.css";
import type { Metadata } from "next";
import ThreeBackground from "@/components/ThreeBackground";

export const metadata: Metadata = {
  title: "Nexo — The 3D Spatial Social Network",
  description: "Apple-grade spatial social experience with real-time feeds, rich media, and 3D fluid glass aesthetics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink relative overflow-x-hidden selection:bg-accent/30 selection:text-white">
        {/* Dynamic 3D Three.js Spatial Layer */}
        <ThreeBackground />
        
        {/* Ambient Ethereal Glow Orbs */}
        <div className="ambient-glow-1" aria-hidden="true" />
        <div className="ambient-glow-2" aria-hidden="true" />

        {/* Foreground Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
