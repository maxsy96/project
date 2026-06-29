import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEventAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getStoredEvents, storedEventToView, type StoredEvent } from "@/lib/admin-content-store";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { EventAdminForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const event = id < 0
    ? (await getStoredEvents()).find((item) => item.id === id)
    : await prisma.event.findUnique({ where: { id } });

  if (!event) notFound();
  const eventForForm = id < 0 ? storedEventToView(event as StoredEvent) : event;
  const viewEvent = {
    title: eventForForm.title,
    date: new Date(eventForForm.date),
    time: eventForForm.time,
    location: eventForForm.location,
    description: eventForForm.description,
    category: eventForForm.category,
    organizer: eventForForm.organizer,
    registrationUrl: eventForForm.registrationUrl,
    imageUrl: eventForForm.imageUrl,
    status: eventForForm.status,
    slug: eventForForm.slug,
  };

  return (
    <AdminShell title="Edit Event">
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/events" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
            Back to events
          </Link>
          <Link href={`/events/${viewEvent.slug}`} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
            View public page
          </Link>
        </div>
        <EventAdminForm action={updateEventAction.bind(null, id)} event={viewEvent} />
      </div>
    </AdminShell>
  );
}
