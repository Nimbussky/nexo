import { redirect } from "next/navigation";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import Nav from "@/components/Nav";
import PostCard from "@/components/PostCard";

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
      <main className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">Explore</h1>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </main>
    </>
  );
}
