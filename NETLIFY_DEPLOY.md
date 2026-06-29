# Netlify deployment

This is a dynamic Next.js app, so do not use Netlify drag-and-drop for the built files. Use Netlify CLI from this folder so Netlify can build the app and deploy the server functions.

## First deploy

From this folder:

```powershell
pnpm --package=netlify-cli dlx netlify login
pnpm --package=netlify-cli dlx netlify init
pnpm --package=netlify-cli dlx netlify deploy --build --prod
```

If the site already exists on Netlify, use this instead of `init`:

```powershell
pnpm --package=netlify-cli dlx netlify link
pnpm --package=netlify-cli dlx netlify deploy --build --prod
```

## Admin login

Set admin credentials in Netlify environment variables before sharing the site:

```text
ADMIN_USERNAME=<admin username>
ADMIN_PASSWORD=<strong admin password>
AUTH_SECRET=<long random secret>
```

Production admin login requires these variables. Do not rely on development credentials for a public website.

`DATABASE_URL=file:./dev.db` is already included in `netlify.toml`; Prisma resolves it to the bundled `prisma/dev.db` file.

## Email notifications

Forms are wired to email the official club inbox:

```text
CLUB_NOTIFICATION_EMAIL=Clubcavm@gmail.com
```

To turn delivery on, add a Resend API key in Netlify:

```text
RESEND_API_KEY=<your Resend API key>
NOTIFICATION_FROM_EMAIL=CAVM Club <onboarding@resend.dev>
```

Use a verified sender/domain in `NOTIFICATION_FROM_EMAIL` if Resend asks for one. Submissions are still saved in admin even if email delivery is not configured.

For the easier Windows path, open `SETUP_EMAIL_NOTIFICATIONS.bat`, paste the Resend API key, then redeploy.

## Production database note

The original seeded public content uses SQLite. Visitor submissions and admin-managed live content are stored in Netlify Blobs so they can persist on Netlify without a separate database account.

This includes student registrations, partner submissions, contact messages, opportunity changes, event changes, achievements, media, members, and alumni. A hosted database such as Netlify DB, Neon, Supabase, or another Postgres provider can still be added later for advanced reporting, but it is no longer required for the admin buttons and visitor forms to work on Netlify.
