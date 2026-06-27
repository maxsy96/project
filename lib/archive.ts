import { readFile } from "fs/promises";
import path from "path";

export type ArchivePhoto = {
  src: string;
  originalName: string;
};

export type ArchiveAlbum = {
  slug: string;
  title: string;
  eventSlug: string;
  date: string;
  description: string;
  sources: string[];
  mediaType: string;
  category: string;
  photos: ArchivePhoto[];
  photoCount: number;
  coverImage: string;
};

export type ArchiveDocument = {
  title: string;
  fileUrl: string;
  fileName: string;
  sizeBytes: number;
};

export type ArchiveManifest = {
  generatedAt: string;
  albums: ArchiveAlbum[];
  documents: ArchiveDocument[];
  previews: {
    accomplishments: string[];
  };
};

const emptyArchive: ArchiveManifest = {
  generatedAt: "",
  albums: [],
  documents: [],
  previews: { accomplishments: [] },
};

export async function getArchiveManifest(): Promise<ArchiveManifest> {
  try {
    const manifestPath = path.join(process.cwd(), "public", "images", "archive", "archive-manifest.json");
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw) as ArchiveManifest;
  } catch {
    return emptyArchive;
  }
}

export function formatFileSize(bytes: number) {
  if (!bytes) return "File";
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}
