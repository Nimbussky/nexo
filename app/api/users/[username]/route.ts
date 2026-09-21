import { NextResponse } from "next/server";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { username: string } }) {
  const db = readDB();
  const user = db.users.find((u) => u.username === params.username.toLowerCase());
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const me = getCurrentUser();
  const followers = db.follows.filter((f) => f.followingId === user.id).length;
  const following = db.follows.filter((f) => f.followerId === user.id).length;
  const isFollowing = !!(me && db.follows.some((f) => f.followerId === me.id && f.followingId === user.id));
  const posts = db.posts
    .filter((p) => p.authorId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({
    user: publicUser(user),
    followers,
    following,
    isFollowing,
    isMe: me?.id === user.id,
    posts,
  });
}
