import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import type { ArchiveAlbum, ArchiveManifest, ArchivePhoto } from "@/lib/archive";
import { saveUploadedImage } from "@/lib/uploaded-images";

const storeName = "cavm-admin-album-uploads";
const contentKey = "albums.json";
const localContentPath = path.join(process.cwd(), ".data", "album-uploads.json");

export type UploadedAlbum = {
  slug: string;
  title: string;
  eventSlug: string;
  date: string;
  description: string;
  sources: string[];
  mediaType: string;
  category: string;
  photos: ArchivePhoto[];
  removedPhotoSrcs: string[];
  createdAt: string;
  updatedAt: string;
};

type AlbumUploadInput = {
  slug?: string;
  title: string;
  eventSlug: string;
  date: string;
  description: string;
  category: string;
  files: FormDataEntryValue[];
};

type AlbumPhotoRemovalInput = {
  slug?: string;
  title: string;
  eventSlug: string;
  date: string;
  description: string;
  category: string;
  photoSrc: string;
};

function isUploadedFile(value: FormDataEntryValue): value is File {
  return Boolean(value && typeof value === "object" && "arrayBuffer" in value && "size" in value && "name" in value);
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "uploaded-album";
}

function cleanAlbum(value: unknown): UploadedAlbum | null {
  if (!value || typeof value !== "object") return null;
  const album = value as Partial<UploadedAlbum>;
  if (!album.eventSlug && !album.slug) return null;

  return {
    slug: album.slug || normalizeSlug(album.eventSlug || "uploaded-album"),
    title: album.title || "Uploaded Photo Album",
    eventSlug: album.eventSlug || album.slug || "",
    date: album.date || new Date().toISOString().slice(0, 10),
    description: album.description || "Admin-uploaded photo album.",
    sources: Array.isArray(album.sources) ? album.sources : ["Admin uploads"],
    mediaType: album.mediaType || "Photos",
    category: album.category || "Admin uploads",
    photos: Array.isArray(album.photos) ? album.photos : [],
    removedPhotoSrcs: Array.isArray(album.removedPhotoSrcs) ? album.removedPhotoSrcs : [],
    createdAt: album.createdAt || new Date().toISOString(),
    updatedAt: album.updatedAt || new Date().toISOString(),
  };
}

function cleanAlbums(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map(cleanAlbum).filter((album): album is UploadedAlbum => Boolean(album));
}

async function getBlobStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(storeName);
  } catch {
    return null;
  }
}

async function readLocalAlbums() {
  try {
    const text = await fs.readFile(localContentPath, "utf8");
    return cleanAlbums(JSON.parse(text));
  } catch {
    return [];
  }
}

async function writeLocalAlbums(albums: UploadedAlbum[]) {
  await fs.mkdir(path.dirname(localContentPath), { recursive: true });
  await fs.writeFile(localContentPath, JSON.stringify(albums, null, 2));
}

export async function getUploadedAlbums() {
  const store = await getBlobStore();
  if (!store) return readLocalAlbums();

  try {
    const albums = await store.get(contentKey, { type: "json" });
    return cleanAlbums(albums);
  } catch {
    return [];
  }
}

async function writeUploadedAlbums(albums: UploadedAlbum[]) {
  const store = await getBlobStore();
  if (!store) {
    await writeLocalAlbums(albums);
    return;
  }

  await store.setJSON(contentKey, albums);
}

export async function appendAlbumUploads(input: AlbumUploadInput) {
  const imageFiles = input.files.filter((file): file is File => isUploadedFile(file) && file.size > 0);
  if (!imageFiles.length) return null;

  const now = new Date().toISOString();
  const albumSlug = normalizeSlug(input.slug || input.eventSlug || input.title);
  const uploadedPhotos = await Promise.all(
    imageFiles.map(async (file) => ({
      src: await saveUploadedImage(file),
      originalName: file.name || "Uploaded image",
    })),
  );
  const albums = await getUploadedAlbums();
  const index = albums.findIndex((album) => album.slug === albumSlug || album.eventSlug === input.eventSlug);

  if (index >= 0) {
    const existing = albums[index];
    const updated: UploadedAlbum = {
      ...existing,
      title: input.title || existing.title,
      eventSlug: input.eventSlug || existing.eventSlug,
      date: input.date || existing.date,
      description: input.description || existing.description,
      category: input.category || existing.category,
      photos: [...existing.photos, ...uploadedPhotos],
      removedPhotoSrcs: existing.removedPhotoSrcs,
      updatedAt: now,
    };
    albums[index] = updated;
    await writeUploadedAlbums(albums);
    return updated;
  }

  const album: UploadedAlbum = {
    slug: albumSlug,
    title: input.title,
    eventSlug: input.eventSlug,
    date: input.date,
    description: input.description,
    sources: ["Admin uploads"],
    mediaType: "Photos",
    category: input.category,
    photos: uploadedPhotos,
    removedPhotoSrcs: [],
    createdAt: now,
    updatedAt: now,
  };

  await writeUploadedAlbums([album, ...albums]);
  return album;
}

export async function removeAlbumPhoto(input: AlbumPhotoRemovalInput) {
  if (!input.photoSrc) return null;

  const now = new Date().toISOString();
  const albumSlug = normalizeSlug(input.slug || input.eventSlug || input.title);
  const albums = await getUploadedAlbums();
  const index = albums.findIndex((album) => album.slug === albumSlug || album.eventSlug === input.eventSlug);

  if (index >= 0) {
    const existing = albums[index];
    const removed = new Set(existing.removedPhotoSrcs);
    removed.add(input.photoSrc);
    const updated: UploadedAlbum = {
      ...existing,
      title: input.title || existing.title,
      eventSlug: input.eventSlug || existing.eventSlug,
      date: input.date || existing.date,
      description: input.description || existing.description,
      category: input.category || existing.category,
      photos: existing.photos.filter((photo) => photo.src !== input.photoSrc),
      removedPhotoSrcs: Array.from(removed),
      updatedAt: now,
    };
    albums[index] = updated;
    await writeUploadedAlbums(albums);
    return updated;
  }

  const album: UploadedAlbum = {
    slug: albumSlug,
    title: input.title,
    eventSlug: input.eventSlug,
    date: input.date,
    description: input.description,
    sources: ["Admin uploads"],
    mediaType: "Photos",
    category: input.category,
    photos: [],
    removedPhotoSrcs: [input.photoSrc],
    createdAt: now,
    updatedAt: now,
  };

  await writeUploadedAlbums([album, ...albums]);
  return album;
}

function toArchiveAlbum(album: UploadedAlbum): ArchiveAlbum {
  const removed = new Set(album.removedPhotoSrcs);
  const photos = album.photos.filter((photo) => !removed.has(photo.src));
  return {
    slug: album.slug,
    title: album.title,
    eventSlug: album.eventSlug,
    date: album.date,
    description: album.description,
    sources: album.sources,
    mediaType: album.mediaType,
    category: album.category,
    photos,
    photoCount: photos.length,
    coverImage: photos[0]?.src || "",
  };
}

export function mergeUploadedAlbums(archive: ArchiveManifest, uploadedAlbums: UploadedAlbum[]): ArchiveManifest {
  const albums = archive.albums.map((album) => ({ ...album, photos: [...album.photos] }));

  for (const uploaded of uploadedAlbums) {
    const index = albums.findIndex((album) => album.eventSlug === uploaded.eventSlug || album.slug === uploaded.slug);
    const removed = new Set(uploaded.removedPhotoSrcs);
    if (index >= 0) {
      const existing = albums[index];
      const mergedPhotos = [
        ...existing.photos.filter((photo) => !removed.has(photo.src)),
        ...uploaded.photos.filter((photo) => !removed.has(photo.src)),
      ];
      albums[index] = {
        ...existing,
        photos: mergedPhotos,
        photoCount: mergedPhotos.length,
        coverImage: mergedPhotos[0]?.src || "",
        sources: Array.from(new Set([...existing.sources, ...uploaded.sources])),
      };
    } else {
      albums.push(toArchiveAlbum(uploaded));
    }
  }

  return { ...archive, albums };
}
