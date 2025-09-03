---
trigger: manual
---

# Finance Blog – Tech Stack

This document captures the stack we’ll use for the finance blog and admin panel.

## Core choices
- **Framework:** Next.js 15.5.2 (App Router) + React 19 + TypeScript + Turbopack
- **Platform (Google‑first):** Firebase Hosting (SSR via Functions/Run)
- **Auth:** Firebase Auth (Google) with custom `admin` claim for `/admin`
- **Database:** Firestore (posts, tags, users, revisions, settings)
- **Storage:** Cloud Storage (images, attachments) with signed URLs
- **Content format:** MDX (rendered in RSC), stored alongside metadata in Firestore
- **UI & styling:** Tailwind CSS v4 + **shadcn/ui** component library
- **Icons:** lucide-react
- **Forms & validation:** react-hook-form + zod
- **SEO:** next-seo, next-sitemap (sitemap + robots.txt), OpenGraph image template
- **Search (MVP):** fuse.js client-side index (upgrade later if needed)
- **Analytics:** GA4 (or Plausible/Umami if you prefer privacy)
- **Monitoring:** Sentry
- **Linting/formatting:** ESLint (from create-next-app) + optional Prettier

## Tailwind v4 note
> Tailwind **v4** is already set up by `create-next-app`. **No extra Tailwind config file is required** unless you decide to customize themes/plugins later.

## shadcn/ui (component library)
We’ll use **shadcn/ui** for a consistent, editable component set built on Tailwind.

**Install (CLI):**
```bash
# initialize the project for shadcn/ui
npx shadcn@latest init
# (if the alias above isn’t available in your env, try: npx shadcn-ui@latest init)

# add some base components
npx shadcn add button card input textarea label badge dropdown-menu dialog toast
```

- Components are generated locally under `src/components/ui/*` so you can fully customize them.
- The installer will add helper deps (e.g., `class-variance-authority`, `tailwind-merge`) if not present.

## Recommended project structure (high-level)
```
src/
  app/
    (public routes)
    admin/           # protected admin panel
    api/             # route handlers (revalidation, uploads, etc.)
  components/
    ui/              # shadcn/ui components
    charts/          # finance chart wrappers
  lib/               # firebase client/admin, helpers
  styles/
public/
```

## Optional add-ons (when needed)
- **BigQuery + Looker Studio** for heavier datasets/dashboards
- **Meilisearch/Typesense** if you outgrow client-side search
- **UploadThing** or signed uploads for nicer media UX

---

**Decision summary:** Next.js + Firebase keeps the stack simple, Google‑centric, and low‑ops while giving us great SEO (ISR) and a solid admin experience.
