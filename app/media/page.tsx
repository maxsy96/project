import type { Metadata } from "next";
import { getAllMediaItems } from "@/lib/runtime-store";
import { PageHero } from "@/components/ui";
import { MediaGallery } from "@/components/media-gallery";
import { getArchiveManifest } from "@/lib/archive";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const [items, archive] = await Promise.all([
    getAllMediaItems(),
    getArchiveManifest(),
  ]);
  items.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="A complete archive for the club's public-facing work."
        description="All supplied photo albums, source files, event reports, and curated public highlights in one organized media hub."
      />
      <MediaGallery
        items={items}
        albums={archive.albums}
        documents={archive.documents}
      />
    </>
  );
}
