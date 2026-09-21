import { redirect } from "next/navigation";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import Nav from "@/components/Nav";
import Composer from "@/components/Composer";
import PostCard from "@/components/PostCard";

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
      author: (() => {
        const u = db.users.find((x) => x.id === p.authorId);
        return u ? publicUser(u) : null;
      })(),
    }));

  return (
    <>
      <Nav username={me.username} />
      <main className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <Composer />
        {posts.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-6 text-mute">
            Your feed is quiet. Search people and follow them, or share your first post.
          </p>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </main>
    </>
  );
}
