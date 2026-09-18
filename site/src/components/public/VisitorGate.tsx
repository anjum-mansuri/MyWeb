"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import WaveformRibbon from "./WaveformRibbon";
import GlowBackdrop from "./GlowBackdrop";

export default function VisitorGate({
  name,
  title,
  photoBase64,
}: {
  name: string;
  title: string;
  photoBase64: string | null;
}) {
  const router = useRouter();
  const [formName, setFormName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email, reason, source: "gate" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16 text-cream">
      <GlowBackdrop />
      <WaveformRibbon />
      <div className="relative z-10 w-full max-w-md text-center">
        {photoBase64 && (
          <div
            className="mx-auto mb-6 h-32 w-32 rounded-full p-1.5 shadow-2xl"
            style={{ background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoBase64}
              alt={name}
              className="h-full w-full rounded-full border-[3px] border-ink object-cover"
            />
          </div>
        )}
        <h1 className="font-display text-3xl font-bold">{name || "Welcome"}</h1>
        {title && <p className="mt-1.5 text-[15px] text-cream/70">{title}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-2xl border border-cream/15 bg-surface p-6 text-left"
        >
          <p className="mb-4 text-sm text-cream/60">
            Please share a few details to view the full profile.
          </p>

          <input
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your Name"
            className="mb-2.5 w-full rounded-lg border border-cream/15 bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="mb-2.5 w-full rounded-lg border border-cream/15 bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for visiting (optional)"
            className="mb-3.5 w-full rounded-lg border border-cream/15 bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold"
          />

          {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait…" : "View Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
