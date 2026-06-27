"use client";

import { useActionState } from "react";
import { contactAction, partnerSubmissionAction, registerInterestAction, type ActionState } from "@/lib/actions";
import { academicYears, opportunityTypes, preferredLocations, sectors } from "@/lib/constants";
import { FieldError } from "@/components/ui";

const initialState: ActionState = { ok: false, message: "" };

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
  errors,
}: {
  legend: string;
  name: string;
  values: readonly string[];
  errors?: string[];
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-800">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {values.map((value) => (
          <label key={value} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
            <input name={name} value={value} type="checkbox" className="h-4 w-4 accent-emerald-700" />
            {value}
          </label>
        ))}
      </div>
      <FieldError errors={errors} />
    </fieldset>
  );
}

export function InterestRegistrationForm() {
  const [state, formAction, pending] = useActionState(registerInterestAction, initialState);
  return (
    <form action={formAction} className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.message && !state.ok ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">{state.message}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label="Full name" name="fullName" required errors={state.errors?.fullName} />
        <TextInput label="Student ID (optional)" name="studentId" errors={state.errors?.studentId} />
        <TextInput label="Email" name="email" type="email" required errors={state.errors?.email} />
        <TextInput label="Phone (optional)" name="phone" errors={state.errors?.phone} />
        <label className="block text-sm font-semibold text-slate-800">
          Academic year
          <select name="academicYear" required className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="">Choose year</option>
            {academicYears.map((year) => <option key={year}>{year}</option>)}
          </select>
          <FieldError errors={state.errors?.academicYear} />
        </label>
        <TextInput label="Major/program" name="major" required errors={state.errors?.major} />
      </div>
      <CheckboxGroup legend="Interest sectors" name="interests" values={sectors} errors={state.errors?.interests} />
      <CheckboxGroup legend="Opportunity preferences" name="opportunityPreferences" values={opportunityTypes} errors={state.errors?.opportunityPreferences} />
      <CheckboxGroup legend="Preferred location" name="preferredLocations" values={preferredLocations} errors={state.errors?.preferredLocations} />
      <TextInput label="Availability" name="availability" required errors={state.errors?.availability} />
      <TextArea label="Short goals statement" name="goals" required errors={state.errors?.goals} />
      <label className="flex gap-3 rounded-md bg-emerald-50 p-4 text-sm text-slate-700">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" required />
        <span>I consent to CAVM Club storing this information and contacting me about relevant opportunities.</span>
      </label>
      <FieldError errors={state.errors?.consent} />
      <button disabled={pending} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? "Submitting..." : "Register my interests"}
      </button>
    </form>
  );
}

export function PartnerSubmissionForm() {
  const [state, formAction, pending] = useActionState(partnerSubmissionAction, initialState);
  return (
    <form action={formAction} className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.message ? (
        <p className={`rounded-md p-3 text-sm font-medium ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label="Organization name" name="organizationName" required errors={state.errors?.organizationName} />
        <TextInput label="Contact person" name="contactPerson" required errors={state.errors?.contactPerson} />
        <TextInput label="Email" name="email" type="email" required errors={state.errors?.email} />
        <TextInput label="Phone (optional)" name="phone" errors={state.errors?.phone} />
        <TextInput label="Opportunity title" name="opportunityTitle" required errors={state.errors?.opportunityTitle} />
        <label className="block text-sm font-semibold text-slate-800">
          Opportunity type
          <select name="opportunityType" required className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm">
            <option value="">Choose type</option>
            {opportunityTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <FieldError errors={state.errors?.opportunityType} />
        </label>
        <TextInput label="Location" name="location" required errors={state.errors?.location} />
        <TextInput label="Deadline" name="deadline" type="date" errors={state.errors?.deadline} />
      </div>
      <CheckboxGroup legend="Relevant sectors" name="sectors" values={sectors} errors={state.errors?.sectors} />
      <TextArea label="Description" name="description" required errors={state.errors?.description} />
      <TextArea label="Eligibility" name="eligibility" required errors={state.errors?.eligibility} />
      <TextInput label="Application link" name="applicationUrl" type="url" errors={state.errors?.applicationUrl} />
      <TextArea label="Notes for CAVM Club" name="notes" errors={state.errors?.notes} />
      <label className="flex gap-3 rounded-md bg-sky-50 p-4 text-sm text-slate-700">
        <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" required />
        <span>I confirm this submission can be reviewed by CAVM Club and shared with students if approved.</span>
      </label>
      <button disabled={pending} className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
        {pending ? "Submitting..." : "Submit opportunity"}
      </button>
    </form>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(contactAction, initialState);
  return (
    <form action={formAction} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.message ? (
        <p className={`rounded-md p-3 text-sm font-medium ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {state.message}
        </p>
      ) : null}
      <TextInput label="Name" name="name" required errors={state.errors?.name} />
      <TextInput label="Email" name="email" type="email" required errors={state.errors?.email} />
      <TextInput label="Subject" name="subject" required errors={state.errors?.subject} />
      <TextArea label="Message" name="message" required errors={state.errors?.message} />
      <button disabled={pending} className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
