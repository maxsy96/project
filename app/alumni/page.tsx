import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ButtonLink, PageHero, SectionHeader } from "@/components/ui";
import { PersonCard } from "@/components/cards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Alumni" };

export default async function AlumniPage() {
  const alumni = await prisma.alumni.findMany({ orderBy: { graduationYear: "desc" } });
  return (
    <>
      <PageHero
        eyebrow="Alumni"
        title="Where CAVM students go next."
        description="Alumni stories help students connect club activities to real pathways in veterinary medicine, agriculture, food systems, research, sustainability, and government."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeader title="Alumni stories" description="Sample stories are seeded for the MVP; replace them with consent-approved alumni submissions when ready." />
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
    </>
  );
}
