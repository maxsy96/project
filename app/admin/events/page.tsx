import Link from "next/link";
import { createEventAction, deleteEventAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  return (
    <AdminShell title="Events Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="event" action={createEventAction} />
        <AdminTable>
          <thead><tr><AdminTh>Event</AdminTh><AdminTh>Status</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {events.map((event) => (
              <tr key={event.id}>
                <AdminTd><p className="font-semibold text-slate-950">{event.title}</p><p className="text-xs text-slate-500">{formatDate(event.date)} - {event.location} - {event.category}</p></AdminTd>
                <AdminTd><StatusBadge status={event.status} /></AdminTd>
                <AdminTd><div className="flex gap-2"><Link className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold" href={`/events/${event.slug}`}>View</Link><form action={deleteEventAction.bind(null, event.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></div></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
