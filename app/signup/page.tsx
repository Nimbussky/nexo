"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", displayName: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      window.location.href = "/feed";
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-semibold">Join Nexo</h1>
      <form onSubmit={submit} className="space-y-3">
        {["email", "username", "displayName", "password"].map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : key === "email" ? "email" : "text"}
            placeholder={key === "displayName" ? "Display name" : key[0].toUpperCase() + key.slice(1)}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none"
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        ))}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full rounded-full bg-accent py-3 font-medium">Create account</button>
      </form>
      <p className="mt-4 text-sm text-mute">
        Already have an account? <Link href="/login" className="text-white">Log in</Link>
      </p>
    </main>
  );
}
