"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  adminPassword,
  adminUsername,
  requireAdmin,
} from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit-log";
import { imageUrlFromFormData } from "@/lib/uploaded-images";
import {
  createStoredAchievement,
  createStoredEvent,
  deleteStoredAchievement,
  deleteStoredEvent,
  getStoredAchievements,
  getStoredEvents,
  markDatabaseAchievementDeleted,
  markDatabaseEventDeleted,
  updateStoredEvent,
  upsertStoredAchievement,
  upsertStoredEventBySlug,
} from "@/lib/admin-content-store";
import { prisma } from "@/lib/prisma";
import {
  createAlumni,
  createMediaItem,
  createMember,
  deleteAlumniById,
  deleteContactSubmissionById,
  deleteMediaItemById,
  deleteMemberById,
  deleteOpportunityById,
  deletePartnerSubmissionById,
  getAllAlumni,
  getAllContactSubmissions,
  getAllMediaItems,
  getAllMembers,
  getAllOpportunities,
  getOpportunityById,
  getPartnerSubmissionById,
  approvePartnerSubmissionWithOpportunity,
  saveOpportunity,
  updateContactStatus,
  updateOpportunityStatus,
  updatePartnerSubmissionStatus,
} from "@/lib/runtime-store";
import { formList, formString, slugify, toJsonList } from "@/lib/utils";

function dateOrNull(value: string) {
  return value ? new Date(`${value}T09:00:00.000Z`) : null;
}

function bool(formData: FormData, key: string) {
  return formString(formData, key) === "on";
}

async function uniqueOpportunitySlug(title: string, currentId?: number) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  const opportunities = await getAllOpportunities();
  while (true) {
    const existing = opportunities.find((opportunity) => opportunity.slug === slug);
    if (!existing || existing.id === currentId) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

async function uniqueEventSlug(title: string) {
  const base = slugify(title) || "event";
  const storedEvents = await getStoredEvents();
  let slug = base;
  let counter = 2;

  while (true) {
    const [dbEvent, storedEvent] = await Promise.all([
      prisma.event.findUnique({ where: { slug } }),
      Promise.resolve(storedEvents.find((event) => event.slug === slug)),
    ]);
    if (!dbEvent && !storedEvent) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function adminLoginAction(_state: { message: string }, formData: FormData) {
  const username = formString(formData, "username") || formString(formData, "email");
  const password = formString(formData, "password");
  if (username !== adminUsername() || password !== adminPassword()) {
    await logAuditEvent({
      actor: username || "Unknown admin",
      action: "failed login",
      entityType: "Auth",
      status: "failed",
      details: { username: username || "blank" },
    });
    return { message: "Invalid admin username or password." };
  }
  await createAdminSession(username);
  await logAuditEvent({ actor: username, action: "logged in", entityType: "Auth" });
  redirect("/admin");
}

async function opportunityData(formData: FormData) {
  const title = formString(formData, "title");
  return {
    title,
    organization: formString(formData, "organization"),
    type: formString(formData, "type"),
    sectors: toJsonList(formList(formData, "sectors")),
    location: formString(formData, "location"),
    isRemote: bool(formData, "isRemote"),
    isAbroad: bool(formData, "isAbroad"),
    isGovernmentRelated: bool(formData, "isGovernmentRelated"),
    paidStatus: formString(formData, "paidStatus"),
    deadline: dateOrNull(formString(formData, "deadline")),
    description: formString(formData, "description"),
    eligibility: formString(formData, "eligibility"),
    requirements: formString(formData, "requirements"),
    benefits: formString(formData, "benefits"),
    applicationUrl: formString(formData, "applicationUrl"),
    contactEmail: formString(formData, "contactEmail"),
    status: formString(formData, "status") || "open",
    source: formString(formData, "source") || "Admin",
    imageUrl: await imageUrlFromFormData(formData),
    submittedByPartner: false,
    approvalStatus: "approved",
  };
}

export async function createOpportunityAction(formData: FormData) {
  await requireAdmin();
  const data = await opportunityData(formData);
  const saved = await saveOpportunity({
    ...data,
    slug: await uniqueOpportunitySlug(data.title),
  });
  await logAuditEvent({
    action: "created opportunity",
    entityType: "Opportunity",
    entityId: saved.id,
    entityName: saved.title,
    details: { status: saved.status, type: saved.type },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin/audit-log");
  redirect("/admin/opportunities");
}

export async function updateOpportunityAction(id: number, formData: FormData) {
  await requireAdmin();
  const data = await opportunityData(formData);
  const saved = await saveOpportunity({
    ...data,
    slug: await uniqueOpportunitySlug(data.title, id),
  }, id);
  await logAuditEvent({
    action: "updated opportunity",
    entityType: "Opportunity",
    entityId: saved.id,
    entityName: saved.title,
    details: { status: saved.status, type: saved.type },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin/audit-log");
  redirect("/admin/opportunities");
}

export async function deleteOpportunityAction(id: number) {
  await requireAdmin();
  const opportunity = await getOpportunityById(id);
  await deleteOpportunityById(id);
  await logAuditEvent({
    action: "deleted opportunity",
    entityType: "Opportunity",
    entityId: id,
    entityName: opportunity?.title || "",
    details: { status: opportunity?.status || "" },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin/audit-log");
  redirect("/admin/opportunities");
}

export async function archiveOpportunityAction(id: number) {
  await requireAdmin();
  const opportunity = await updateOpportunityStatus(id, "closed");
  await logAuditEvent({
    action: "closed opportunity",
    entityType: "Opportunity",
    entityId: id,
    entityName: opportunity?.title || "",
    details: { status: "closed" },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin/audit-log");
  redirect("/admin/opportunities");
}

export async function approvePartnerSubmissionAction(id: number) {
  await requireAdmin();
  const submission = await getPartnerSubmissionById(id);
  if (!submission) redirect("/admin/partner-submissions");
  const title = submission.opportunityTitle;
  const result = await approvePartnerSubmissionWithOpportunity(id, {
    title,
    slug: await uniqueOpportunitySlug(title),
    organization: submission.organizationName,
    type: submission.opportunityType,
    sectors: submission.sectors,
    location: submission.location,
    isRemote: false,
    isAbroad: false,
    isGovernmentRelated: false,
    paidStatus: "Pending details",
    deadline: submission.deadline,
    description: submission.description,
    eligibility: submission.eligibility,
    requirements: submission.eligibility,
    benefits: submission.notes || "Benefits to be confirmed by partner.",
    applicationUrl: submission.applicationUrl,
    contactEmail: submission.email,
    status: "open",
    source: "Partner submission",
    submittedByPartner: true,
    approvalStatus: "approved",
    imageUrl: "/images/events/cavm-event-09.jpg",
  });
  await logAuditEvent({
    action: "approved partner submission",
    entityType: "Partner submission",
    entityId: id,
    entityName: submission.opportunityTitle,
    details: { organization: submission.organizationName, opportunityCreated: result?.opportunity.title || "" },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/partner-submissions");
  revalidatePath("/admin/opportunities");
  revalidatePath("/admin/audit-log");
  redirect("/admin/partner-submissions");
}

export async function rejectPartnerSubmissionAction(id: number) {
  await requireAdmin();
  const submission = await updatePartnerSubmissionStatus(id, "rejected");
  await logAuditEvent({
    action: "rejected partner submission",
    entityType: "Partner submission",
    entityId: id,
    entityName: submission?.opportunityTitle || "",
    details: { organization: submission?.organizationName || "" },
  });
  revalidatePath("/admin/partner-submissions");
  revalidatePath("/admin/audit-log");
  redirect("/admin/partner-submissions");
}

export async function deletePartnerSubmissionAction(id: number) {
  await requireAdmin();
  const submission = await getPartnerSubmissionById(id);
  await deletePartnerSubmissionById(id);
  await logAuditEvent({
    action: "deleted partner submission",
    entityType: "Partner submission",
    entityId: id,
    entityName: submission?.opportunityTitle || "",
    details: { organization: submission?.organizationName || "" },
  });
  revalidatePath("/admin/partner-submissions");
  revalidatePath("/admin/audit-log");
  redirect("/admin/partner-submissions");
}

export async function markContactReadAction(id: number, status: string) {
  await requireAdmin();
  const message = await updateContactStatus(id, status);
  await logAuditEvent({
    action: `marked contact message ${status}`,
    entityType: "Contact message",
    entityId: id,
    entityName: message?.subject || "",
    details: { sender: message?.name || "", status },
  });
  revalidatePath("/admin/contact-submissions");
  revalidatePath("/admin/audit-log");
  redirect("/admin/contact-submissions");
}

export async function deleteContactAction(id: number) {
  await requireAdmin();
  const message = (await getAllContactSubmissions()).find((item) => item.id === id);
  await deleteContactSubmissionById(id);
  await logAuditEvent({
    action: "deleted contact message",
    entityType: "Contact message",
    entityId: id,
    entityName: message?.subject || "",
    details: { sender: message?.name || "" },
  });
  revalidatePath("/admin/contact-submissions");
  revalidatePath("/admin/audit-log");
  redirect("/admin/contact-submissions");
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();
  const data = await eventData(formData, await uniqueEventSlug(formString(formData, "title")));
  const event = await createStoredEvent(data);
  await logAuditEvent({
    action: "created event",
    entityType: "Event",
    entityId: event.id,
    entityName: event.title,
    details: { status: event.status, submissions: event.submissionStatus },
  });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/audit-log");
  redirect("/admin/events");
}

async function eventData(formData: FormData, slug: string) {
  const title = formString(formData, "title");
  const date = dateOrNull(formString(formData, "date")) ?? new Date();
  return {
    title,
    slug,
    date: date.toISOString(),
    time: formString(formData, "time"),
    location: formString(formData, "location"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    organizer: formString(formData, "organizer") || "CAVM Club",
    registrationUrl: formString(formData, "registrationUrl"),
    imageUrl: await imageUrlFromFormData(formData),
    status: formString(formData, "status") || "upcoming",
    submissionStatus: formString(formData, "submissionStatus") || "open",
  };
}

type ExistingEvent = {
  title: string;
  slug: string;
  date: Date | string;
  time: string;
  location: string;
  description: string;
  category: string;
  organizer: string;
  registrationUrl: string;
  imageUrl: string;
  status: string;
  submissionStatus?: string;
};

function eventDataFromExisting(event: ExistingEvent, submissionStatus: string) {
  return {
    title: event.title,
    slug: event.slug,
    date: event.date instanceof Date ? event.date.toISOString() : event.date,
    time: event.time,
    location: event.location,
    description: event.description,
    category: event.category,
    organizer: event.organizer,
    registrationUrl: event.registrationUrl,
    imageUrl: event.imageUrl,
    status: event.status,
    submissionStatus,
  };
}

export async function updateEventAction(id: number, formData: FormData) {
  await requireAdmin();
  let slug = "";
  let data: Awaited<ReturnType<typeof eventData>> | null = null;

  if (id < 0) {
    const storedEvents = await getStoredEvents();
    const existingSlug = storedEvents.find((event) => event.id === id)?.slug;
    slug = existingSlug ?? await uniqueEventSlug(formString(formData, "title"));
    data = await eventData(formData, slug);
    await updateStoredEvent(id, data);
  } else {
    const databaseEvent = await prisma.event.findUnique({ where: { id } });
    if (!databaseEvent) return;
    slug = databaseEvent.slug;
    data = await eventData(formData, slug);
    await upsertStoredEventBySlug(data);
  }

  await logAuditEvent({
    action: "updated event",
    entityType: "Event",
    entityId: id,
    entityName: data?.title || "",
    details: { status: data?.status || "", submissions: data?.submissionStatus || "" },
  });
  revalidatePath("/");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  revalidatePath("/admin/audit-log");
  redirect("/admin/events");
}

export async function updateEventSubmissionStatusAction(id: number, submissionStatus: string) {
  await requireAdmin();
  let slug = "";
  let eventName = "";

  if (id < 0) {
    const existing = (await getStoredEvents()).find((event) => event.id === id);
    if (!existing) redirect("/admin/events");
    slug = existing.slug;
    eventName = existing.title;
    await updateStoredEvent(id, eventDataFromExisting(existing, submissionStatus));
  } else {
    const databaseEvent = await prisma.event.findUnique({ where: { id } });
    if (!databaseEvent) redirect("/admin/events");
    slug = databaseEvent.slug;
    eventName = databaseEvent.title;
    await upsertStoredEventBySlug(eventDataFromExisting(databaseEvent, submissionStatus));
  }

  await logAuditEvent({
    action: "changed event submissions",
    entityType: "Event",
    entityId: id,
    entityName: eventName,
    details: { submissions: submissionStatus },
  });
  revalidatePath("/");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  revalidatePath("/admin/audit-log");
  redirect("/admin/events");
}

export async function deleteEventAction(id: number) {
  await requireAdmin();
  const storedEvent = id < 0 ? (await getStoredEvents()).find((event) => event.id === id) : null;
  if (await deleteStoredEvent(id)) {
    if (storedEvent) {
      const databaseEvent = await prisma.event.findUnique({ where: { slug: storedEvent.slug } });
      if (databaseEvent) await markDatabaseEventDeleted(storedEvent.slug);
    }
    await logAuditEvent({
      action: "deleted event",
      entityType: "Event",
      entityId: id,
      entityName: storedEvent?.title || "",
      details: { slug: storedEvent?.slug || "" },
    });
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/audit-log");
    redirect("/admin/events");
  }

  const databaseEvent = await prisma.event.findUnique({ where: { id } });
  if (databaseEvent) {
    await markDatabaseEventDeleted(databaseEvent.slug);
  }
  await logAuditEvent({
    action: "deleted event",
    entityType: "Event",
    entityId: id,
    entityName: databaseEvent?.title || "",
    details: { slug: databaseEvent?.slug || "" },
  });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/admin/audit-log");
  redirect("/admin/events");
}

export async function createAchievementAction(formData: FormData) {
  await requireAdmin();
  const date = dateOrNull(formString(formData, "date"));
  const achievement = await createStoredAchievement({
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    year: Number(formString(formData, "year")) || new Date().getFullYear(),
    date: date ? date.toISOString() : null,
    imageUrl: await imageUrlFromFormData(formData),
    externalUrl: formString(formData, "externalUrl"),
  });
  await logAuditEvent({
    action: "created achievement",
    entityType: "Achievement",
    entityId: achievement.id,
    entityName: achievement.title,
    details: { category: achievement.category, year: achievement.year },
  });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/audit-log");
  redirect("/admin/achievements");
}

async function achievementData(formData: FormData) {
  const date = dateOrNull(formString(formData, "date"));
  return {
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    year: Number(formString(formData, "year")) || new Date().getFullYear(),
    date: date ? date.toISOString() : null,
    imageUrl: await imageUrlFromFormData(formData),
    externalUrl: formString(formData, "externalUrl"),
  };
}

export async function updateAchievementAction(id: number, formData: FormData) {
  await requireAdmin();
  const achievement = await upsertStoredAchievement(id, await achievementData(formData));
  await logAuditEvent({
    action: "updated achievement",
    entityType: "Achievement",
    entityId: id,
    entityName: achievement.title,
    details: { category: achievement.category, year: achievement.year },
  });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/audit-log");
  redirect("/admin/achievements");
}

export async function deleteAchievementAction(id: number) {
  await requireAdmin();
  const storedAchievement = (await getStoredAchievements()).find((achievement) => achievement.id === id);
  const databaseAchievement = storedAchievement ? null : await prisma.achievement.findUnique({ where: { id } });
  const achievementName = storedAchievement?.title || databaseAchievement?.title || "";
  if (await deleteStoredAchievement(id)) {
    await markDatabaseAchievementDeleted(id);
    await logAuditEvent({
      action: "deleted achievement",
      entityType: "Achievement",
      entityId: id,
      entityName: achievementName,
    });
    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    revalidatePath("/admin/audit-log");
    redirect("/admin/achievements");
  }

  await markDatabaseAchievementDeleted(id);
  await logAuditEvent({
    action: "deleted achievement",
    entityType: "Achievement",
    entityId: id,
    entityName: achievementName,
  });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/audit-log");
  redirect("/admin/achievements");
}

export async function createMediaAction(formData: FormData) {
  await requireAdmin();
  const item = await createMediaItem({
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    mediaType: formString(formData, "mediaType"),
    imageUrl: await imageUrlFromFormData(formData),
    videoUrl: formString(formData, "videoUrl"),
    date: dateOrNull(formString(formData, "date")),
  });
  await logAuditEvent({
    action: "created media item",
    entityType: "Media",
    entityId: item.id,
    entityName: item.title,
    details: { category: item.category, mediaType: item.mediaType },
  });
  revalidatePath("/media");
  revalidatePath("/admin/media");
  revalidatePath("/admin/audit-log");
  redirect("/admin/media");
}

export async function deleteMediaAction(id: number) {
  await requireAdmin();
  const item = (await getAllMediaItems()).find((mediaItem) => mediaItem.id === id);
  await deleteMediaItemById(id);
  await logAuditEvent({
    action: "deleted media item",
    entityType: "Media",
    entityId: id,
    entityName: item?.title || "",
    details: { category: item?.category || "" },
  });
  revalidatePath("/media");
  revalidatePath("/admin/media");
  revalidatePath("/admin/audit-log");
  redirect("/admin/media");
}

export async function createMemberAction(formData: FormData) {
  await requireAdmin();
  const studentId = formString(formData, "studentId");
  const email = formString(formData, "email") || (studentId ? `${studentId}@uaeu.ac.ae` : "");
  const member = await createMember({
    name: formString(formData, "name"),
    studentId,
    email,
    role: formString(formData, "role"),
    committee: formString(formData, "committee"),
    areaOfInterest: formString(formData, "areaOfInterest"),
    bio: formString(formData, "bio"),
    imageUrl: await imageUrlFromFormData(formData),
    socialUrl: formString(formData, "socialUrl"),
    order: Number(formString(formData, "order")) || 0,
    isActive: true,
  });
  await logAuditEvent({
    action: "created member",
    entityType: "Member",
    entityId: member.id,
    entityName: member.name,
    details: { role: member.role, committee: member.committee },
  });
  revalidatePath("/members");
  revalidatePath("/admin/members");
  revalidatePath("/admin/audit-log");
  redirect("/admin/members");
}

export async function deleteMemberAction(id: number) {
  await requireAdmin();
  const member = (await getAllMembers()).find((item) => item.id === id);
  await deleteMemberById(id);
  await logAuditEvent({
    action: "deleted member",
    entityType: "Member",
    entityId: id,
    entityName: member?.name || "",
    details: { role: member?.role || "" },
  });
  revalidatePath("/members");
  revalidatePath("/admin/members");
  revalidatePath("/admin/audit-log");
  redirect("/admin/members");
}

export async function createAlumniAction(formData: FormData) {
  await requireAdmin();
  const person = await createAlumni({
    name: formString(formData, "name"),
    graduationYear: formString(formData, "graduationYear"),
    currentRole: formString(formData, "currentRole"),
    sector: formString(formData, "sector"),
    story: formString(formData, "story"),
    advice: formString(formData, "advice"),
    imageUrl: await imageUrlFromFormData(formData),
    socialUrl: formString(formData, "socialUrl"),
  });
  await logAuditEvent({
    action: "created alumni profile",
    entityType: "Alumni",
    entityId: person.id,
    entityName: person.name,
    details: { graduationYear: person.graduationYear, currentRole: person.currentRole },
  });
  revalidatePath("/alumni");
  revalidatePath("/admin/alumni");
  revalidatePath("/admin/audit-log");
  redirect("/admin/alumni");
}

export async function deleteAlumniAction(id: number) {
  await requireAdmin();
  const person = (await getAllAlumni()).find((item) => item.id === id);
  await deleteAlumniById(id);
  await logAuditEvent({
    action: "deleted alumni profile",
    entityType: "Alumni",
    entityId: id,
    entityName: person?.name || "",
    details: { graduationYear: person?.graduationYear || "" },
  });
  revalidatePath("/alumni");
  revalidatePath("/admin/alumni");
  revalidatePath("/admin/audit-log");
  redirect("/admin/alumni");
}
