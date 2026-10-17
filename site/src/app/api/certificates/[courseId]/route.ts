import { prisma } from "@/lib/prisma";

/** Public: serves a course's certificate file, only while the Courses section is public. */
export async function GET(_request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;

  const section = await prisma.section.findUnique({ where: { key: "courses" } });
  if (section && !section.isPublic) return new Response("Not found", { status: 404 });

  const certificate = await prisma.certificate.findUnique({ where: { courseId } });
  if (!certificate) return new Response("Not found", { status: 404 });

  // Older uploads were stored as a full data URL ("data:...;base64,<body>"); decode only the body
  const commaIndex = certificate.dataBase64.indexOf(",");
  const base64Body = commaIndex >= 0 ? certificate.dataBase64.slice(commaIndex + 1) : certificate.dataBase64;
  const bytes = Buffer.from(base64Body, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": certificate.mimeType,
      "Content-Disposition": `inline; filename="${certificate.filename.replace(/"/g, "")}"`,
      "Cache-Control": "no-cache",
    },
  });
}
