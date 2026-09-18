import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const askSchema = z.object({
  question: z.string().min(1).max(4000),
  imageDataUrl: z.string().max(10_000_000).optional(),
});

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mediaType: match[1], base64: match[2] };
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY configuration." },
      { status: 500 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = askSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const [profile, documents] = await Promise.all([
    prisma.profile.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.document.findMany({
      select: { filename: true, extractedText: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const docContext = documents
    .filter((d) => d.extractedText)
    .map((d) => `--- Document: ${d.filename} ---\n${d.extractedText}`)
    .join("\n\n")
    .slice(0, 150_000);

  const profileContext = `Name: ${profile.name}\nTitle: ${profile.title}\nBio: ${profile.bio}\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLocation: ${profile.location}\nLinkedIn: ${profile.linkedinUrl}\nGitHub: ${profile.githubUrl}\nGoogle Scholar: ${profile.scholarUrl}\nORCID: ${profile.orcidUrl}\nResearchGate: ${profile.researchGateUrl}`;

  const systemPrompt = `You are a private personal assistant for ${profile.name || "the site owner"}, helping them recall their own academic/professional details and read their uploaded documents. Answer directly and concisely using the profile info and documents provided below. If asked about something not covered, say so plainly rather than guessing.\n\nPROFILE:\n${profileContext}\n\nUPLOADED DOCUMENTS:\n${docContext || "(none uploaded yet)"}`;

  const contentBlocks: Anthropic.MessageParam["content"] = [];
  if (parsed.data.imageDataUrl) {
    const img = parseDataUrl(parsed.data.imageDataUrl);
    if (img) {
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType as "image/jpeg", data: img.base64 },
      });
    }
  }
  contentBlocks.push({ type: "text", text: parsed.data.question });

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const answer = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
