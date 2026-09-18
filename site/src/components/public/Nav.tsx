"use client";

import { useState } from "react";

export default function Nav({
  items,
  siteName,
}: {
  items: { key: string; label: string }[];
  siteName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-cream/10 bg-ink/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
        <a
          href="#top"
          className="shrink-0 font-display text-lg font-bold tracking-wide whitespace-nowrap text-cream uppercase"
        >
          {siteName || "Portfolio"}
        </a>
        <nav className="hidden shrink gap-5 text-xs font-semibold tracking-wider text-cream/80 uppercase 2xl:flex">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className="whitespace-nowrap border-b border-transparent pb-1 transition-colors hover:border-gold hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 2xl:flex">
          <a
            href="/api/cv"
            className="rounded-full bg-gold px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-ink transition-opacity hover:opacity-90"
          >
            Download CV
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-md border border-cream/30 px-2 py-1 text-sm text-cream 2xl:hidden"
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-cream/10 px-6 py-3 text-sm font-medium tracking-wide text-cream/80 uppercase 2xl:hidden">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              onClick={() => setOpen(false)}
              className="py-1.5 hover:text-gold"
            >
              {item.label}
            </a>
          ))}
          <a href="/api/cv" className="py-1.5 font-semibold text-gold">
            Download CV
          </a>
        </nav>
      )}
    </header>
  );
}
