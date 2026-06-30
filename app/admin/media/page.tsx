import { addAlbumPhotosAction, createMediaAction, deleteMediaAction, removeAlbumPhotoAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getArchiveManifest } from "@/lib/archive";
import { getStoredEvents } from "@/lib/admin-content-store";
import { prisma } from "@/lib/prisma";
import { getAllMediaItems } from "@/lib/runtime-store";
import { formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { AdminAlbumManager } from "@/components/admin-album-manager";
import { AlbumPhotosAdminForm, SimpleContentForm, type AlbumTarget } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

function eventDateMeta(value: Date | string) {
  return formatDate(value instanceof Date ? value : new Date(value));
}

export default async function AdminMediaPage() {
  await requireAdmin();
  const [mediaItems, archive, databaseEvents, storedEvents] = await Promise.all([
    getAllMediaItems(),
    getArchiveManifest(),
    prisma.event.findMany(),
    getStoredEvents(),
  ]);
  const media = mediaItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const targetMap = new Map<string, AlbumTarget>();

  for (const album of archive.albums) {
    if (!album.eventSlug) continue;
    targetMap.set(album.eventSlug, {
      key: album.eventSlug,
      title: album.title,
      meta: `${album.category} - ${eventDateMeta(album.date)}`,
    });
  }

  for (const event of [...storedEvents, ...databaseEvents]) {
    if (targetMap.has(event.slug)) continue;
    targetMap.set(event.slug, {
      key: event.slug,
      title: event.title,
      meta: `${event.category} - ${eventDateMeta(event.date)}`,
    });
  }

  const albumTargets = Array.from(targetMap.values()).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <AdminShell title="Media Management">
      <div className="grid gap-6">
        <AlbumPhotosAdminForm action={addAlbumPhotosAction} targets={albumTargets} />
        <AdminAlbumManager albums={archive.albums} removeAction={removeAlbumPhotoAction} />
        <SimpleContentForm kind="media" action={createMediaAction} />
        <AdminTable>
          <thead><tr><AdminTh>Media</AdminTh><AdminTh>Type</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {media.map((item) => (
              <tr key={item.id}>
                <AdminTd><p className="font-semibold text-slate-950">{item.title}</p><p className="text-xs text-slate-500">{item.category}</p></AdminTd>
                <AdminTd>{item.mediaType}</AdminTd>
                <AdminTd><form action={deleteMediaAction.bind(null, item.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
