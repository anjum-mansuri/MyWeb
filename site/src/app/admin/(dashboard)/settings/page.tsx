"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setEnabled(Boolean(data.settings?.visitorGateEnabled)))
      .finally(() => setLoading(false));
  }, []);

  async function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorGateEnabled: next }),
      });
      if (!res.ok) setEnabled(!next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-slate-900">Settings</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Visitor gate</p>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              When enabled, visitors must submit their name, email, and (optionally) their reason
              for visiting before they can view your public profile.
            </p>
          </div>
          <button
            onClick={toggle}
            disabled={loading || saving}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              enabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-300 bg-slate-100 text-slate-500"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}
