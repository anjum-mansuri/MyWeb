# Academic Portfolio Site

A self-service academic portfolio: every section (Education, Publications, Patents, Awards,
Skills, etc.) can be added to, edited, deleted, and toggled public/private from `/admin` — no
code changes required. Visitors only ever see sections marked public. The "Download CV" button
generates a PDF live from whatever is currently marked public.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL (via [Neon](https://neon.tech), free tier) + Prisma ORM
- Single-admin password login (session cookie signed with `jose`)
- `@react-pdf/renderer` for server-generated CVs

## 0. Cloning this repo on a new computer

```
git clone https://github.com/anjum-mansuri/MyWeb.git
cd MyWeb/site
```

Everything the app needs — code, database schema, migrations — is in this repo. The only things
*not* in the repo (by design, since they're secrets) are the three environment variables in
section 1 below. Once you've set those in a `.env.local` file, `npm install && npm run dev`
(section 2) gets you running locally, pointed at the exact same live database as any other
machine — so content is instantly shared, nothing to export/import.

## 1. One-time setup: create your database

1. Go to [neon.tech](https://neon.tech) and create a free account/project. No credit card required.
2. In the Neon dashboard, open **Connection Details** and copy the connection string
   (the "pooled connection" one, `postgresql://...`).
3. In `site/`, copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
4. Paste your Neon connection string into `DATABASE_URL` in `.env.local`.
5. Set `ADMIN_PASSWORD` to whatever password you want to log into `/admin` with.
6. Set `SESSION_SECRET` to a random string, e.g. generate one with:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
7. (Optional) Set `ANTHROPIC_API_KEY` to enable the `/admin/ask` AI assistant — get one at
   [console.anthropic.com](https://console.anthropic.com) under API Keys. Leave it blank to skip
   this feature entirely; everything else works fine without it.

> **Already have a working `.env.local` on another machine?** Just copy that file over instead
> of repeating steps 1–7 — it already has the real values, and reusing the same `DATABASE_URL`
> means both machines see the same content.

## 2. Local development

```
npm install
npm run db:migrate   # creates the database tables (first time, and after schema changes)
npm run db:seed       # seeds default sections/profile/settings rows
npm run dev
```

Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin` to log in
with the `ADMIN_PASSWORD` you set.

## 3. Deploying (GitHub → Vercel)

1. Push this repository to GitHub (see below if it isn't already there).
2. Go to [vercel.com](https://vercel.com), "Add New Project", and import the GitHub repo.
   Set the project root to `site/` if prompted.
3. In the Vercel project's **Settings → Environment Variables**, add the same three variables
   from your `.env.local`: `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
4. Deploy. On the first deploy, run the migration once against your Neon database (from your
   local machine, pointed at the same `DATABASE_URL` you gave Vercel):
   ```
   npm run db:deploy
   npm run db:seed
   ```
5. (Optional) Add a custom domain under **Settings → Domains**.

Because Vercel and your local machine both use the same Neon `DATABASE_URL`, content you add
in the deployed `/admin` shows up immediately everywhere — there's nothing to keep in sync.

## 4. Changing or resetting the admin password

The admin password isn't stored in the database — it's just the `ADMIN_PASSWORD` environment
variable. To change it:

- **Locally**: edit `ADMIN_PASSWORD` in `.env.local` and restart `npm run dev`.
- **On Vercel**: update `ADMIN_PASSWORD` in Project Settings → Environment Variables, then
  redeploy (Vercel prompts you to redeploy when you change an env var).

There's no "forgot password" flow by design — whoever can edit the environment variables (you)
controls admin access.

## 5. How content maps to the admin panel

- **Hero, About Me, Contact** are edited together on `/admin/profile` (name, title, tagline,
  photo, bio, links, email/phone/location).
- Every other section (Education, Experience, Research, Publications, Patents, Awards, Skills,
  Teaching, Courses, Languages, References) is a list you manage from `/admin/section/<name>` —
  add, edit, delete, and reorder entries with the up/down arrows.
- The dashboard at `/admin` toggles each section **Public**/**Private** independently. Patents
  and References default to Private; everything else defaults to Public.
- `/admin/settings` turns the **visitor gate** on or off (a name/email/reason form visitors must
  fill out before seeing the site).
- `/admin/leads` lists everyone who has submitted the visitor gate or the on-page contact form.
- `/admin/documents` is a private file library — upload PDFs, photos, or any document. PDFs have
  their text extracted automatically so they can be used as context for the next feature.
- `/admin/ask` is a private AI assistant (type a question and/or attach a photo) that answers
  using your profile data and anything in the document library. Requires `ANTHROPIC_API_KEY` to
  be set (see section 1, step 7) — without it, the page shows a clear error instead of crashing.

## 6. CV generation

`/api/cv` (linked from the "Download CV" button) queries the database on every request and
renders a PDF containing only the sections currently marked public — so it's always in sync
with what's live on the site, and never includes private sections like Patents or References
unless you've made them public.
