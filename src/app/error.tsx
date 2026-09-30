"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-x py-24 md:py-32">
      <h1 className="t-h1">Something went wrong.</h1>
      <p className="t-lead mt-4 measure">Please try again. If it keeps happening, email nash@thescribblelab.com.</p>
      <button type="button" className="btn btn-indigo mt-8" onClick={reset}>Try again</button>
    </div>
  );
}
