import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { fromJsonList, formatDate } from "@/lib/utils";
import { Pill, StatusBadge } from "@/components/ui";

type OpportunityLike = {
  id: number;
  title: string;
  slug: string;
  organization: string;
  type: string;
  sectors: string;
  location: string;
  paidStatus: string;
  deadline: Date | null;
  description: string;
  status: string;
  imageUrl?: string;
};

export function OpportunityCard({ opportunity }: { opportunity: OpportunityLike }) {
  const sectors = fromJsonList(opportunity.sectors);
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">{opportunity.type}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">{opportunity.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{opportunity.organization}</p>
        </div>
        <StatusBadge status={opportunity.status} />
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{opportunity.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <Pill key={sector}>{sector}</Pill>
        ))}
      </div>
      <div className="mt-5 grid gap-2 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Deadline: {formatDate(opportunity.deadline)}
        </span>
        <span className="font-semibold text-slate-800">{opportunity.paidStatus}</span>
      </div>
      <Link
        href={`/opportunities/${opportunity.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
      >
        View details <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

type EventLike = {
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

export function EventCard({ event }: { event: EventLike }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {event.imageUrl ? (
        <Image src={event.imageUrl} alt={event.title} width={900} height={620} className="h-48 w-full object-cover" />
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Pill>{event.category}</Pill>
          <StatusBadge status={event.status} />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-slate-950">{event.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <span>{formatDate(event.date)} at {event.time}</span>
          <span>{event.location}</span>
        </div>
        <Link href={`/events/${event.slug}`} className="mt-5 inline-flex text-sm font-semibold text-emerald-700">
          Event details
        </Link>
      </div>
    </article>
  );
}

type AchievementLike = {
  title: string;
  description: string;
  category: string;
  year: number;
  imageUrl: string;
  externalUrl?: string;
};

export function AchievementCard({ achievement }: { achievement: AchievementLike }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {achievement.imageUrl ? (
        <Image src={achievement.imageUrl} alt={achievement.title} width={800} height={520} className="mb-4 h-40 w-full rounded-md object-cover" />
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <Pill>{achievement.category}</Pill>
        <span className="text-sm font-semibold text-slate-500">{achievement.year}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{achievement.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{achievement.description}</p>
      {achievement.externalUrl ? (
        <Link href={achievement.externalUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
          Open related archive <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </article>
  );
}

export function PersonCard({
  name,
  role,
  meta,
  body,
  imageUrl,
  contact,
}: {
  name: string;
  role: string;
  meta: string;
  body: string;
  imageUrl?: string;
  contact?: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={600} height={420} className="mb-4 h-44 w-full rounded-md object-cover" />
      ) : (
        <div className="mb-4 flex h-44 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-500">
          Consent-based profile image
        </div>
      )}
      <p className="text-sm font-semibold text-emerald-700">{role}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-950">{name}</h3>
      <p className="mt-1 text-sm text-slate-500">{meta}</p>
      {contact ? <p className="mt-2 break-all text-xs font-semibold text-emerald-700">{contact}</p> : null}
      <p className="mt-4 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
