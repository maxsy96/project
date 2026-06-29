import { opportunityTypes, sectors, eventCategories, eventStatuses, achievementCategories } from "@/lib/constants";
import { format } from "date-fns";
import { fromJsonList } from "@/lib/utils";

type Opportunity = {
  title?: string;
  organization?: string;
  type?: string;
  sectors?: string;
  location?: string;
  isRemote?: boolean;
  isAbroad?: boolean;
  isGovernmentRelated?: boolean;
  paidStatus?: string;
  deadline?: Date | null;
  description?: string;
  eligibility?: string;
  requirements?: string;
  benefits?: string;
  applicationUrl?: string;
  contactEmail?: string;
  status?: string;
  source?: string;
  imageUrl?: string;
};

type EventItem = {
  title?: string;
  date?: Date | null;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
  organizer?: string;
  registrationUrl?: string;
  imageUrl?: string;
  status?: string;
};

function Input({ name, label, defaultValue = "", type = "text", required = false }: { name: string; label: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" />
    </label>
  );
}

function TextArea({ name, label, defaultValue = "", required = false }: { name: string; label: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-800">
      {label}
      <textarea name={name} rows={4} required={required} defaultValue={defaultValue} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm" />
    </label>
  );
}

function dateInputValue(date?: Date | null) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export function OpportunityAdminForm({ action, opportunity }: { action: (formData: FormData) => void | Promise<void>; opportunity?: Opportunity }) {
  const selected = fromJsonList(opportunity?.sectors);
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label="Title" defaultValue={opportunity?.title} required />
        <Input name="organization" label="Organization/provider" defaultValue={opportunity?.organization} required />
        <label className="block text-sm font-semibold text-slate-800">
          Type
          <select name="type" defaultValue={opportunity?.type || ""} required className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
            <option value="">Choose type</option>
            {opportunityTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <Input name="location" label="Location" defaultValue={opportunity?.location} required />
        <Input name="paidStatus" label="Paid/funding info" defaultValue={opportunity?.paidStatus} required />
        <Input name="deadline" label="Deadline" type="date" defaultValue={dateInputValue(opportunity?.deadline)} />
        <Input name="applicationUrl" label="Application URL" defaultValue={opportunity?.applicationUrl} />
        <Input name="contactEmail" label="Contact email" defaultValue={opportunity?.contactEmail} />
        <Input name="source" label="Source" defaultValue={opportunity?.source || "Admin"} />
        <Input name="imageUrl" label="Image URL" defaultValue={opportunity?.imageUrl} />
        <label className="block text-sm font-semibold text-slate-800">
          Status
          <select name="status" defaultValue={opportunity?.status || "open"} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
            <option value="open">open</option>
            <option value="closing soon">closing soon</option>
            <option value="closed">closed</option>
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">Sectors</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {sectors.map((sector) => (
            <label key={sector} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
              <input name="sectors" value={sector} type="checkbox" defaultChecked={selected.includes(sector)} className="accent-emerald-700" />
              {sector}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        <label><input name="isRemote" type="checkbox" defaultChecked={opportunity?.isRemote} className="mr-2 accent-emerald-700" /> Remote/hybrid</label>
        <label><input name="isAbroad" type="checkbox" defaultChecked={opportunity?.isAbroad} className="mr-2 accent-emerald-700" /> Abroad</label>
        <label><input name="isGovernmentRelated" type="checkbox" defaultChecked={opportunity?.isGovernmentRelated} className="mr-2 accent-emerald-700" /> Government-related</label>
      </div>
      <TextArea name="description" label="Short description" defaultValue={opportunity?.description} required />
      <TextArea name="eligibility" label="Eligibility" defaultValue={opportunity?.eligibility} required />
      <TextArea name="requirements" label="Requirements" defaultValue={opportunity?.requirements} />
      <TextArea name="benefits" label="Benefits" defaultValue={opportunity?.benefits} />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save opportunity</button>
    </form>
  );
}

export function EventAdminForm({ action, event }: { action: (formData: FormData) => void | Promise<void>; event?: EventItem }) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="title" label="Title" defaultValue={event?.title} required />
        <Input name="date" label="Date" type="date" defaultValue={dateInputValue(event?.date)} required />
        <Input name="time" label="Time" defaultValue={event?.time} required />
        <Input name="location" label="Location" defaultValue={event?.location} required />
        <label className="block text-sm font-semibold text-slate-800">
          Category
          <select name="category" defaultValue={event?.category || "Field visit"} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
            {eventCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-800">
          Status
          <select name="status" defaultValue={event?.status || "upcoming"} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
            {eventStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <Input name="organizer" label="Organizer" defaultValue={event?.organizer || "CAVM Club"} />
        <Input name="registrationUrl" label="Registration URL" defaultValue={event?.registrationUrl} />
        <Input name="imageUrl" label="Image URL" defaultValue={event?.imageUrl} />
      </div>
      <TextArea name="description" label="Description" defaultValue={event?.description} required />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save event</button>
    </form>
  );
}

export function SimpleContentForm({ kind, action }: { kind: "event" | "achievement" | "media" | "member" | "alumni"; action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Create {kind}</h2>
      {kind === "event" ? (
        <>
          <Input name="title" label="Title" required />
          <div className="grid gap-4 md:grid-cols-3"><Input name="date" label="Date" type="date" required /><Input name="time" label="Time" required /><Input name="location" label="Location" required /></div>
          <label className="block text-sm font-semibold text-slate-800">Category<select name="category" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{eventCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <Input name="organizer" label="Organizer" defaultValue="CAVM Club" />
          <Input name="registrationUrl" label="Registration URL" />
          <Input name="imageUrl" label="Image URL" />
          <label className="block text-sm font-semibold text-slate-800">Status<select name="status" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{eventStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "achievement" ? (
        <>
          <Input name="title" label="Title" required />
          <div className="grid gap-4 md:grid-cols-3"><Input name="year" label="Year" required /><Input name="date" label="Date" type="date" /><label className="block text-sm font-semibold text-slate-800">Category<select name="category" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{achievementCategories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <Input name="imageUrl" label="Image URL" />
          <Input name="externalUrl" label="External URL" />
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "media" ? (
        <>
          <Input name="title" label="Title" required />
          <div className="grid gap-4 md:grid-cols-3"><Input name="category" label="Category" required /><Input name="mediaType" label="Media type" defaultValue="Image" /><Input name="date" label="Date" type="date" /></div>
          <Input name="imageUrl" label="Image URL" />
          <Input name="videoUrl" label="Video URL" />
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "member" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2"><Input name="name" label="Name" required /><Input name="role" label="Role" required /></div>
          <div className="grid gap-4 md:grid-cols-2"><Input name="studentId" label="Student ID" /><Input name="email" label="UAEU email" type="email" /></div>
          <div className="grid gap-4 md:grid-cols-3"><Input name="committee" label="Committee" required /><Input name="areaOfInterest" label="Area of interest" required /><Input name="order" label="Order" /></div>
          <Input name="imageUrl" label="Image URL" />
          <Input name="socialUrl" label="Social URL" />
          <TextArea name="bio" label="Bio" required />
        </>
      ) : null}
      {kind === "alumni" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2"><Input name="name" label="Name" required /><Input name="graduationYear" label="Graduation year" required /></div>
          <div className="grid gap-4 md:grid-cols-2"><Input name="currentRole" label="Current role" required /><Input name="sector" label="Sector" required /></div>
          <Input name="imageUrl" label="Image URL" />
          <Input name="socialUrl" label="LinkedIn/social URL" />
          <TextArea name="story" label="Story" required />
          <TextArea name="advice" label="Advice" required />
        </>
      ) : null}
      <button className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Create</button>
    </form>
  );
}
