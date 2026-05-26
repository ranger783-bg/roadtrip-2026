# Summer 2026 — Mom & Dad's Road Trip

A private planning site for a 49-day Glacier · Yellowstone · Grand Tetons RV trip (Aug 7 – Sep 24, 2026, round-trip from Yuma in the F150 + Casita, with Tucker the Schnoodle). Mom and Dad browse a board of ideas, star what they want to do, pin favorites to days, see a color-coded calendar, and a full route map.

Built with Next.js 16 (App Router) + TypeScript, Tailwind 4, Supabase (Postgres/Auth/Realtime/Storage), and Leaflet/OpenStreetMap for the route map. Sibling of the `alaska-2026` project.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in the two Supabase values
npm run dev
```

## First-time Supabase setup

1. Create a free Supabase project. In **Settings → API**, copy the **Project URL** and **anon public** key into `.env.local`.
2. SQL Editor, in order: `supabase/migrations/0001_init.sql` → `supabase/seed.sql` → `supabase/storage_setup.sql`.
3. Update the placeholder emails: `update profiles set email='real@email' where name='Mom';` (Mom, Dad, Brian).
4. **Auth → Providers → Email**: confirm-email **off**. **Sign-up**: "Allow new users to sign up" **off** (invite-only). **URL Configuration**: Site URL = the Vercel URL; add `http://localhost:3000/**` to redirect URLs.
5. **Auth → Users → Invite** each real email (or force-confirm: `update auth.users set email_confirmed_at=now() where email=…`). A trigger links each auth user to its seeded profile by email.
6. (Recommended) Custom SMTP (Gmail App Password) so invite emails don't hit Supabase's built-in rate limit.

## What's in it

- **Ideas board** (`/`) — cards filtered by stop, category, dog-OK, in-town, low-walking. "Want to do" star.
- **Add idea** (`/add`) — photo (URL or upload), map location, dog/town/walking flags, assign to a stop.
- **Idea detail** (`/ideas/[id]`) — Google map, **essentials quick-links** (groceries/gas/propane/dump/vet near the stop), notes for coordination, and **pin-to-a-day** + planned/skip.
- **Itinerary** (`/itinerary`) — list view of all 15 stops with pinned ideas, plus a **color- and icon-coded calendar** (day tint = where you sleep, icons = pinned ideas).
- **Route** (`/route`) — interactive Leaflet map of all 15 stops + connecting line, with **"Open in Google Maps"** buttons (main route + outbound/return legs, to dodge Google's ~10-waypoint cap).

## The route (fixed)

15 stops in `src/lib/constants.ts` (also seeded to the `stops` table). Mains: Flagstaff (4n), West Glacier (17n), Yellowstone (5n), Dubois/Tetons (7n), Payson (7n). Edit `STOPS` there to change the backbone.

## Deploy

Push to GitHub, import on Vercel, add the two `NEXT_PUBLIC_SUPABASE_*` env vars, deploy. Subsequent deploys: `git push` then `vercel --prod --yes` (GitHub auto-deploy optional).

## Notes

- Dogs aren't allowed on trails in Glacier/Yellowstone/Tetons — ideas are tagged `dog_ok` and there are forest-road/in-town alternatives seeded for Tucker.
- Route map uses OpenStreetMap (no API key). Per-idea maps use the keyless Google embed.
- Throw-away after Sep 2026.
