import { opportunityTypes, sectors, eventCategories, eventStatuses, achievementCategories, submissionStatuses } from "@/lib/constants";
import { format } from "date-fns";
import { fromJsonList } from "@/lib/utils";
import { AdminImageField } from "@/components/admin-image-field";
import { AdminAlbumUploadField } from "@/components/admin-album-upload-field";

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
  submissionStatus?: string;
};

type AchievementItem = {
  title?: string;
  description?: string;
  category?: string;
  year?: number;
  date?: Date | null;
  imageUrl?: string;
  externalUrl?: string;
};

type MemberItem = {
  name?: string;
  studentId?: string;
  email?: string;
  role?: string;
  committee?: string;
  areaOfInterest?: string;
  bio?: string;
  imageUrl?: string;
  socialUrl?: string;
  order?: number;
};

type AlumniItem = {
  name?: string;
  graduationYear?: string;
  currentRole?: string;
  sector?: string;
  story?: string;
  advice?: string;
  imageUrl?: string;
  socialUrl?: string;
};

export type AlbumTarget = {
  key: string;
  title: string;
  meta: string;
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
        <AdminImageField name="imageUrl" label="Image" defaultValue={opportunity?.imageUrl} />
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
        <Input name="registrationUrl" label="External registration URL" defaultValue={event?.registrationUrl} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-800">
          Submissions
          <select name="submissionStatus" defaultValue={event?.submissionStatus || "open"} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
            {submissionStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <AdminImageField name="imageUrl" label="Event card image" defaultValue={event?.imageUrl} />
      </div>
      <AdminAlbumUploadField label="Add photos to this event album" />
      <TextArea name="description" label="Description" defaultValue={event?.description} required />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save event</button>
    </form>
  );
}

export function AchievementAdminForm({ action, achievement }: { action: (formData: FormData) => void | Promise<void>; achievement?: AchievementItem }) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="title" label="Title" defaultValue={achievement?.title} required />
        <Input name="year" label="Year" defaultValue={achievement?.year ? String(achievement.year) : ""} required />
        <Input name="date" label="Date" type="date" defaultValue={dateInputValue(achievement?.date)} />
      </div>
      <label className="block text-sm font-semibold text-slate-800">
        Category
        <select name="category" defaultValue={achievement?.category || achievementCategories[0]} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">
          {achievementCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <AdminImageField name="imageUrl" label="Achievement image" defaultValue={achievement?.imageUrl} />
      <Input name="externalUrl" label="Related URL" defaultValue={achievement?.externalUrl} />
      <TextArea name="description" label="Description" defaultValue={achievement?.description} required />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save achievement</button>
    </form>
  );
}

export function MemberAdminForm({ action, member }: { action: (formData: FormData) => void | Promise<void>; member?: MemberItem }) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" label="Name" defaultValue={member?.name} required />
        <Input name="role" label="Role" defaultValue={member?.role} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="studentId" label="Student ID" defaultValue={member?.studentId} />
        <Input name="email" label="UAEU email" type="email" defaultValue={member?.email} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input name="committee" label="Committee" defaultValue={member?.committee} required />
        <Input name="areaOfInterest" label="Area of interest" defaultValue={member?.areaOfInterest} required />
        <Input name="order" label="Order" defaultValue={member?.order !== undefined ? String(member.order) : ""} />
      </div>
      <AdminImageField name="imageUrl" label="Profile image" defaultValue={member?.imageUrl} />
      <Input name="socialUrl" label="LinkedIn URL" defaultValue={member?.socialUrl} />
      <TextArea name="bio" label="Bio" defaultValue={member?.bio} required />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save member</button>
    </form>
  );
}

export function AlumniAdminForm({ action, person }: { action: (formData: FormData) => void | Promise<void>; person?: AlumniItem }) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" label="Name" defaultValue={person?.name} required />
        <Input name="graduationYear" label="Graduation year" defaultValue={person?.graduationYear} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="currentRole" label="Current role" defaultValue={person?.currentRole} required />
        <Input name="sector" label="Sector" defaultValue={person?.sector} required />
      </div>
      <AdminImageField name="imageUrl" label="Alumni image" defaultValue={person?.imageUrl} />
      <Input name="socialUrl" label="LinkedIn URL" defaultValue={person?.socialUrl} />
      <TextArea name="story" label="Story" defaultValue={person?.story} required />
      <TextArea name="advice" label="Advice" defaultValue={person?.advice} required />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Save alumni profile</button>
    </form>
  );
}

export function AlbumPhotosAdminForm({ action, targets }: { action: (formData: FormData) => void | Promise<void>; targets: AlbumTarget[] }) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Add photos to an event album</h2>
      <label className="block text-sm font-semibold text-slate-800">
        Album
        <select name="albumTarget" required className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm">
          <option value="">Choose an event album</option>
          {targets.map((target) => (
            <option key={target.key} value={target.key}>{target.title} - {target.meta}</option>
          ))}
        </select>
      </label>
      <AdminAlbumUploadField label="Photos to append" />
      <button className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">Add photos to album</button>
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
          <Input name="registrationUrl" label="External registration URL" />
          <label className="block text-sm font-semibold text-slate-800">Submissions<select name="submissionStatus" defaultValue="open" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{submissionStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <AdminImageField name="imageUrl" label="Event card image" />
          <AdminAlbumUploadField label="Add photos to this event album" />
          <label className="block text-sm font-semibold text-slate-800">Status<select name="status" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{eventStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "achievement" ? (
        <>
          <Input name="title" label="Title" required />
          <div className="grid gap-4 md:grid-cols-3"><Input name="year" label="Year" required /><Input name="date" label="Date" type="date" /><label className="block text-sm font-semibold text-slate-800">Category<select name="category" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm">{achievementCategories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <AdminImageField name="imageUrl" label="Achievement image" />
          <Input name="externalUrl" label="Related URL" />
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "media" ? (
        <>
          <Input name="title" label="Title" required />
          <div className="grid gap-4 md:grid-cols-3"><Input name="category" label="Category" required /><Input name="mediaType" label="Media type" defaultValue="Image" /><Input name="date" label="Date" type="date" /></div>
          <AdminImageField name="imageUrl" label="Media image" />
          <Input name="videoUrl" label="Video URL" />
          <TextArea name="description" label="Description" required />
        </>
      ) : null}
      {kind === "member" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2"><Input name="name" label="Name" required /><Input name="role" label="Role" required /></div>
          <div className="grid gap-4 md:grid-cols-2"><Input name="studentId" label="Student ID" /><Input name="email" label="UAEU email" type="email" /></div>
          <div className="grid gap-4 md:grid-cols-3"><Input name="committee" label="Committee" required /><Input name="areaOfInterest" label="Area of interest" required /><Input name="order" label="Order" /></div>
          <AdminImageField name="imageUrl" label="Profile image" />
          <Input name="socialUrl" label="LinkedIn URL" />
          <TextArea name="bio" label="Bio" required />
        </>
      ) : null}
      {kind === "alumni" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2"><Input name="name" label="Name" required /><Input name="graduationYear" label="Graduation year" required /></div>
          <div className="grid gap-4 md:grid-cols-2"><Input name="currentRole" label="Current role" required /><Input name="sector" label="Sector" required /></div>
          <AdminImageField name="imageUrl" label="Alumni image" />
          <Input name="socialUrl" label="LinkedIn URL" />
          <TextArea name="story" label="Story" required />
          <TextArea name="advice" label="Advice" required />
        </>
      ) : null}
      <button className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Create</button>
    </form>
  );
}
