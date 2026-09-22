"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostType } from "@/lib/types";

export default function Composer() {
  const [activeTab, setActiveTab] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && !file && !videoUrl.trim() && !title.trim()) return;

    setBusy(true);
    setError("");
    try {
      let mediaUrl = videoUrl.trim();
      let type: PostType = activeTab;

      // Handle File upload if attached
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await up.json();
        if (!up.ok) throw new Error(data.error);
        mediaUrl = data.url;
        type = file.type.startsWith("video") ? "video" : "image";
      }

      const payload = {
        title: activeTab === "blog" ? title.trim() : undefined,
        body: body.trim(),
        mediaUrl,
        type,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Reset
      setTitle("");
      setBody("");
      setVideoUrl("");
      setFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Could not publish post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass-3d-panel rounded-2xl md:rounded-3xl p-5 mb-6 relative overflow-hidden"
    >
      {/* Post Type Selector Tabs */}
      <div className="flex items-center gap-1.5 mb-4 p-1 rounded-xl bg-white/[0.04] border border-white/5 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
            activeTab === "text"
              ? "bg-white/15 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ✦ Quick Thought
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blog")}
          className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
            activeTab === "blog"
              ? "bg-accent/30 text-accentLight border border-accent/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          📰 Blog Article
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
            activeTab === "video"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🎬 Video / YouTube
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("image")}
          className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
            activeTab === "image"
              ? "bg-cyan/20 text-cyan border border-cyan/30 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          📸 Photo
        </button>
      </div>

      {/* Blog Post Title Input */}
      {activeTab === "blog" && (
        <div className="mb-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article Title (e.g. The Future of AI Agents in 2026)"
            className="w-full text-base md:text-lg font-bold bg-transparent outline-none text-white placeholder:text-slate-500 border-b border-white/10 pb-2"
          />
        </div>
      )}

      {/* Video / YouTube Link Input */}
      {activeTab === "video" && (
        <div className="mb-3">
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste YouTube or video link (e.g. https://www.youtube.com/watch?v=...)"
            className="glass-input w-full rounded-xl px-3.5 py-2 text-xs md:text-sm text-white placeholder:text-slate-500 outline-none"
          />
        </div>
      )}

      {/* Main Body Textarea */}
      <div className="flex items-start gap-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            activeTab === "blog"
              ? "Write your full blog article content here..."
              : activeTab === "video"
              ? "Add a caption or summary for this video..."
              : "What's happening in your universe? Share moments, thoughts, media..."
          }
          className={`w-full resize-none bg-transparent outline-none text-slate-100 placeholder:text-slate-500 text-sm md:text-base leading-relaxed ${
            activeTab === "blog" ? "min-h-[140px]" : "min-h-[90px]"
          }`}
        />
      </div>

      {/* File Attachment Pill */}
      {file && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs text-accentLight">
          <span>📎 Attached File:</span>
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

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer text-xs font-medium text-slate-300 transition-colors">
          <span>📁 Upload File (MP4/PNG/JPG)</span>
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
            disabled={busy || (!body.trim() && !file && !videoUrl.trim() && !title.trim())}
            className="glass-button-primary px-5 py-2 rounded-full text-xs md:text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none"
          >
            {busy ? "Publishing..." : activeTab === "blog" ? "Publish Article ✦" : "Share Post ✦"}
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
