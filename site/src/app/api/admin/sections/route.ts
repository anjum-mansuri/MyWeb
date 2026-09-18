import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { SECTIONS } from "@/lib/sections";
import type { SectionKey } from "@prisma/client";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const rows = await prisma.section.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r.isPublic]));

  const sections = SECTIONS.map((s) => ({
    key: s.key,
    label: s.label,
    kind: s.kind,
    isPublic: byKey.get(s.key) ?? s.defaultPublic,
  }));

  return NextResponse.json({ sections });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: { key?: string; isPublic?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const validKeys = SECTIONS.map((s) => s.key);
  if (typeof body.key !== "string" || !validKeys.includes(body.key as SectionKey)) {
    return NextResponse.json({ error: "Unknown section key." }, { status: 400 });
  }
  if (typeof body.isPublic !== "boolean") {
    return NextResponse.json({ error: "isPublic must be a boolean." }, { status: 400 });
  }

  const updated = await prisma.section.upsert({
    where: { key: body.key as SectionKey },
    update: { isPublic: body.isPublic },
    create: { key: body.key as SectionKey, isPublic: body.isPublic },
  });

  return NextResponse.json({ section: updated });
}
