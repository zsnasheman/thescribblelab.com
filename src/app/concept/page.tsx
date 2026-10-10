import type { Metadata } from "next";
import { ConceptJourney } from "@/components/concept/ConceptJourney";
import { CounterBar } from "@/components/concept/CounterBar";
import { ConceptProjects } from "@/components/concept/ConceptProjects";

export const metadata: Metadata = { title: "Homepage concept", robots: { index: false, follow: false } };

export default function ConceptPage() {
  return (
    <div className="overflow-x-clip pb-28">
      <ConceptJourney />
      <ConceptProjects />
      <CounterBar />
    </div>
  );
}
