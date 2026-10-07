# Art direction: immersive, photographic (current)

Status: replaces every earlier concept (painted sketchbook, blob guide, scroll "journey", procedural illustrations).
Those were removed from the code and assets on request.

## Direction
A cinematic, photograph-led site in the spirit of the "luxury hero" and "immersive studio" references the owner named.
**The motionsites.ai pages could not be opened from the build environment (egress block), so they have not been studied;
this is an interpretation from the brief until stills or recordings are supplied.** Nothing is copied from them.

## Homepage
1. **Hero reel**: full-bleed real imagery with a slow camera move, thumbnail progress bars, a pause control, and a slot for a looping film (`HERO_VIDEO` in `src/content/media.ts`; null until a clip exists).
2. **Statement**: a large light-weight sentence whose words come into focus as it scrolls (fully readable without motion).
3. **Immersive frame**: a framed render that opens to the full screen while scrolling (pinned for ~1.6 screens only), then names Interiors.
4. **Five ways to shape a space**: typographic index, each row to its discipline page.
5. **Selected interiors**: horizontal reel (native scroll/snap, buttons, arrow keys).
6. **From sketch to site**: five large steps with what you receive.
7. **Closing**: full-bleed image, actions, verified details.

## System
Logo always in a light pill (light field only). Glass navigation. Josefin Sans light for display, Figtree for text, indigo/coral from the brand. Grain overlay on paper.
Imagery is the five supplied placeholder images (`public/projects`), each labelled Photograph or Design visual; reduced motion stops the camera move and auto-advance.


## Update: references received as stills (Oct 2026)
Stills of the two reference pages were supplied (the live pages remain unreachable from the build environment).
Observed: (1) a deep indigo night scene with a glowing orb, a huge high-contrast serif headline split across the frame
(small italic line above giant capitals, small word at the right), tiny tracked-uppercase navigation, a bottom strip of
numbered captions and an outlined "START A PROJECT" pill; (2) a full-bleed sunset villa image where the camera flies
through the building into the interior, centred uppercase serif headline, centred small nav, white pill action.
Applied: night grade in brand indigo with a coral glow; Instrument Serif display type (a deliberate step away from the
Brand Book's Josefin Sans, to confirm with the owner); the split headline; tracked uppercase nav and captions;
numbered "01 Our craft / 02 Our approach" strip; fly-through transition between pictures (camera pushes in as the
next picture arrives from inside it); dark immersive homepage. No artwork, text or layout is copied.

---
## Reference rebuild (Roar-style slides, Oct 2026)
Source: a 12-slide full-page capture of a design-studio site plus its copied styles. Structure kept: white hero with colour blocks and a big condensed caps headline; a full colour statement slide; a contour-line landscape; discipline labels with a yellow triangle; grayscale cutouts with colour blocks; a "X follows Y" slide; a pink/navy philosophy slide; outlined-numeral stats; featured projects; closing.
Adapted, not cloned: Roar's angular polygons become the Scribble logo's curved blobs; yellow/pink/navy become coral/mustard/lavender/indigo; Barlow Condensed (condensed caps, as in the reference) with Figtree for text; all copy and images are the studio's own (company profile).
The reference's tiger/panther cut-outs are replaced by real cut-outs from the studio's work (Ariel, Huda Beauty bowling, Ariel kiosk) and grayscale photographs that turn to colour on hover. A realistic Scribble "signature" subject (e.g. a real pencil / sketching hands) needs photography: see CONTENT_CHECKLIST.
