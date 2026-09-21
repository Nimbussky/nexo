import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";

export async function POST(req: Request) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });
  const { username } = await req.json();
  const db = readDB();
  const target = db.users.find((u) => u.username === String(username || "").toLowerCase());
  if (!target || target.id === me.id) {
    return NextResponse.json({ error: "Cannot follow that user." }, { status: 400 });
  }
  const exists = db.follows.find((f) => f.followerId === me.id && f.followingId === target.id);
  if (exists) {
    db.follows = db.follows.filter((f) => !(f.followerId === me.id && f.followingId === target.id));
  } else {
    db.follows.push({ followerId: me.id, followingId: target.id });
  }
  writeDB(db);
  return NextResponse.json({ following: !exists });
}
