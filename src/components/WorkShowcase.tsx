import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { Arrow } from "./shapes";
import { allProjects } from "@/content";

export function WorkShowcase() {
  const pick = ["concept-courtyard-lounge", "concept-hall-stand", "concept-launch-stage", "concept-sliding-window"];
  const all = allProjects();
  const chosen = pick.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as typeof all;
  const list = chosen.length ? chosen : all.slice(0, 4);
  const spans = ["lg:col-span-7", "lg:col-span-5 lg:mt-20", "lg:col-span-5", "lg:col-span-7 lg:mt-20"];
  return (
    <div>
      {list.length === 0 ? (
        <p className="t-lead measure">
          Our first case studies are being prepared. In the meantime,{" "}
          <Link className="link" href="/start-a-project">tell us what you are imagining</Link>.
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 120} className={spans[i]}>
              <ProjectCard p={p} />
            </Reveal>
          ))}
        </div>
      )}
      <div className="mt-14">
        <Link href="/work" className="btn btn-indigo">
          See all work <Arrow />
        </Link>
      </div>
    </div>
  );
}
