"use client";

import { useState } from "react";
import type { SectionKey } from "@prisma/client";

export default function SectionToggle({
  sectionKey,
  initialPublic,
}: {
  sectionKey: SectionKey;
  initialPublic: boolean;
}) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !isPublic;
    setIsPublic(next);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: sectionKey, isPublic: next }),
      });
      if (!res.ok) setIsPublic(!next);
    } catch {
      setIsPublic(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        isPublic
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-300 bg-slate-100 text-slate-500"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isPublic ? "bg-emerald-500" : "bg-slate-400"}`} />
      {isPublic ? "Public" : "Private"}
    </button>
  );
}
