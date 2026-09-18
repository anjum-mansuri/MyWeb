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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a href="#top" className="font-serif text-lg font-semibold text-slate-900">
          {siteName || "Portfolio"}
        </a>
        <nav className="hidden gap-5 text-sm font-medium text-slate-600 md:flex">
          {items.map((item) => (
            <a key={item.key} href={`#${item.key}`} className="hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600 md:hidden"
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 md:hidden">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              onClick={() => setOpen(false)}
              className="py-1.5 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
