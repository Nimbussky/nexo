"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setMe(d.user));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setUsers(d.users || []));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <>
      <Nav username={me?.username} />
      <main className="mx-auto max-w-xl px-4 py-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search people..."
          className="mb-4 w-full rounded-full border border-line bg-surface px-5 py-3 outline-none"
        />
        <div className="space-y-2">
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/profile/${u.username}`}
              className="block rounded-2xl border border-line bg-surface p-4 hover:border-accent"
            >
              <p className="font-medium">{u.displayName}</p>
              <p className="text-sm text-mute">@{u.username}</p>
              {u.bio && <p className="mt-1 text-sm text-mute">{u.bio}</p>}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
