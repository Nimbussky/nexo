import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const me = getCurrentUser();
  if (me) redirect("/feed");

  return (
    <main className="min-h-screen flex flex-col justify-between px-6 py-12 max-w-6xl mx-auto relative z-10">
      
      {/* Top Navigation Pill */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-accent to-cyanLight flex items-center justify-center font-black text-white text-lg shadow-glass-glow">
            N
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Nexo
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="glass-button-secondary px-5 py-2 rounded-full text-xs md:text-sm font-semibold text-slate-200"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="glass-button-primary px-5 py-2 rounded-full text-xs md:text-sm font-semibold"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="my-auto py-16 md:py-24 text-center flex flex-col items-center">
        {/* Floating VisionOS Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill mb-8 shadow-glass-card">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanLight opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-slate-300">
            NEXO v2.0 • SPATIAL SOCIAL REALITY
          </span>
        </div>

        {/* 3D Impact Headline */}
        <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.08] mb-6">
          Connect in{" "}
          <span className="bg-gradient-to-r from-accent via-purple-300 to-cyanLight bg-clip-text text-transparent">
            Dimension
          </span>
          .<br />
          Share Without Limits.
        </h1>

        {/* Vision Statement */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed font-normal mb-10">
          The next-generation social layer engineered with Apple VisionOS 3D glass aesthetics, real-time kinetic feeds, and zero algorithmic clutter.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="glass-button-primary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm md:text-base font-bold shadow-glass-glow flex items-center justify-center gap-2"
          >
            <span>Enter the Nexus</span>
            <span>→</span>
          </Link>
          <Link
            href="/explore"
            className="glass-button-secondary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm md:text-base font-semibold text-slate-200 flex items-center justify-center gap-2"
          >
            <span>Explore Spatial Feed</span>
            <span>✦</span>
          </Link>
        </div>

        {/* Floating 3D Telemetry Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
          
          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="text-base font-bold text-white mb-1">Apple 3D Liquid Glass</h3>
            <p className="text-xs text-mute leading-relaxed">
              Multi-layered specular highlights, dynamic refraction, and deep obsidian depth physics.
            </p>
          </div>

          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-base font-bold text-white mb-1">Interactive Three.js Core</h3>
            <p className="text-xs text-mute leading-relaxed">
              Living WebGL constellation responding dynamically to your cursor coordinates in real-time.
            </p>
          </div>

          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="text-base font-bold text-white mb-1">Zero-Tamper Authenticity</h3>
            <p className="text-xs text-mute leading-relaxed">
              Cryptographic HMAC session cookies, verified social graph isolation, and serverless edge delivery.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Nexo Inc. Crafted with Apple-level 3D spatial standards.</p>
        <div className="flex gap-6">
          <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
          <Link href="/signup" className="hover:text-slate-300 transition-colors">Register</Link>
        </div>
      </footer>

    </main>
  );
}
