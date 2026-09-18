import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().max(200).optional(),
  title: z.string().max(300).optional(),
  tagline: z.string().max(300).optional(),
  photoBase64: z.string().max(2_000_000).nullable().optional(),
  bio: z.string().max(10_000).optional(),
  email: z.string().max(200).optional(),
  phone: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  linkedinUrl: z.string().max(500).optional(),
  scholarUrl: z.string().max(500).optional(),
  orcidUrl: z.string().max(500).optional(),
  githubUrl: z.string().max(500).optional(),
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });

  return NextResponse.json({ profile });
}
