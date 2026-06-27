import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui";
import { OpportunityExplorer } from "@/components/opportunity-explorer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Opportunity Hub" };

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    where: { approvalStatus: "approved" },
    orderBy: [{ status: "asc" }, { deadline: "asc" }],
  });

  return (
    <>
      <PageHero
        eyebrow="CAVM Opportunity Hub"
        title="One organized place for student opportunities."
        description="Search and filter internships, volunteering roles, research assistant roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <OpportunityExplorer opportunities={opportunities} />
      </section>
    </>
  );
}
