import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { extractPdfText, MAX_DOCUMENT_BYTES } from "@/lib/documents";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, mimeType: true, sizeBytes: true, createdAt: true },
  });
  return NextResponse.json({ documents });
}

const uploadSchema = z.object({
  filename: z.string().min(1).max(300),
  mimeType: z.string().min(1).max(150),
  dataBase64: z.string().min(1),
});

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

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
  const commaIndex = dataBase64.indexOf(",");
  const base64Body = commaIndex >= 0 ? dataBase64.slice(commaIndex + 1) : dataBase64;
  const buffer = Buffer.from(base64Body, "base64");

  if (buffer.byteLength > MAX_DOCUMENT_BYTES) {
    return NextResponse.json({ error: "File is too large (max 8MB)." }, { status: 400 });
  }

  const extractedText = mimeType === "application/pdf" ? await extractPdfText(buffer) : null;

  const document = await prisma.document.create({
    data: {
      filename,
      mimeType,
      dataBase64,
      extractedText,
      sizeBytes: buffer.byteLength,
    },
    select: { id: true, filename: true, mimeType: true, sizeBytes: true, createdAt: true },
  });

  return NextResponse.json({ document }, { status: 201 });
}
