import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { headers } from "next/headers";
import { currentAdminUsername } from "@/lib/auth";

const storeName = "cavm-audit-log";
const contentKey = "audit-log.json";
const localContentPath = path.join(process.cwd(), ".data", "audit-log.json");
const maxEntries = 1000;

export type AuditStatus = "success" | "failed";

export type AuditEntry = {
  id: string;
  createdAt: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  status: AuditStatus;
  details: Record<string, string>;
  ipAddress: string;
  userAgent: string;
};

type AuditInput = {
  actor?: string | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  entityName?: string | null;
  status?: AuditStatus;
  details?: Record<string, string | number | boolean | null | undefined>;
};

function cleanEntries(value: unknown): AuditEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is AuditEntry => Boolean(entry && typeof entry === "object" && "id" in entry))
    .map((entry) => ({
      id: String(entry.id || crypto.randomUUID()),
      createdAt: String(entry.createdAt || new Date().toISOString()),
      actor: String(entry.actor || "Unknown admin"),
      action: String(entry.action || "Unknown action"),
      entityType: String(entry.entityType || "System"),
      entityId: String(entry.entityId || ""),
      entityName: String(entry.entityName || ""),
      status: entry.status === "failed" ? "failed" : "success",
      details: cleanDetails(entry.details),
      ipAddress: String(entry.ipAddress || ""),
      userAgent: String(entry.userAgent || ""),
    }));
}

function cleanDetails(details: unknown) {
  if (!details || typeof details !== "object") return {};
  return Object.fromEntries(
    Object.entries(details as Record<string, unknown>)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value).slice(0, 500)]),
  );
}

async function getBlobStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(storeName);
  } catch {
    return null;
  }
}

async function readLocalAuditLog() {
  try {
    const text = await fs.readFile(localContentPath, "utf8");
    return cleanEntries(JSON.parse(text));
  } catch {
    return [];
  }
}

async function writeLocalAuditLog(entries: AuditEntry[]) {
  await fs.mkdir(path.dirname(localContentPath), { recursive: true });
  await fs.writeFile(localContentPath, JSON.stringify(entries, null, 2));
}

export async function readAuditLog(limit = maxEntries) {
  const store = await getBlobStore();
  if (!store) return (await readLocalAuditLog()).slice(0, limit);

  try {
    const entries = await store.get(contentKey, { type: "json" });
    return cleanEntries(entries).slice(0, limit);
  } catch {
    return [];
  }
}

async function writeAuditLog(entries: AuditEntry[]) {
  const trimmed = entries.slice(0, maxEntries);
  const store = await getBlobStore();
  if (!store) {
    await writeLocalAuditLog(trimmed);
    return;
  }

  await store.setJSON(contentKey, trimmed);
}

async function requestContext() {
  try {
    const headerStore = await headers();
    return {
      ipAddress: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-nf-client-connection-ip") || "",
      userAgent: headerStore.get("user-agent") || "",
    };
  } catch {
    return { ipAddress: "", userAgent: "" };
  }
}

export async function logAuditEvent(input: AuditInput) {
  try {
    const [actor, context, entries] = await Promise.all([
      input.actor === undefined ? currentAdminUsername() : Promise.resolve(input.actor),
      requestContext(),
      readAuditLog(),
    ]);

    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      actor: actor || "Unknown admin",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId === undefined || input.entityId === null ? "" : String(input.entityId),
      entityName: input.entityName || "",
      status: input.status || "success",
      details: cleanDetails(input.details),
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    };

    await writeAuditLog([entry, ...entries]);
  } catch (error) {
    console.error("[audit-log:write-failed]", error);
  }
}
