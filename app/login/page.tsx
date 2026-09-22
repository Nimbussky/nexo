"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      // Force full document navigation to guarantee the session cookie is dispatched
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
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-2 text-3xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-mute">Sign in to your Nexo account</p>

      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-white/30"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none focus:border-white/30"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl p-3">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-full bg-accent py-3 font-medium transition opacity-100 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <button
        type="button"
        onClick={fillDemo}
        className="mt-3 w-full rounded-full border border-line py-2.5 text-xs text-mute hover:text-white transition"
      >
        Click to fill Demo Account (aakash@nexo.com)
      </button>

      <p className="mt-4 text-center text-sm text-mute">
        New here? <Link href="/signup" className="text-white underline">Create account</Link>
      </p>
    </main>
  );
}
