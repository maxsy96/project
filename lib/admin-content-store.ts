import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

const storeName = "cavm-admin-content";
const contentKey = "content.json";
const localContentPath = path.join(process.cwd(), ".data", "admin-content.json");

export type StoredEvent = {
  id: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  organizer: string;
  registrationUrl: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type StoredAchievement = {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  date: string | null;
  imageUrl: string;
  externalUrl: string;
  createdAt: string;
};

type AdminContent = {
  events: StoredEvent[];
  achievements: StoredAchievement[];
};

const emptyContent: AdminContent = {
  events: [],
  achievements: [],
};

function cleanContent(value: unknown): AdminContent {
  if (!value || typeof value !== "object") {
    return { ...emptyContent };
  }

  const content = value as Partial<AdminContent>;
  return {
    events: Array.isArray(content.events) ? content.events : [],
    achievements: Array.isArray(content.achievements) ? content.achievements : [],
  };
}

function nextNegativeId(items: Array<{ id: number }>) {
  const lowest = items.reduce((min, item) => Math.min(min, item.id), 0);
  return lowest - 1;
}

async function getBlobStore() {
  const hasNetlifyContext = Boolean(
    process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT,
  );

  if (!hasNetlifyContext) {
    return null;
  }

  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore(storeName);
  } catch {
    return null;
  }
}

async function readLocalContent() {
  try {
    const text = await fs.readFile(localContentPath, "utf8");
    return cleanContent(JSON.parse(text));
  } catch {
    return { ...emptyContent };
  }
}

async function writeLocalContent(content: AdminContent) {
  await fs.mkdir(path.dirname(localContentPath), { recursive: true });
  await fs.writeFile(localContentPath, JSON.stringify(content, null, 2));
}

export async function readAdminContent() {
  const store = await getBlobStore();
  if (!store) {
    return readLocalContent();
  }

  try {
    const content = await store.get(contentKey, { type: "json" });
    return cleanContent(content);
  } catch {
    return { ...emptyContent };
  }
}

async function writeAdminContent(content: AdminContent) {
  const store = await getBlobStore();
  if (!store) {
    await writeLocalContent(content);
    return;
  }

  await store.setJSON(contentKey, content);
}

export async function getStoredEvents() {
  const content = await readAdminContent();
  return content.events;
}

export async function getStoredEventBySlug(slug: string) {
  const events = await getStoredEvents();
  return events.find((event) => event.slug === slug) ?? null;
}

export async function createStoredEvent(event: Omit<StoredEvent, "id" | "createdAt" | "updatedAt">) {
  const content = await readAdminContent();
  const now = new Date().toISOString();
  const storedEvent: StoredEvent = {
    ...event,
    id: nextNegativeId(content.events),
    createdAt: now,
    updatedAt: now,
  };

  content.events = [storedEvent, ...content.events];
  await writeAdminContent(content);
  return storedEvent;
}

export async function updateStoredEvent(id: number, event: Omit<StoredEvent, "id" | "createdAt" | "updatedAt">) {
  const content = await readAdminContent();
  const now = new Date().toISOString();
  const index = content.events.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const updatedEvent: StoredEvent = {
    ...event,
    id,
    createdAt: content.events[index].createdAt,
    updatedAt: now,
  };
  content.events[index] = updatedEvent;
  await writeAdminContent(content);
  return updatedEvent;
}

export async function upsertStoredEventBySlug(event: Omit<StoredEvent, "id" | "createdAt" | "updatedAt">) {
  const content = await readAdminContent();
  const now = new Date().toISOString();
  const index = content.events.findIndex((item) => item.slug === event.slug);

  if (index !== -1) {
    const updatedEvent: StoredEvent = {
      ...event,
      id: content.events[index].id,
      createdAt: content.events[index].createdAt,
      updatedAt: now,
    };
    content.events[index] = updatedEvent;
    await writeAdminContent(content);
    return updatedEvent;
  }

  const storedEvent: StoredEvent = {
    ...event,
    id: nextNegativeId(content.events),
    createdAt: now,
    updatedAt: now,
  };
  content.events = [storedEvent, ...content.events];
  await writeAdminContent(content);
  return storedEvent;
}

export async function deleteStoredEvent(id: number) {
  const content = await readAdminContent();
  const nextEvents = content.events.filter((event) => event.id !== id);
  if (nextEvents.length === content.events.length) {
    return false;
  }

  content.events = nextEvents;
  await writeAdminContent(content);
  return true;
}

export async function getStoredAchievements() {
  const content = await readAdminContent();
  return content.achievements;
}

export async function createStoredAchievement(achievement: Omit<StoredAchievement, "id" | "createdAt">) {
  const content = await readAdminContent();
  const storedAchievement: StoredAchievement = {
    ...achievement,
    id: nextNegativeId(content.achievements),
    createdAt: new Date().toISOString(),
  };

  content.achievements = [storedAchievement, ...content.achievements];
  await writeAdminContent(content);
  return storedAchievement;
}

export async function deleteStoredAchievement(id: number) {
  const content = await readAdminContent();
  const nextAchievements = content.achievements.filter((achievement) => achievement.id !== id);
  if (nextAchievements.length === content.achievements.length) {
    return false;
  }

  content.achievements = nextAchievements;
  await writeAdminContent(content);
  return true;
}

export function storedEventToView(event: StoredEvent) {
  return {
    ...event,
    date: new Date(event.date),
    createdAt: new Date(event.createdAt),
    updatedAt: new Date(event.updatedAt),
  };
}

export function storedAchievementToView(achievement: StoredAchievement) {
  return {
    ...achievement,
    date: achievement.date ? new Date(achievement.date) : null,
    createdAt: new Date(achievement.createdAt),
  };
}
