import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ButtonLink, PageHero, Pill, StatusBadge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { getArchiveManifest } from "@/lib/archive";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  return { title: event?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, archive] = await Promise.all([
    prisma.event.findUnique({ where: { slug } }),
    getArchiveManifest(),
  ]);
  if (!event) notFound();
  const albums = archive.albums.filter((album) => album.eventSlug === event.slug);

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
            <div><dt className="text-sm font-semibold text-slate-500">Location</dt><dd className="mt-1 font-medium">{event.location}</dd></div>
            <div><dt className="text-sm font-semibold text-slate-500">Organizer</dt><dd className="mt-1 font-medium">{event.organizer}</dd></div>
          </dl>
        </article>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Interested in events like this?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Register your interests so CAVM Club can match you with relevant visits, workshops, and programs.</p>
          <div className="mt-5">
            <ButtonLink href={event.registrationUrl || "/register-interest"}>Register interest</ButtonLink>
          </div>
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
