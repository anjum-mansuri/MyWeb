import { PrismaClient } from "@prisma/client";
import { SECTIONS } from "../src/lib/sections";

const prisma = new PrismaClient();

async function main() {
  for (const section of SECTIONS) {
    await prisma.section.upsert({
      where: { key: section.key },
      update: {},
      create: { key: section.key, isPublic: section.defaultPublic },
    });
  }

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, visitorGateEnabled: false },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
