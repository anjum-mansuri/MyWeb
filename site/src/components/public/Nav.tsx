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
    <header className="sticky top-0 z-20 border-b border-plum/10 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3.5">
        <a
          href="#top"
          className="min-w-0 shrink truncate font-serif text-lg font-semibold whitespace-nowrap text-plum"
        >
          {siteName || "Portfolio"}
        </a>
        <nav className="hidden shrink-0 gap-4 text-sm font-medium text-plum lg:flex">
          {items.map((item) => (
            <a key={item.key} href={`#${item.key}`} className="whitespace-nowrap hover:text-coral">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href="/api/cv"
            className="rounded-full bg-coral px-4 py-1.5 text-xs font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90"
          >
            Download CV
          </a>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-md border border-plum/30 px-2 py-1 text-sm text-plum lg:hidden"
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-plum/10 px-6 py-3 text-sm font-medium text-plum lg:hidden">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              onClick={() => setOpen(false)}
              className="py-1.5 hover:text-coral"
            >
              {item.label}
            </a>
          ))}
          <a href="/api/cv" className="py-1.5 font-semibold text-coral">
            Download CV
          </a>
        </nav>
      )}
    </header>
  );
}
