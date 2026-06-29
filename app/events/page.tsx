import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getStoredEvents, storedEventToView } from "@/lib/admin-content-store";
import { mergeEventsBySlug, sortEventsForDisplay } from "@/lib/event-utils";
import { EventExplorer } from "@/components/event-explorer";
import { PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const [databaseEvents, storedEvents] = await Promise.all([
    prisma.event.findMany({ orderBy: { date: "desc" } }),
    getStoredEvents(),
  ]);
  const events = [
    ...storedEvents.map(storedEventToView),
    ...databaseEvents,
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
