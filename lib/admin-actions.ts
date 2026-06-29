"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  adminPassword,
  adminUsername,
  requireAdmin,
} from "@/lib/auth";
import {
  createStoredAchievement,
  createStoredEvent,
  deleteStoredAchievement,
  deleteStoredEvent,
  getStoredEvents,
  updateStoredEvent,
  upsertStoredEventBySlug,
} from "@/lib/admin-content-store";
import { prisma } from "@/lib/prisma";
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
  while (true) {
    const existing = await prisma.opportunity.findUnique({ where: { slug } });
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
    return { message: "Invalid admin username or password." };
  }
  await createAdminSession(username);
  redirect("/admin");
}

function opportunityData(formData: FormData) {
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
    imageUrl: formString(formData, "imageUrl"),
    approvalStatus: "approved",
  };
}

export async function createOpportunityAction(formData: FormData) {
  await requireAdmin();
  const data = opportunityData(formData);
  await prisma.opportunity.create({
    data: {
      ...data,
      slug: await uniqueOpportunitySlug(data.title),
    },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  redirect("/admin/opportunities");
}

export async function updateOpportunityAction(id: number, formData: FormData) {
  await requireAdmin();
  const data = opportunityData(formData);
  await prisma.opportunity.update({
    where: { id },
    data: {
      ...data,
      slug: await uniqueOpportunitySlug(data.title, id),
    },
  });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
  redirect("/admin/opportunities");
}

export async function deleteOpportunityAction(id: number) {
  await requireAdmin();
  await prisma.opportunity.delete({ where: { id } });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
}

export async function archiveOpportunityAction(id: number) {
  await requireAdmin();
  await prisma.opportunity.update({ where: { id }, data: { status: "closed" } });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
}

export async function approvePartnerSubmissionAction(id: number) {
  await requireAdmin();
  const submission = await prisma.partnerSubmission.findUnique({ where: { id } });
  if (!submission) return;
  const title = submission.opportunityTitle;
  await prisma.opportunity.create({
    data: {
      title,
      slug: await uniqueOpportunitySlug(title),
      organization: submission.organizationName,
      type: submission.opportunityType,
      sectors: submission.sectors,
      location: submission.location,
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
    },
  });
  await prisma.partnerSubmission.update({ where: { id }, data: { approvalStatus: "approved" } });
  revalidatePath("/opportunities");
  revalidatePath("/admin/partner-submissions");
}

export async function rejectPartnerSubmissionAction(id: number) {
  await requireAdmin();
  await prisma.partnerSubmission.update({ where: { id }, data: { approvalStatus: "rejected" } });
  revalidatePath("/admin/partner-submissions");
}

export async function deletePartnerSubmissionAction(id: number) {
  await requireAdmin();
  await prisma.partnerSubmission.delete({ where: { id } });
  revalidatePath("/admin/partner-submissions");
}

export async function markContactReadAction(id: number, status: string) {
  await requireAdmin();
  await prisma.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contact-submissions");
}

export async function deleteContactAction(id: number) {
  await requireAdmin();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/contact-submissions");
}

export async function createEventAction(formData: FormData) {
  await requireAdmin();
  const data = eventData(formData, await uniqueEventSlug(formString(formData, "title")));
  await createStoredEvent(data);
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

function eventData(formData: FormData, slug: string) {
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
    imageUrl: formString(formData, "imageUrl"),
    status: formString(formData, "status") || "upcoming",
  };
}

export async function updateEventAction(id: number, formData: FormData) {
  await requireAdmin();
  let slug = "";

  if (id < 0) {
    const storedEvents = await getStoredEvents();
    const existingSlug = storedEvents.find((event) => event.id === id)?.slug;
    slug = existingSlug ?? await uniqueEventSlug(formString(formData, "title"));
    await updateStoredEvent(id, eventData(formData, slug));
  } else {
    const databaseEvent = await prisma.event.findUnique({ where: { id } });
    if (!databaseEvent) return;
    slug = databaseEvent.slug;
    await upsertStoredEventBySlug(eventData(formData, slug));
  }

  revalidatePath("/");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEventAction(id: number) {
  await requireAdmin();
  if (await deleteStoredEvent(id)) {
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return;
  }

  await prisma.event.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function createAchievementAction(formData: FormData) {
  await requireAdmin();
  const date = dateOrNull(formString(formData, "date"));
  await createStoredAchievement({
    title: formString(formData, "title"),
    description: formString(formData, "description"),
    category: formString(formData, "category"),
    year: Number(formString(formData, "year")) || new Date().getFullYear(),
    date: date ? date.toISOString() : null,
    imageUrl: formString(formData, "imageUrl"),
    externalUrl: formString(formData, "externalUrl"),
  });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
}

export async function deleteAchievementAction(id: number) {
  await requireAdmin();
  if (await deleteStoredAchievement(id)) {
    revalidatePath("/achievements");
    revalidatePath("/admin/achievements");
    return;
  }

  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
}

export async function createMediaAction(formData: FormData) {
  await requireAdmin();
  await prisma.mediaItem.create({
    data: {
      title: formString(formData, "title"),
      description: formString(formData, "description"),
      category: formString(formData, "category"),
      mediaType: formString(formData, "mediaType"),
      imageUrl: formString(formData, "imageUrl"),
      videoUrl: formString(formData, "videoUrl"),
      date: dateOrNull(formString(formData, "date")),
    },
  });
  revalidatePath("/media");
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: number) {
  await requireAdmin();
  await prisma.mediaItem.delete({ where: { id } });
  revalidatePath("/media");
  revalidatePath("/admin/media");
}

export async function createMemberAction(formData: FormData) {
  await requireAdmin();
  const studentId = formString(formData, "studentId");
  const email = formString(formData, "email") || (studentId ? `${studentId}@uaeu.ac.ae` : "");
  await prisma.member.create({
    data: {
      name: formString(formData, "name"),
      studentId,
      email,
      role: formString(formData, "role"),
      committee: formString(formData, "committee"),
      areaOfInterest: formString(formData, "areaOfInterest"),
      bio: formString(formData, "bio"),
      imageUrl: formString(formData, "imageUrl"),
      socialUrl: formString(formData, "socialUrl"),
      order: Number(formString(formData, "order")) || 0,
      isActive: true,
    },
  });
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function deleteMemberAction(id: number) {
  await requireAdmin();
  await prisma.member.delete({ where: { id } });
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function createAlumniAction(formData: FormData) {
  await requireAdmin();
  await prisma.alumni.create({
    data: {
      name: formString(formData, "name"),
      graduationYear: formString(formData, "graduationYear"),
      currentRole: formString(formData, "currentRole"),
      sector: formString(formData, "sector"),
      story: formString(formData, "story"),
      advice: formString(formData, "advice"),
      imageUrl: formString(formData, "imageUrl"),
      socialUrl: formString(formData, "socialUrl"),
    },
  });
  revalidatePath("/alumni");
  revalidatePath("/admin/alumni");
}

export async function deleteAlumniAction(id: number) {
  await requireAdmin();
  await prisma.alumni.delete({ where: { id } });
  revalidatePath("/alumni");
  revalidatePath("/admin/alumni");
}
