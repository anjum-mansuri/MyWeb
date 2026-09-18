import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isItemTypeKey, itemTypeConfig, type ItemTypeKey } from "@/lib/items";

type PrismaDelegate = {
  findMany: (args: unknown) => Promise<unknown[]>;
  count: (args?: unknown) => Promise<number>;
  create: (args: unknown) => Promise<unknown>;
};

function delegateFor(type: ItemTypeKey): PrismaDelegate {
  const config = itemTypeConfig(type);
  return (prisma as unknown as Record<string, PrismaDelegate>)[config.model as string];
}

export async function GET(_request: Request, { params }: { params: Promise<{ type: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { type } = await params;
  if (!isItemTypeKey(type)) {
    return NextResponse.json({ error: "Unknown item type." }, { status: 404 });
  }

  const items = await delegateFor(type).findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ items });
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { type } = await params;
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

  const parsed = config.schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const delegate = delegateFor(type);
  const count = await delegate.count();
  const fields = parsed.data as Record<string, unknown>;
  const created = await delegate.create({ data: { ...fields, sortOrder: count } });

  return NextResponse.json({ item: created }, { status: 201 });
}
