# Business Expo 2026 — Website (Next.js + Tailwind + Supabase)

## Setup (Windows)

1. Install Node.js (LTS) from nodejs.org if you haven't already.
2. Unzip this project, open the folder in VS Code / terminal.
3. Run:
   ```
   npm install
   ```
4. Copy `.env.local.example` to `.env.local` and fill in your real Supabase Project URL + anon key
   (Supabase dashboard → Project Settings → API).
5. Run the SQL schema from `expo-website-guide.md` (PART 4) in your Supabase SQL Editor
   to create the `visitors`, `exhibitor_inquiries`, `sponsor_inquiries`, `contact_messages` tables.
6. Run:
   ```
   npm run dev
   ```
   Open http://localhost:3000

## What's included
- Bilingual (English/Marathi) toggle — top right button
- Hero with live countdown timer (edit the date in `src/components/Countdown.jsx`)
- Animated stat counters
- Expo sectors grid
- Stall pricing cards
- Working Exhibitor Inquiry form → saves to Supabase `exhibitor_inquiries` table
- Working Visitor Registration form → saves to Supabase `visitors` table
- Sponsorship tiers section
- Gallery placeholder grid (replace with real images)
- Working Contact form → saves to Supabase `contact_messages` table

## Deploy
Push this folder to a GitHub repo, then import it in vercel.com → add the same
`.env.local` values as Environment Variables → Deploy. Free `.vercel.app` URL in ~2 minutes.

## Next steps
See PART 10 (Roadmap) in `expo-website-guide.md` for Phase 2+ features
(admin dashboard, payments, QR check-in, WhatsApp/SMS).
