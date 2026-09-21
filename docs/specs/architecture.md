# Nexo — Architecture Spec

## Stack (decided)
- **Framework:** Next.js 14 App Router + TypeScript (monolith — recommended for V1)
- **UI:** Tailwind CSS, custom design tokens (not a generic template)
- **Auth:** HTTP-only session cookie + password hashing (bcryptjs)
- **Data:** JSON file store (`data/db.json`) for V1 — no external DB required to run
  - Why: ships and deploys immediately; schema is already relational-shaped so we can swap Prisma + Postgres later without rewriting product logic
  - Alternative rejected: raw SQLite on Vercel (ephemeral filesystem)
- **Media:** uploaded files stored in `public/uploads` (Vercel Blob or S3 later)
- **Deploy:** Vercel
- **Repo:** GitHub

## Data model
- User: id, email, username, displayName, bio, avatarUrl, passwordHash, createdAt
- Follow: followerId, followingId
- Post: id, authorId, type (text|image|video), body, mediaUrl, createdAt

## Security rules
- Passwords never stored in plaintext
- Session cookie httpOnly
- No secrets in client code
- Uploads limited by type and size
- Usernames unique, lowercase, 3–20 chars

## Design system
- Dark premium social UI
- Background: #0B0B0F
- Surface: #14141A
- Accent: #7C5CFF (violet)
- Text: #F4F4F5 / muted #A1A1AA
- Radius: 16px cards, 999px pills
- Font: system + Inter-like stack
