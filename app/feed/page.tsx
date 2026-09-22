import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import Nav from "@/components/Nav";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default function FeedPage() {
  const me = getCurrentUser();
  if (!me) redirect("/login");
  const db = readDB();
  const following = new Set(db.follows.filter((f) => f.followerId === me.id).map((f) => f.followingId));
  following.add(me.id);
  const posts = db.posts
    .filter((p) => following.has(p.authorId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((p) => ({
      ...p,
      likes: p.likes || [],
      comments: (p.comments || []).map((c) => {
        const cAuthor = db.users.find((u) => u.id === c.authorId);
        return { ...c, author: cAuthor ? publicUser(cAuthor) : undefined };
      }),
      sharesCount: p.sharesCount || 0,
      author: (() => {
        const u = db.users.find((x) => x.id === p.authorId);
        return u ? publicUser(u) : null;
      })(),
    }));

  return (
    <>
      <Nav username={me.username} />
      <main className="mx-auto max-w-2xl px-4 pb-16">
        <Composer />

        {posts.length === 0 ? (
          <div className="glass-3d-card rounded-3xl p-8 text-center my-6">
            <div className="text-4xl mb-3">🌌</div>
            <h3 className="text-lg font-bold text-white mb-2">Your Feed is Peaceful</h3>
            <p className="text-sm text-mute max-w-md mx-auto mb-6">
              Connect with fellow creators or explore the global stream to discover posts from across the network.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/explore"
                className="glass-button-primary px-5 py-2.5 rounded-full text-xs font-semibold"
              >
                Explore Global Feed
              </Link>
              <Link
                href="/search"
                className="glass-button-secondary px-5 py-2.5 rounded-full text-xs font-semibold text-slate-200"
              >
                Find Creators
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p as any} currentUserId={me.id} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
