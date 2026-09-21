import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readDB } from "@/lib/db";
import { signSession } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const db = readDB();
  const user = db.users.find((u) => u.email === String(email || "").toLowerCase());
  if (!user || !(await bcrypt.compare(String(password || ""), user.passwordHash))) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set("nexo_session", signSession(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
