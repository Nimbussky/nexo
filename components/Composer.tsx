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
    <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share a thought, a photo, or a video..."
        className="min-h-[90px] w-full resize-none bg-transparent outline-none"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-xs text-mute"
        />
        <button
          disabled={busy}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Posting..." : "Share"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
