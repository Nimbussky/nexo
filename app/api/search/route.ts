import { NextResponse } from "next/server";
import { publicUser } from "@/lib/auth";
import { readDB } from "@/lib/db";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.toLowerCase() || "";
  const db = readDB();
  const users = db.users
    .filter((u) => !q || u.username.includes(q) || u.displayName.toLowerCase().includes(q))
    .slice(0, 20)
    .map(publicUser);
  return NextResponse.json({ users });
}
