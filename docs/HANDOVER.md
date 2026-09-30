# The Scribble Lab: first draft handover

## What this is
The first reviewable draft of the new site: a fresh creative direction built on Brand Book v1.1.
Stack: Next.js (App Router, TypeScript), Tailwind CSS, Supabase, Vercel.

## Design summary (v2: bold editorial and tactile)
- **Idea:** "Every space starts as a scribble." Big confident type, photography in organic cut-paper shapes, and interactions you can touch.
- **Homepage:** hero with pointer-reactive layered shapes, coral ticker of the five worlds, a statement that lights up as you read, five service cards that stack as you scroll, a drag-to-browse work carousel, a hover-driven process, a kinetic window you move by hand with a slider, then the people and a large call to action.
- **Logo:** the supplied primary blob logo only, never retyped or recoloured, at least 200 px wide, always on a light field. No scribble-and-name lockup is used anywhere.
- **Brand:** all eight colours as tokens in `src/app/globals.css`; Josefin Sans and Figtree via `next/font`; indigo dominant, coral as spark, mustard only inside stripe shapes.
- **Motion:** eased, upward and settling. Reduced-motion users get a static ticker, no autoplay, and the window slider still works. Ticker has a pause button. Content stays visible if animation or JavaScript fails.
- **Imagery:** temporary web photos (Unsplash licence) from one manifest, `src/content/placeholders.ts`. Each is labelled "Placeholder photo" and each has a designed fallback block if it fails to load. They are not Scribble Lab projects.

## Routes
`/`, `/work` (filters via `?service=`), `/work/[slug]`, `/services`, `/services/[slug]` (five pages), `/studio`, `/start-a-project` (five-step inquiry), plus `sitemap.xml`, `robots.txt`, share image, 404 and error pages.

## Content model (ready for a future dashboard)
Typed records in `src/content/`: services, process stages, projects, media (alt text, caption, attribution, `permissionToPublish`, concept/completed status). Demo projects are isolated in `src/content/demo/`; their photos come from `src/content/placeholders.ts`. To launch without them: delete that folder and set `SHOW_DEMO_CONTENT = false` in `src/content/index.ts`. Real projects go in `src/content/projects.ts` until the Supabase-backed dashboard replaces the files.

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
| Logo master SVG, plus a version without the faint ghost "Lab" under the wordmark | `public/brand/TSL_Logo_Primary_FullColour_RGB.svg` | Header, footer, share image. Current file is a PNG from the supplied artwork. |
| Hero photograph (interior, warm light) | `public/work/hero.jpg` | Homepage hero, inside the blob shape |
| One photo per service (five) | `public/services/<slug>.jpg` | Service cards and service pages |
| Completed-project photography with client, city, year, photographer and written permission | `public/work/<slug>/01.jpg` … | Work carousel, work index and project pages |
| Five process photos (brief, sketch, materials, workshop, handover) | `public/process/<stage>.jpg` | Process section |
| Approved founder portrait | `public/people/founder.jpg` | Homepage and Studio |
| Project video and poster | `public/work/<slug>/video.mp4`, `poster.jpg` | Project pages |
| Workshop address, trade licence number, TRN | `src/lib/site.ts` | Footer, only when approved |

To swap a placeholder: change its entry in `src/content/placeholders.ts` to a local file and set `placeholder: false`. The "Placeholder photo" label disappears automatically.

## Items to confirm
- Founder display name: Brand Book prints **Nashemman Sahiba Zargar**.
- Contact email `nash@thescribblelab.com` and phone `+971 52 281 5209` are taken from the Brand Book.
- Studio address is the UNBOX, Business Bay address from the Brand Book. The workshop address is deliberately left out.
