import Image from "next/image";
import { ExternalLink, Trash2 } from "lucide-react";
import type { ArchiveAlbum } from "@/lib/archive";
import { formatDate } from "@/lib/utils";

export function AdminAlbumManager({
  albums,
  removeAction,
}: {
  albums: ArchiveAlbum[];
  removeAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <section id="album-manager" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-700">Album manager</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">Review and remove album photos</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Open an album, check the thumbnail, view the full image if needed, then remove only the exact photo you do not want public.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        {albums.map((album) => (
          <details key={album.slug} id={`album-${album.slug}`} className="rounded-lg border border-slate-200 bg-slate-50">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-950">
              {album.title}
              <span className="ml-2 font-medium text-slate-500">
                {album.photoCount} photos - {album.category} - {formatDate(new Date(`${album.date}T09:00:00.000Z`))}
              </span>
            </summary>
            {album.photos.length ? (
              <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                {album.photos.map((photo, index) => (
                  <article key={`${album.slug}-${photo.src}`} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                    <a href={photo.src} target="_blank" rel="noreferrer" className="group relative block bg-slate-100" aria-label={`Open ${album.title} photo ${index + 1}`}>
                      <Image
                        src={photo.src}
                        alt={`${album.title} photo ${index + 1}`}
                        width={320}
                        height={240}
                        className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-slate-950 shadow-sm">
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </a>
                    <div className="grid gap-2 p-3">
                      <p className="truncate text-xs font-medium text-slate-500" title={photo.originalName}>
                        Photo {index + 1}
                      </p>
                      <form action={removeAction}>
                        <input type="hidden" name="albumKey" value={album.eventSlug || album.slug} />
                        <input type="hidden" name="photoSrc" value={photo.src} />
                        <button className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-50">
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Remove photo
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border-t border-slate-200 p-4 text-sm font-medium text-slate-500">
                This album has no visible photos.
              </div>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
