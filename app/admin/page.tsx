import { requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDeletedEventSlugs, getStoredEvents, storedEventToView } from "@/lib/admin-content-store";
import {
  getAllContactSubmissions,
  getAllOpportunities,
  getAllPartnerSubmissions,
  getAllStudentInterests,
} from "@/lib/runtime-store";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const [
    opportunities,
    students,
    partnerSubmissions,
    databaseUpcomingEvents,
    storedEvents,
    deletedEventSlugs,
    recentMessages,
  ] = await Promise.all([
    getAllOpportunities(),
    getAllStudentInterests(),
    getAllPartnerSubmissions(),
    prisma.event.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 5 }),
    getStoredEvents(),
    getDeletedEventSlugs(),
    getAllContactSubmissions(),
  ]);
  const deleted = new Set(deletedEventSlugs);
  const upcomingEvents = [
    ...storedEvents.map(storedEventToView).filter((event) => event.status === "upcoming"),
    ...databaseUpcomingEvents.filter((event) => !deleted.has(event.slug)),
  ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  const openOpportunities = opportunities.filter((opportunity) => ["open", "closing soon"].includes(opportunity.status)).length;
  const latestMessages = recentMessages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  return (
    <AdminShell title="Overview">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Opportunities", opportunities.length],
          ["Open opportunities", openOpportunities],
          ["Registered students", students.length],
          ["Partner submissions", partnerSubmissions.length],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
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
              <Link key={event.id} href={`/admin/events/${event.id}/edit`} className="flex items-center justify-between gap-4 rounded-md bg-slate-50 p-3 transition hover:bg-emerald-50">
                <div><p className="font-medium">{event.title}</p><p className="text-sm text-slate-500">{formatDate(event.date)}</p></div>
                <StatusBadge status={event.status} />
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent messages</h2>
          <div className="mt-4 grid gap-3">
            {latestMessages.map((message) => (
              <Link key={message.id} href="/admin/contact-submissions" className="block rounded-md bg-slate-50 p-3 transition hover:bg-emerald-50">
                <p className="font-medium">{message.subject}</p>
                <p className="text-sm text-slate-500">{message.name} - {message.status}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
