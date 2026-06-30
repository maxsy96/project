# CAVM Club Admin Dashboard Guide

This guide explains how CAVM Club admins operate the live website dashboard, review visitor submissions, update public content, close submissions, and keep a reliable record of admin changes.

Live site:

```text
https://cavm-opportunity-hub-uaeu-2026.netlify.app
```

Admin login:

```text
https://cavm-opportunity-hub-uaeu-2026.netlify.app/admin/login
```

In-dashboard guide:

```text
/admin/guide
```

## 1. Admin Access

Production admin credentials are controlled by Netlify environment variables:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
AUTH_SECRET
```

Only trusted committee/admin members should receive the username and password. If credentials are shared too widely, change `ADMIN_PASSWORD` in Netlify and redeploy. Always use Logout after finishing dashboard work on shared computers.

## 2. Dashboard Sections

| Dashboard page | Purpose |
| --- | --- |
| `/admin` | Overview of opportunities, students, partner submissions, recent messages, and upcoming events |
| `/admin/guide` | Full admin guide inside the dashboard |
| `/admin/opportunities` | Create, edit, close, archive, or delete student opportunities |
| `/admin/students` | Review student interest registrations and export CSV |
| `/admin/events` | Create activities, update event details, and open or close event submissions |
| `/admin/achievements` | Manage club achievements and public highlights |
| `/admin/media` | Add or remove curated media items |
| `/admin/members` | Add or remove committee members |
| `/admin/alumni` | Add or remove alumni stories |
| `/admin/partner-submissions` | Review external partner opportunity proposals |
| `/admin/contact-submissions` | Review contact messages, opportunity interests, and event registrations |
| `/admin/audit-log` | Review admin login and content-change history |

## 3. Where Visitor Forms Go

| Visitor action | Admin destination | What admins review |
| --- | --- | --- |
| Register Interest | `/admin/students` | Student name, ID, email, major, sectors, opportunity preferences, availability, and goals |
| Partner With Us | `/admin/partner-submissions` | Organization details, contact person, proposal details, sectors, deadline, and approval status |
| Contact form | `/admin/contact-submissions` | Questions, media requests, collaboration messages, and general messages |
| Opportunity interest | `/admin/contact-submissions` | Student name, email, target opportunity, and note |
| Event registration | `/admin/contact-submissions` | Event title, student name, email, student ID, phone, and message |

If email notifications are configured, submissions are also sent to `Clubcavm@gmail.com`. Even if email delivery is not configured, submissions are still saved inside the admin dashboard.

## 4. Overview Workflow

Use `/admin` first when starting an admin session.

1. Check total opportunities and open opportunities.
2. Check registered students.
3. Check partner submissions.
4. Review recent messages.
5. Review upcoming events and click an event if it needs editing.

## 5. Student Interest Registrations

Open:

```text
/admin/students
```

Use this page to review students who registered their interests.

- Filter by sector, such as Veterinary Medicine, Agriculture, Food Science, Environment, Research, or Government Sector.
- Filter by opportunity type, such as Internship, Volunteering, Farm Visit, Research Assistant Role, or Training Program.
- Open top matches to see which current open opportunities fit each student.
- Use Export CSV when the committee needs a spreadsheet for shortlisting, attendance, or reporting.

Good routine:

1. Filter students by the event or opportunity sector.
2. Review top matches.
3. Export CSV.
4. Contact selected students from the exported list or email records.

## 6. Opportunities

Open:

```text
/admin/opportunities
```

Use this area for internships, volunteering roles, research assistant roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad.

Opportunity statuses:

| Status | Meaning |
| --- | --- |
| `open` | Students can apply or send interest |
| `closing soon` | Deadline is near, but submissions are still accepted |
| `closed` | Students should no longer submit interest or apply from the website |

Admin workflow:

1. Use Create opportunity for a new item.
2. Fill title, organization, type, sectors, location, deadline, description, requirements, benefits, contact email, source, image, and status.
3. Use Edit to update an existing item.
4. Use Archive to close an opportunity without deleting it.
5. Use Delete only if the opportunity should be removed from admin and public view.

Important: closed opportunities must not show `Apply externally` or `Send interest` on the public opportunity page.

## 7. Events And Activities

Open:

```text
/admin/events
```

Events have two separate controls:

| Control | What it affects |
| --- | --- |
| Event status | Public state of the event, such as upcoming, completed, cancelled, or closed |
| Submission status | Whether students can register: open, closing soon, or closed |

Use event status for the activity timeline. Use submission status for registrations.

Recommended workflow:

1. Create the event with title, date, time, location, category, image, description, organizer, event status, and submission status.
2. Keep event status as `upcoming` while the activity is in the future.
3. Set submission status to `open` while students can register.
4. Set submission status to `closing soon` when the deadline is near.
5. Set submission status to `closed` when registration is full, the deadline passed, or the activity should no longer accept names.
6. After the event happens, update event status to `completed`.

Important: if submission status is closed, the event page must not show a registration form or event registration link.

## 8. Partner Submissions

Open:

```text
/admin/partner-submissions
```

Use this page to review organizations that want to offer student opportunities.

Actions:

- Open submission: read the full proposal details.
- Reply by email: contact the partner for clarification.
- Approve: create a public opportunity from the partner submission.
- Reject: mark the proposal rejected while keeping the record.
- Delete: remove the submission if it should not stay in admin.

Before approving, check:

- Organization name and contact person.
- Opportunity title and type.
- Sectors.
- Location.
- Deadline.
- Eligibility.
- Application link.
- Whether the opportunity is appropriate for CAVM students.

## 9. Contact Messages And Event Registrations

Open:

```text
/admin/contact-submissions
```

This page stores contact form messages, opportunity interest messages, and event registrations.

Workflow:

1. New/unread messages are highlighted.
2. Click Open submission to read the full message.
3. Use Reply by email for follow-up.
4. Mark as Read after the message is handled.
5. Mark as Unread if another admin still needs to review it.
6. Delete only if the message is no longer needed.

## 10. Achievements

Open:

```text
/admin/achievements
```

Use this page for official visits, exhibitions, initiatives, awards, public activities, community service, and club highlights.

Recommended workflow:

1. Add title, category, year, date, description, image, and optional related link.
2. Use images that match the achievement.
3. Use Edit when correcting existing achievements.
4. Use Delete only if the achievement should be removed from the public site.

## 11. Media

Open:

```text
/admin/media
```

Use Media for curated photos, videos, and archive highlights.

Rules:

- Keep every photo connected to the correct event or album.
- Do not use photos from one event under another event.
- Prefer high-quality group photos where students and activities are clear.
- Avoid screenshots with visible social media carousel dots when a clean photo is available.

## 12. Members

Open:

```text
/admin/members
```

Use Members for current committee information.

Fields:

- Name.
- Student ID.
- Email.
- Role.
- Committee.
- Area of interest.
- Bio.
- Image.
- Social link.
- Display order.

If an email is not entered, the dashboard can generate a UAEU-style email from the student ID in the member form workflow.

## 13. Alumni

Open:

```text
/admin/alumni
```

Use Alumni for graduate stories and role models.

Include:

- Name.
- Graduation year.
- Current role.
- Sector.
- Story.
- Advice.
- Image.
- Social or professional link if approved.

## 14. Audit Log

Open:

```text
/admin/audit-log
```

The audit log records important admin activity:

- Login, failed login, and logout.
- Opportunity create, edit, close, and delete.
- Event create, edit, delete, and submission-status changes.
- Achievement create, edit, and delete.
- Media create and delete.
- Member create and delete.
- Alumni create and delete.
- Partner submission approve, reject, and delete.
- Contact message read, unread, and delete.

Use filters to narrow the log by section. Open details to see saved context such as item name, status, submission state, or organization.

## 15. Safe Admin Rules

- Check public pages after important edits.
- Do not delete records unless the committee no longer needs them.
- Close submissions before an event deadline if registration should stop.
- Keep photos matched to their actual event.
- Do not share admin credentials publicly.
- Use the audit log when checking who made a change.
- Export important student lists before closing or deleting related activities.

## 16. Email Notifications

Submissions are saved in the dashboard. Email delivery is optional but recommended.

Netlify variables:

```text
RESEND_API_KEY
CLUB_NOTIFICATION_EMAIL=Clubcavm@gmail.com
NOTIFICATION_FROM_EMAIL=CAVM Club <onboarding@resend.dev>
```

If `RESEND_API_KEY` is missing, the dashboard still stores submissions, but email notifications will not be sent.

## 17. Netlify And Production Storage

The app is a real dynamic Next.js application.

It uses:

- Protected admin pages.
- Server actions.
- Prisma seed data.
- Netlify server functions.
- Netlify Blobs for live admin edits and visitor submissions.
- Optional Resend email notifications.

Seeded launch content is bundled with SQLite. Live submissions and admin-managed edits are stored in Netlify Blobs.

## 18. Daily Or Weekly Admin Checklist

- Check Contact Messages for unread items.
- Check Partner Submissions for pending proposals.
- Check Students for new interest registrations.
- Check Events to make sure upcoming activities have the correct submission status.
- Check Opportunities to close expired items.
- Check Achievements and Media after every major club event.
- Check Audit Log after major updates.
- Log out when finished.
