import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  const initial = (post.author?.displayName || post.author?.username || "?").slice(0, 1).toUpperCase();

  return (
    <article className="glass-3d-card rounded-2xl md:rounded-3xl p-5 md:p-6 mb-4 relative overflow-hidden group">
      {/* Specular Edge Glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-cyanLight/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent/30 to-cyanLight/20 border border-white/20 shadow-glass-card">
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

        {/* Post Type / Status Badge */}
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
          {post.type || "Thought"}
        </span>
      </div>

      {/* Body Content */}
      {post.body && (
        <p className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed text-slate-200 font-normal">
          {post.body}
        </p>
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

      {/* Media: Video */}
      {post.mediaUrl && post.type === "video" && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 shadow-glass-card bg-black/40">
          <video src={post.mediaUrl} controls className="w-full max-h-[520px] rounded-2xl" />
        </div>
      )}

      {/* Interactive Micro-Action Bar */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-mute">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
            <span>🤍</span>
            <span>Like</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-cyanLight transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
            <span>💬</span>
            <span>Comment</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-slate-200 transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
            <span>↗</span>
            <span>Share</span>
          </button>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}
        </span>
      </div>
    </article>
  );
}
