"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setMe(d.user));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setUsers(d.users || []));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <Nav username={me?.username} />
      <main className="mx-auto max-w-2xl px-4 pb-16">
        
        {/* Apple 3D Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search creators, keywords, or topics across the spatial graph..."
            className="glass-input w-full rounded-2xl pl-11 pr-5 py-3.5 outline-none text-sm text-white placeholder:text-slate-500 shadow-glass-card"
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          {users.length === 0 && q && (
            <p className="glass-3d-card rounded-2xl p-6 text-center text-sm text-mute">
              No matching profiles found for &ldquo;{q}&rdquo;.
            </p>
          )}

          {users.map((u) => (
            <Link
              key={u.id}
              href={`/profile/${u.username}`}
              className="glass-3d-card block rounded-2xl p-4 md:p-5 hover:border-accentLight transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-accent/30 to-cyanLight/20 border border-white/20 flex items-center justify-center font-bold text-slate-100 text-sm shadow-glass-card">
                  {(u.displayName || u.username || "?").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white tracking-tight text-sm md:text-base flex items-center gap-1.5">
                    {u.displayName}
                    <span className="text-xs text-accent">✓</span>
                  </p>
                  <p className="text-xs text-mute font-mono">@{u.username}</p>
                </div>
              </div>
              {u.bio && (
                <p className="mt-3 text-xs md:text-sm text-slate-300 pl-14 leading-relaxed">
                  {u.bio}
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
