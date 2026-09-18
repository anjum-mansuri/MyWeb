"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import WaveformRibbon from "./WaveformRibbon";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-plum px-6 py-16 text-white">
      <WaveformRibbon />
      <div className="relative z-10 w-full max-w-md text-center">
        {photoBase64 && (
          <div
            className="mx-auto mb-6 h-32 w-32 rounded-full p-1.5 shadow-2xl"
            style={{ background: "linear-gradient(135deg, var(--color-coral), var(--color-coral-light))" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoBase64}
              alt={name}
              className="h-full w-full rounded-full border-[3px] border-white/40 object-cover"
            />
          </div>
        )}
        <h1 className="font-serif text-3xl font-medium">{name || "Welcome"}</h1>
        {title && <p className="mt-1.5 text-[15px] text-white/80">{title}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-2xl border border-white/15 bg-white/[0.06] p-6 text-left"
        >
          <p className="mb-4 text-sm text-white/70">
            Please share a few details to view the full profile.
          </p>

          <input
            required
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your Name"
            className="mb-2.5 w-full rounded-lg border-0 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="mb-2.5 w-full rounded-lg border-0 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-coral"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for visiting (optional)"
            className="mb-3.5 w-full rounded-lg border-0 px-3.5 py-2.5 text-sm text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-coral"
          />

          {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-coral py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait…" : "View Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
