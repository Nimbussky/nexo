import "./globals.css";
import type { Metadata } from "next";
import ThreeBackground from "@/components/ThreeBackground";
import CursorSpotlight from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  title: "Nexo — Spatial Social Platform",
  description: "A premium social network built for connection, not noise. Real profiles, real posts, cinematic interface.",
  openGraph: {
    title: "Nexo — Spatial Social Platform",
    description: "Connect without the noise. Text, photo, and video in a refined spatial experience.",
    type: "website",
  },
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
