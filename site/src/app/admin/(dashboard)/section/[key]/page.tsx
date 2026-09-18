import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isItemTypeKey, itemTypeConfig } from "@/lib/items";
import ListEditor from "@/components/admin/ListEditor";

type PrismaDelegate = { findMany: (args: unknown) => Promise<unknown[]> };

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!isItemTypeKey(key)) notFound();

  const config = itemTypeConfig(key);
  const delegate = (prisma as unknown as Record<string, PrismaDelegate>)[config.model as string];
  const items = await delegate.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900">
        ← Back to dashboard
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-slate-900">{config.label}</h1>
      <div className="mt-6">
        <ListEditor
          type={key}
          fields={config.fields}
          titleField={config.titleField}
          singular={config.singular}
          initialItems={items as never}
        />
      </div>
    </div>
  );
}
