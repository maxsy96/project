import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fromJsonList, matchScore } from "@/lib/utils";
import { OpportunityCard } from "@/components/cards";
import { ButtonLink, PageHero, Pill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Registration Success" };

export default async function RegisterSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const student = id ? await prisma.studentInterest.findUnique({ where: { id: Number(id) } }) : null;
  const opportunities = await prisma.opportunity.findMany({ where: { approvalStatus: "approved", status: { not: "closed" } }, orderBy: { deadline: "asc" } });
  const matches = student
    ? opportunities
        .map((opportunity) => ({
          opportunity,
          score: matchScore(fromJsonList(student.interests), fromJsonList(student.opportunityPreferences), fromJsonList(opportunity.sectors), opportunity.type),
        }))
        .filter((item) => item.score !== "No match")
        .slice(0, 6)
    : [];

  return (
    <>
      <PageHero
        eyebrow="Registration saved"
        title="Your interests are now ready for matching."
        description="CAVM Club can use your selected sectors, preferred opportunity types, locations, availability, and goals to share more relevant student pathways."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {student ? (
          <div className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-xl font-semibold text-slate-950">Thank you, {student.fullName}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {fromJsonList(student.interests).map((interest) => <Pill key={interest}>{interest}</Pill>)}
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-2xl font-semibold text-slate-950">Current matching opportunities</h2>
          <ButtonLink href="/opportunities" variant="secondary">Browse all opportunities</ButtonLink>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {matches.map(({ opportunity, score }) => (
            <div key={opportunity.id} className="grid gap-3">
              <Pill>{score}</Pill>
              <OpportunityCard opportunity={opportunity} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
