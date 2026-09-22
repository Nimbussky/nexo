"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      return setError("Please fill in both email and password.");
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      window.location.href = "/feed";
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("aakash@nexo.com");
    setPassword("password123");
    setError("");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12 relative z-10">
      
      {/* 3D Glass Authentication Container */}
      <div className="glass-3d-panel rounded-3xl p-8 md:p-10 border border-white/10 shadow-glass-3d relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-accent to-cyanLight flex items-center justify-center font-black text-white text-2xl shadow-glass-glow">
            N
          </div>
        </div>

        <h1 className="mb-2 text-2xl md:text-3xl font-bold text-center tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mb-8 text-center text-xs md:text-sm text-slate-400">
          Enter your credentials to access the spatial feed
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              className="glass-input w-full rounded-2xl px-4 py-3 outline-none text-sm text-white placeholder:text-slate-500"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1">
              PASSWORD
            </label>
            <input
              type="password"
              required
              className="glass-input w-full rounded-2xl px-4 py-3 outline-none text-sm text-white placeholder:text-slate-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="glass-button-primary w-full py-3.5 rounded-full font-bold text-sm tracking-wide transition disabled:opacity-50 mt-2 shadow-glass-glow"
          >
            {loading ? "Decrypting Session..." : "Sign In to Nexo"}
          </button>
        </form>

        <button
          type="button"
          onClick={fillDemo}
          className="mt-4 w-full rounded-full glass-pill py-2.5 text-xs text-accentLight hover:text-white transition font-medium hover:bg-white/10"
        >
          ⚡ Autofill Verified Demo (aakash@nexo.com)
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-accentLight hover:text-white font-semibold underline underline-offset-4 ml-1">
            Create account
          </Link>
        </p>
      </div>

    </main>
  );
}
