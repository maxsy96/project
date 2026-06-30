"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, FileText, ImageIcon, Maximize2, X } from "lucide-react";
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

function AlbumCarousel({
  album,
  offset = 0,
  onOpen,
}: {
  album: ArchiveAlbum;
  offset?: number;
  onOpen: (index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const photos = album.photos;
  const previewCount = Math.min(photos.length, 18);

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
      <button
        type="button"
        onClick={() => onOpen(active % previewCount)}
        className="absolute inset-0 z-10"
        aria-label={`Open ${album.title} photo viewer`}
      >
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-xs font-semibold text-slate-950 opacity-0 shadow-sm transition group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
          View
        </span>
      </button>
      {photos.slice(0, previewCount).map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={`${album.title} photo ${index + 1}`}
          fill
          sizes="(min-width: 1024px) 38vw, 100vw"
          className={`object-cover transition-opacity duration-700 ${index === active % previewCount ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/85 to-transparent p-4 text-white">
        <p className="text-sm font-semibold">{album.photoCount} photos</p>
        <p className="text-xs text-slate-200">{formatDate(new Date(`${album.date}T09:00:00.000Z`))}</p>
      </div>
    </div>
  );
}

function PhotoLightbox({
  album,
  photoIndex,
  onClose,
  onMove,
}: {
  album: ArchiveAlbum;
  photoIndex: number;
  onClose: () => void;
  onMove: (index: number) => void;
}) {
  const photo = album.photos[photoIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove((photoIndex - 1 + album.photos.length) % album.photos.length);
      if (event.key === "ArrowRight") onMove((photoIndex + 1) % album.photos.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [album.photos.length, onClose, onMove, photoIndex]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{album.title}</p>
          <p className="text-xs text-slate-300">Photo {photoIndex + 1} of {album.photos.length}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Close photo viewer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <Image
          src={photo.src}
          alt={`${album.title} photo ${photoIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
        {album.photos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => onMove((photoIndex - 1 + album.photos.length) % album.photos.length)}
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-950 shadow-sm transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onMove((photoIndex + 1) % album.photos.length)}
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-950 shadow-sm transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function AlbumArchive({ album, index }: { album: ArchiveAlbum; index: number }) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  return (
    <article id={album.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="group">
          <AlbumCarousel album={album} offset={index * 240} onOpen={setPhotoIndex} />
        </div>
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
            <button
              key={photo.src}
              type="button"
              onClick={() => setPhotoIndex(photoIndex)}
              className="group relative overflow-hidden rounded-md bg-slate-100 text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label={`Open ${album.title} photo ${photoIndex + 1}`}
            >
              <Image
                src={photo.src}
                alt={`${album.title} archive photo ${photoIndex + 1}`}
                width={260}
                height={190}
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/35 group-hover:opacity-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950 shadow-sm">
                  <Maximize2 className="h-5 w-5" aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </details>
      {photoIndex !== null ? (
        <PhotoLightbox
          album={album}
          photoIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
          onMove={setPhotoIndex}
        />
      ) : null}
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
