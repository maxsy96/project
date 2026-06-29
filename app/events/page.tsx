import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getDeletedEventSlugs, getStoredEvents, storedEventToView } from "@/lib/admin-content-store";
import { mergeEventsBySlug, sortEventsForDisplay } from "@/lib/event-utils";
import { EventExplorer } from "@/components/event-explorer";
import { PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
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
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming and Past CAVM Club Activities."
        description="Field visits, workshops, conferences, public engagement, research events, cultural activities, and leadership moments."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <EventExplorer events={mergedEvents} />
      </section>
    </>
  );
}
