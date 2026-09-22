import "./globals.css";
import type { Metadata } from "next";
import ThreeBackground from "@/components/ThreeBackground";
import CursorSpotlight from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  title: "Nexo — The $10,000 Spatial Social Experience",
  description: "Award-winning 3D spatial social platform engineered with Apple VisionOS glassmorphism, Three.js WebGL physics, and real-time feeds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink relative overflow-x-hidden selection:bg-accent/30 selection:text-white">
        {/* Dynamic 3D Three.js Studio Scene */}
        <ThreeBackground />

        {/* Dynamic Cursor Spotlight Following Mouse Pointer */}
        <CursorSpotlight />
        
        {/* Ambient Refraction Glows */}
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
