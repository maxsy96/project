import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "1. Access And Login",
    items: [
      "Open /admin/login from the live website.",
      "Sign in with the admin username and password set in Netlify environment variables.",
      "Do not share admin credentials in group chats or public documents.",
      "Use Logout when finished, especially on shared computers.",
    ],
  },
  {
    title: "2. Overview Page",
    items: [
      "Use Overview for a quick health check of open opportunities, registered students, partner submissions, recent messages, and upcoming events.",
      "Click an upcoming event from Overview to jump directly to its edit screen.",
      "Click a recent message to review it under Contact Messages.",
    ],
  },
  {
    title: "3. Student Interest Registrations",
    items: [
      "Open Students to review all students who submitted Register Interest.",
      "Use sector and opportunity-type filters to find students for specific activities.",
      "Open top matches to see which current opportunities fit each student.",
      "Use Export CSV when the committee needs a spreadsheet for shortlisting or records.",
    ],
  },
  {
    title: "4. Opportunities",
    items: [
      "Open Opportunities to create, edit, close, or delete internships, volunteering roles, research roles, farm visits, jobs, training, scholarships, competitions, conferences, government opportunities, and programs abroad.",
      "Use open when students can apply or send interest.",
      "Use closing soon when the deadline is near but submissions are still accepted.",
      "Use closed when students should no longer submit interest or apply from the website.",
      "Use Archive to close an opportunity without deleting it from the public archive.",
    ],
  },
  {
    title: "5. Events And Activities",
    items: [
      "Open Events to create activities and manage upcoming or past events.",
      "Event status controls the public activity state: upcoming, closing soon, completed, cancelled, or closed.",
      "Submission status controls whether students can register: open, closing soon, or closed.",
      "Set submissions to closed when registration is full, the deadline passed, or the activity should no longer accept names.",
      "Use Edit to update event date, time, location, image, description, category, organizer, public status, and submission status.",
      "Use Event card image for the public card and hero image. Use Add photos to this event album when you want photos to appear inside the Media album.",
    ],
  },
  {
    title: "6. Partner Submissions",
    items: [
      "Open Partner Submissions to review organizations that want to offer opportunities to students.",
      "Use Open submission to read the full description, eligibility, location, notes, and application link.",
      "Use Reply by email if more information is needed.",
      "Approve creates a public opportunity from the partner submission.",
      "Reject keeps the record but marks it rejected.",
      "Delete removes the submission from the admin list.",
    ],
  },
  {
    title: "7. Contact Messages And Event Registrations",
    items: [
      "Open Contact Messages to review contact form messages, opportunity interest forms, and event registrations.",
      "Unread messages are highlighted.",
      "Use Open submission to read the full message.",
      "Use Reply by email to respond from your email app.",
      "Use Read and Unread to manage follow-up status.",
      "Delete only when the message is no longer needed.",
    ],
  },
  {
    title: "8. Achievements, Media, Members, And Alumni",
    items: [
      "Use Achievements for club accomplishments, official visits, exhibitions, initiatives, awards, and public activities.",
      "Use Media for curated archive entries and important photo or video items.",
      "At the top of Media, use Add photos to an event album to append many photos to an existing album without changing the card image.",
      "Use Album manager in Media to open an album, preview each thumbnail, open the full photo, and remove a photo from the public album if it does not belong.",
      "Use Members for committee names, roles, IDs, generated UAEU emails, committees, and profile information.",
      "Use Alumni for graduate stories, current roles, sectors, advice, career pathways, profile photos, and LinkedIn links.",
      "Use the image picker to select existing site photos, upload an image from a phone or computer, paste a trusted image path, or clear an image.",
      "Uploaded images can be JPG, PNG, WebP, or GIF files up to 8 MB.",
      "Keep photos matched to their real event or album. Do not reuse unrelated event photos.",
    ],
  },
  {
    title: "9. Audit Log",
    items: [
      "Open Audit Log to see admin login activity and content changes.",
      "Use filters to view changes by Auth, Opportunity, Event, Achievement, Media, Member, Alumni, Partner submission, or Contact message.",
      "Open details to see status changes, item names, and other saved context.",
      "Use the audit log when checking who changed event submissions, closed opportunities, deleted records, or approved partner submissions.",
    ],
  },
  {
    title: "10. Safe Admin Routine",
    items: [
      "Before publishing an event, check title, date, time, location, description, image, event status, and submission status.",
      "Before closing submissions, confirm the committee has exported or reviewed the registration list.",
      "Before deleting content, make sure it is not needed for club history, reporting, or media archive records.",
      "After major updates, open the public page in a new tab and confirm the change appears correctly.",
      "Check the audit log after important changes so the committee has a record.",
    ],
  },
];

const quickLinks = [
  ["Students", "/admin/students"],
  ["Opportunities", "/admin/opportunities"],
  ["Events", "/admin/events"],
  ["Partner submissions", "/admin/partner-submissions"],
  ["Contact messages", "/admin/contact-submissions"],
  ["Achievements", "/admin/achievements"],
  ["Media", "/admin/media"],
  ["Members", "/admin/members"],
  ["Alumni", "/admin/alumni"],
  ["Audit log", "/admin/audit-log"],
];

export default async function AdminGuidePage() {
  await requireAdmin();

  return (
    <AdminShell title="Admin Dashboard Guide">
      <div className="grid gap-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase text-emerald-700">Operating guide</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">How admins should operate the CAVM dashboard</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            This guide explains where each visitor form goes, how to manage opportunities and activities, how to close
            submissions, how to handle messages, and how to keep a reliable admin record.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-950">Important Rules</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-amber-900 md:grid-cols-3">
            <p>Use closed status when students should not submit anymore. Closed pages must not show application buttons.</p>
            <p>Keep every photo in the correct event or media album. Do not place photos from one event under another event.</p>
            <p>Do not delete records unless the committee no longer needs them for reports, history, or follow-up.</p>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
