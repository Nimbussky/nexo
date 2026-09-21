import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const me = getCurrentUser();
  if (me) redirect("/feed");
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-mute">Social, simple</p>
      <h1 className="max-w-2xl text-5xl font-semibold leading-tight md:text-7xl">
        Meet people. Share the moment. <span className="text-accent">Nexo</span>.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-mute">
        A real social platform for profiles, friends, writing, photos, and video.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/signup" className="rounded-full bg-accent px-6 py-3 font-medium">
          Create account
        </Link>
        <Link href="/login" className="rounded-full border border-line px-6 py-3">
          Log in
        </Link>
      </div>
    </main>
  );
}
