"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";

type DocMeta = {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/documents")
      .then((r) => r.json())
      .then((data) => setDocs(data.documents ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const dataBase64 = await fileToDataUrl(file);
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, mimeType: file.type || "application/octet-stream", dataBase64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setDocs((prev) => [data.document, ...prev]);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    if (res.ok) setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-slate-900">Documents</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload CVs, papers, forms, or photos of documents. Uploaded PDFs are read automatically so you can ask
        questions about them on the <Link href="/admin/ask" className="underline">Ask</Link> page.
      </p>

      {error && <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <label className="mt-6 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 py-6 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50">
        {uploading ? "Uploading…" : "+ Upload a document or photo"}
        <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="px-5 py-4 text-sm text-slate-500">Loading…</p>
        ) : docs.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No documents uploaded yet.</p>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{doc.filename}</p>
                <p className="text-xs text-slate-500">
                  {formatSize(doc.sizeBytes)} · {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`/api/admin/documents/${doc.id}`}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
