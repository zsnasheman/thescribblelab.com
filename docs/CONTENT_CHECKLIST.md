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


---
## Owner-supplied materials still needed (consolidated, art-direction rebuild)
None of these are shown on the public site; the pages read as complete without them.

1. **Completed-project photography and video**, with written permission to publish, location, year and a one-line brief each. Until then the homepage and Work show *Concept study* illustrations.
2. **Commissioned or high-resolution artwork** to replace the concept layers in `public/art/` (hero scene at least 2400 px wide, five discipline vignettes at least 1600 px, textures from real material scans: travertine, timber, granite, plaster).
3. **Founder**: her own words for the four chapters (where she comes from, what shaped her eye, why she started the studio), and a portrait if she wants one shown. Confirm the spelling of her name: the Brand Book prints "Nashemman"; the site uses "Nasheman".
4. **Founder facts to confirm**: that the listed employers may be named, the December 2021 date, and the 2036 ambition wording.
5. **Verified outcomes** per project (only numbers you can evidence).
6. **Map pin**: confirm the Google Maps location for UNBOX Community, Bay Square.
7. **Approved alternate logo lockup** for the compact bar, if you want one; until then the compact bar uses a plain Home link.
8. **Run `supabase/migrations/20261001000000_contact_source.sql`** (pending): the contact form cannot store messages until it has run. Verify storage on the deployed preview afterwards.


---
## Assets needed for the next refinement (prioritised)
1. **One completed Scribble Lab project: 3-5 landscape photographs** (min 2400 px wide) and its verified facts (name, discipline, location, year, one-line brief, what you made). The best one is a wide shot with a strong **arched or framed opening** (or a clear architectural edge) so the journey's aperture can open onto it; add to `src/content/projects.ts` with `permissionToPublish: true`. This replaces the concept study in the reveal (Beat D). Also provide a portrait crop (4:5) of the same space for mobile.
2. **A 6-10 second silent clip (landscape, 1920x1080, MP4/WebM, under 4 MB) of the same project** (walk-through or kinetic movement) plus a poster frame. Used inside the aperture on desktop.
3. **One real photograph per discipline** (interiors, exhibitions, events, brand activations, kinetic windows), landscape plus a square crop, each with permission and a one-line caption. Until then each discipline shows a labelled concept study.
4. **The logo SVG** (it was not received). If you want the guide to use the exact paths, send the original SVG.
5. **Process material that is real:** photographs of sketches, a material board, a model or a site visit (3-6 images), for the Material and Delivery scenes.
6. **Recording stills:** 3-5 frames from each of the three reference recordings (beginning, middle, end of the key change).
