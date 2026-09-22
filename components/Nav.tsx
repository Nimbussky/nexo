"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav({ username }: { username?: string }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const navLinks = [
    { label: "Feed", href: "/feed", icon: "✦" },
    { label: "Explore", href: "/explore", icon: "⌕" },
    { label: "Search", href: "/search", icon: "🔍" },
  ];

  return (
    <header className="sticky top-4 z-30 mx-auto max-w-4xl px-4 mb-6">
      <div className="glass-3d-panel rounded-2xl md:rounded-full px-5 py-3 flex items-center justify-between border border-white/10 shadow-glass-3d">
        
        {/* Brand with 3D gradient */}
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-accent to-cyanLight flex items-center justify-center font-bold text-white shadow-glass-glow group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Nexo
          </span>
        </Link>

        {/* Apple-style Floating Nav Items */}
        <nav className="flex items-center gap-1 md:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/15"
                    : "text-mute hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#8b5cf6]" />
                )}
              </Link>
            );
          })}

          {username && (
            <Link
              href={`/profile/${username}`}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs md:text-sm text-slate-200 transition-colors ml-1"
            >
              <div className="w-5 h-5 rounded-full bg-accent/30 border border-accent/60 flex items-center justify-center text-[10px] font-bold text-accentLight">
                {username.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-medium">@{username}</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="ml-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 transition-all"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
