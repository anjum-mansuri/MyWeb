"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, source: "contact" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
        Thank you — your message has been sent.
      </p>
    );
  }

  const inputClass =
    "mb-2.5 w-full rounded-lg border border-cream/15 bg-ink/40 px-3.5 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <input
        required
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <textarea
        required
        placeholder="Message"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={inputClass}
      />
      {error && <p className="mb-2.5 text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
