import { Bubbles } from "./shapes";

export function PageHeader({
  label,
  title,
  lead,
  children,
}: {
  label: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="container-x pb-10 pt-14 md:pb-14 md:pt-20">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-4xl">
          <p className="t-label text-lavender">{label}</p>
          <h1 className="t-display mt-5">{title}</h1>
          {lead && <p className="t-lead mt-6 measure">{lead}</p>}
          {children}
        </div>
        <Bubbles size={12} className="mt-2 hidden shrink-0 md:block" />
      </div>
    </header>
  );
}
