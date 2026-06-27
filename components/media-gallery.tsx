"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, FileText, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ArchiveAlbum, ArchiveDocument } from "@/lib/archive";
import { SectionHeader } from "@/components/ui";
import { formatDate } from "@/lib/utils";

type MediaItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  mediaType: string;
  imageUrl: string;
  videoUrl: string;
  date: Date | null;
};

function formatFileSize(bytes: number) {
  if (!bytes) return "File";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

function AlbumCarousel({ album, offset = 0 }: { album: ArchiveAlbum; offset?: number }) {
  const [active, setActive] = useState(0);
  const photos = album.photos;

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % photos.length);
    }, 3200 + offset);
    return () => window.clearInterval(timer);
  }, [offset, photos.length]);

  if (!photos.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-500">
        No photos yet
      </div>
    );
  }

  return (
    <div className="relative h-72 overflow-hidden rounded-md bg-slate-950">
      {photos.slice(0, 18).map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={`${album.title} photo ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className={`object-cover transition-opacity duration-700 ${index === active % Math.min(photos.length, 18) ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-4 text-white">
        <p className="text-sm font-semibold">{album.photoCount} photos</p>
        <p className="text-xs text-slate-200">{formatDate(new Date(`${album.date}T09:00:00.000Z`))}</p>
      </div>
    </div>
  );
}

function AlbumArchive({ album, index }: { album: ArchiveAlbum; index: number }) {
  return (
    <article id={album.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AlbumCarousel album={album} offset={index * 240} />
        <div>
          <p className="text-sm font-semibold text-emerald-700">{album.category}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">{album.title}</h3>
          <p className="mt-3 leading-7 text-slate-600">{album.description}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {album.eventSlug ? (
              <Link href={`/events/${album.eventSlug}`} className="rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
                Open event
              </Link>
            ) : null}
            <a href={`#${album.slug}-all`} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-emerald-400">
              View all photos
            </a>
          </div>
        </div>
      </div>
      <details id={`${album.slug}-all`} className="mt-6">
        <summary className="cursor-pointer rounded-md bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
          Complete photo set ({album.photoCount})
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {album.photos.map((photo, photoIndex) => (
            <figure key={photo.src} className="overflow-hidden rounded-md bg-slate-100">
              <Image
                src={photo.src}
                alt={`${album.title} archive photo ${photoIndex + 1}`}
                width={260}
                height={190}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="truncate px-2 py-1.5 text-[11px] text-slate-500">{photo.originalName}</figcaption>
            </figure>
          ))}
        </div>
      </details>
    </article>
  );
}

function DocumentArchive({ documents }: { documents: ArchiveDocument[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
      <SectionHeader
        eyebrow="Files"
        title="Source documents"
        description="The public archive includes the supplied PDFs and Word documents so the website keeps its source material organized."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documents.map((document) => (
          <a key={document.fileUrl} href={document.fileUrl} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-slate-950">{document.title}</span>
              <span className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Download className="h-4 w-4" aria-hidden="true" />
                {formatFileSize(document.sizeBytes)}
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function MediaGallery({
  items,
  albums,
  documents,
}: {
  items: MediaItem[];
  albums: ArchiveAlbum[];
  documents: ArchiveDocument[];
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <SectionHeader
          eyebrow="Photo archive"
          title="Every supplied photo, grouped by its actual event album"
          description="Albums stay connected to their source folders and event pages, with smooth rotating previews plus complete thumbnail sets."
        />
        <div className="mt-8 grid gap-6">
          {albums.map((album, index) => <AlbumArchive key={album.slug} album={album} index={index} />)}
        </div>
      </section>

      {items.length ? (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
            <SectionHeader eyebrow="Highlights" title="Curated media highlights" />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {items.map((item, index) => (
                <article key={item.id} className={index === 0 ? "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:col-span-2" : "overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"}>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} width={900} height={620} className="h-64 w-full object-cover" />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500">
                      <ImageIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {item.mediaType}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm font-semibold text-emerald-700">{item.category} - {formatDate(item.date)}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <DocumentArchive documents={documents} />
    </>
  );
}
