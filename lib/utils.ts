import { clsx, type ClassValue } from "clsx";
import { format, isBefore, isWithinInterval, addDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toJsonList(values: FormDataEntryValue[] | string[] | string) {
  const list = Array.isArray(values) ? values : [values];
  return JSON.stringify(
    list
      .map((value) => String(value).trim())
      .filter(Boolean),
  );
}

export function fromJsonList(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(date?: Date | string | null) {
  if (!date) return "Rolling";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date?: Date | string | null) {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy, h:mm a");
}

export function deadlineState(deadline?: Date | string | null) {
  if (!deadline) return "open";
  const due = new Date(deadline);
  const now = new Date();
  if (isBefore(due, now)) return "closed";
  if (isWithinInterval(due, { start: now, end: addDays(now, 14) })) return "closing soon";
  return "open";
}

export function matchScore(
  studentSectors: string[],
  studentTypes: string[],
  opportunitySectors: string[],
  opportunityType: string,
) {
  const sectorMatches = opportunitySectors.filter((sector) => studentSectors.includes(sector)).length;
  const typeMatch = studentTypes.includes(opportunityType) || studentTypes.includes(`${opportunityType}s`);
  if (sectorMatches > 0 && typeMatch) return "Strong match";
  if (sectorMatches > 0) return "Good match";
  if (typeMatch) return "Possible match";
  return "No match";
}

export function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function formString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function formList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((item) => String(item).trim())
    .filter(Boolean);
}
