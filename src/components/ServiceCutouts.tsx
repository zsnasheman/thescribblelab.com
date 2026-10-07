import Link from "next/link";
import { Cutout, type Shape } from "./Cutout";
import { Slide } from "./Slide";
import { services } from "@/content";
import { shot } from "@/content/showcase";

const PIC = { interiors: shot("laduree-dubai-hills", 0), exhibitions: shot("laduree-expex", 0), events: shot("ahmed-al-maghribi-launch", 3), "brand-activations": shot("fifa-arab-cup-qatar", 0), "kinetic-windows": shot("chopard-kinetic-windows", 0) } as const;
const SH: Shape[] = ["blob-a", "arch", "circle", "blob-b", "pill"];
const PA = ["tex:09-coral", "tex:01-emerald", "tex:08-lavender", "tex:09-mustard", "tex:01-indigo"];

/** The five disciplines as cut-out pictures, each sliding in from alternating sides. */
export function ServiceCutouts() {
  return (
    <ol className="space-y-14 md:space-y-24">
      {services.map((s, i) => {
        const pic = PIC[s.slug]; const flip = i % 2 === 1;
        return (
          <li key={s.slug}>
            <Slide from={flip ? "right" : "left"}>
              <Link href={`/services/${s.slug}`} className={`group grid items-center gap-8 no-underline md:grid-cols-12 ${flip ? "" : ""}`}>
                <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                  <Cutout src={pic.image.thumb} alt={pic.alt} shape={SH[i]} patch={PA[i]} ratio={SH[i] === "arch" ? "4 / 5" : SH[i] === "pill" ? "1.5 / 1" : "1 / 1"} width={820} height={600} className="mx-auto w-[78%] transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-[1.03] md:w-full" />
                </div>
                <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                  <p className="cap text-lavender">0{i + 1}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(2.2rem,1rem+4vw,4.8rem)] leading-none"><span className="draw-link">{s.name}</span></h3>
                  <p className="t-lead mt-4 max-w-[34ch]">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold">See the work <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            </Slide>
          </li>
        );
      })}
    </ol>
  );
}
