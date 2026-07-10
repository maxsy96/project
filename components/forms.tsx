"use client";

import { useActionState } from "react";
import { contactAction, partnerSubmissionAction, registerInterestAction, type ActionState } from "@/lib/actions";
import { academicYears, opportunityTypes, preferredLocations, sectors } from "@/lib/constants";
import { FieldError } from "@/components/ui";

type Locale = "en" | "ar";

const initialState: ActionState = { ok: false, message: "" };

const optionLabelsAr: Record<string, string> = {
  "Veterinary Medicine": "الطب البيطري",
  Agriculture: "الزراعة",
  "Food Science": "علوم الغذاء",
  Environment: "البيئة",
  Research: "البحث العلمي",
  "Government Sector": "القطاع الحكومي",
  Internship: "تدريب عملي",
  Volunteering: "تطوع",
  "Research Assistant Role": "مساعد بحث",
  "Farm Visit": "زيارة ميدانية لمزرعة",
  "Job Opening": "فرصة وظيفية",
  "Training Program": "برنامج تدريبي",
  Scholarship: "منحة",
  Competition: "مسابقة",
  Conference: "مؤتمر",
  "Government Opportunity": "فرصة لدى جهة حكومية",
  "Program Abroad": "برنامج خارج الدولة",
  "On campus": "داخل الحرم الجامعي",
  Local: "داخل الدولة",
  Abroad: "خارج الدولة",
  "Remote/hybrid": "عن بعد أو بنظام هجين",
  Foundation: "السنة التأسيسية",
  "First year": "السنة الأولى",
  "Second year": "السنة الثانية",
  "Third year": "السنة الثالثة",
  "Fourth year": "السنة الرابعة",
  "Fifth year": "السنة الخامسة",
  "Graduate student": "طالب دراسات عليا",
};

const formCopy = {
  en: {
    chooseYear: "Choose year",
    chooseType: "Choose type",
    fullName: "Full name",
    studentId: "Student ID (optional)",
    email: "Email",
    phone: "Phone (optional)",
    academicYear: "Academic year",
    major: "Major/program",
    interestSectors: "Interest sectors",
    opportunityPreferences: "Opportunity preferences",
    preferredLocation: "Preferred location",
    availability: "Availability",
    goals: "Short goals statement",
    studentConsent: "I consent to CAVM Club storing this information and contacting me about relevant opportunities.",
    registerPending: "Submitting...",
    registerSubmit: "Register my interests",
    organizationName: "Organization name",
    contactPerson: "Contact person",
    opportunityTitle: "Opportunity title",
    opportunityType: "Opportunity type",
    location: "Location",
    deadline: "Deadline",
    relevantSectors: "Relevant sectors",
    description: "Description",
    eligibility: "Eligibility",
    applicationUrl: "Application link",
    partnerNotes: "Notes for CAVM Club",
    partnerConsent: "I confirm this submission can be reviewed by CAVM Club and shared with students if approved.",
    partnerPending: "Submitting...",
    partnerSubmit: "Submit opportunity",
    name: "Name",
    subject: "Subject",
    message: "Message",
    contactPending: "Sending...",
    contactSubmit: "Send message",
  },
  ar: {
    chooseYear: "اختر السنة الدراسية",
    chooseType: "اختر نوع الفرصة",
    fullName: "الاسم الكامل",
    studentId: "الرقم الجامعي (اختياري)",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف (اختياري)",
    academicYear: "السنة الدراسية",
    major: "التخصص أو البرنامج",
    interestSectors: "مجالات الاهتمام",
    opportunityPreferences: "أنواع الفرص المطلوبة",
    preferredLocation: "الموقع المفضل",
    availability: "الأوقات المناسبة للمشاركة",
    goals: "نبذة مختصرة عن أهدافك",
    studentConsent: "أوافق على حفظ هذه البيانات لدى نادي الكلية واستخدامها للتواصل معي بشأن الفرص المناسبة.",
    registerPending: "جارٍ الإرسال...",
    registerSubmit: "تسجيل الاهتمام",
    organizationName: "اسم الجهة",
    contactPerson: "اسم الشخص المسؤول",
    opportunityTitle: "عنوان الفرصة",
    opportunityType: "نوع الفرصة",
    location: "الموقع",
    deadline: "آخر موعد للتقديم",
    relevantSectors: "المجالات ذات الصلة",
    description: "وصف الفرصة",
    eligibility: "شروط المشاركة",
    applicationUrl: "رابط التقديم",
    partnerNotes: "ملاحظات موجهة لنادي الكلية",
    partnerConsent: "أؤكد إمكانية مراجعة هذا الطلب من قبل نادي الكلية ومشاركته مع الطلبة بعد اعتماده.",
    partnerPending: "جارٍ الإرسال...",
    partnerSubmit: "إرسال الفرصة",
    name: "الاسم",
    subject: "الموضوع",
    message: "الرسالة",
    contactPending: "جارٍ الإرسال...",
    contactSubmit: "إرسال الرسالة",
  },
};

function optionLabel(value: string, locale: Locale) {
  return locale === "ar" ? optionLabelsAr[value] || value : value;
}

function TextInput({
  label,
  name,
  type = "text",
  required = false,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  errors?: string[];
}) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
      <FieldError errors={errors} />
    </label>
  );
}

function TextArea({ label, name, required = false, errors }: { label: string; name: string; required?: boolean; errors?: string[] }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <textarea
        name={name}
        required={required}
        rows={5}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
      <FieldError errors={errors} />
    </label>
  );
}

function CheckboxGroup({
  legend,
  name,
  values,
  locale,
  errors,
}: {
  legend: string;
  name: string;
  values: readonly string[];
  locale: Locale;
  errors?: string[];
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-800">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {values.map((value) => (
          <label key={value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
            <input name={name} value={value} type="checkbox" className="h-4 w-4 accent-emerald-700" />
            {optionLabel(value, locale)}
          </label>
        ))}
      </div>
      <FieldError errors={errors} />
    </fieldset>
  );
}

export function InterestRegistrationForm({ locale = "en" }: { locale?: Locale }) {
  const [state, formAction, pending] = useActionState(registerInterestAction, initialState);
  const copy = formCopy[locale];
  return (
    <form action={formAction} dir={locale === "ar" ? "rtl" : "ltr"} className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="locale" value={locale} />
      {state.message && !state.ok ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">{state.message}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label={copy.fullName} name="fullName" required errors={state.errors?.fullName} />
        <TextInput label={copy.studentId} name="studentId" errors={state.errors?.studentId} />
        <TextInput label={copy.email} name="email" type="email" required errors={state.errors?.email} />
        <TextInput label={copy.phone} name="phone" errors={state.errors?.phone} />
        <label className="block text-sm font-semibold text-slate-800">
          {copy.academicYear}
          <select name="academicYear" required className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="">{copy.chooseYear}</option>
            {academicYears.map((year) => <option key={year} value={year}>{optionLabel(year, locale)}</option>)}
          </select>
          <FieldError errors={state.errors?.academicYear} />
        </label>
        <TextInput label={copy.major} name="major" required errors={state.errors?.major} />
      </div>
      <CheckboxGroup legend={copy.interestSectors} name="interests" values={sectors} locale={locale} errors={state.errors?.interests} />
      <CheckboxGroup legend={copy.opportunityPreferences} name="opportunityPreferences" values={opportunityTypes} locale={locale} errors={state.errors?.opportunityPreferences} />
      <CheckboxGroup legend={copy.preferredLocation} name="preferredLocations" values={preferredLocations} locale={locale} errors={state.errors?.preferredLocations} />
      <TextInput label={copy.availability} name="availability" required errors={state.errors?.availability} />
      <TextArea label={copy.goals} name="goals" required errors={state.errors?.goals} />
      <label className="flex gap-3 rounded-md bg-emerald-50 p-4 text-sm text-slate-700">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" required />
        <span>{copy.studentConsent}</span>
      </label>
      <FieldError errors={state.errors?.consent} />
      <button disabled={pending} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? copy.registerPending : copy.registerSubmit}
      </button>
    </form>
  );
}

export function PartnerSubmissionForm({ locale = "en" }: { locale?: Locale }) {
  const [state, formAction, pending] = useActionState(partnerSubmissionAction, initialState);
  const copy = formCopy[locale];
  return (
    <form action={formAction} dir={locale === "ar" ? "rtl" : "ltr"} className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="locale" value={locale} />
      {state.message ? (
        <p className={`rounded-md p-3 text-sm font-medium ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label={copy.organizationName} name="organizationName" required errors={state.errors?.organizationName} />
        <TextInput label={copy.contactPerson} name="contactPerson" required errors={state.errors?.contactPerson} />
        <TextInput label={copy.email} name="email" type="email" required errors={state.errors?.email} />
        <TextInput label={copy.phone} name="phone" errors={state.errors?.phone} />
        <TextInput label={copy.opportunityTitle} name="opportunityTitle" required errors={state.errors?.opportunityTitle} />
        <label className="block text-sm font-semibold text-slate-800">
          {copy.opportunityType}
          <select name="opportunityType" required className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="">{copy.chooseType}</option>
            {opportunityTypes.map((type) => <option key={type} value={type}>{optionLabel(type, locale)}</option>)}
          </select>
          <FieldError errors={state.errors?.opportunityType} />
        </label>
        <TextInput label={copy.location} name="location" required errors={state.errors?.location} />
        <TextInput label={copy.deadline} name="deadline" type="date" errors={state.errors?.deadline} />
      </div>
      <CheckboxGroup legend={copy.relevantSectors} name="sectors" values={sectors} locale={locale} errors={state.errors?.sectors} />
      <TextArea label={copy.description} name="description" required errors={state.errors?.description} />
      <TextArea label={copy.eligibility} name="eligibility" required errors={state.errors?.eligibility} />
      <TextInput label={copy.applicationUrl} name="applicationUrl" type="url" errors={state.errors?.applicationUrl} />
      <TextArea label={copy.partnerNotes} name="notes" errors={state.errors?.notes} />
      <label className="flex gap-3 rounded-md bg-sky-50 p-4 text-sm text-slate-700">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" required />
        <span>{copy.partnerConsent}</span>
      </label>
      <button disabled={pending} className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
        {pending ? copy.partnerPending : copy.partnerSubmit}
      </button>
    </form>
  );
}

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const [state, formAction, pending] = useActionState(contactAction, initialState);
  const copy = formCopy[locale];
  return (
    <form action={formAction} dir={locale === "ar" ? "rtl" : "ltr"} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <input type="hidden" name="locale" value={locale} />
      {state.message ? (
        <p className={`rounded-md p-3 text-sm font-medium ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}
      <TextInput label={copy.name} name="name" required errors={state.errors?.name} />
      <TextInput label={copy.email} name="email" type="email" required errors={state.errors?.email} />
      <TextInput label={copy.subject} name="subject" required errors={state.errors?.subject} />
      <TextArea label={copy.message} name="message" required errors={state.errors?.message} />
      <button disabled={pending} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? copy.contactPending : copy.contactSubmit}
      </button>
    </form>
  );
}
