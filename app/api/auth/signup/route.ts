import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { readDB, writeDB } from "@/lib/db";
import { signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();
  const username = String(body.username || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  const password = String(body.password || "");
  const displayName = String(body.displayName || username);

  if (!email.includes("@") || username.length < 3 || password.length < 6) {
    return NextResponse.json({ error: "Invalid email, username (3+), or password (6+)." }, { status: 400 });
  }

  const db = readDB();
  if (db.users.some((u) => u.email === email || u.username === username)) {
    return NextResponse.json({ error: "Email or username already taken." }, { status: 409 });
  }

  const user = {
    id: uuid(),
    email,
    username,
    displayName,
    bio: "",
    avatarUrl: "",
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);

  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set("nexo_session", signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
