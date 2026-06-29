import type { Metadata } from "next";
import { getAllOpportunities } from "@/lib/runtime-store";
import { PageHero } from "@/components/ui";
import { OpportunityExplorer } from "@/components/opportunity-explorer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Opportunity Hub" };

export default async function OpportunitiesPage() {
  const opportunities = (await getAllOpportunities())
    .filter((opportunity) => opportunity.approvalStatus === "approved")
    .sort((a, b) => {
      const statusOrder = ["open", "closing soon", "closed"];
      const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusDiff) return statusDiff;
      return (a.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER);
    });

  return (
    <>
      <PageHero
        eyebrow="CAVM Opportunity Hub"
        title="An organized platform for student opportunities."
        description="Search and filter internships, volunteering roles, research assistant roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <OpportunityExplorer opportunities={opportunities} />
      </section>
    </>
  );
}
