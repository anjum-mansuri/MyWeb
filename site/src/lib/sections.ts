import type { SectionKey } from "@prisma/client";

export type SectionMeta = {
  key: SectionKey;
  label: string;
  navLabel: string;
  defaultPublic: boolean;
  /** "profile" edits live on /admin/profile, "list" edits live on /admin/section/[key] */
  kind: "profile" | "list";
};

export const SECTIONS: SectionMeta[] = [
  { key: "hero", label: "Hero / Intro", navLabel: "Home", defaultPublic: true, kind: "profile" },
  { key: "about", label: "About Me", navLabel: "About", defaultPublic: true, kind: "profile" },
  { key: "education", label: "Education", navLabel: "Education", defaultPublic: true, kind: "list" },
  { key: "experience", label: "Professional Experience", navLabel: "Experience", defaultPublic: true, kind: "list" },
  { key: "research", label: "Doctoral Research / Key Research Summary", navLabel: "Research", defaultPublic: true, kind: "list" },
  { key: "publications", label: "Publications", navLabel: "Publications", defaultPublic: true, kind: "list" },
  { key: "patents", label: "Intellectual Property / Patents", navLabel: "Patents", defaultPublic: false, kind: "list" },
  { key: "awards", label: "Awards & Honors", navLabel: "Awards", defaultPublic: true, kind: "list" },
  { key: "skills", label: "Skills", navLabel: "Skills", defaultPublic: true, kind: "list" },
  { key: "teaching", label: "Teaching & Academic Service", navLabel: "Teaching", defaultPublic: true, kind: "list" },
  { key: "courses", label: "Courses & Certifications", navLabel: "Courses", defaultPublic: true, kind: "list" },
  { key: "languages", label: "Languages", navLabel: "Languages", defaultPublic: true, kind: "list" },
  { key: "references", label: "References", navLabel: "References", defaultPublic: false, kind: "list" },
  { key: "contact", label: "Contact", navLabel: "Contact", defaultPublic: true, kind: "profile" },
];

export function sectionMeta(key: SectionKey): SectionMeta {
  const meta = SECTIONS.find((s) => s.key === key);
  if (!meta) throw new Error(`Unknown section key: ${key}`);
  return meta;
}
