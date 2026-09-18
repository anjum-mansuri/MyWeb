import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isItemTypeKey, itemTypeConfig, type ItemTypeKey } from "@/lib/items";

type PrismaDelegate = {
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
};

function delegateFor(type: ItemTypeKey): PrismaDelegate {
  const config = itemTypeConfig(type);
  return (prisma as unknown as Record<string, PrismaDelegate>)[config.model as string];
}

const reorderSchema = z.object({ sortOrder: z.number().int() });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { type, id } = await params;
  if (!isItemTypeKey(type)) {
    return NextResponse.json({ error: "Unknown item type." }, { status: 404 });
  }

  const config = itemTypeConfig(type);
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const isReorder =
    typeof raw === "object" && raw !== null && "sortOrder" in raw && Object.keys(raw).length === 1;
  const parsed = isReorder ? reorderSchema.safeParse(raw) : config.schema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  try {
    const updated = await delegateFor(type).update({ where: { id }, data: parsed.data });
    return NextResponse.json({ item: updated });
  } catch {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { type, id } = await params;
  if (!isItemTypeKey(type)) {
    return NextResponse.json({ error: "Unknown item type." }, { status: 404 });
  }

  try {
    await delegateFor(type).delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }
}
