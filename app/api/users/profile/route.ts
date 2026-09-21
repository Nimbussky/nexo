import { NextResponse } from "next/server";
import { getCurrentUser, publicUser } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";

export async function POST(req: Request) {
  const me = getCurrentUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });
  const body = await req.json();
  const db = readDB();
  const user = db.users.find((u) => u.id === me.id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.displayName) user.displayName = String(body.displayName).slice(0, 40);
  if (typeof body.bio === "string") user.bio = body.bio.slice(0, 160);
  if (typeof body.avatarUrl === "string") user.avatarUrl = body.avatarUrl;
  writeDB(db);
  return NextResponse.json({ user: publicUser(user) });
}
