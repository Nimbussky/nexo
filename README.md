# Nexo

A real social platform: accounts, profiles, follow, search, text posts, photos, and video.

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

Next.js 14 · TypeScript · Tailwind · file-based data store (`data/db.json`) · local uploads.

To go production-grade later: swap `lib/db.ts` for Prisma + Postgres and uploads for Vercel Blob / S3.

## Deploy

Push this folder to GitHub, then import the repo in Vercel.
Set `NEXO_SECRET` in Vercel environment variables.
