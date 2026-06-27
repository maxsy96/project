import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { interestedAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { fromJsonList, formatDate } from "@/lib/utils";
import { ButtonLink, PageHero, Pill, StatusBadge } from "@/components/ui";
import { OpportunityCard } from "@/components/cards";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await prisma.opportunity.findUnique({ where: { slug } });
  return { title: opportunity?.title ?? "Opportunity" };
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opportunity = await prisma.opportunity.findUnique({ where: { slug } });
  if (!opportunity) notFound();
  const sectorList = fromJsonList(opportunity.sectors);
  const related = await prisma.opportunity.findMany({
    where: {
      approvalStatus: "approved",
      id: { not: opportunity.id },
    },
    take: 3,
    orderBy: { deadline: "asc" },
  });

  return (
    <>
      <PageHero eyebrow={opportunity.type} title={opportunity.title} description={opportunity.description}>
        <div className="rounded-lg bg-white p-5 text-slate-950 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={opportunity.status} />
            {sectorList.map((sector) => <Pill key={sector}>{sector}</Pill>)}
          </div>
          <p className="mt-4 text-sm text-slate-600">{opportunity.organization} - {opportunity.location}</p>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1fr_360px] md:px-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {opportunity.imageUrl ? (
            <Image src={opportunity.imageUrl} alt={opportunity.title} width={1200} height={760} className="mb-6 h-80 w-full rounded-md object-cover" />
          ) : null}
          <div className="grid gap-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-950">Full description</h2>
              <p className="mt-3 leading-7 text-slate-600">{opportunity.description}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-950">Requirements</h2>
              <p className="mt-3 leading-7 text-slate-600">{opportunity.requirements || opportunity.eligibility}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-950">Benefits</h2>
              <p className="mt-3 leading-7 text-slate-600">{opportunity.benefits}</p>
            </section>
            <dl className="grid gap-4 rounded-lg bg-slate-50 p-5 sm:grid-cols-2">
              <div><dt className="text-sm font-semibold text-slate-500">Deadline</dt><dd className="mt-1 font-medium">{formatDate(opportunity.deadline)}</dd></div>
              <div><dt className="text-sm font-semibold text-slate-500">Paid/funding</dt><dd className="mt-1 font-medium">{opportunity.paidStatus}</dd></div>
              <div><dt className="text-sm font-semibold text-slate-500">Contact</dt><dd className="mt-1 font-medium">{opportunity.contactEmail || "CAVM Club"}</dd></div>
              <div><dt className="text-sm font-semibold text-slate-500">Source</dt><dd className="mt-1 font-medium">{opportunity.source}</dd></div>
            </dl>
          </div>
        </article>
        <aside className="grid h-fit gap-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Application instructions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Use the external application link when available, or register your interests so CAVM Club can help match and follow up.</p>
            <div className="mt-5 grid gap-3">
              {opportunity.applicationUrl ? (
                <a href={opportunity.applicationUrl} className="rounded-md bg-emerald-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-800">
                  Apply externally
                </a>
              ) : null}
              <ButtonLink href="/register-interest" variant="secondary">Register interests</ButtonLink>
            </div>
          </div>
          <form action={interestedAction} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <input type="hidden" name="opportunityTitle" value={opportunity.title} />
            <h2 className="text-lg font-semibold text-slate-950">I&apos;m Interested</h2>
            <label className="mt-4 block text-sm font-semibold text-slate-800">
              Email
              <input name="email" type="email" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-800">
              Name
              <input name="name" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-800">
              Message
              <textarea name="message" rows={3} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
            </label>
            <button className="mt-4 w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Send interest</button>
          </form>
        </aside>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <h2 className="text-2xl font-semibold text-slate-950">Related opportunities</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((item) => <OpportunityCard key={item.id} opportunity={item} />)}
        </div>
      </section>
    </>
  );
}
