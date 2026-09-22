import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const db = readDB();
  const postIndex = db.posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = db.posts[postIndex];
  post.sharesCount = (post.sharesCount || 0) + 1;
  db.posts[postIndex] = post;
  writeDB(db);

  return NextResponse.json({ sharesCount: post.sharesCount });
}
