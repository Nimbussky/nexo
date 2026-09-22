"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Composer() {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && !file) return;

    setBusy(true);
    setError("");
    try {
      let mediaUrl = "";
      let type: "text" | "image" | "video" = "text";
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await up.json();
        if (!up.ok) throw new Error(data.error);
        mediaUrl = data.url;
        type = file.type.startsWith("video") ? "video" : "image";
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, mediaUrl, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBody("");
      setFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass-3d-panel rounded-2xl md:rounded-3xl p-5 mb-6 relative overflow-hidden"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-accent to-cyanLight flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-glass-glow">
          ✦
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening in your universe? Share moments, thoughts, media..."
          className="min-h-[95px] w-full resize-none bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-sm md:text-base leading-relaxed"
        />
      </div>

      {file && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-accentLight">
          <span>📎 Attached:</span>
          <span className="font-mono truncate max-w-xs">{file.name}</span>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-xs font-medium text-slate-300 transition-colors">
          <span>📷 Add Media</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-500 font-mono">
            {body.length > 0 && `${body.length} chars`}
          </span>
          <button
            disabled={busy || (!body.trim() && !file)}
            className="glass-button-primary px-5 py-2 rounded-full text-xs md:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none"
          >
            {busy ? "Publishing..." : "Publish ✦"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
          {error}
        </p>
      )}
    </form>
  );
}
