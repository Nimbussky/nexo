import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { id } = params;
  const db = readDB();
  const postIndex = db.posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = db.posts[postIndex];
  if (!post.likes) post.likes = [];

  const existingIndex = post.likes.indexOf(me.id);
  let liked = false;

  if (existingIndex > -1) {
    post.likes.splice(existingIndex, 1);
    liked = false;
  } else {
    post.likes.push(me.id);
    liked = true;
  }

  db.posts[postIndex] = post;
  writeDB(db);

  return NextResponse.json({
    liked,
    likesCount: post.likes.length,
    likes: post.likes,
  });
}
