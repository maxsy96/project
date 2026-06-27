"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSession } from "@/lib/auth";
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

export async function adminLoginAction(_state: { message: string }, formData: FormData) {
  const email = formString(formData, "email");
  const password = formString(formData, "password");
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return { message: "Invalid admin email or password." };
  }
  await createAdminSession(email);
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
  await prisma.opportunity.delete({ where: { id } });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
}

export async function archiveOpportunityAction(id: number) {
  await prisma.opportunity.update({ where: { id }, data: { status: "closed" } });
  revalidatePath("/opportunities");
  revalidatePath("/admin/opportunities");
}

export async function approvePartnerSubmissionAction(id: number) {
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
  await prisma.partnerSubmission.update({ where: { id }, data: { approvalStatus: "rejected" } });
  revalidatePath("/admin/partner-submissions");
}

export async function deletePartnerSubmissionAction(id: number) {
  await prisma.partnerSubmission.delete({ where: { id } });
  revalidatePath("/admin/partner-submissions");
}

export async function markContactReadAction(id: number, status: string) {
  await prisma.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/contact-submissions");
}

export async function deleteContactAction(id: number) {
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/contact-submissions");
}

export async function createEventAction(formData: FormData) {
  const title = formString(formData, "title");
  await prisma.event.create({
    data: {
      title,
      slug: slugify(`${title}-${Date.now()}`),
      date: dateOrNull(formString(formData, "date")) ?? new Date(),
      time: formString(formData, "time"),
      location: formString(formData, "location"),
      description: formString(formData, "description"),
      category: formString(formData, "category"),
      organizer: formString(formData, "organizer") || "CAVM Club",
      registrationUrl: formString(formData, "registrationUrl"),
      imageUrl: formString(formData, "imageUrl"),
      status: formString(formData, "status") || "upcoming",
    },
  });
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function deleteEventAction(id: number) {
  await prisma.event.delete({ where: { id } });
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function createAchievementAction(formData: FormData) {
  await prisma.achievement.create({
    data: {
      title: formString(formData, "title"),
      description: formString(formData, "description"),
      category: formString(formData, "category"),
      year: Number(formString(formData, "year")) || new Date().getFullYear(),
      date: dateOrNull(formString(formData, "date")),
      imageUrl: formString(formData, "imageUrl"),
      externalUrl: formString(formData, "externalUrl"),
    },
  });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
}

export async function deleteAchievementAction(id: number) {
  await prisma.achievement.delete({ where: { id } });
  revalidatePath("/achievements");
  revalidatePath("/admin/achievements");
}

export async function createMediaAction(formData: FormData) {
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
  await prisma.mediaItem.delete({ where: { id } });
  revalidatePath("/media");
  revalidatePath("/admin/media");
}

export async function createMemberAction(formData: FormData) {
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
  await prisma.member.delete({ where: { id } });
  revalidatePath("/members");
  revalidatePath("/admin/members");
}

export async function createAlumniAction(formData: FormData) {
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
  await prisma.alumni.delete({ where: { id } });
  revalidatePath("/alumni");
  revalidatePath("/admin/alumni");
}
