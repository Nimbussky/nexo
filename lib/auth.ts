import { cookies } from "next/headers";
import crypto from "crypto";
import { readDB } from "./db";
import { User } from "./types";

const SECRET = process.env.NEXO_SECRET || "nexo-dev-secret-change-in-prod";

export function signSession(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, t: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token?: string | null): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.userId as string;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const token = cookies().get("nexo_session")?.value;
  const userId = verifySession(token);
  if (!userId) return null;
  return readDB().users.find((u) => u.id === userId) || null;
}

export function publicUser(u: User) {
  const { passwordHash, email, ...rest } = u;
  return rest;
}
