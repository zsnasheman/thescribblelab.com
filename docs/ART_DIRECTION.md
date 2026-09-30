# Art direction: the living studio sketchbook

Status: implemented on the preview branch. Replaces the earlier refinement brief.

## References (what could and could not be inspected)
Roar (designbyroar.com/about), Random Studio and VAVE were **not** visually inspected by the developer: the build
environment cannot reach them. The notes in the brief (Roar: illustrated skyline and shaped colour fields around editorial
text; Random: project imagery leads, restrained nav; VAVE: confident type, direct access to the practice) were taken as
given, and the supplied concept image was used as the direct composition reference. No animation from those sites is claimed
to have been studied. Nothing is taken from them, or from the old thescribblelab.com.

## The story of the homepage
One drawn line becomes a place. Six chapters, one visual grammar (line drawing, material mask, paper grain, organic fields):
1. **Opening, the idea.** Headline, one sentence, "Explore our work". Logo and navigation are part of the composition; the scene runs beneath them.
2. **Five ways to shape a space.** One board: per discipline a spatial concept, a line-drawing detail and material samples. Selecting gathers them into a focused view; Close/Escape returns. Phones use an accordion.
3. **Work.** Three larger concept studies: brief, design move, space. Labelled *Concept study*.
4. **Founder.** Short story, a route to the Founder page, and the four-stage illustration.
5. **From sketch to site.** Listen, Sketch, Develop, Build, Handover around one canopy concept.
6. **Let's make a place.** Start a project / Contact us; the footer carries the verified details.

## Artwork pipeline (`scripts/build-art.py`)
The only detailed artwork available is the supplied concept (1484 px wide). The script crops it into separate layers, removes
the mock-up's own text, nav, logo and stray marks, converts the paper to transparency (colour-to-alpha), and derives a
line-only "ink" version of each scene. Outputs are in `public/art/`. The full mock-up is never used as a background.
All of it is **concept illustration**, labelled as such on the page, never presented as completed work.
Limitation: at this resolution the art is soft on large or high-density screens. Commissioned high-resolution artwork
is listed in `CONTENT_CHECKLIST.md`; replacing the files in `public/art/` (same names and ratios) is enough.

## Motion intent
- **Sketch becomes space**: on load the colour fills across the line drawing once (about 3 s, CSS mask), then the lines settle back. Sketch-to-site repeats it stage by stage, driven by scroll position or by choosing a stage. Reduced motion: complete composition.
- **Material board becomes a discipline**: shared-layout move of the pieces (framer-motion), focus managed, Escape/Close returns focus to the tile.
- **Roots become practice** (Founder): four chapters add detail to one illustration; future forms are faint, unlabelled and dashed.
- **A kinetic display reveals its purpose**: louvre teaser in the Kinetic tile (plays once when visible) and the full Play/Pause demo on the Kinetic windows page.
- Finishing: drawn underline on nav links, 6-10 px pointer depth on the hero art only (fine pointers, visible area only), no cursor effects, no scroll-jacking.

## Responsive compositions
Mobile uses a separate hero crop and image; the board is an accordion; phones show one illustration stage per founder chapter.
Checked at 360, 390, 768, 1024 and 1440 px.
