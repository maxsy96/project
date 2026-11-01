export type EventForSorting = {
  slug: string;
  date: Date;
  status: string;
};

export function eventStatusRank(status: string) {
  const normalized = status.toLowerCase();
  if (isActiveEventStatus(normalized)) return 1;
  if (normalized === "proposed") return 2;
  if (normalized.includes("cancel")) return 4;
  return 3;
}

export function isActiveEventStatus(status: string) {
  const normalized = status.toLowerCase();
  return normalized === "upcoming" || normalized === "closing soon";
}

export function isEventSubmissionOpen(eventStatus: string, submissionStatus = "open") {
  if (!isActiveEventStatus(eventStatus)) return false;
  return submissionStatus === "open" || submissionStatus === "closing soon";
}

export function sortEventsForDisplay<T extends EventForSorting>(events: T[]) {
  return [...events].sort((a, b) => {
    const rank = eventStatusRank(a.status) - eventStatusRank(b.status);
    if (rank !== 0) return rank;
    if (eventStatusRank(a.status) === 1) return a.date.getTime() - b.date.getTime();
    return b.date.getTime() - a.date.getTime();
  });
}

export function mergeEventsBySlug<T extends { slug: string }>(events: T[]) {
  const merged = new Map<string, T>();
  for (const event of events) {
    if (!merged.has(event.slug)) {
      merged.set(event.slug, event);
    }
  }
  return Array.from(merged.values());
}
