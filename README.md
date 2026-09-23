# Nexo

A real social platform: accounts, profiles, follow, search, text posts, photos, and video.

**Elevated premium version** — refined spatial UI, cleaner product language, tighter design system.

## Run locally

```bash
cd nexo
npm install
npm run dev
```

Open http://localhost:3000

1. Create an account  
2. Edit your profile  
3. Search / follow people  
4. Share text, images, or videos  
5. Check Feed and Explore

## Stack

Next.js 14 · TypeScript · Tailwind · Three.js background · file-based data store (`data/db.json`) · local uploads.

## Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New… → Project**.
3. Import the repository **`Nimbussky/nexo`**.
4. Leave the framework preset as **Next.js** (auto-detected).
5. Add this Environment Variable:

   | Name          | Value                              |
   |---------------|------------------------------------|
   | `NEXO_SECRET` | any long random string (e.g. `openssl rand -hex 32`) |

6. Click **Deploy**.

After the build you will get a live URL (e.g. `https://nexo-xxxx.vercel.app`).  
Every push to `main` will automatically redeploy.

### Optional: Custom Domain
In the Vercel project → **Settings → Domains** → add your domain.

## Production Notes

- Current data store (`data/db.json`) is fine for demos but is **ephemeral** on Vercel (resets on new deployments).
- For real production:
  - Replace `lib/db.ts` with **Prisma + Postgres** (or Supabase / Neon / PlanetScale).
  - Move media uploads from `public/uploads` to **Vercel Blob** or **S3**.
- Always set `NEXO_SECRET` in the Vercel Environment Variables before users sign up.

## Local Production Build

```bash
npm run build
npm start
```
