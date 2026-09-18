import { prisma } from "./prisma";
import { SECTIONS } from "./sections";
import type { SectionKey } from "@prisma/client";

export async function getPublicData() {
  const [sectionRows, profile, settings] = await Promise.all([
    prisma.section.findMany(),
    prisma.profile.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);

  const isPublicMap = new Map(sectionRows.map((r) => [r.key, r.isPublic]));
  const isPublic = (key: SectionKey) =>
    isPublicMap.get(key) ?? SECTIONS.find((s) => s.key === key)!.defaultPublic;

  const orderBy = { sortOrder: "asc" as const };

  const [
    education,
    experience,
    research,
    publications,
    patents,
    awards,
    skills,
    teaching,
    courses,
    languages,
    references,
  ] = await Promise.all([
    isPublic("education") ? prisma.education.findMany({ orderBy }) : [],
    isPublic("experience") ? prisma.experience.findMany({ orderBy }) : [],
    isPublic("research") ? prisma.researchHighlight.findMany({ orderBy }) : [],
    isPublic("publications") ? prisma.publication.findMany({ orderBy }) : [],
    isPublic("patents") ? prisma.patent.findMany({ orderBy }) : [],
    isPublic("awards") ? prisma.award.findMany({ orderBy }) : [],
    isPublic("skills") ? prisma.skill.findMany({ orderBy }) : [],
    isPublic("teaching") ? prisma.teachingService.findMany({ orderBy }) : [],
    isPublic("courses") ? prisma.course.findMany({ orderBy }) : [],
    isPublic("languages") ? prisma.language.findMany({ orderBy }) : [],
    isPublic("references") ? prisma.reference.findMany({ orderBy }) : [],
  ]);

  return {
    isHeroPublic: isPublic("hero"),
    isAboutPublic: isPublic("about"),
    isContactPublic: isPublic("contact"),
    isPublic,
    profile,
    settings,
    education,
    experience,
    research,
    publications,
    patents,
    awards,
    skills,
    teaching,
    courses,
    languages,
    references,
  };
}

export type PublicData = Awaited<ReturnType<typeof getPublicData>>;
