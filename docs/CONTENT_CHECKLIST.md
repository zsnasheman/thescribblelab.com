# Content and asset checklist

One list for everything still needed from the owner. Nothing in this list blocks the preview; each item
replaces a clearly marked placeholder or confirms a draft.

## 1. Facts to confirm

| Item | What the site says now | Source | Needed |
|---|---|---|---|
| Founder's name | **Nasheman** Sahiba Zargar (used everywhere, from one record in `src/lib/site.ts`) | Owner's brief | The Brand Book v1.1 prints **Nashemman**. Confirm the correct public spelling, and whether the Brand Book should be corrected. |
| Founder's title | Founder & Design Director | Brand Book | Confirm |
| Studio established | December 2021 | Owner's brief | Confirm |
| Phone and WhatsApp | +971 52 281 5209 | Brand Book and brief | Confirm it is monitored on WhatsApp |
| Email | nash@thescribblelab.com | Brand Book | Confirm this is the address to publish |
| Studio address | UNBOX Community, Building 4, 2nd Floor, Bay Square, Business Bay, Dubai, UAE | Brand Book | Confirm |
| Map link | A Google Maps **search** built from the address | Generated | Open it and confirm it lands on the right place. If not, send the exact Maps link. |
| Workshop address | Not published | none | Supply if it should appear. Nothing is invented. |
| Opening hours | Not published | none | Supply if they should appear. Nothing is invented. |
| Previous employers | XBD Collective, Swiss Bureau, Ellington Properties, RK Gulf, Eclat Concept Design, shown as text only | Owner's brief | Confirm names and spelling. Logos only with written permission. |
| Career dates, roles, degree | Not stated anywhere | none | Supply if wanted. The site assigns no role or date to any employer. |
| Social links | None shown | none | Supply handles if they should appear. |

## 2. In her own words (founder page)

The page is structured so her words drop into place. Each is marked "To come" once, quietly, in its chapter.

- **Roots and creative perspective.** Where she comes from and what shaped her eye. The drawing is an interpretation
  of Kashmir-inspired forms flowing toward Dubai; it does not claim a birthplace, childhood or quotation.
- **Starting The Scribble Lab.** Why she started it, and what the first projects were like.
- **Her approach today.** Currently editorial draft copy, not a quotation. Please review and rewrite.
- **Approved portrait.** `public/people/nasheman-portrait.jpg`, 4:5, portrait.

## 3. Draft copy to review

These were written from the Brand Book and the owner's brief. They describe working behaviour, so the owner should
confirm they are true of the studio:

- Studio page: the working behaviour under each value (Crafted, Bold, Curious, Borderless), "How the work connects"
  and the roles of designers, makers and delivery partners.
- Our approach: what happens, what the client sees and where decisions are made, for each of the five stages.
- Service pages: briefs, scope, deliverables, how the stages apply, and the FAQs. No prices, deadlines, guarantees,
  certifications or approvals are stated.
- Privacy page (see section 5).

## 4. Project content (per project, before any project is published as real work)

Each project needs: permission to publish (and client permission for any client name), status (concept or completed),
location and year if they are to be shown, the brief, the design response, materials and decisions, development,
execution, verified outcomes only, photographer and caption for every image, and alt text.

Illustrative concepts are kept in `src/content/demo/`. Delete that folder and set `SHOW_DEMO_CONTENT` to `false`
in `src/content/index.ts` before launch. A render-to-reality slider appears only for a genuinely matched pair
(the same view, from the same position). None exists yet.

## 5. Decisions and legal

- **Retention.** How long to keep contact messages and briefs that do not lead to a project. The Privacy page says
  this is undecided.
- **Privacy page.** It describes what the two forms collect today. It is a draft and has not been reviewed by a lawyer.
- **Email notification.** None is sent when a form is submitted. Decide whether to add a delivery service.
- **Testimonials, awards, client references.** None are shown. Supply approved ones with written permission.

## 6. Before launch

- [ ] Run `supabase/migrations/20261001000000_contact_source.sql` in Supabase (see HANDOVER.md). Until it is run, the contact form shows an honest "not sent" state.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` and `INQUIRY_HASH_SALT` set in Vercel (Production and Preview).
- [ ] Set `NEXT_PUBLIC_SITE_INDEXING=on` only on the launch deployment. Until then every page is `noindex`.
- [ ] Map the old site's URLs in `src/content/redirects.ts`.
- [ ] Remove demo content (section 4).
- [ ] Connect the domain. Keep the existing MX, SPF, DKIM and autodiscover records so Microsoft 365 email keeps working.
- [ ] Move Vercel from Hobby to Pro (commercial use).

## 7. Asset checklist

| Asset | Proposed file | Orientation | Where it goes | Purpose |
|---|---|---|---|---|
| Logo master (SVG), primary, without the faint ghost "Lab" under the wordmark | `public/brand/TSL_Logo_Primary_FullColour_RGB.svg` | landscape | Header, footer, share image | The supplied PNG contains a faint duplicate "Lab" below the wordmark |
| Founder portrait | `public/people/nasheman-portrait.jpg` | portrait 4:5 | Homepage, Founder page | Replaces the portrait placeholder frame |
| Project photographs | `public/work/<slug>/01.jpg` … | landscape 4:3 or 16:10 | Project pages, Work cards | Completed work. Wide shot first, then details. |
| Project video and poster | `public/work/<slug>/video.mp4`, `poster.jpg` | landscape 16:9 | Project pages, Completed work tab | Walk-through or movement |
| Matched render and built photograph | `public/work/<slug>/render.jpg`, `built.jpg` | same crop, same viewpoint | Compare slider | Only for a genuinely matched pair |
| Sketches and mood boards | `public/work/<slug>/sketch-01.jpg`, `moodboard.jpg` | any | Project pages, Our approach | Real drawings replace illustrated fragments |
| Material close-ups | `public/materials/<name>.jpg` | square | Material swatches, Studio | Real samples replace drawn swatches |
| Workshop photograph | `public/studio/workshop-01.jpg` | landscape 4:3 | Studio | Fabrication in progress |
| Installation photograph | `public/studio/install-01.jpg` | landscape 4:3 | Studio | A team on site |
| Approved client references | `src/content/` | n/a | Work, Studio | Only with written permission |
