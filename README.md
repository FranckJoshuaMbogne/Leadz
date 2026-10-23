# Springs 360 — website

Marketing site for **Springs 360**, a 360° growth agency. React 19 + TypeScript + Vite + Tailwind + Framer Motion, hosted on Firebase Hosting with Firestore and Firebase Auth.

## Commands

```bash
npm install
npm run dev        # local dev server (client-rendered)
npm run build      # typecheck → client build → SSR bundle → prerender all routes
npm run preview
```

`npm run build` prerenders every public route to static HTML with page-specific metadata and JSON-LD, then writes `sitemap.xml`, `robots.txt`, `404.html` and `app.html` (SPA shell for admin and newly published CMS articles). See `scripts/prerender.mjs`.

## Structure

```
src/
  config/site.ts        brand, URL, contact details, nav — edit business info here
  data/                 services & pillars, case studies, industries, growth system, insights
  lib/                  seo (head + JSON-LD), insights (static + CMS), markdown, firebase, leads, analytics
  components/
    layout/             Navbar, Footer, Logo, Layout
    sections/           PageHero, CtaBand, FaqList, home/* sections
    cards/ forms/ ui/   reusable building blocks
    animations/         Reveal, MaskText, Counter, Parallax
    art/                generative SVG artwork (HeroField, GrowthWheel, CoverArt)
  pages/                route components (+ admin/)
  entry-server.tsx      prerender entry
```

## Firebase setup

1. Deploy rules: `firebase deploy --only firestore:rules` (the previous rules expired on 29 Aug 2026 and denied all access).
2. Enable **Email/Password** sign-in in Firebase Auth and create the admin user.
3. In Firestore create `admins/{UID}` (any fields) for each admin — the document ID must be the user's Auth UID.
4. Sign in at `/admin`. The dashboard manages **Leads** and **Insights** (create, edit, draft/publish, delete).

Collections: `leads` (public create-only, validated), `insights` (public read when `status == "published"`), `admins` (manual).

## Content notes

- Case studies in `src/data/caseStudies.ts` are **illustrative** (carried over from demo data) and labelled as such on the site. Add real ones with `verified: true`.
- Insights published in the CMS appear immediately (client-side) and are prerendered + added to the sitemap on the next build/deploy.

See **CUSTOMIZE.md** for where to change fonts, illustrations, colours and content.


## Admin dashboard (/admin)

Sign in at **https://springs360.in/admin** (Google or email). `/dashboard` redirects there.

| Tab | What you manage |
|---|---|
| Leads | Strategy-call and contact enquiries — status (new → contacted → qualified → won/closed/spam), private notes, WhatsApp/email/call, search, CSV export |
| Insights (blog) | Write, publish and edit articles |
| Hero, contact & links | Home hero text (*asterisks* = gold), hero image, main button text + link, phone/WhatsApp, email, hours, social links |
| Services menu | Service cards: name, outcome, icon, growth step, “most requested” on home |
| Growth wheel | The steps of the 360° wheel |
| Capabilities / Service pages | Every /services page: text, approach, deliverables, FAQ, images |
| Work / case studies | Create, edit, delete, publish case studies with cover image, gallery, video and live link |
| Industries, FAQ | As named |

Changes are live as soon as you save; the site also rebuilds every night so Google sees them.
Images are compressed and stored in Firestore (no paid Storage plan needed). Videos are links.

**One-time setup (Firebase console → project leadzindb):** Authentication → Sign-in method → enable Google;
Authentication → Settings → Authorized domains → add `springs360.in` and `www.springs360.in`;
then `firebase deploy --only firestore:rules`. Admins = emails in `firestore.rules` → `isAdmin()` or documents in `admins/{uid}`.
