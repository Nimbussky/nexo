import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Home() {
  const me = getCurrentUser();
  if (me) redirect("/feed");

  return (
    <main className="min-h-screen flex flex-col justify-between px-6 py-10 max-w-5xl mx-auto relative z-10">
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent to-cyan flex items-center justify-center font-bold text-white text-sm shadow-glass-glow">
            N
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Nexo
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="glass-button-secondary px-4 py-2 rounded-full text-xs font-medium text-slate-200"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="glass-button-primary px-4 py-2 rounded-full text-xs font-semibold"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="my-auto py-16 md:py-24 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5a3c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff5a3c]"></span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400">
            Spatial Social
          </span>
        </div>

        <h1 className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] mb-5 text-white">
          Connect without<br className="hidden sm:block" />
          the noise.
        </h1>

        <p className="max-w-md text-sm sm:text-base text-slate-400 leading-relaxed mb-9">
          Real profiles. Real posts. Text, photo, and video in a clean interface that stays out of the way.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/signup"
            className="glass-button-primary w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            Create your profile
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/explore"
            className="glass-button-secondary w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-medium text-slate-200 flex items-center justify-center"
          >
            Explore the feed
          </Link>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-16 w-full text-left">
          <div className="glass-3d-card rounded-2xl p-5">
            <div className="text-[10px] font-mono tracking-widest text-accent mb-2">01</div>
            <h3 className="text-sm font-semibold text-white mb-1">Profiles that matter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Username, bio, avatar. Follow people you actually care about.
            </p>
          </div>
          <div className="glass-3d-card rounded-2xl p-5">
            <div className="text-[10px] font-mono tracking-widest text-cyan mb-2">02</div>
            <h3 className="text-sm font-semibold text-white mb-1">Text · Photo · Video</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Post what you want. The feed stays clean and chronological.
            </p>
          </div>
          <div className="glass-3d-card rounded-2xl p-5">
            <div className="text-[10px] font-mono tracking-widest text-[#ff5a3c] mb-2">03</div>
            <h3 className="text-sm font-semibold text-white mb-1">Built for presence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dark glass interface, smooth motion, zero algorithm noise.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 Nexo</p>
        <div className="flex gap-5">
          <Link href="/explore" className="hover:text-slate-300 transition-colors">Explore</Link>
          <Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
          <Link href="/signup" className="hover:text-slate-300 transition-colors">Register</Link>
        </div>
      </footer>

    </main>
  );
}
