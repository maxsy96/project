"use client";

import { useMemo, useState } from "react";
import { eventCategories } from "@/lib/constants";
import { EventCard } from "@/components/cards";

type EventItem = {
  id: number;
  title: string;
  slug: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
};

export function EventExplorer({ events }: { events: EventItem[] }) {
  const [view, setView] = useState("all");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const viewMatch = view === "all" || event.status === view;
      const categoryMatch = !category || event.category === category;
      return viewMatch && categoryMatch;
    });
  }, [events, view, category]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <select value={view} onChange={(event) => setView(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="all">All events</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="">All categories</option>
          {eventCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
