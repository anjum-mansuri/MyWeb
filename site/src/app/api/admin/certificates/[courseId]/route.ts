import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ALLOWED_CERTIFICATE_TYPES, MAX_CERTIFICATE_BYTES } from "@/lib/certificates";

const uploadSchema = z.object({
  filename: z.string().min(1).max(300),
  mimeType: z.string().min(1).max(150),
  dataBase64: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { courseId } = await params;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = uploadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const { filename, mimeType, dataBase64 } = parsed.data;
  if (!ALLOWED_CERTIFICATE_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: "Certificate must be a PDF, PNG, JPG, or WebP file." }, { status: 400 });
  }

  const commaIndex = dataBase64.indexOf(",");
  const base64Body = commaIndex >= 0 ? dataBase64.slice(commaIndex + 1) : dataBase64;
  const buffer = Buffer.from(base64Body, "base64");
  if (buffer.byteLength > MAX_CERTIFICATE_BYTES) {
    return NextResponse.json({ error: "File is too large (max 3MB)." }, { status: 400 });
  }

  try {
    const certificate = await prisma.certificate.upsert({
      where: { courseId },
      create: { courseId, filename, mimeType, dataBase64: base64Body, sizeBytes: buffer.byteLength },
      update: { filename, mimeType, dataBase64: base64Body, sizeBytes: buffer.byteLength },
      select: { id: true, courseId: true, filename: true, mimeType: true, sizeBytes: true },
    });
    return NextResponse.json({ certificate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { courseId } = await params;
  await prisma.certificate.deleteMany({ where: { courseId } });
  return NextResponse.json({ ok: true });
}
