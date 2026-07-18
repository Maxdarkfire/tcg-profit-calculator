# TCGplayer Profit Calculator

Phase 0 validation wedge for the TCG seller toolkit. Next.js 15 + TypeScript +
Tailwind v4. Mobile-first, no login, one page.

## Run locally
```bash
npm install
npm run dev
```

## Before launch (do these!)
1. **Verify fee rates.** Edit `src/config/fees.ts` — the rates are placeholders.
   Check TCGplayer's current seller fee schedule and update `lastVerified`.
2. **Set up Supabase.** Create a project, run `supabase/schema.sql` in the SQL
   editor, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   (see `.env.example`) locally and in Vercel project settings.
   The service key is server-only — it is never sent to the browser.
3. **Deploy to Vercel.** Import the repo, add the two env vars, deploy.
   Analytics: enable Web Analytics in the Vercel dashboard (the `<Analytics />`
   component is already wired).
4. Sanity-check the math against one of your real orders.

## Where things live
- Fee rates: `src/config/fees.ts` (single source of truth, integer-cents math in `src/lib/`)
- Calculator logic: `src/lib/calc.ts` (pure function — easy to unit test later)
- Signup API: `src/app/api/subscribe/route.ts` → `beta_signups` table
