import { redirect } from "next/navigation";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import Nav from "@/components/Nav";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default function ExplorePage() {
  const me = getCurrentUser();
  if (!me) redirect("/login");
  const db = readDB();
  const posts = [...db.posts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 50)
    .map((p) => {
      const u = db.users.find((x) => x.id === p.authorId);
      return { ...p, author: u ? publicUser(u) : null };
    });

  return (
    <>
      <Nav username={me.username} />
      <main className="mx-auto max-w-2xl px-4 pb-16">
        
        {/* Header with Title and Pills */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Explore Nexus</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accentLight font-mono">
                LIVE
              </span>
            </h1>
            <span className="text-xs text-mute font-mono">{posts.length} posts indexed</span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button className="px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 font-medium">
              ✦ All Streams
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white border border-white/10">
              📸 Media
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white border border-white/10">
              ⚡ Discussions
            </button>
            <button className="px-3.5 py-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white border border-white/10">
              🔥 Trending
            </button>
          </div>
        </div>

        {/* Post Grid */}
        <div className="space-y-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </main>
    </>
  );
}
