"use client";

import { useMemo, useState } from "react";
import { eventCategories, eventStatuses } from "@/lib/constants";
import { eventStatusRank } from "@/lib/event-utils";
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
  submissionStatus?: string;
};

export function EventExplorer({ events }: { events: EventItem[] }) {
  const [view, setView] = useState("all");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("upcoming");

  const filtered = useMemo(() => {
    const filteredEvents = events.filter((event) => {
      const viewMatch = view === "all" || event.status === view;
      const categoryMatch = !category || event.category === category;
      return viewMatch && categoryMatch;
    });

    return [...filteredEvents].sort((a, b) => {
      if (sort === "upcoming") {
        const rank = eventStatusRank(a.status) - eventStatusRank(b.status);
        if (rank !== 0) return rank;
        if (eventStatusRank(a.status) === 1) return a.date.getTime() - b.date.getTime();
        return b.date.getTime() - a.date.getTime();
      }
      if (sort === "newest") return b.date.getTime() - a.date.getTime();
      return a.date.getTime() - b.date.getTime();
    });
  }, [events, view, category, sort]);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <select value={view} onChange={(event) => setView(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="all">All events</option>
          {eventStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="">All categories</option>
          {eventCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="upcoming">Upcoming first</option>
          <option value="chronological">Chronological order</option>
          <option value="newest">Newest first</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </div>
  );
}
