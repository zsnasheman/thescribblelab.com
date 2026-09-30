export function PageHeader({ label, title, lead, children }: { label: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <header className="container-x pb-10 pt-10 md:pb-16 md:pt-16">
      <p className="t-label text-lavender">{label}</p>
      <h1 className="t-mega mt-5 max-w-[14ch]">{title}</h1>
      {lead && <p className="t-lead mt-8 measure">{lead}</p>}
      {children}
    </header>
  );
}
