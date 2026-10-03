import { Slide } from "./Slide";
import { Patch } from "./Cutout";

const LINES = [
  { k: "Our attitude", t: "Our clients don’t come to us for safe. They come to us because ordinary stopped working.", d: "We’re a Dubai-based creative agency that concepts, builds and activates spaces and experiences people actually remember. Interior design. Brand activations. Exhibitions. Events. Retail pop-ups. We do it all and we do it bold." },
  { k: "How we think", t: "Nothing gets built without a scribble first.", d: "The scribble always comes before the structure. We take ideas from napkin to reality: concepting, designing and building end to end so nothing gets lost in translation." },
  { k: "Who we are", t: "We call ourselves Scribblers.", d: "We walk into a blank space and see the finished room. We look at a brief and sketch something nobody asked for but everybody needed. We lose sleep over the angle of a spotlight and the texture of a wall that most people will never notice but will always feel." },
] as const;

/** Short, confident write-ups in the studio's own words (company profile), each arriving from a different side. */
export function Attitude() {
  return (
    <div className="space-y-20 md:space-y-32">
      {LINES.map((l, i) => (
        <Slide key={l.k} from={i % 2 ? "right" : "left"}>
          <div className={`relative grid gap-6 md:grid-cols-12 ${i % 2 ? "" : ""}`}>
            <Patch shape={i === 0 ? "blob-c" : i === 1 ? "blob-a" : "blob-b"} color={["#ffe0d8", "#e1dce9", "#d9efe7"][i]} className={`-z-10 h-[140%] w-[46%] ${i % 2 ? "left-0 top-[-20%]" : "right-0 top-[-20%]"}`} />
            <div className={`md:col-span-7 ${i % 2 ? "md:col-start-6" : ""}`}>
              <p className="cap text-lavender">{l.k}</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,1rem+3.4vw,4rem)] leading-[1.05]">{l.t}</p>
              <p className="t-lead mt-5 max-w-[52ch] text-indigo-80">{l.d}</p>
            </div>
          </div>
        </Slide>
      ))}
    </div>
  );
}
