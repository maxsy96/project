import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getStoredAchievements, storedAchievementToView } from "@/lib/admin-content-store";
import { ButtonLink, PageHero, SectionHeader } from "@/components/ui";
import { AchievementExplorer } from "@/components/achievement-explorer";
import { PersonCard } from "@/components/cards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Alumni & Achievements" };

export default async function AchievementsPage() {
  const [alumni, databaseAchievements, storedAchievements] = await Promise.all([
    prisma.alumni.findMany({ orderBy: { graduationYear: "desc" } }),
    prisma.achievement.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] }),
    getStoredAchievements(),
  ]);
  const achievements = [
    ...storedAchievements.map(storedAchievementToView),
    ...databaseAchievements,
  ].sort((a, b) => b.year - a.year || b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <PageHero
        eyebrow="Alumni & Achievements"
        title="People first, then the record of impact."
        description="Alumni stories and CAVM Club achievements together in one organized public archive, connecting student activity to real pathways and measurable club impact."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeader
            eyebrow="Alumni"
            title="Where CAVM students go next"
            description="Alumni stories help students connect club activities to real pathways in veterinary medicine, agriculture, food systems, research, sustainability, and government."
          />
          <ButtonLink href="/contact" variant="secondary">Share Your Alumni Story</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {alumni.map((person) => (
            <PersonCard
              key={person.id}
              name={person.name}
              role={person.currentRole}
              meta={`${person.graduationYear} - ${person.sector}`}
              body={`${person.story} Advice: ${person.advice}`}
              imageUrl={person.imageUrl}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <SectionHeader
          eyebrow="Achievements"
          title="CAVM Club impact archive"
          description="Awards, competitions, community impact, research, events, partnerships, and media recognition gathered into one organized record."
        />
        <div className="mt-8">
          <AchievementExplorer achievements={achievements} />
        </div>
      </section>
    </>
  );
}
