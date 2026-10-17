// Kept separate from documents.ts: that module loads pdf-parse, which crashes on Vercel at import time.

export const ALLOWED_CERTIFICATE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

/** Vercel rejects request bodies over 4.5MB and base64 adds ~33%, so certificates must stay under 3MB. */
export const MAX_CERTIFICATE_BYTES = 3 * 1024 * 1024;
