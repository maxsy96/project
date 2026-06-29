# CAVM Club Website Operating Guide

This guide explains how CAVM Club admins operate the live website, review visitor submissions, update public content, and keep the project running as a real production application.

Live site: <https://cavm-opportunity-hub-uaeu-2026.netlify.app>

## 1. Admin Access

Admin page:

```text
https://cavm-opportunity-hub-uaeu-2026.netlify.app/admin/login
```

Production credentials must be set in Netlify environment variables:

```text
ADMIN_USERNAME
ADMIN_PASSWORD
AUTH_SECRET
```

Only trusted committee/admin members should receive the username and password. If the credentials are shared too widely, change `ADMIN_PASSWORD` in Netlify and redeploy.

Local development can use `.env` copied from `.env.example`.

## 2. Where Visitor Forms Go

All important visitor actions have an admin review path.

| Visitor form | Admin page | What admins review |
| --- | --- | --- |
| Register Interest | `/admin/students` | Student name, ID, email, major, sectors, opportunity preferences, availability, and goals |
| Partner With Us | `/admin/partner-submissions` | Organization details, contact person, opportunity proposal, sectors, deadline, and approval status |
| Contact page | `/admin/contact-submissions` | Questions, media requests, collaboration messages, and general website messages |
| Opportunity interest | `/admin/contact-submissions` | Student name, email, target opportunity, and note |
| Event registration | `/admin/contact-submissions` | Event title, student name, email, student ID, phone, and message |

Email notifications can also be sent to `Clubcavm@gmail.com` when email delivery is configured.

## 3. Email Notifications

The website saves submissions in admin and can email the club inbox.

Set these Netlify environment variables:

```text
RESEND_API_KEY
CLUB_NOTIFICATION_EMAIL=Clubcavm@gmail.com
NOTIFICATION_FROM_EMAIL=CAVM Club <onboarding@resend.dev>
```

Use a verified sender or domain in Resend if required. If `RESEND_API_KEY` is missing, the submission is still saved in admin, but no email is sent.

## 4. Event Operation

Admins can manage events from:

```text
/admin/events
```

Recommended workflow:

1. Create the event with title, date, time, location, category, image, description, and status.
2. Use `upcoming` while registration is open.
3. Use `closing soon` when the deadline is near.
4. Use `closed` if registration should stop before the event date.
5. Use `completed` after the event has happened.
6. Add event photos to the correct archive album so media stays organized.

Upcoming and active events appear first on the public events page. Completed events remain visible as a club history archive.

## 5. Opportunities

Admins manage opportunities from:

```text
/admin/opportunities
```

Use this area for internships, volunteering, research roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad.

When a partner submits an opportunity, review it in `/admin/partner-submissions`. Approved partner submissions can become public opportunities.

## 6. Achievements, Alumni, Members, and Media

Admin pages:

```text
/admin/achievements
/admin/alumni
/admin/members
/admin/media
```

Use these areas to keep the public presence current:

- Achievements: awards, community initiatives, exhibitions, official visits, public activities, and recognitions.
- Alumni: graduate stories, roles, advice, and CAVM pathways.
- Members: committee names, roles, student IDs, generated UAEU email addresses, and leadership areas.
- Media: curated photo/video items and links to organized event albums.

Use approved photos only, and keep each event album connected to the correct event.

## 7. Production Storage

The app is a real dynamic Next.js application, not a static demo. It includes:

- Protected admin dashboard.
- Dynamic forms.
- Prisma schema and seed data.
- Netlify server function deployment.
- Netlify Blobs storage for admin-added events and achievements.
- Email notification integration through Resend.

Important production note: SQLite is suitable for local development and seeded launch data. For permanent production storage of student registrations, partner submissions, contact messages, opportunities, members, alumni, and media records, connect Prisma to a hosted production database such as Netlify DB, Neon, Supabase, or another PostgreSQL provider.

Until a hosted database is configured, email notifications are the safest external record for new form submissions.

## 8. Local Development

Install dependencies and start the app:

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

Open:

```text
http://localhost:3000
```

Run checks:

```bash
pnpm run lint
pnpm run build
```

## 9. Netlify Deployment

The project is configured for Netlify in `netlify.toml`.

Required build command:

```bash
pnpm run db:touch && pnpm run db:generate && pnpm run db:push && pnpm run db:seed && pnpm run build
```

Publish directory:

```text
.next
```

Required environment variables:

```text
DATABASE_URL=file:./dev.db
ADMIN_USERNAME=<admin username>
ADMIN_PASSWORD=<strong admin password>
AUTH_SECRET=<long random secret>
CLUB_NOTIFICATION_EMAIL=Clubcavm@gmail.com
RESEND_API_KEY=<optional but recommended>
NOTIFICATION_FROM_EMAIL=<verified sender>
```

## 10. Admin Checklist

Before sharing the site widely:

- Confirm the public pages load.
- Confirm `/admin/login` works.
- Confirm the contact form saves under `/admin/contact-submissions`.
- Confirm Register Interest saves under `/admin/students`.
- Confirm Partner With Us saves under `/admin/partner-submissions`.
- Confirm event status labels are correct.
- Confirm all media albums use the correct event photos.
- Confirm email notifications reach `Clubcavm@gmail.com`.
- Confirm admin credentials are not shared publicly.
- Confirm a hosted database plan is in place for long-term production records.
