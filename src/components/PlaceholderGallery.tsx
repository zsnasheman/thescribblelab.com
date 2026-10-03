import { Reveal } from "./Reveal";
import { PLACEHOLDER_IMAGES } from "@/content/placeholders";

/** Interior imagery supplied as placeholders: a photograph and four design visuals, labelled by what they are. */
export function PlaceholderGallery() {
  const [lead, ...rest] = PLACEHOLDER_IMAGES;
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <figure className="relative overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lead.src} width={lead.w} height={lead.h} alt={lead.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full md:min-h-[26rem]" />
            <figcaption className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] shadow-sm">Photograph · {lead.title}</figcaption>
          </figure>
        </Reveal>
        <div className="grid gap-4 md:col-span-5">
          {rest.slice(0, 2).map((img, i) => (
            <Reveal key={img.id} delay={i * 90}>
              <figure className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.thumb} width={640} height={320} alt={img.alt} loading="lazy" decoding="async" className="aspect-[2/1] w-full object-cover" />
                <figcaption className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] shadow-sm">Design visual · {img.title}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        {rest.slice(2).map((img, i) => (
          <Reveal key={img.id} delay={i * 90} className="md:col-span-6">
            <figure className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} width={img.w} height={img.h} alt={img.alt} loading="lazy" decoding="async" className="aspect-[2/1] w-full object-cover" />
              <figcaption className="t-label absolute left-3 top-3 rounded-full bg-paper px-3 py-2 text-[0.625rem] shadow-sm">Design visual · {img.title}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="t-caption mt-4 text-indigo-80">Placeholder imagery.</p>
    </div>
  );
}
