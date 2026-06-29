# CAVM Club Website + Opportunity Hub

Official website and Opportunity Hub for the CAVM Club at UAEU. The application gives the club a public presence beyond social media and provides one organized platform for student opportunities, activities, achievements, members, alumni, media archives, partner submissions, and visitor forms.

Live site: <https://cavm-opportunity-hub-uaeu-2026.netlify.app>

## What This Application Includes

- Public website pages for Home, About, History, Alumni & Achievements, Events, Media, Members, Opportunity Hub, Partners, Contact & Links.
- Searchable and filterable Opportunity Hub for internships, volunteering, research assistant roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad.
- Student interest registration with sector matching for veterinary medicine, agriculture, food science, environment, research, and government pathways.
- Partner submission workflow for external organizations offering student opportunities.
- Event pages with upcoming, closing soon, closed, completed, and cancelled states.
- Event registration forms that send details to the admin contact submissions area.
- Protected admin dashboard for opportunities, students, partner submissions, contact messages, events, achievements, media, members, and alumni.
- CSV export for student interest registrations.
- CAVM photo archive and event albums from the provided media folders.
- Email notification support for forms through Resend.
- Netlify deployment configuration for a dynamic Next.js app.

## Operating Guide

The full operating guide is included in this repository:

- [Markdown guide](docs/OPERATING_GUIDE.md)
- [PowerPoint guide](docs/CAVM-Website-Operating-Guide.pptx)

The guide explains admin login, where visitor forms go, event updates, opportunity review, contact messages, email notifications, deployment, and the admin checklist.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development and seeded launch data
- Netlify server functions
- Netlify Blobs for admin-added events and achievements
- Zod validation
- lucide-react icons

## Local Setup

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

## Environment Variables

Copy `.env.example` to `.env` for local development.

```bash
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="replace-with-admin-username"
ADMIN_PASSWORD="replace-with-strong-admin-password"
AUTH_SECRET="replace-with-a-long-random-string-at-least-32-characters"
RESEND_API_KEY=""
NOTIFICATION_FROM_EMAIL="CAVM Club <onboarding@resend.dev>"
CLUB_NOTIFICATION_EMAIL="Clubcavm@gmail.com"
```

Production admin credentials must be configured in Netlify. The app does not rely on public production fallback credentials.

## Admin Dashboard

Admin login route:

```text
/admin/login
```

Main admin areas:

- `/admin/students`
- `/admin/contact-submissions`
- `/admin/partner-submissions`
- `/admin/opportunities`
- `/admin/events`
- `/admin/achievements`
- `/admin/media`
- `/admin/members`
- `/admin/alumni`

## Form Submission Routing

| Visitor action | Admin destination |
| --- | --- |
| Register Interest | `/admin/students` |
| Contact form | `/admin/contact-submissions` |
| Opportunity interest | `/admin/contact-submissions` |
| Event registration | `/admin/contact-submissions` |
| Partner With Us | `/admin/partner-submissions` |

If `RESEND_API_KEY` is configured, these forms also email `Clubcavm@gmail.com`.

## Database Commands

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm db:studio
```

## Production Storage Note

This is a real dynamic application, not a static demo. It includes protected admin pages, server actions, form handling, email notifications, Prisma models, and Netlify deployment support.

For long-term production records, connect Prisma to a hosted production database such as Netlify DB, Neon, Supabase, or another PostgreSQL provider. SQLite is appropriate for local development and seeded launch content, but a hosted database is recommended for durable student registrations, partner submissions, contact messages, opportunity updates, members, alumni, and media records.

Admin-added events and achievements already use Netlify Blobs on Netlify.

## Netlify Deployment

Use the included `netlify.toml`.

Build command:

```bash
pnpm run db:touch && pnpm run db:generate && pnpm run db:push && pnpm run db:seed && pnpm run build
```

Publish directory:

```text
.next
```

Required Netlify environment variables:

```text
DATABASE_URL=file:./dev.db
ADMIN_USERNAME=<admin username>
ADMIN_PASSWORD=<strong admin password>
AUTH_SECRET=<long random secret>
CLUB_NOTIFICATION_EMAIL=Clubcavm@gmail.com
```

Recommended for email notifications:

```text
RESEND_API_KEY=<Resend API key>
NOTIFICATION_FROM_EMAIL=<verified sender>
```

## Validation

```bash
pnpm run lint
pnpm run build
```

Both commands should pass before deployment.
