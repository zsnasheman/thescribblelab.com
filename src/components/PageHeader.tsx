export type HeaderArt = { src: string; w: number; h: number; alt: string };

/** Page opening: copy on a calm surface, artwork beside it. Clears the full logo that sits at the upper left. */
export function PageHeader({ label, title, lead, art, children }: { label: string; title: string; lead?: string; art?: HeaderArt; children?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden">
      <div className="container-x grid items-center gap-x-10 gap-y-2 pb-8 pt-masthead md:pb-12 lg:grid-cols-12 lg:pt-44">
        <div className={art ? "lg:col-span-7" : "lg:col-span-12"}>
          <p className="t-label text-lavender">{label}</p>
          <h1 className="t-display mt-4 max-w-[20ch] !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{title}</h1>
          {lead && <p className="t-lead mt-5 measure">{lead}</p>}
          {children}
        </div>
        {art && (
          <div aria-hidden="true" className="pointer-events-none relative mt-4 lg:col-span-5 lg:mt-0">
            <div className="blob blob-1 absolute inset-[-4%_-10%_-8%_-6%] opacity-45" style={{ backgroundImage: "url(/art/t-wash.webp)" }} />
            <div className="art-stack relative px-[4%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.src} width={art.w} height={art.h} alt="" decoding="async" className="w-full" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function SectionHead({ label, title, children, id }: { label: string; title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="t-label text-lavender">{label}</p>
      <h2 id={id} className="t-h1 mt-3">{title}</h2>
      {children && <p className="t-lead mt-4 measure">{children}</p>}
    </div>
  );
}
