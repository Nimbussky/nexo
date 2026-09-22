"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Nav({ username }: { username?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/feed" className="text-xl font-semibold tracking-tight">
          Nexo
        </Link>
        <nav className="flex items-center gap-4 text-sm text-mute">
          <Link href="/feed" className="hover:text-white">Feed</Link>
          <Link href="/explore" className="hover:text-white">Explore</Link>
          <Link href="/search" className="hover:text-white">Search</Link>
          {username && (
            <Link href={`/profile/${username}`} className="hover:text-white">
              @{username}
            </Link>
          )}
          <button onClick={logout} className="rounded-full border border-line px-3 py-1 hover:text-white">
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
