import { NextResponse } from "next/server";
import { getCurrentUser, publicUser } from "@/lib/auth";

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { ...publicUser(user), email: user.email } });
}
