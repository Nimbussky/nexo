"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import PostCard from "@/components/PostCard";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");

  async function load() {
    const [p, m] = await Promise.all([
      fetch(`/api/users/${username}`).then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]);
    setData(p);
    setMe(m.user);
    setBio(p.user?.bio || "");
    setDisplayName(p.user?.displayName || "");
  }

  useEffect(() => {
    load();
  }, [username]);

  async function follow() {
    await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    load();
  }

  async function save() {
    await fetch("/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, bio }),
    });
    load();
  }

  if (!data?.user) return <p className="p-8 text-mute">Loading...</p>;

  return (
    <>
      <Nav username={me?.username} />
      <main className="mx-auto max-w-xl space-y-4 px-4 py-6">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h1 className="text-2xl font-semibold">{data.user.displayName}</h1>
          <p className="text-mute">@{data.user.username}</p>
          <p className="mt-3">{data.user.bio || "No bio yet."}</p>
          <p className="mt-3 text-sm text-mute">
            {data.followers} followers · {data.following} following
          </p>
          {data.isMe ? (
            <div className="mt-4 space-y-2">
              <input className="w-full rounded-xl border border-line bg-ink px-3 py-2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <textarea className="w-full rounded-xl border border-line bg-ink px-3 py-2" value={bio} onChange={(e) => setBio(e.target.value)} />
              <button onClick={save} className="rounded-full bg-accent px-4 py-2 text-sm">Save profile</button>
            </div>
          ) : (
            <button onClick={follow} className="mt-4 rounded-full bg-accent px-4 py-2 text-sm">
              {data.isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </section>
        {data.posts.map((p: any) => (
          <PostCard key={p.id} post={{ ...p, author: data.user }} />
        ))}
      </main>
    </>
  );
}
