"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { formList, formString, slugify, toJsonList } from "@/lib/utils";
import { queueNotification } from "@/lib/notifications";
import {
  createContactSubmission,
  createPartnerSubmission,
  createStudentInterest,
  getAllOpportunities,
} from "@/lib/runtime-store";

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const emailSchema = z.string().email("Use a valid email address.");

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  studentId: z.string().optional(),
  email: emailSchema,
  phone: z.string().optional(),
  academicYear: z.string().min(1, "Academic year is required."),
  major: z.string().min(2, "Major/program is required."),
  interests: z.array(z.string()).min(1, "Choose at least one interest."),
  opportunityPreferences: z.array(z.string()).min(1, "Choose at least one opportunity type."),
  preferredLocations: z.array(z.string()).min(1, "Choose at least one preferred location."),
  availability: z.string().min(2, "Availability is required."),
  goals: z.string().min(10, "Share a short goals statement."),
  consent: z.literal("on", { error: "Consent is required." }),
});

const partnerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required."),
  contactPerson: z.string().min(2, "Contact person is required."),
  email: emailSchema,
  phone: z.string().optional(),
  opportunityTitle: z.string().min(3, "Opportunity title is required."),
  opportunityType: z.string().min(1, "Opportunity type is required."),
  sectors: z.array(z.string()).min(1, "Choose at least one sector."),
  description: z.string().min(20, "Description should be at least 20 characters."),
  location: z.string().min(2, "Location is required."),
  deadline: z.string().optional(),
  eligibility: z.string().min(5, "Eligibility is required."),
  applicationUrl: z.string().url("Use a valid URL.").optional().or(z.literal("")),
  notes: z.string().optional(),
  consent: z.literal("on", { error: "Consent is required." }),
});

const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: emailSchema,
  subject: z.string().min(3, "Subject is required."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

const eventRegistrationSchema = z.object({
  eventTitle: z.string().min(2, "Event title is required."),
  eventSlug: z.string().min(1, "Event slug is required."),
  name: z.string().min(2, "Name is required."),
  email: emailSchema,
  studentId: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

function validationState(error: z.ZodError): ActionState {
  return {
    ok: false,
    message: "Please check the highlighted fields.",
    errors: error.flatten().fieldErrors,
  };
}

export async function registerInterestAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (formString(formData, "company")) return { ok: true, message: "Thanks." };

  const parsed = studentSchema.safeParse({
    fullName: formString(formData, "fullName"),
    studentId: formString(formData, "studentId"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    academicYear: formString(formData, "academicYear"),
    major: formString(formData, "major"),
    interests: formList(formData, "interests"),
    opportunityPreferences: formList(formData, "opportunityPreferences"),
    preferredLocations: formList(formData, "preferredLocations"),
    availability: formString(formData, "availability"),
    goals: formString(formData, "goals"),
    consent: formString(formData, "consent"),
  });

  if (!parsed.success) return validationState(parsed.error);

  const student = await createStudentInterest({
    ...parsed.data,
    studentId: parsed.data.studentId || "",
    phone: parsed.data.phone || "",
    interests: toJsonList(parsed.data.interests),
    opportunityPreferences: toJsonList(parsed.data.opportunityPreferences),
    preferredLocations: toJsonList(parsed.data.preferredLocations),
    consent: true,
  });

  await queueNotification(
    "New CAVM student interest registration",
    `${student.fullName} registered for ${parsed.data.interests.join(", ")} opportunities.`,
    [
      ["Name", student.fullName],
      ["Student ID", student.studentId],
      ["Email", student.email],
      ["Phone", student.phone],
      ["Academic year", student.academicYear],
      ["Major/program", student.major],
      ["Interest sectors", parsed.data.interests.join(", ")],
      ["Opportunity preferences", parsed.data.opportunityPreferences.join(", ")],
      ["Preferred locations", parsed.data.preferredLocations.join(", ")],
      ["Availability", student.availability],
      ["Goals", student.goals],
    ],
  );

  revalidatePath("/admin/students");
  redirect(`/register-interest/success?id=${student.id}`);
}

export async function partnerSubmissionAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (formString(formData, "company")) return { ok: true, message: "Thanks." };

  const parsed = partnerSchema.safeParse({
    organizationName: formString(formData, "organizationName"),
    contactPerson: formString(formData, "contactPerson"),
    email: formString(formData, "email"),
    phone: formString(formData, "phone"),
    opportunityTitle: formString(formData, "opportunityTitle"),
    opportunityType: formString(formData, "opportunityType"),
    sectors: formList(formData, "sectors"),
    description: formString(formData, "description"),
    location: formString(formData, "location"),
    deadline: formString(formData, "deadline"),
    eligibility: formString(formData, "eligibility"),
    applicationUrl: formString(formData, "applicationUrl"),
    notes: formString(formData, "notes"),
    consent: formString(formData, "consent"),
  });

  if (!parsed.success) return validationState(parsed.error);

  const {
    organizationName,
    contactPerson,
    email,
    opportunityTitle,
    opportunityType,
    sectors,
    description,
    location,
    deadline,
    eligibility,
    phone,
    notes,
    applicationUrl,
  } = parsed.data;

  try {
    await createPartnerSubmission({
      organizationName,
      contactPerson,
      email,
      opportunityTitle,
      opportunityType,
      description,
      location,
      eligibility,
      phone: phone || "",
      notes: notes || "",
      applicationUrl: applicationUrl || "",
      sectors: toJsonList(sectors),
      deadline: deadline ? new Date(`${deadline}T09:00:00.000Z`).toISOString() : null,
      approvalStatus: "pending",
    });
  } catch (error) {
    console.error("[partner-submission:save-failed]", error);
    return {
      ok: false,
      message: "The partner submission could not be saved. Please try again or email Clubcavm@gmail.com.",
    };
  }

  await queueNotification(
    "New partner opportunity submitted",
    `${organizationName} submitted ${opportunityTitle}.`,
    [
      ["Organization", organizationName],
      ["Contact person", contactPerson],
      ["Email", email],
      ["Phone", phone],
      ["Opportunity title", opportunityTitle],
      ["Opportunity type", opportunityType],
      ["Sectors", sectors.join(", ")],
      ["Location", location],
      ["Deadline", deadline],
      ["Eligibility", eligibility],
      ["Application link", applicationUrl],
      ["Description", description],
      ["Notes", notes],
    ],
  );

  revalidatePath("/admin/partner-submissions");
  return { ok: true, message: "Thank you. Your opportunity was saved for CAVM Club review." };
}

export async function contactAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (formString(formData, "company")) return { ok: true, message: "Thanks." };

  const parsed = contactSchema.safeParse({
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    subject: formString(formData, "subject"),
    message: formString(formData, "message"),
  });

  if (!parsed.success) return validationState(parsed.error);

  await createContactSubmission(parsed.data);
  await queueNotification(
    "New CAVM website contact message",
    `${parsed.data.name}: ${parsed.data.subject}`,
    [
      ["Name", parsed.data.name],
      ["Email", parsed.data.email],
      ["Subject", parsed.data.subject],
      ["Message", parsed.data.message],
    ],
  );
  revalidatePath("/admin/contact-submissions");

  return { ok: true, message: "Message received. The club team can follow up from the admin dashboard." };
}

export async function interestedAction(formData: FormData) {
  const opportunityTitle = formString(formData, "opportunityTitle");
  const name = formString(formData, "name") || "Interested student";
  const email = formString(formData, "email");
  const message = formString(formData, "message") || `A student clicked interested for ${opportunityTitle}.`;

  await createContactSubmission({
    name,
    email,
    subject: `Interested in ${opportunityTitle}`,
    message,
  });
  await queueNotification(
    `New interest in ${opportunityTitle}`,
    `${name} submitted interest from an opportunity page.`,
    [
      ["Opportunity", opportunityTitle],
      ["Name", name],
      ["Email", email],
      ["Message", message],
    ],
  );
  revalidatePath("/admin/contact-submissions");
  redirect("/contact?sent=interest");
}

export async function eventRegistrationAction(formData: FormData) {
  const parsed = eventRegistrationSchema.safeParse({
    eventTitle: formString(formData, "eventTitle"),
    eventSlug: formString(formData, "eventSlug"),
    name: formString(formData, "name"),
    email: formString(formData, "email"),
    studentId: formString(formData, "studentId"),
    phone: formString(formData, "phone"),
    message: formString(formData, "message"),
  });

  if (!parsed.success) {
    redirect(`/events/${formString(formData, "eventSlug")}?registered=error`);
  }

  const message = parsed.data.message || `Registration request for ${parsed.data.eventTitle}.`;

  await createContactSubmission({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: `Event registration: ${parsed.data.eventTitle}`,
    message: [
      message,
      parsed.data.studentId ? `Student ID: ${parsed.data.studentId}` : "",
      parsed.data.phone ? `Phone: ${parsed.data.phone}` : "",
    ].filter(Boolean).join("\n"),
  });

  await queueNotification(
    `New event registration: ${parsed.data.eventTitle}`,
    `${parsed.data.name} registered interest for an upcoming CAVM Club event.`,
    [
      ["Event", parsed.data.eventTitle],
      ["Name", parsed.data.name],
      ["Student ID", parsed.data.studentId],
      ["Email", parsed.data.email],
      ["Phone", parsed.data.phone],
      ["Message", message],
    ],
  );

  revalidatePath("/admin/contact-submissions");
  redirect(`/events/${parsed.data.eventSlug}?registered=1`);
}

export async function makeOpportunitySlug(title: string) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  const opportunities = await getAllOpportunities();
  while (opportunities.some((opportunity) => opportunity.slug === slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}
