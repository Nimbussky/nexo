import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const me = getCurrentUser();
  if (me) redirect("/feed");

  return (
    <main className="min-h-screen flex flex-col justify-between px-6 py-10 max-w-6xl mx-auto relative z-10">
      
      {/* Top Navigation Dock */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-accent to-cyan flex items-center justify-center font-black text-white text-base shadow-glass-glow">
            N
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Nexo
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono tracking-widest text-slate-500">
              v2.0 SPATIAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="glass-button-secondary px-5 py-2 rounded-full text-xs font-semibold text-slate-200"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="glass-button-primary px-5 py-2 rounded-full text-xs font-semibold"
          >
            Initialize Profile
          </Link>
        </div>
      </header>

      {/* Hero Section — Award-Winning Kage / Yukai Inspired */}
      <section className="my-auto py-16 md:py-24 text-center flex flex-col items-center">
        
        {/* Eyebrow Track Indicator */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-pill mb-8 shadow-glass-card">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5a3c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5a3c]"></span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-slate-300">
            KINETIC WEBGL • APPLE VISIONOS GLASS
          </span>
        </div>

        {/* 3D Impact Headline with Tight Kerning */}
        <h1 className="max-w-4xl text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] leading-[1.04] mb-6">
          Connect in{" "}
          <span className="bg-gradient-to-r from-accent via-purple-300 to-cyan bg-clip-text text-transparent">
            Dimension
          </span>
          .<br />
          Share Without Limits.
        </h1>

        {/* Studio Subheading */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300/80 leading-relaxed font-light mb-10">
          The award-winning social experience engineered with Three.js ACES Filmic lighting, real-time spatial physics, and decentralized privacy.
        </p>

        {/* High-Impact Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="glass-button-primary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm md:text-base font-bold shadow-glass-glow flex items-center justify-center gap-2.5"
          >
            <span>Enter the Spatial Network</span>
            <span>→</span>
          </Link>
          <Link
            href="/explore"
            className="glass-button-secondary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm md:text-base font-semibold text-slate-200 flex items-center justify-center gap-2"
          >
            <span>Explore Live Stream</span>
            <span>✦</span>
          </Link>
        </div>

        {/* 4 Interactive Feature Chapters (Adopted from Yukai & Kage) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 w-full text-left">
          
          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden group">
            <div className="text-xs font-mono text-accent mb-2">01 // RENDER ENGINE</div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-accent transition-colors">
              Three.js ACES Filmic
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Directional moonlight key, cold sky fill, and ember bounce lights with live cursor parallax.
            </p>
          </div>

          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden group">
            <div className="text-xs font-mono text-cyan mb-2">02 // OPTICAL GLASS</div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan transition-colors">
              VisionOS Refraction
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Multi-stop blur saturations, hairline specular reflections, and physical ambient drops.
            </p>
          </div>

          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden group">
            <div className="text-xs font-mono text-[#ff5a3c] mb-2">03 // KINETIC FEED</div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#ff5a3c] transition-colors">
              Zero-Lag Streams
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Next.js 14 Server Actions with optimistic state updates and isolated social graph filtering.
            </p>
          </div>

          <div className="glass-3d-card rounded-3xl p-6 relative overflow-hidden group">
            <div className="text-xs font-mono text-emerald-400 mb-2">04 // EDGE AUTH</div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-400 transition-colors">
              Cryptographic HMAC
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Anti-tampering session tokens, resilient serverless storage fallback, and instant global CDN.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Nexo Inc. Crafted with Awwwards-winning 3D spatial standards.</p>
        <div className="flex gap-6 font-mono text-[11px]">
          <Link href="/explore" className="hover:text-slate-300 transition-colors">EXPLORE</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">SIGN IN</Link>
          <Link href="/signup" className="hover:text-slate-300 transition-colors">REGISTER</Link>
        </div>
      </footer>

    </main>
  );
}
