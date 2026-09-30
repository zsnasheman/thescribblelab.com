import Link from "next/link";
import { Logo } from "./Logo";
import { Blob } from "./shapes";
import { Arrow } from "./shapes";
import { C } from "@/lib/colors";
import { SITE } from "@/lib/site";

export function FounderBlock() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
      <figure className="md:col-span-4">
        {/* Room for an approved portrait. Replace with /public/people/founder.jpg */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem] md:max-w-sm">
          <Blob kind="a" color={C.lavender} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white">
            <span className="t-caption">Approved portrait to be added</span>
          </div>
        </div>
      </figure>
      <div className="md:col-span-8">
        <p className="t-label text-lavender">The people</p>
        <h2 className="t-h1 mt-4">A small studio that draws it and builds it.</h2>
        <p className="t-lead mt-5 measure">
          The Scribble Lab is led from Dubai by {SITE.founder.name}, {SITE.founder.role}. Our purpose
          is simple: to turn ideas into places people remember.
        </p>
        <p className="t-body mt-4 measure text-indigo-80">
          Designers, makers and installers work as one team, so the detail you approve on paper is
          the detail you get on site.
        </p>
        <Link href="/studio" className="btn btn-outline mt-7">
          Meet the studio <Arrow />
        </Link>
      </div>
    </div>
  );
}

export function ClosingCta() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 className="t-display">What are you imagining?</h2>
        <p className="t-lead mt-6 measure">
          Tell us about the space, the moment or the window. A short brief is enough to start the
          conversation.
        </p>
        <Link href="/start-a-project" className="btn btn-coral mt-9">
          Start a project <Arrow />
        </Link>
      </div>
      <div className="lg:col-span-5">
        {/* Primary full-colour logo on a light field, with its clear space kept around it */}
        <div className="mx-auto max-w-md px-6 py-6">
          <Logo variant="primary" width={400} />
        </div>
        <p className="mt-6 text-center font-[family-name:var(--font-display)] text-xl font-light leading-snug md:text-2xl">
          {SITE.tagline}
        </p>
      </div>
    </div>
  );
}
