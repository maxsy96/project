import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const storeName = "cavm-admin-uploads";
const uploadPrefix = "images";
const localUploadPath = path.join(process.cwd(), ".data", "uploads");
const maxImageSize = 8 * 1024 * 1024;

const mimeToExtension: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const extensionToMime: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

async function getBlobStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(storeName);
  } catch {
    return null;
  }
}

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return Boolean(value && typeof value === "object" && "arrayBuffer" in value && "size" in value && "type" in value);
}

function cleanKey(key: string) {
  return key
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .join("/");
}

function extensionFor(file: File) {
  const fromMime = mimeToExtension[file.type];
  if (fromMime) return fromMime;
  const fromName = file.name.split(".").pop()?.toLowerCase() || "";
  if (extensionToMime[fromName]) return fromName === "jpeg" ? "jpg" : fromName;
  return "";
}

export async function saveUploadedImage(file: File) {
  if (!file.size) return "";
  if (file.size > maxImageSize) {
    throw new Error("Image upload is too large. Use an image under 8 MB.");
  }

  const extension = extensionFor(file);
  if (!extension) {
    throw new Error("Unsupported image type. Upload JPG, PNG, WebP, or GIF.");
  }

  const key = `${uploadPrefix}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const store = await getBlobStore();

  if (store) {
    await store.set(key, arrayBuffer, {
      metadata: {
        contentType: file.type || extensionToMime[extension] || "application/octet-stream",
        originalName: file.name,
      },
    });
  } else {
    const outputPath = path.join(localUploadPath, cleanKey(key));
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, bytes);
  }

  return `/admin-uploads/${key}`;
}

export async function imageUrlFromFormData(formData: FormData, fieldName = "imageUrl") {
  const uploaded = formData.get(`${fieldName}File`);
  if (isUploadedFile(uploaded) && uploaded.size > 0) {
    return saveUploadedImage(uploaded);
  }

  const existing = formData.get(fieldName);
  return typeof existing === "string" ? existing.trim() : "";
}

export async function readUploadedImage(keyParts: string[]) {
  const key = cleanKey(keyParts.join("/"));
  if (!key.startsWith(`${uploadPrefix}/`)) return null;

  const store = await getBlobStore();
  if (store) {
    const data = await store.get(key, { type: "arrayBuffer" });
    if (!data) return null;
    return {
      body: Buffer.from(data),
      contentType: extensionToMime[key.split(".").pop()?.toLowerCase() || ""] || "application/octet-stream",
    };
  }

  try {
    const filePath = path.join(localUploadPath, key);
    const body = await fs.readFile(filePath);
    return {
      body,
      contentType: extensionToMime[key.split(".").pop()?.toLowerCase() || ""] || "application/octet-stream",
    };
  } catch {
    return null;
  }
}
