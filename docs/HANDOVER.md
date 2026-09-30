# The Scribble Lab: first draft handover

## What this is
The first reviewable draft of the new site: a fresh creative direction built on Brand Book v1.1.
Stack: Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion (board panel only), Supabase, Vercel.

## Design summary
- **Idea:** "Every space starts as a scribble." A living studio sketchbook: an idea becomes a material study becomes a place.
- **Six homepage chapters:** hero (Idea / Material / Space states) → five-worlds studio board → work → process (five stages, five-bubble progress) → kinetic window → people and closing call to action.
- **Brand:** tokens for all eight colours in `src/app/globals.css`; Josefin Sans (headlines) and Figtree (body) via `next/font`; supplied logo files only, never redrawn. Indigo leads; coral appears as buttons and feature panels; mustard stays small and only inside stripe shapes.
- **Motion:** slow, settling, left-to-right and upward. Three polished moments (hero states, studio board, kinetic window). Everything else is a quiet scroll reveal. Reduced-motion users get static states and a step-through control for the kinetic window.
- **Honesty:** all imagery is original code-drawn illustration labelled "Illustrative concept". No invented clients, results, dates or testimonials.

## Routes
`/`, `/work` (filters via `?service=`), `/work/[slug]`, `/services`, `/services/[slug]` (five pages), `/studio`, `/start-a-project` (five-step inquiry), plus `sitemap.xml`, `robots.txt`, share image, 404 and error pages.

## Content model (ready for a future dashboard)
Typed records in `src/content/`: services, process stages, projects, media (alt text, caption, attribution, `permissionToPublish`, concept/completed status). Demo projects are isolated in `src/content/demo/`. To launch without them: delete that folder and set `SHOW_DEMO_CONTENT = false` in `src/content/index.ts`. Real projects go in `src/content/projects.ts` until the Supabase-backed dashboard replaces the files.

## Inquiry storage: what you must do in Supabase
1. **SQL Editor → New query**: paste `supabase/migrations/20260930000000_inquiries.sql` and run it.
   It creates `inquiries` with RLS enabled and no public policies: visitors cannot read or write it.
2. In **Vercel → Project Settings → Environment Variables**, add (Production and Preview):
   - `SUPABASE_SERVICE_ROLE_KEY` (mark **Sensitive**; copy from Supabase → Project Settings → API Keys → secret / service_role)
   - `INQUIRY_HASH_SALT` (any long random string)
3. Redeploy. Until step 2 is done the form shows an honest "not sent" state with an email and phone alternative. It never shows success without a confirmed insert.

Safeguards in the server action: server-side validation, honeypot field, limit of five briefs per hashed IP per hour, idempotency key so a double click or retry cannot create duplicates.
No email notification is sent. Briefs are read in Supabase until the dashboard exists.

## Checks
See the PR description for the exact list of automated checks, manual checks and what was not tested.

## Launch checklist (not done in this draft)
- [ ] Set `NEXT_PUBLIC_SITE_INDEXING=on` only on the launch deployment. Until then every page sends `noindex` and `robots.txt` disallows all.
- [ ] Map old URLs into `src/content/redirects.ts`.
- [ ] Remove demo content (see above).
- [ ] Connect the domain. Keep the existing MX, SPF, DKIM and autodiscover records untouched so Microsoft 365 email keeps working; change only the `@` A record and `www` CNAME.
- [ ] Upgrade Vercel from Hobby to Pro (commercial use).
- [ ] Add a delivery service if email notification of new briefs is wanted.

## Asset checklist
| Need | Proposed filename | Where it is used |
|---|---|---|
| Logo master SVGs (primary, white lockup, indigo lockup, secondary mark) | `public/brand/TSL_Logo_Primary_FullColour_RGB.svg` etc. | Header, footer, closing section, favicon. Current files are PNGs taken from the brand book. |
| Clean primary logo without the faint ghost "Lab" under the wordmark | `public/brand/TSL_Logo_Primary_FullColour_RGB.svg` | Closing section. The supplied PNG contains a faint duplicate "Lab" below the wordmark. |
| Approved founder portrait | `public/people/founder.jpg` | Homepage and Studio |
| Real material scans (stone, foil, terrazzo, fabric) | `public/materials/*.jpg` | Replace illustrated swatches inside blob shapes |
| Completed-project photography, with client, city, year, photographer and written permission | `public/work/<slug>/01.jpg` … | Work showcase and project pages |
| Project video and poster | `public/work/<slug>/video.mp4`, `poster.jpg` | Project pages |
| Workshop address, trade licence number, TRN | `src/lib/site.ts` | Footer, only when approved for public display |

## Items to confirm
- Founder display name: Brand Book prints **Nashemman Sahiba Zargar**.
- Contact email `nash@thescribblelab.com` and phone `+971 52 281 5209` are taken from the Brand Book.
- Studio address is the UNBOX, Business Bay address from the Brand Book. The workshop address is deliberately left out.
