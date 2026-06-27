import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui";
import { AchievementExplorer } from "@/components/achievement-explorer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
  return (
    <>
      <PageHero
        eyebrow="Achievements"
        title="A public record of CAVM Club impact."
        description="Awards, competitions, community impact, research, events, partnerships, and media recognition gathered into one organized archive."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <AchievementExplorer achievements={achievements} />
      </section>
    </>
  );
}
