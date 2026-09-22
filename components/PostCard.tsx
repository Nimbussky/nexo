"use client";

import { useState } from "react";
import Link from "next/link";
import { Post, Comment } from "@/lib/types";

export default function PostCard({ post, currentUserId }: { post: Post; currentUserId?: string }) {
  const [likes, setLikes] = useState<string[]>(post.likes || []);
  const [isLiked, setIsLiked] = useState<boolean>(currentUserId ? (post.likes || []).includes(currentUserId) : false);
  const [likeCount, setLikeCount] = useState<number>((post.likes || []).length);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [sharesCount, setSharesCount] = useState<number>(post.sharesCount || 0);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const initial = (post.author?.displayName || post.author?.username || "?").slice(0, 1).toUpperCase();
  const isYouTube = post.mediaUrl && (post.mediaUrl.includes("youtube.com/embed") || post.mediaUrl.includes("youtu.be"));

  // 1. Toggle Like
  async function handleLike() {
    // Optimistic UI update
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(data.liked);
        setLikeCount(data.likesCount);
      }
    } catch {
      // Revert on failure
      setIsLiked(!nextLiked);
      setLikeCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    }
  }

  // 2. Add Comment
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments([...comments, data.comment]);
        setCommentText("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  }

  // 3. Share Handler
  async function recordShare() {
    setSharesCount((prev) => prev + 1);
    try {
      await fetch(`/api/posts/${post.id}/share`, { method: "POST" });
    } catch {}
  }

  function shareTo(platform: "twitter" | "whatsapp" | "facebook" | "linkedin" | "copy") {
    const postUrl = typeof window !== "undefined" ? `${window.location.origin}/feed` : "";
    const text = encodeURIComponent(`Check out this post by ${post.author?.displayName || "a creator"} on Nexo: "${post.title || post.body?.slice(0, 60)}..."`);
    const encodedUrl = encodeURIComponent(postUrl);

    recordShare();

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <article className="glass-3d-card rounded-2xl md:rounded-3xl p-5 md:p-6 mb-4 relative overflow-hidden group">
      {/* Specular Edge Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-cyan/20 border border-white/20 shadow-glass-card">
            {post.author?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-slate-100">{initial}</span>
            )}
          </div>
          <div>
            <Link
              href={`/profile/${post.author?.username}`}
              className="font-semibold text-slate-100 hover:text-accentLight transition-colors tracking-tight text-sm md:text-base flex items-center gap-1.5"
            >
              {post.author?.displayName || post.author?.username}
              <span className="text-xs text-accent">✓</span>
            </Link>
            <p className="text-xs text-mute font-mono">@{post.author?.username}</p>
          </div>
        </div>

        {/* Post Type Badge */}
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
          {post.type === "blog" ? "📰 Blog Article" : post.type === "video" ? "🎬 Video" : post.type === "image" ? "📸 Photo" : "✦ Thought"}
        </span>
      </div>

      {/* Blog Post Title */}
      {post.title && (
        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight mb-2.5 leading-snug">
          {post.title}
        </h2>
      )}

      {/* Body Content */}
      {post.body && (
        <p className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed text-slate-200 font-normal">
          {post.body}
        </p>
      )}

      {/* Media: YouTube Embed */}
      {post.mediaUrl && isYouTube && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-glass-card aspect-video w-full bg-black/60">
          <iframe
            src={post.mediaUrl}
            title={post.title || "Video content"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Media: Direct Video File */}
      {post.mediaUrl && post.type === "video" && !isYouTube && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-glass-card bg-black/40">
          <video src={post.mediaUrl} controls className="w-full max-h-[520px] rounded-2xl" />
        </div>
      )}

      {/* Media: Image */}
      {post.mediaUrl && post.type === "image" && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-glass-card bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.mediaUrl}
            alt=""
            className="max-h-[520px] w-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
          />
        </div>
      )}

      {/* Interactive Micro-Action Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-mute flex-wrap gap-2">
        <div className="flex items-center gap-3">
          
          {/* Like Button (Instagram / Twitter style) */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              isLiked
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold"
                : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{isLiked ? "❤️" : "🤍"}</span>
            <span>{likeCount}</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              showComments
                ? "bg-accent/20 text-accentLight border border-accent/30 font-semibold"
                : "hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>💬</span>
            <span>{comments.length}</span>
          </button>

          {/* Share Button (Social Media Dispatcher) */}
          <div className="relative">
            <button
              onClick={() => setShowShareModal(!showShareModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition-all"
            >
              <span>↗</span>
              <span>{sharesCount > 0 ? sharesCount : "Share"}</span>
            </button>

            {/* Share Dropdown Modal */}
            {showShareModal && (
              <div className="absolute left-0 bottom-full mb-2 w-48 rounded-2xl glass-3d-panel p-2 shadow-glass-3d z-30 space-y-1">
                <button
                  onClick={() => shareTo("twitter")}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span>𝕏</span> Share on Twitter / X
                </button>
                <button
                  onClick={() => shareTo("whatsapp")}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span>🟢</span> Share on WhatsApp
                </button>
                <button
                  onClick={() => shareTo("facebook")}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span>📘</span> Share on Facebook
                </button>
                <button
                  onClick={() => shareTo("linkedin")}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span>💼</span> Share on LinkedIn
                </button>
                <button
                  onClick={() => shareTo("copy")}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs text-accentLight flex items-center gap-2 font-medium"
                >
                  <span>📋</span> {copied ? "Copied Link! ✓" : "Copy Direct Link"}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-slate-500 font-mono">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
        </span>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a thoughtful comment..."
              className="glass-input flex-1 rounded-xl px-4 py-2 text-xs md:text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <button
              disabled={isSubmittingComment || !commentText.trim()}
              className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              {isSubmittingComment ? "..." : "Reply"}
            </button>
          </form>

          {/* List of Comments */}
          <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">
                      {c.author?.displayName || "Creator"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </article>
  );
}
