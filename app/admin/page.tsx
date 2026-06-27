import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [
    opportunities,
    openOpportunities,
    students,
    partnerSubmissions,
    upcomingEvents,
    recentMessages,
  ] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: { in: ["open", "closing soon"] } } }),
    prisma.studentInterest.count(),
    prisma.partnerSubmission.count(),
    prisma.event.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 5 }),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <AdminShell title="Overview">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Opportunities", opportunities],
          ["Open opportunities", openOpportunities],
          ["Registered students", students],
          ["Partner submissions", partnerSubmissions],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">{label as string}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{value as number}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Upcoming events</h2>
          <div className="mt-4 grid gap-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-4 rounded-md bg-slate-50 p-3">
                <div><p className="font-medium">{event.title}</p><p className="text-sm text-slate-500">{formatDate(event.date)}</p></div>
                <StatusBadge status={event.status} />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent messages</h2>
          <div className="mt-4 grid gap-3">
            {recentMessages.map((message) => (
              <div key={message.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-medium">{message.subject}</p>
                <p className="text-sm text-slate-500">{message.name} - {message.status}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
