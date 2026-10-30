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

## Landing pages, courses & payments (/admin)

| Tab | What it does |
|---|---|
| Landing pages | Create unlimited high-conversion pages at `springs360.in/<url>` from 3 templates: **Free audit (quiz)**, **Online training**, **Lead form**. Edit every text, the quiz (pillars, questions, advice), sections (cards, list, steps, tags, FAQ, testimonials, text), images, video, SEO/share text. Draft → Preview → Publish. `/audit` and `/training` work out of the box and become editable once saved. |
| Course orders | Payments to verify. Check your UPI / PayPal / bank account, then **Payment received · create password**. Send the ready-made message on WhatsApp in one tap. Turn any password off to remove access. You can also create a password without an order (cash, gifts). |
| Courses | Title, price, old price, free ~30 s preview video, cover, outcomes, and the full lesson videos (only visible after unlocking). |
| Payment methods | UPI, Google Pay, card, Apple Pay, PayPal (or any other): pay-to ID with copy button, QR image, payment link and step-by-step instructions shown in the payment pop-up. Only methods switched on are offered. |

**Buyer flow:** course page → free preview → *Get the full course* → sign in with Google → phone number → choose payment method → pop-up with your instructions → pays → enters name + phone used to pay (+ optional transaction ID) → you verify in **Course orders** → you send the password → learner opens **springs360.in/learn**, signed in with the same Google email, enters the password → that course only is unlocked.

Security: passwords are bound to the buyer's Google email and one course (enforced in `firestore.rules`). Lesson videos are only readable with an unlocked grant. Host lesson videos on Vimeo with *domain-level privacy* (springs360.in) so a copied link doesn't play elsewhere.

Leads from audit and lead-form pages appear in **Leads** with score, weakest pillar, area and source (`?src=instagram` on your links).

**After merging, deploy the new rules once:** `firebase deploy --only firestore:rules` (or Firebase console → Firestore → Rules → paste `firestore.rules` → Publish). Google sign-in must be enabled (it already is for the admin).

## Local SEO (/admin → Locations)

City pages at `/locations/hyderabad`, `/locations/bengaluru`, `/locations/delhi-ncr` (+ `/locations` index), prerendered with
`ProfessionalService` (LocalBusiness) structured data: areas served, neighbourhoods, service catalogue, FAQ and breadcrumbs.
Organization, home, services and service pages declare the same areas served. Courses carry `Course` structured data
(price, online mode, workload) and `/training` an `ItemList` of courses. Add an office address to a city only if you
really operate from it; link each city's Google Business Profile in *Google Maps link*.

## Course groups

Each course can have a private Telegram group (Courses → Course group). The link is stored with the lessons, so only
learners who unlocked the course can see it (in the player at /learn/<course>). Create the Telegram invite link with
"Request admin approval" so forwarded links can't be used without you approving.
