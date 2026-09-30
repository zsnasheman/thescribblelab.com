# The Scribble Lab: website revision handover

Stack: Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion (the discipline board only), Supabase, Vercel.
Everything outstanding from the owner is in `docs/CONTENT_CHECKLIST.md`.

## What the site is

A spatial, drawn-first studio site. Real architectural perspective drawings (built from one projection, so they
respond to the viewer accurately), axonometric stand and pop-up drawings, material samples, and labelled details.
Where photographs do not exist yet, honest drawn placeholders say what is needed. Nothing depicts invented clients,
results, testimonials, awards or overseas offices.

## Pages

`/` · `/work` (filters by discipline and status) · `/work/[slug]` · `/services` · `/services/[slug]` (five, each with
its own explainer and section order) · `/studio` · `/founder` · `/approach` · `/contact` · `/start-a-project` ·
`/privacy` · sitemap, robots, share image, 404, error.

Navigation: Work, What we do, Studio, Contact, and a prominent Start a project. Founder and Our approach are
reachable from Studio, the homepage and the footer, and sit under Studio in the current-page state.

## The five signature interactions

1. **Reactive spatial hero.** One room seen from one viewpoint in three states (Idea, Material, Space). On a mouse,
   the room reprojects to follow the pointer and the light shifts; text and page never move. The same control is
   available by **View angle** and **Light** sliders (touch and keyboard), and three inspectable details open small
   drawings. It plays one gentle Idea to Space pass on first view, then stops. Reduced motion starts resolved and does not animate.
2. **Material board.** Choose a discipline and its drawing, detail and material samples recompose into a focused view
   (shared-layout transitions). All five names stay visible, another can be chosen at once, and "Back to the complete board" returns.
3. **Founder story.** Six readable chapters beside a drawing that moves from Kashmir-inspired forms to Dubai's
   architecture to faint unlabelled future forms. Nothing is pinned or locked. Reduced motion shows one static composition.
4. **Work.** Cards morph into their project pages (the browser's View Transitions, with a plain fallback). Each project
   has Drawings, Materials and Completed-work views. A render/built slider is built but only appears for a matched pair.
5. **Kinetic window.** Panels with thickness, a rail, carriages, a drive, a pendant with light and a shadow. Move it by
   slider, or Play, Pause and Reset. Labelled as a demonstration, not a client installation.

## Editing content

Content is separate from layout in `src/content/`: `services.ts`, `process.ts`, `studio.ts`, `founder.ts`, `projects.ts`
(real projects) and `demo/projects.ts` (illustrative). Contact details and the founder record live once in `src/lib/site.ts`.

## Database

Two migrations, run in Supabase **SQL Editor** in order:

1. `supabase/migrations/20260930000000_inquiries.sql` (already run)
2. `supabase/migrations/20261001000000_contact_source.sql` **(needs running)**. Adds `source`, `topic` and `message`,
   lets brief-only columns be empty only for contact messages, and keeps a CHECK that still requires every brief field
   when `source = 'project'`. Existing rows and the working brief flow are untouched. Safe to run more than once.

Vercel variables (Production and Preview): `SUPABASE_SERVICE_ROLE_KEY` (Sensitive), `INQUIRY_HASH_SALT`.
Optional: `SUPABASE_URL` (runtime copy used by server code). Keep `NEXT_PUBLIC_SITE_INDEXING` unset until launch.

Both forms validate on the server, refuse a filled honeypot, limit five per hour per hashed IP, use an idempotency
key so a double click or retry stores one row, and report success only after the database confirms the insert.
Until migration 2 is run, the contact form says the message has not been sent and offers email, phone and WhatsApp.

## Tests

`qa/` holds the browser tests and a local stand-in for Supabase. See `qa/README.md`, including what they cannot prove.
