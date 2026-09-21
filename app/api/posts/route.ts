import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "explore";
  const me = getCurrentUser();
  const db = readDB();

  let posts = [...db.posts];
  if (mode === "feed" && me) {
    const following = new Set(
      db.follows.filter((f) => f.followerId === me.id).map((f) => f.followingId)
    );
    following.add(me.id);
    posts = posts.filter((p) => following.has(p.authorId));
  }

  posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const hydrated = posts.slice(0, 50).map((p) => {
    const author = db.users.find((u) => u.id === p.authorId);
    return { ...p, author: author ? publicUser(author) : null };
  });
  return NextResponse.json({ posts: hydrated });
}

export async function POST(req: Request) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });
  const body = await req.json();
  const type = body.type === "image" || body.type === "video" ? body.type : "text";
  const text = String(body.body || "").trim();
  const mediaUrl = String(body.mediaUrl || "");
  if (!text && !mediaUrl) return NextResponse.json({ error: "Write something or add media." }, { status: 400 });

  const db = readDB();
  const post = {
    id: uuid(),
    authorId: me.id,
    type,
    body: text,
    mediaUrl,
    createdAt: new Date().toISOString(),
  };
  db.posts.unshift(post);
  writeDB(db);
  return NextResponse.json({ post: { ...post, author: publicUser(me) } });
}
