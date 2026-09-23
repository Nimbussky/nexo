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

To go production-grade: swap `lib/db.ts` for Prisma + Postgres and uploads for Vercel Blob / S3.

## Design

- Dark spatial glass interface  
- Soft cinematic Three.js ambient  
- Clean typography and restrained motion  
- Mobile-first responsive

## Deploy

Push to GitHub → import in Vercel.  
Set `NEXO_SECRET` in Vercel environment variables.
