import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SECTIONS } from "@/lib/sections";
import SectionToggle from "@/components/admin/SectionToggle";

export default async function AdminDashboardPage() {
  const rows = await prisma.section.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r.isPublic]));

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-slate-900">Sections</h1>
      <p className="mt-1 text-sm text-slate-500">
        Toggle each section public or private, and edit its content.
      </p>

      <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {SECTIONS.map((s) => {
          const editHref = s.kind === "profile" ? "/admin/profile" : `/admin/section/${s.key}`;
          return (
            <div key={s.key} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-slate-900">{s.label}</p>
              </div>
              <div className="flex items-center gap-3">
                <SectionToggle sectionKey={s.key} initialPublic={byKey.get(s.key) ?? s.defaultPublic} />
                <Link
                  href={editHref}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
