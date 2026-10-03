export function PageHeader({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="container-x pb-10 pt-masthead md:pb-14">
      <p className="t-label text-lavender">{label}</p>
      <h1 className="t-lux mt-4 max-w-[16ch] !text-[clamp(2.4rem,1rem+5.2vw,5.5rem)]">{title}</h1>
      <div aria-hidden="true" className="rule-draw mt-8 h-px w-24 bg-coral" />
      {lead && <p className="t-lead mt-6 measure">{lead}</p>}
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
