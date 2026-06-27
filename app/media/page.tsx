import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui";
import { MediaGallery } from "@/components/media-gallery";
import { getArchiveManifest } from "@/lib/archive";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const [items, archive] = await Promise.all([
    prisma.mediaItem.findMany({ orderBy: { date: "desc" } }),
    getArchiveManifest(),
  ]);
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
