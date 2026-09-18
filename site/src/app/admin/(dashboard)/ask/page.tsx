"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

type Turn = { question: string; answer: string; imagePreview?: string };

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Turn[]>([]);

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImageDataUrl(await fileToDataUrl(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() && !imageDataUrl) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim() || "What does this photo show or say?",
          imageDataUrl: imageDataUrl ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setHistory((prev) => [
        { question: question.trim() || "(photo question)", answer: data.answer, imagePreview: imageDataUrl ?? undefined },
        ...prev,
      ]);
      setQuestion("");
      setImageDataUrl(null);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-slate-900">Ask</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ask about your profile or any uploaded document — type a question, or attach a photo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        {imageDataUrl && (
          <div className="mb-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageDataUrl} alt="Attached" className="h-16 w-16 rounded-md object-cover" />
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              className="text-xs font-medium text-red-600"
            >
              Remove photo
            </button>
          </div>
        )}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What's my ORCID? Summarize my thesis abstract."
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">
            Take / attach photo
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          </label>
          <button
            type="submit"
            disabled={loading || (!question.trim() && !imageDataUrl)}
            className="ml-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Asking…" : "Ask"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-6 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
              {turn.imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={turn.imagePreview} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />
              )}
              <p className="font-medium text-slate-900">{turn.question}</p>
            </div>
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm whitespace-pre-line text-slate-700">
              {turn.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
