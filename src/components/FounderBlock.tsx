import Link from "next/link";
import { Photo } from "./Photo";
import { Arrow } from "./ui";
import { PH } from "@/content/placeholders";
import { SITE } from "@/lib/site";

export function FounderBlock() {
  return (
    <div className="grid items-center gap-12 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="blob-a relative mx-auto aspect-[176/120] w-full max-w-lg overflow-hidden bg-lavender md:max-w-none">
          <Photo photo={{ ...PH.studio, alt: "Placeholder for the approved founder portrait" }} sizes="(min-width:768px) 40vw, 90vw" />
        </div>
        <p className="t-caption mt-3 text-indigo-80">An approved portrait of the founder will replace this placeholder.</p>
      </div>
      <div className="md:col-span-7">
        <p className="t-label text-lavender">The people</p>
        <h2 className="t-display mt-4">A studio that draws it and builds it.</h2>
        <p className="t-lead mt-6 measure">
          The Scribble Lab is led from Dubai by {SITE.founder.name}, {SITE.founder.role}. Our purpose is simple: to turn ideas into places people remember.
        </p>
        <p className="t-body mt-4 measure text-indigo-80">
          Designers, makers and installers work as one team, so the detail you approve on paper is the detail you get on site.
        </p>
        <Link href="/studio" className="btn btn-indigo mt-8">Meet the studio <Arrow /></Link>
      </div>
    </div>
  );
}
