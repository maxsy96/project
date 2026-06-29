import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eventRegistrationAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { getDeletedEventSlugs, getStoredEventBySlug, storedEventToView } from "@/lib/admin-content-store";
import { ButtonLink, PageHero, Pill, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { getArchiveManifest } from "@/lib/archive";
import { isActiveEventStatus } from "@/lib/event-utils";

export const dynamic = "force-dynamic";

function eventDurationLabel(category: string, title: string, description: string) {
  const text = `${category} ${title} ${description}`.toLowerCase();
  if (text.includes("four-week") || text.includes("4-week")) return "4 weeks";
  if (category === "Field visit") return "Half-day to full-day visit";
  if (category === "Workshop") return "Workshop duration shared before the event";
  if (category === "Conference") return "Scheduled session or conference-day activity";
  if (category === "Leadership" || category === "Culture" || category === "Community") return "Event-day activity; shifts may vary";
  return "Duration confirmed with event details";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [databaseEvent, storedEvent, deletedEventSlugs] = await Promise.all([
    prisma.event.findUnique({ where: { slug } }),
    getStoredEventBySlug(slug),
    getDeletedEventSlugs(),
  ]);
  const event = storedEvent ? storedEventToView(storedEvent) : deletedEventSlugs.includes(slug) ? null : databaseEvent;
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ registered?: string }>;
}) {
  const { slug } = await params;
  const { registered } = await searchParams;
  const [databaseEvent, storedEvent, deletedEventSlugs, archive] = await Promise.all([
    prisma.event.findUnique({ where: { slug } }),
    getStoredEventBySlug(slug),
    getDeletedEventSlugs(),
    getArchiveManifest(),
  ]);
  const event = storedEvent ? storedEventToView(storedEvent) : deletedEventSlugs.includes(slug) ? null : databaseEvent;
  if (!event) notFound();
  const albums = archive.albums.filter((album) => album.eventSlug === event.slug);
  const registrationOpen = isActiveEventStatus(event.status);

  return (
    <>
      <PageHero eyebrow={event.category} title={event.title} description={event.description}>
        <div className="rounded-lg bg-white p-5 text-slate-950 shadow-sm">
          <div className="flex items-center gap-3">
            <Pill>{formatDate(event.date)}</Pill>
            <StatusBadge status={event.status} />
          </div>
          <p className="mt-4 text-sm text-slate-600">{event.time} - {event.location}</p>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1fr_360px] md:px-8">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          {event.imageUrl ? (
            <Image src={event.imageUrl} alt={event.title} width={1200} height={760} className="mb-6 h-80 w-full rounded-md object-cover" />
          ) : null}
          <h2 className="text-2xl font-semibold text-slate-950">Event details</h2>
          <p className="mt-4 leading-7 text-slate-600">{event.description}</p>
          <dl className="mt-6 grid gap-4 rounded-lg bg-slate-50 p-5 sm:grid-cols-2">
            <div><dt className="text-sm font-semibold text-slate-500">Date</dt><dd className="mt-1 font-medium">{formatDate(event.date)}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Time</dt><dd className="mt-1 font-medium">{event.time}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Expected duration</dt><dd className="mt-1 font-medium">{eventDurationLabel(event.category, event.title, event.description)}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Location</dt><dd className="mt-1 font-medium">{event.location}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Organizer</dt><dd className="mt-1 font-medium">{event.organizer}</dd></div>
          </dl>
        </article>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Register for this event</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Submit your details and CAVM Club will receive them directly for event follow-up.</p>
          {registered === "1" ? (
            <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              Registration received. The club team has your details.
            </p>
          ) : null}
          {registered === "error" ? (
            <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
              Please enter your name and a valid email address.
            </p>
          ) : null}
          {registrationOpen ? (
            <form action={eventRegistrationAction} className="mt-5 grid gap-4">
              <input type="hidden" name="eventTitle" value={event.title} />
              <input type="hidden" name="eventSlug" value={event.slug} />
              <label className="block text-sm font-semibold text-slate-800">
                Full name
                <input name="name" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">
                Email
                <input name="email" type="email" required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">
                Student ID
                <input name="studentId" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">
                Phone
                <input name="phone" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">
                Notes
                <textarea name="message" rows={3} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
              </label>
              <button className="rounded-md bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                Send event registration
              </button>
              {event.registrationUrl ? (
                <a href={event.registrationUrl} className="text-center text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                  Open external event link
                </a>
              ) : null}
            </form>
          ) : (
            <div className="mt-5">
              <p className="rounded-md bg-slate-100 p-3 text-sm font-semibold text-slate-700">Registration is closed for this event.</p>
              <div className="mt-4">
                <ButtonLink href="/register-interest" variant="secondary">Register future interests</ButtonLink>
              </div>
            </div>
          )}
        </aside>
      </section>
      {albums.length ? (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <p className="text-sm font-semibold uppercase text-emerald-700">Event media</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Photos from this event</h2>
            <div className="mt-8 grid gap-6">
              {albums.map((album) => (
                <article key={album.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{album.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{album.photoCount} photos in the supplied archive.</p>
                    </div>
                    <Link href={`/media#${album.slug}`} className="rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
                      Open full album
                    </Link>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {album.photos.slice(0, 12).map((photo, index) => (
                      <Image
                        key={photo.src}
                        src={photo.src}
                        alt={`${album.title} photo ${index + 1}`}
                        width={260}
                        height={190}
                        className="aspect-[4/3] rounded-md object-cover"
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
