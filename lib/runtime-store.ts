import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const storeName = "cavm-runtime-data";
const contentKey = "runtime.json";
const localContentPath = path.join(process.cwd(), ".data", "runtime-data.json");

type MaybeDate = Date | string | null;

export type StoredOpportunity = {
  id: number;
  title: string;
  slug: string;
  organization: string;
  type: string;
  sectors: string;
  location: string;
  isRemote: boolean;
  isAbroad: boolean;
  isGovernmentRelated: boolean;
  paidStatus: string;
  deadline: MaybeDate;
  description: string;
  eligibility: string;
  requirements: string;
  benefits: string;
  applicationUrl: string;
  contactEmail: string;
  status: string;
  source: string;
  submittedByPartner: boolean;
  approvalStatus: string;
  imageUrl: string;
  createdAt: MaybeDate;
  updatedAt: MaybeDate;
};

export type StoredStudentInterest = {
  id: number;
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  academicYear: string;
  major: string;
  interests: string;
  opportunityPreferences: string;
  preferredLocations: string;
  availability: string;
  goals: string;
  consent: boolean;
  createdAt: MaybeDate;
};

export type StoredPartnerSubmission = {
  id: number;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  opportunityTitle: string;
  opportunityType: string;
  sectors: string;
  description: string;
  location: string;
  deadline: MaybeDate;
  eligibility: string;
  applicationUrl: string;
  notes: string;
  approvalStatus: string;
  createdAt: MaybeDate;
};

export type StoredContactSubmission = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: MaybeDate;
};

export type StoredMediaItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  mediaType: string;
  imageUrl: string;
  videoUrl: string;
  date: MaybeDate;
  createdAt: MaybeDate;
};

export type StoredMember = {
  id: number;
  name: string;
  studentId: string;
  email: string;
  role: string;
  committee: string;
  areaOfInterest: string;
  bio: string;
  imageUrl: string;
  socialUrl: string;
  order: number;
  isActive: boolean;
  createdAt: MaybeDate;
};

export type StoredAlumni = {
  id: number;
  name: string;
  graduationYear: string;
  currentRole: string;
  sector: string;
  story: string;
  advice: string;
  imageUrl: string;
  socialUrl: string;
  createdAt: MaybeDate;
};

type RuntimeContent = {
  opportunities: StoredOpportunity[];
  deletedOpportunityIds: number[];
  studentInterests: StoredStudentInterest[];
  partnerSubmissions: StoredPartnerSubmission[];
  deletedPartnerSubmissionIds: number[];
  contactSubmissions: StoredContactSubmission[];
  deletedContactSubmissionIds: number[];
  mediaItems: StoredMediaItem[];
  deletedMediaItemIds: number[];
  members: StoredMember[];
  deletedMemberIds: number[];
  alumni: StoredAlumni[];
  deletedAlumniIds: number[];
};

const emptyContent: RuntimeContent = {
  opportunities: [],
  deletedOpportunityIds: [],
  studentInterests: [],
  partnerSubmissions: [],
  deletedPartnerSubmissionIds: [],
  contactSubmissions: [],
  deletedContactSubmissionIds: [],
  mediaItems: [],
  deletedMediaItemIds: [],
  members: [],
  deletedMemberIds: [],
  alumni: [],
  deletedAlumniIds: [],
};

function cleanContent(value: unknown): RuntimeContent {
  if (!value || typeof value !== "object") return { ...emptyContent };
  const content = value as Partial<RuntimeContent>;
  return {
    opportunities: Array.isArray(content.opportunities) ? content.opportunities : [],
    deletedOpportunityIds: Array.isArray(content.deletedOpportunityIds) ? content.deletedOpportunityIds : [],
    studentInterests: Array.isArray(content.studentInterests) ? content.studentInterests : [],
    partnerSubmissions: Array.isArray(content.partnerSubmissions) ? content.partnerSubmissions : [],
    deletedPartnerSubmissionIds: Array.isArray(content.deletedPartnerSubmissionIds) ? content.deletedPartnerSubmissionIds : [],
    contactSubmissions: Array.isArray(content.contactSubmissions) ? content.contactSubmissions : [],
    deletedContactSubmissionIds: Array.isArray(content.deletedContactSubmissionIds) ? content.deletedContactSubmissionIds : [],
    mediaItems: Array.isArray(content.mediaItems) ? content.mediaItems : [],
    deletedMediaItemIds: Array.isArray(content.deletedMediaItemIds) ? content.deletedMediaItemIds : [],
    members: Array.isArray(content.members) ? content.members : [],
    deletedMemberIds: Array.isArray(content.deletedMemberIds) ? content.deletedMemberIds : [],
    alumni: Array.isArray(content.alumni) ? content.alumni : [],
    deletedAlumniIds: Array.isArray(content.deletedAlumniIds) ? content.deletedAlumniIds : [],
  };
}

function nextNegativeId(items: Array<{ id: number }>) {
  const lowest = items.reduce((min, item) => Math.min(min, item.id), 0);
  return lowest - 1;
}

function dateOrNull(value: MaybeDate) {
  return value ? new Date(value) : null;
}

function dateOrNow(value: MaybeDate) {
  return value ? new Date(value) : new Date();
}

function serializeDates<T extends Record<string, unknown>>(item: T): T {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]),
  ) as T;
}

function isQaRecordText(...values: Array<string | null | undefined>) {
  return values.some((value) => value?.toLowerCase().includes("codex qa student browser"));
}

async function getBlobStore() {
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

async function writeLocalContent(content: RuntimeContent) {
  await fs.mkdir(path.dirname(localContentPath), { recursive: true });
  await fs.writeFile(localContentPath, JSON.stringify(content, null, 2));
}

async function readRuntimeContent() {
  const store = await getBlobStore();
  if (!store) return readLocalContent();

  try {
    const content = await store.get(contentKey, { type: "json" });
    return cleanContent(content);
  } catch {
    return { ...emptyContent };
  }
}

async function writeRuntimeContent(content: RuntimeContent) {
  const store = await getBlobStore();
  if (!store) {
    await writeLocalContent(content);
    return;
  }

  await store.setJSON(contentKey, content);
}

export function opportunityToView(opportunity: StoredOpportunity) {
  return {
    ...opportunity,
    deadline: dateOrNull(opportunity.deadline),
    createdAt: dateOrNow(opportunity.createdAt),
    updatedAt: dateOrNow(opportunity.updatedAt),
  };
}

export function studentToView(student: StoredStudentInterest) {
  return { ...student, createdAt: dateOrNow(student.createdAt) };
}

export function partnerToView(submission: StoredPartnerSubmission) {
  return {
    ...submission,
    deadline: dateOrNull(submission.deadline),
    createdAt: dateOrNow(submission.createdAt),
  };
}

export function contactToView(message: StoredContactSubmission) {
  return { ...message, createdAt: dateOrNow(message.createdAt) };
}

export function mediaToView(item: StoredMediaItem) {
  return {
    ...item,
    date: dateOrNull(item.date),
    createdAt: dateOrNow(item.createdAt),
  };
}

export function memberToView(member: StoredMember) {
  return { ...member, createdAt: dateOrNow(member.createdAt) };
}

export function alumniToView(person: StoredAlumni) {
  return { ...person, createdAt: dateOrNow(person.createdAt) };
}

export async function getAllOpportunities() {
  const [databaseOpportunities, content] = await Promise.all([
    prisma.opportunity.findMany(),
    readRuntimeContent(),
  ]);
  const runtimeById = new Map(content.opportunities.map((opportunity) => [opportunity.id, opportunity]));
  const deleted = new Set(content.deletedOpportunityIds);
  const database = databaseOpportunities
    .filter((opportunity) => !deleted.has(opportunity.id) && !runtimeById.has(opportunity.id))
    .map((opportunity) => opportunityToView(serializeDates(opportunity as unknown as StoredOpportunity)));
  const runtime = content.opportunities.map(opportunityToView);
  return [...runtime, ...database];
}

export async function getOpportunityById(id: number) {
  const content = await readRuntimeContent();
  if (content.deletedOpportunityIds.includes(id)) return null;
  const runtime = content.opportunities.find((opportunity) => opportunity.id === id);
  if (runtime) return opportunityToView(runtime);
  const database = await prisma.opportunity.findUnique({ where: { id } });
  return database ? opportunityToView(serializeDates(database as unknown as StoredOpportunity)) : null;
}

export async function getOpportunityBySlug(slug: string) {
  const opportunities = await getAllOpportunities();
  return opportunities.find((opportunity) => opportunity.slug === slug) ?? null;
}

export async function saveOpportunity(opportunity: Omit<StoredOpportunity, "id" | "createdAt" | "updatedAt">, id?: number) {
  const content = await readRuntimeContent();
  const now = new Date().toISOString();
  const existingIndex = id ? content.opportunities.findIndex((item) => item.id === id) : -1;
  const existing = existingIndex >= 0 ? content.opportunities[existingIndex] : null;
  const stored: StoredOpportunity = {
    ...opportunity,
    id: id ?? nextNegativeId(content.opportunities),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    content.opportunities[existingIndex] = stored;
  } else {
    content.opportunities = [stored, ...content.opportunities];
  }

  content.deletedOpportunityIds = content.deletedOpportunityIds.filter((item) => item !== stored.id);
  await writeRuntimeContent(content);
  return opportunityToView(stored);
}

export async function deleteOpportunityById(id: number) {
  const content = await readRuntimeContent();
  content.opportunities = content.opportunities.filter((item) => item.id !== id);
  if (!content.deletedOpportunityIds.includes(id)) content.deletedOpportunityIds.push(id);
  await writeRuntimeContent(content);
}

export async function updateOpportunityStatus(id: number, status: string) {
  const opportunity = await getOpportunityById(id);
  if (!opportunity) return null;
  return saveOpportunity({ ...opportunity, status }, id);
}

export async function createStudentInterest(data: Omit<StoredStudentInterest, "id" | "createdAt">) {
  const content = await readRuntimeContent();
  const stored: StoredStudentInterest = {
    ...data,
    id: nextNegativeId(content.studentInterests),
    createdAt: new Date().toISOString(),
  };
  content.studentInterests = [stored, ...content.studentInterests];
  await writeRuntimeContent(content);
  return studentToView(stored);
}

export async function getAllStudentInterests() {
  const [databaseStudents, content] = await Promise.all([
    prisma.studentInterest.findMany(),
    readRuntimeContent(),
  ]);
  return [
    ...content.studentInterests.map(studentToView),
    ...databaseStudents.map((student) => studentToView(serializeDates(student as unknown as StoredStudentInterest))),
  ].filter((student) => !isQaRecordText(student.fullName, student.email, student.goals));
}

export async function getStudentInterestById(id: number) {
  const content = await readRuntimeContent();
  const runtime = content.studentInterests.find((student) => student.id === id);
  if (runtime) return studentToView(runtime);
  const database = await prisma.studentInterest.findUnique({ where: { id } });
  return database ? studentToView(serializeDates(database as unknown as StoredStudentInterest)) : null;
}

export async function createPartnerSubmission(data: Omit<StoredPartnerSubmission, "id" | "createdAt">) {
  const content = await readRuntimeContent();
  const stored: StoredPartnerSubmission = {
    ...data,
    id: nextNegativeId(content.partnerSubmissions),
    createdAt: new Date().toISOString(),
  };
  content.partnerSubmissions = [stored, ...content.partnerSubmissions];
  await writeRuntimeContent(content);
  return partnerToView(stored);
}

export async function getAllPartnerSubmissions() {
  const [databaseSubmissions, content] = await Promise.all([
    prisma.partnerSubmission.findMany(),
    readRuntimeContent(),
  ]);
  const deleted = new Set(content.deletedPartnerSubmissionIds);
  const runtimeById = new Map(content.partnerSubmissions.map((submission) => [submission.id, submission]));
  return [
    ...content.partnerSubmissions.map(partnerToView),
    ...databaseSubmissions
      .filter((submission) => !deleted.has(submission.id) && !runtimeById.has(submission.id))
      .map((submission) => partnerToView(serializeDates(submission as unknown as StoredPartnerSubmission))),
  ];
}

export async function getPartnerSubmissionById(id: number) {
  const submissions = await getAllPartnerSubmissions();
  return submissions.find((submission) => submission.id === id) ?? null;
}

export async function updatePartnerSubmissionStatus(id: number, approvalStatus: string) {
  const content = await readRuntimeContent();
  const existing = await getPartnerSubmissionById(id);
  if (!existing) return null;
  const stored = serializeDates({ ...existing, approvalStatus } as unknown as StoredPartnerSubmission);
  const index = content.partnerSubmissions.findIndex((submission) => submission.id === id);
  if (index >= 0) content.partnerSubmissions[index] = stored;
  else content.partnerSubmissions = [stored, ...content.partnerSubmissions];
  await writeRuntimeContent(content);
  return partnerToView(stored);
}

export async function approvePartnerSubmissionWithOpportunity(
  id: number,
  opportunity: Omit<StoredOpportunity, "id" | "createdAt" | "updatedAt">,
) {
  const content = await readRuntimeContent();
  const now = new Date().toISOString();
  const runtimeIndex = content.partnerSubmissions.findIndex((submission) => submission.id === id);
  let submission = runtimeIndex >= 0 ? content.partnerSubmissions[runtimeIndex] : null;

  if (!submission) {
    const databaseSubmission = await prisma.partnerSubmission.findUnique({ where: { id } });
    if (!databaseSubmission) return null;
    submission = serializeDates(databaseSubmission as unknown as StoredPartnerSubmission);
  }

  const approvedSubmission = serializeDates({
    ...submission,
    approvalStatus: "approved",
  } as unknown as StoredPartnerSubmission);

  if (runtimeIndex >= 0) {
    content.partnerSubmissions[runtimeIndex] = approvedSubmission;
  } else {
    content.partnerSubmissions = [approvedSubmission, ...content.partnerSubmissions];
  }

  const existingOpportunityIndex = content.opportunities.findIndex(
    (item) =>
      item.source === "Partner submission" &&
      item.title === opportunity.title &&
      item.contactEmail === opportunity.contactEmail,
  );
  const existingOpportunity = existingOpportunityIndex >= 0 ? content.opportunities[existingOpportunityIndex] : null;
  const storedOpportunity: StoredOpportunity = {
    ...opportunity,
    id: existingOpportunity?.id ?? nextNegativeId(content.opportunities),
    createdAt: existingOpportunity?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingOpportunityIndex >= 0) {
    content.opportunities[existingOpportunityIndex] = storedOpportunity;
  } else {
    content.opportunities = [storedOpportunity, ...content.opportunities];
  }

  content.deletedOpportunityIds = content.deletedOpportunityIds.filter((item) => item !== storedOpportunity.id);
  await writeRuntimeContent(content);

  return {
    submission: partnerToView(approvedSubmission),
    opportunity: opportunityToView(storedOpportunity),
  };
}

export async function deletePartnerSubmissionById(id: number) {
  const content = await readRuntimeContent();
  content.partnerSubmissions = content.partnerSubmissions.filter((submission) => submission.id !== id);
  if (!content.deletedPartnerSubmissionIds.includes(id)) content.deletedPartnerSubmissionIds.push(id);
  await writeRuntimeContent(content);
}

export async function createContactSubmission(data: Omit<StoredContactSubmission, "id" | "createdAt" | "status"> & { status?: string }) {
  const content = await readRuntimeContent();
  const stored: StoredContactSubmission = {
    ...data,
    id: nextNegativeId(content.contactSubmissions),
    status: data.status ?? "unread",
    createdAt: new Date().toISOString(),
  };
  content.contactSubmissions = [stored, ...content.contactSubmissions];
  await writeRuntimeContent(content);
  return contactToView(stored);
}

export async function getAllContactSubmissions() {
  const [databaseMessages, content] = await Promise.all([
    prisma.contactSubmission.findMany(),
    readRuntimeContent(),
  ]);
  const deleted = new Set(content.deletedContactSubmissionIds);
  const runtimeById = new Map(content.contactSubmissions.map((message) => [message.id, message]));
  return [
    ...content.contactSubmissions.map(contactToView),
    ...databaseMessages
      .filter((message) => !deleted.has(message.id) && !runtimeById.has(message.id))
      .map((message) => contactToView(serializeDates(message as unknown as StoredContactSubmission))),
  ].filter((message) => !isQaRecordText(message.name, message.email, message.subject, message.message));
}

export async function updateContactStatus(id: number, status: string) {
  const content = await readRuntimeContent();
  const messages = await getAllContactSubmissions();
  const existing = messages.find((message) => message.id === id);
  if (!existing) return null;
  const stored = serializeDates({ ...existing, status } as unknown as StoredContactSubmission);
  const index = content.contactSubmissions.findIndex((message) => message.id === id);
  if (index >= 0) content.contactSubmissions[index] = stored;
  else content.contactSubmissions = [stored, ...content.contactSubmissions];
  await writeRuntimeContent(content);
  return contactToView(stored);
}

export async function deleteContactSubmissionById(id: number) {
  const content = await readRuntimeContent();
  content.contactSubmissions = content.contactSubmissions.filter((message) => message.id !== id);
  if (!content.deletedContactSubmissionIds.includes(id)) content.deletedContactSubmissionIds.push(id);
  await writeRuntimeContent(content);
}

export async function getAllMediaItems() {
  const [databaseMedia, content] = await Promise.all([
    prisma.mediaItem.findMany(),
    readRuntimeContent(),
  ]);
  const deleted = new Set(content.deletedMediaItemIds);
  return [
    ...content.mediaItems.map(mediaToView),
    ...databaseMedia
      .filter((item) => !deleted.has(item.id))
      .map((item) => mediaToView(serializeDates(item as unknown as StoredMediaItem))),
  ];
}

export async function createMediaItem(data: Omit<StoredMediaItem, "id" | "createdAt">) {
  const content = await readRuntimeContent();
  const stored: StoredMediaItem = { ...data, id: nextNegativeId(content.mediaItems), createdAt: new Date().toISOString() };
  content.mediaItems = [stored, ...content.mediaItems];
  await writeRuntimeContent(content);
  return mediaToView(stored);
}

export async function deleteMediaItemById(id: number) {
  const content = await readRuntimeContent();
  content.mediaItems = content.mediaItems.filter((item) => item.id !== id);
  if (!content.deletedMediaItemIds.includes(id)) content.deletedMediaItemIds.push(id);
  await writeRuntimeContent(content);
}

export async function getAllMembers(includeInactive = true) {
  const [databaseMembers, content] = await Promise.all([
    prisma.member.findMany(),
    readRuntimeContent(),
  ]);
  const runtimeById = new Map(content.members.map((member) => [member.id, member]));
  const deleted = new Set(content.deletedMemberIds);
  return [
    ...content.members.map(memberToView),
    ...databaseMembers
      .filter((member) => !deleted.has(member.id) && !runtimeById.has(member.id))
      .map((member) => memberToView(serializeDates(member as unknown as StoredMember))),
  ].filter((member) => includeInactive || member.isActive);
}

export async function getMemberById(id: number) {
  const members = await getAllMembers();
  return members.find((member) => member.id === id) ?? null;
}

export async function createMember(data: Omit<StoredMember, "id" | "createdAt">) {
  const content = await readRuntimeContent();
  const stored: StoredMember = { ...data, id: nextNegativeId(content.members), createdAt: new Date().toISOString() };
  content.members = [stored, ...content.members];
  await writeRuntimeContent(content);
  return memberToView(stored);
}

export async function saveMember(data: Omit<StoredMember, "id" | "createdAt">, id?: number) {
  const content = await readRuntimeContent();
  const existingIndex = id ? content.members.findIndex((member) => member.id === id) : -1;
  const existing = existingIndex >= 0 ? content.members[existingIndex] : null;
  const stored: StoredMember = {
    ...data,
    id: id ?? nextNegativeId(content.members),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    content.members[existingIndex] = stored;
  } else {
    content.members = [stored, ...content.members];
  }

  content.deletedMemberIds = content.deletedMemberIds.filter((item) => item !== stored.id);
  await writeRuntimeContent(content);
  return memberToView(stored);
}

export async function deleteMemberById(id: number) {
  const content = await readRuntimeContent();
  content.members = content.members.filter((member) => member.id !== id);
  if (!content.deletedMemberIds.includes(id)) content.deletedMemberIds.push(id);
  await writeRuntimeContent(content);
}

export async function getAllAlumni() {
  const [databaseAlumni, content] = await Promise.all([
    prisma.alumni.findMany(),
    readRuntimeContent(),
  ]);
  const runtimeById = new Map(content.alumni.map((person) => [person.id, person]));
  const deleted = new Set(content.deletedAlumniIds);
  return [
    ...content.alumni.map(alumniToView),
    ...databaseAlumni
      .filter((person) => !deleted.has(person.id) && !runtimeById.has(person.id))
      .map((person) => alumniToView(serializeDates(person as unknown as StoredAlumni))),
  ];
}

export async function getAlumniById(id: number) {
  const alumni = await getAllAlumni();
  return alumni.find((person) => person.id === id) ?? null;
}

export async function createAlumni(data: Omit<StoredAlumni, "id" | "createdAt">) {
  const content = await readRuntimeContent();
  const stored: StoredAlumni = { ...data, id: nextNegativeId(content.alumni), createdAt: new Date().toISOString() };
  content.alumni = [stored, ...content.alumni];
  await writeRuntimeContent(content);
  return alumniToView(stored);
}

export async function saveAlumni(data: Omit<StoredAlumni, "id" | "createdAt">, id?: number) {
  const content = await readRuntimeContent();
  const existingIndex = id ? content.alumni.findIndex((person) => person.id === id) : -1;
  const existing = existingIndex >= 0 ? content.alumni[existingIndex] : null;
  const stored: StoredAlumni = {
    ...data,
    id: id ?? nextNegativeId(content.alumni),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    content.alumni[existingIndex] = stored;
  } else {
    content.alumni = [stored, ...content.alumni];
  }

  content.deletedAlumniIds = content.deletedAlumniIds.filter((item) => item !== stored.id);
  await writeRuntimeContent(content);
  return alumniToView(stored);
}

export async function deleteAlumniById(id: number) {
  const content = await readRuntimeContent();
  content.alumni = content.alumni.filter((person) => person.id !== id);
  if (!content.deletedAlumniIds.includes(id)) content.deletedAlumniIds.push(id);
  await writeRuntimeContent(content);
}
