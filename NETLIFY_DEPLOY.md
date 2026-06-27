# Netlify deployment

This Next.js app is prepared for Netlify with `netlify.toml`.

## Deploy commands

From this folder:

```powershell
pnpm --package=netlify-cli dlx netlify login
pnpm --package=netlify-cli dlx netlify init
pnpm --package=netlify-cli dlx netlify deploy --build --prod
```

If the site already exists on Netlify, use this instead of `init`:

```powershell
pnpm --package=netlify-cli dlx netlify link
```

## Required Netlify environment variables

Set these in Netlify after linking the site:

```text
ADMIN_EMAIL=Clubcavm@gmail.com
ADMIN_PASSWORD=<strong admin password>
AUTH_SECRET=<long random secret>
DATABASE_URL=file:./prisma/dev.db
```

`DATABASE_URL` is already included in `netlify.toml` for the current SQLite seed database.

## Production database note

The current app uses SQLite for local development and seeded public content. For a production Netlify site where student registrations, partner submissions, contact messages, and admin edits must persist, move Prisma to a hosted database such as Netlify DB, Neon, Supabase, or another Postgres provider, then set `DATABASE_URL` to that hosted database.
