"use client";

import { useState } from "react";
import type { FieldDef } from "@/lib/items";

type Item = Record<string, unknown> & { id: string; sortOrder: number };

function emptyForm(fields: FieldDef[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function ItemForm({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label className="block text-xs font-medium text-slate-600">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              value={values[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          ) : (
            <input
              type="text"
              value={values[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ListEditor({
  type,
  fields,
  titleField,
  singular,
  initialItems,
}: {
  type: string;
  fields: FieldDef[];
  titleField: string;
  singular: string;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [adding, setAdding] = useState(false);
  const [newValues, setNewValues] = useState(emptyForm(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/items/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValues),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      setItems((prev) => [...prev, data.item]);
      setNewValues(emptyForm(fields));
      setAdding(false);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(item: Item) {
    setEditingId(item.id);
    setEditValues(Object.fromEntries(fields.map((f) => [f.key, String(item[f.key] ?? "")])));
  }

  async function handleSaveEdit(id: string) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/items/${type}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
      setEditingId(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/items/${type}/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((it) => it.id !== id));
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const a = items[index];
    const b = items[targetIndex];
    const reordered = [...items];
    reordered[index] = b;
    reordered[targetIndex] = a;
    setItems(reordered);
    await Promise.all([
      fetch(`/api/admin/items/${type}/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: b.sortOrder }),
      }),
      fetch(`/api/admin/items/${type}/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: a.sortOrder }),
      }),
    ]);
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="space-y-3">
        {items.length === 0 && !adding && (
          <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
            No entries yet. Add your first {singular.toLowerCase()} below.
          </p>
        )}

        {items.map((item, index) =>
          editingId === item.id ? (
            <div key={item.id} className="rounded-lg border border-slate-300 bg-slate-50 p-4">
              <ItemForm
                fields={fields}
                values={editValues}
                onChange={(k, v) => setEditValues((prev) => ({ ...prev, [k]: v }))}
              />
              <div className="mt-3 flex gap-2">
                <button
                  disabled={busy}
                  onClick={() => handleSaveEdit(item.id)}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">
                  {String(item[titleField] ?? "(untitled)")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busy}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1 || busy}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={busy}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {adding ? (
        <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-4">
          <ItemForm
            fields={fields}
            values={newValues}
            onChange={(k, v) => setNewValues((prev) => ({ ...prev, [k]: v }))}
          />
          <div className="mt-3 flex gap-2">
            <button
              disabled={busy}
              onClick={handleCreate}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewValues(emptyForm(fields));
              }}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 w-full rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
        >
          + Add {singular.toLowerCase()}
        </button>
      )}
    </div>
  );
}
