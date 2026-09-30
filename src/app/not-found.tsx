import Link from "next/link";
import { Bubbles } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-x py-24 md:py-32">
      <Bubbles size={12} />
      <h1 className="t-display mt-8">That page has been rubbed out.</h1>
      <p className="t-lead mt-6 measure">
        The link may be old or mistyped. Try the homepage, or see what we have made.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-indigo">Home</Link>
        <Link href="/work" className="btn btn-outline">Work</Link>
      </div>
    </div>
  );
}
