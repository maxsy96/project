# CAVM Club Website + CAVM Opportunity Hub

A polished official website for CAVM Club with a centralized Opportunity Hub for internships, volunteering, research roles, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad.

## Features

- Public pages for Home, About, History, Achievements, Events, Media, Members, Alumni, Opportunity Hub, Partners, Official Links, and Contact.
- Searchable and filterable opportunity directory with detail pages.
- Student interest registration with private data storage and matching preview.
- Partner opportunity submission workflow with pending review.
- Protected admin area for opportunities, student registrations, events, achievements, media, members, alumni, partner submissions, and contact messages.
- CSV export for student interest registrations.
- Seeded CAVM-relevant content from the provided PDFs, document, and image archives.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local development through `DATABASE_URL`
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

Open `http://localhost:3000`.

The app in this workspace already has a local SQLite database at `prisma/dev.db` seeded for preview.

## Environment Variables

```bash
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@cavm.local"
ADMIN_PASSWORD="replace-with-a-strong-password"
AUTH_SECRET="replace-with-a-long-random-string"
```

Optional SMTP variables are included in `.env.example` for future notification delivery. The MVP does not require real email sending.

## Admin Login

Visit `/admin/login` and use the values in `.env`:

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

Never expose these values in client code or public documentation for a real deployment.

## Database Commands

```bash
pnpm db:generate   # Generate Prisma Client
pnpm db:push       # Sync SQLite schema locally
pnpm db:seed       # Load sample CAVM data
pnpm db:studio     # Open Prisma Studio
```

To move from SQLite to PostgreSQL later, update `DATABASE_URL`, change the Prisma datasource provider, review scalar compatibility, then run a proper migration.

## Matching System

A student matches an opportunity when at least one selected student sector overlaps with the opportunity sector tags. Match strength increases when the student's preferred opportunity types also include the opportunity type:

- Strong match: sector overlap and type preference match.
- Good match: sector overlap only.
- Possible match: type preference match only.

Matching appears after student registration and inside admin student/opportunity workflows.

## Adding Content

- Add or edit opportunities from `/admin/opportunities`.
- Partner submissions are reviewed at `/admin/partner-submissions` and can be approved into public opportunities.
- Manage events, achievements, media, members, and alumni from their admin pages.
- Keep public member/alumni photos consent-approved.

## Assumptions

- Official social links, club email, and partner application URLs are placeholders until CAVM provides approved links.
- Student data is private and only visible inside `/admin`.
- The provided media archives are used as a curated, optimized web sample rather than importing all large originals.
- Prisma is pinned to 6.x to keep the classic SQLite `DATABASE_URL` setup stable for the MVP.

## Validation

```bash
pnpm run lint
pnpm run build
```

Both checks pass in this workspace.
