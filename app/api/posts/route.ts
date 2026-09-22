import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { Post, Comment } from "@/lib/types";

// Helper to convert standard YouTube links to embed URLs
function formatYouTubeUrl(url: string): string {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
}

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
    
    // Hydrate comments authors
    const hydratedComments = (p.comments || []).map((c) => {
      const cAuthor = db.users.find((u) => u.id === c.authorId);
      return { ...c, author: cAuthor ? publicUser(cAuthor) : undefined };
    });

    return {
      ...p,
      likes: p.likes || [],
      comments: hydratedComments,
      sharesCount: p.sharesCount || 0,
      author: author ? publicUser(author) : null,
    };
  });

  return NextResponse.json({ posts: hydrated });
}

export async function POST(req: Request) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });
  
  const body = await req.json();
  const allowedTypes = ["text", "image", "video", "blog"];
  const type = allowedTypes.includes(body.type) ? body.type : "text";
  
  const text = String(body.body || "").trim();
  const title = body.title ? String(body.title).trim() : undefined;
  let mediaUrl = String(body.mediaUrl || "").trim();

  // If YouTube link, format to embed URL
  if (type === "video" && (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be"))) {
    mediaUrl = formatYouTubeUrl(mediaUrl);
  }

  if (!text && !mediaUrl && !title) {
    return NextResponse.json({ error: "Write something or attach media." }, { status: 400 });
  }

  const db = readDB();
  const post: Post = {
    id: uuid(),
    authorId: me.id,
    type,
    title,
    body: text,
    mediaUrl,
    likes: [],
    comments: [],
    sharesCount: 0,
    createdAt: new Date().toISOString(),
  };

  db.posts.unshift(post);
  writeDB(db);

  return NextResponse.json({ post: { ...post, author: publicUser(me) } });
}
