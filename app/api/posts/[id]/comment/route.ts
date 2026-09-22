import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { Comment } from "@/lib/types";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { id } = params;
  const body = await req.json();
  const text = String(body.text || "").trim();

  if (!text) {
    return NextResponse.json({ error: "Comment text cannot be empty." }, { status: 400 });
  }

  const db = readDB();
  const postIndex = db.posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = db.posts[postIndex];
  if (!post.comments) post.comments = [];

  const newComment: Comment = {
    id: uuid(),
    authorId: me.id,
    text,
    createdAt: new Date().toISOString(),
  };

  post.comments.push(newComment);
  db.posts[postIndex] = post;
  writeDB(db);

  return NextResponse.json({
    comment: { ...newComment, author: publicUser(me) },
    commentsCount: post.comments.length,
  });
}
