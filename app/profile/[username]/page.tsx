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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    await fetch("/api/users/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, bio }),
    });
    setSaving(false);
    setEditing(false);
    load();
  }

  if (!data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-3d-card rounded-2xl px-6 py-4 flex items-center gap-3 text-slate-300">
          <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading spatial profile...</span>
        </div>
      </div>
    );
  }

  const initial = (data.user.displayName || data.user.username || "?").slice(0, 1).toUpperCase();

  return (
    <>
      <Nav username={me?.username} />
      <main className="mx-auto max-w-2xl px-4 pb-16">
        
        {/* Profile 3D Glass Header */}
        <section className="glass-3d-panel rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-tr from-accent to-cyanLight border-2 border-white/20 flex items-center justify-center font-bold text-2xl text-white shadow-glass-glow shrink-0">
                {initial}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {data.user.displayName}
                  <span className="text-xs text-accent">✓</span>
                </h1>
                <p className="text-xs md:text-sm text-mute font-mono">@{data.user.username}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div>
              {data.isMe ? (
                <button
                  onClick={() => setEditing(!editing)}
                  className="glass-button-secondary px-5 py-2 rounded-full text-xs font-semibold text-slate-200"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              ) : (
                <button
                  onClick={follow}
                  className={
                    data.isFollowing
                      ? "glass-button-secondary px-6 py-2 rounded-full text-xs font-semibold text-slate-300"
                      : "glass-button-primary px-6 py-2 rounded-full text-xs font-semibold"
                  }
                >
                  {data.isFollowing ? "Following ✓" : "Follow +"}
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-4">
            {data.user.bio || "Crafting thoughts on the decentralized social canvas."}
          </p>

          {/* Followers / Following telemetry */}
          <div className="flex items-center gap-4 text-xs font-mono pt-4 border-t border-white/5 text-slate-400">
            <div>
              <strong className="text-white text-sm">{data.followers || 0}</strong>{" "}
              <span>Followers</span>
            </div>
            <div>
              <strong className="text-white text-sm">{data.following || 0}</strong>{" "}
              <span>Following</span>
            </div>
            <div className="ml-auto text-accentLight font-sans">
              ✦ Verified Creator
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <label className="block text-xs font-semibold text-slate-400">DISPLAY NAME</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-2 text-sm text-white outline-none"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <label className="block text-xs font-semibold text-slate-400 mt-2">BIO</label>
              <textarea
                className="glass-input w-full rounded-xl px-4 py-2 text-sm text-white outline-none resize-none min-h-[70px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                disabled={saving}
                onClick={save}
                className="glass-button-primary px-5 py-2 rounded-full text-xs font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </section>

        {/* User's posts */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Recent Moments ({data.posts?.length || 0})
        </h2>
        <div className="space-y-4">
          {data.posts && data.posts.length > 0 ? (
            data.posts.map((p: any) => (
              <PostCard key={p.id} post={{ ...p, author: data.user }} currentUserId={me?.id} />
            ))
          ) : (
            <div className="glass-3d-card rounded-2xl p-6 text-center text-sm text-mute">
              No posts published yet.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
