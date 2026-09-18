"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { resizeImageToDataUrl } from "@/lib/image";

type ProfileForm = {
  name: string;
  title: string;
  tagline: string;
  photoBase64: string | null;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  scholarUrl: string;
  orcidUrl: string;
};

const EMPTY: ProfileForm = {
  name: "",
  title: "",
  tagline: "",
  photoBase64: null,
  bio: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  scholarUrl: "",
  orcidUrl: "",
};

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
      )}
    </div>
  );
}

export default function ProfileEditorPage() {
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setForm({ ...EMPTY, ...data.profile });
      })
      .finally(() => setLoading(false));
  }, []);

  function set<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      set("photoBase64", dataUrl);
    } catch {
      setStatus("Could not process that image.");
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error ?? "Could not save.");
        return;
      }
      setStatus("Saved.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-slate-900">
        Hero, About &amp; Contact
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        These fields power the Hero, About Me, and Contact sections.
      </p>

      <div className="mt-6 space-y-8 rounded-xl border border-slate-200 bg-white p-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Hero</h2>
          <div className="mt-3 flex items-center gap-4">
            {form.photoBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.photoBase64}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                No photo
              </div>
            )}
            <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => set("name", v)} />
            <Field label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="Assistant Professor, Computer Applications" />
            <div className="sm:col-span-2">
              <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About Me</h2>
          <div className="mt-3">
            <Field label="Bio" value={form.bio} onChange={(v) => set("bio", v)} textarea />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => set("linkedinUrl", v)} />
            <Field label="Google Scholar URL" value={form.scholarUrl} onChange={(v) => set("scholarUrl", v)} />
            <Field label="ORCID URL" value={form.orcidUrl} onChange={(v) => set("orcidUrl", v)} />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
            <Field label="Location" value={form.location} onChange={(v) => set("location", v)} />
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {status && <span className="text-sm text-slate-500">{status}</span>}
        </div>
      </div>
    </div>
  );
}
