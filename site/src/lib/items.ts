import { z } from "zod";
import { prisma } from "./prisma";
import type { SectionKey } from "@prisma/client";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number";
  placeholder?: string;
};

export type ItemTypeConfig = {
  sectionKey: SectionKey;
  /** Property name on the Prisma client, e.g. prisma.education */
  model: keyof typeof prisma;
  label: string;
  singular: string;
  fields: FieldDef[];
  schema: z.ZodTypeAny;
  /** Field used as the row's primary display title in the admin list */
  titleField: string;
};

const optionalStr = z.string().max(4000).optional().default("");

export const ITEM_TYPES = {
  education: {
    sectionKey: "education",
    model: "education",
    label: "Education",
    singular: "Education entry",
    titleField: "degree",
    fields: [
      { key: "degree", label: "Degree", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "dateRange", label: "Dates", type: "text", placeholder: "e.g. 2015 - 2019" },
      { key: "result", label: "Result / Grade", type: "text" },
    ],
    schema: z.object({
      degree: z.string().min(1, "Degree is required").max(300),
      institution: optionalStr,
      dateRange: optionalStr,
      result: optionalStr,
    }),
  },
  experience: {
    sectionKey: "experience",
    model: "experience",
    label: "Professional Experience",
    singular: "Experience entry",
    titleField: "role",
    fields: [
      { key: "role", label: "Role / Title", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "dateRange", label: "Dates", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    schema: z.object({
      role: z.string().min(1, "Role is required").max(300),
      organization: optionalStr,
      dateRange: optionalStr,
      description: optionalStr,
    }),
  },
  research: {
    sectionKey: "research",
    model: "researchHighlight",
    label: "Doctoral Research / Key Research Summary",
    singular: "Research highlight",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "dateRange", label: "Dates", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(300),
      dateRange: optionalStr,
      description: optionalStr,
    }),
  },
  publications: {
    sectionKey: "publications",
    model: "publication",
    label: "Publications",
    singular: "Publication",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "authors", label: "Authors", type: "text" },
      { key: "venue", label: "Venue / Journal", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "doiOrLink", label: "DOI / Link", type: "text" },
      { key: "citation", label: "Full citation", type: "textarea" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(500),
      authors: optionalStr,
      venue: optionalStr,
      year: optionalStr,
      doiOrLink: optionalStr,
      citation: optionalStr,
    }),
  },
  patents: {
    sectionKey: "patents",
    model: "patent",
    label: "Intellectual Property / Patents",
    singular: "Patent / IP entry",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "number", label: "Patent / Application No.", type: "text" },
      { key: "status", label: "Status", type: "text", placeholder: "Filed / Granted / Pending" },
      { key: "date", label: "Date", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(300),
      number: optionalStr,
      status: optionalStr,
      date: optionalStr,
      description: optionalStr,
    }),
  },
  awards: {
    sectionKey: "awards",
    model: "award",
    label: "Awards & Honors",
    singular: "Award",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(300),
      issuer: optionalStr,
      year: optionalStr,
      description: optionalStr,
    }),
  },
  skills: {
    sectionKey: "skills",
    model: "skill",
    label: "Skills",
    singular: "Skill",
    titleField: "name",
    fields: [
      { key: "name", label: "Skill", type: "text" },
      { key: "category", label: "Category", type: "text", placeholder: "optional" },
      { key: "level", label: "Proficiency (0-100)", type: "number", placeholder: "75" },
    ],
    schema: z.object({
      name: z.string().min(1, "Skill name is required").max(100),
      category: optionalStr,
      level: z.coerce.number().int().min(0).max(100).optional().default(75),
    }),
  },
  teaching: {
    sectionKey: "teaching",
    model: "teachingService",
    label: "Teaching & Academic Service",
    singular: "Teaching / service entry",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "dateRange", label: "Dates", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(300),
      role: optionalStr,
      institution: optionalStr,
      dateRange: optionalStr,
      description: optionalStr,
    }),
  },
  courses: {
    sectionKey: "courses",
    model: "course",
    label: "Courses & Certifications",
    singular: "Course / certification",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "provider", label: "Provider", type: "text" },
      { key: "year", label: "Year", type: "text" },
    ],
    schema: z.object({
      title: z.string().min(1, "Title is required").max(300),
      provider: optionalStr,
      year: optionalStr,
    }),
  },
  languages: {
    sectionKey: "languages",
    model: "language",
    label: "Languages",
    singular: "Language",
    titleField: "name",
    fields: [
      { key: "name", label: "Language", type: "text" },
      { key: "proficiency", label: "Proficiency", type: "text" },
    ],
    schema: z.object({
      name: z.string().min(1, "Language is required").max(100),
      proficiency: optionalStr,
    }),
  },
  references: {
    sectionKey: "references",
    model: "reference",
    label: "References",
    singular: "Reference",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "title", label: "Title / Position", type: "text" },
      { key: "institution", label: "Institution", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
    ],
    schema: z.object({
      name: z.string().min(1, "Name is required").max(200),
      title: optionalStr,
      institution: optionalStr,
      email: optionalStr,
      phone: optionalStr,
    }),
  },
} as const satisfies Record<string, ItemTypeConfig>;

export type ItemTypeKey = keyof typeof ITEM_TYPES;

export function isItemTypeKey(key: string): key is ItemTypeKey {
  return Object.prototype.hasOwnProperty.call(ITEM_TYPES, key);
}

export function itemTypeConfig(key: ItemTypeKey): ItemTypeConfig {
  return ITEM_TYPES[key];
}
