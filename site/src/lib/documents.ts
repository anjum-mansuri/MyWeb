import { PDFParse } from "pdf-parse";

/** Extract plain text from a PDF buffer for use as AI context. Returns null for non-PDF or unreadable files. */
export async function extractPdfText(buffer: Buffer): Promise<string | null> {
  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text.slice(0, 100_000);
  } catch (err) {
    console.error("PDF extraction failed:", err);
    return null;
  }
}

export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
