import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EventExplorer } from "@/components/event-explorer";
import { PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming and past CAVM Club activities."
        description="Field visits, workshops, conferences, public engagement, research events, cultural activities, and leadership moments."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <EventExplorer events={events} />
      </section>
    </>
  );
}
