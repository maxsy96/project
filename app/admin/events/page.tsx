import Link from "next/link";
import { createEventAction, deleteEventAction, updateEventSubmissionStatusAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDeletedEventSlugs, getStoredEvents, storedEventToView } from "@/lib/admin-content-store";
import { mergeEventsBySlug, sortEventsForDisplay } from "@/lib/event-utils";
import { formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";
import { StatusBadge } from "@/components/ui";
import { submissionStatuses } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();
  const [databaseEvents, storedEvents, deletedEventSlugs] = await Promise.all([
    prisma.event.findMany({ orderBy: { date: "desc" } }),
    getStoredEvents(),
    getDeletedEventSlugs(),
  ]);
  const deleted = new Set(deletedEventSlugs);
  const events = [
    ...storedEvents.map(storedEventToView),
    ...databaseEvents.filter((event) => !deleted.has(event.slug)),
  ];
  const mergedEvents = sortEventsForDisplay(mergeEventsBySlug(events));

  return (
    <AdminShell title="Events Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="event" action={createEventAction} />
        <AdminTable>
          <thead><tr><AdminTh>Event</AdminTh><AdminTh>Status</AdminTh><AdminTh>Submissions</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {mergedEvents.map((event) => (
              <tr key={event.id} className="transition hover:bg-emerald-50/40">
                <AdminTd><p className="font-semibold text-slate-950">{event.title}</p><p className="text-xs text-slate-500">{formatDate(event.date)} - {event.location} - {event.category}</p></AdminTd>
                <AdminTd><StatusBadge status={event.status} /></AdminTd>
                <AdminTd>
                  <div className="grid gap-2">
                    <StatusBadge status={event.submissionStatus || "open"} />
                    <div className="flex flex-wrap gap-1">
                      {submissionStatuses.map((status) => (
                        <form key={status} action={updateEventSubmissionStatusAction.bind(null, event.id, status)}>
                          <button
                            title={`Set submissions to ${status}`}
                            className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            {status}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                </AdminTd>
                <AdminTd><div className="flex flex-wrap gap-2"><Link className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-50" href={`/events/${event.slug}`}>View</Link><Link className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-emerald-50 hover:text-emerald-800" href={`/admin/events/${event.id}/edit`}>Edit</Link><form action={deleteEventAction.bind(null, event.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-50">Delete</button></form></div></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
