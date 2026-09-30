export function PageHeader({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="container-x pb-8 pt-10 md:pb-12 md:pt-14">
      <p className="t-label text-lavender">{label}</p>
      <h1 className="t-display mt-4 max-w-[20ch] !text-[clamp(2.25rem,1.4rem+3.4vw,4rem)]">{title}</h1>
      {lead && <p className="t-lead mt-5 measure">{lead}</p>}
      {children}
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
