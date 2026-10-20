# Customising the Springs 360 website

Open the `Leadz` folder in VS Code. All paths below are relative to that folder.
Use **Cmd+P** (Mac) / **Ctrl+P** (Windows) and type a file name to open it quickly.

## Preview your changes

```bash
npm install      # first time only
npm run dev      # opens a live preview at http://localhost:5173 — updates as you save
npm run build    # final check before you commit (must finish without errors)
```

Publish: commit → push → open a pull request → merge into `main` (GitHub deploys automatically).

---

## Fonts

| What | File | Where |
|---|---|---|
| **Which fonts the site uses** | `tailwind.config.ts` | Lines at the top: `FONT_MAIN` (body, navigation, buttons and all headings), `FONT_ACCENT` (italic accent words), `FONT_BRAND` (the "360" in the logo and the big footer wordmark) |
| **Loading the font files** | `src/index.css` | The `@import "@fontsource…"` lines at the very top |
| **Heading weight (bold)** | `src/index.css` | The `.font-display` and `h1.font-display, h2.font-display…` rules under "Type roles" |
| **Home page H1 size/weight** | `src/components/sections/home/Hero.tsx` | The `<h1 …>` line (`font-extrabold`, `fontSize: "clamp(…)"`) |
| **Heading sizes everywhere** | `tailwind.config.ts` | `fontSize` → `display-xl`, `display-lg`, `display-md`, `display-sm` |
| **Fonts preloaded for speed** | `scripts/prerender.mjs` | The line containing `plus-jakarta-sans-latin-wght-normal` |

**To switch to another Google font** (example: Manrope):

1. Terminal: `npm i @fontsource-variable/manrope`
2. `src/index.css`: replace `@import "@fontsource-variable/plus-jakarta-sans/wght.css";` with `@import "@fontsource-variable/manrope/wght.css";`
3. `tailwind.config.ts`: in `FONT_MAIN`, replace `"Plus Jakarta Sans Variable"` / `"Plus Jakarta Sans"` with `"Manrope Variable"` / `"Manrope"`
4. `scripts/prerender.mjs`: replace `plus-jakarta-sans-latin-wght-normal` with `manrope-latin-wght-normal`
5. `npm run dev` and check.

To remove the italic accent font, set `FONT_ACCENT` to the same list as `FONT_MAIN` and delete the `font-style: italic;` line in the `.font-display em` rule in `src/index.css`.

---

## Illustrations & visuals

| Visual | File |
|---|---|
| Home hero cards (post, campaign, enquiry, lead) | `src/components/sections/HeroCollage.tsx` |
| 360° growth wheel (drawing) | `src/components/art/GrowthWheel.tsx` |
| Growth wheel steps (titles, text, questions) | `src/data/growthSystem.ts` |
| Which services appear in each wheel step | `src/data/catalog.ts` → the `stage` field of each service |
| Scroll text reveal ("Marketing doesn't operate in channels…") | `src/components/sections/home/BrandStatement.tsx` (`statement` text at the top; `[0.16, 1]` = start/end opacity) |
| Line-art patterns on page banners, case studies, articles | `src/components/art/CoverArt.tsx` (patterns: `contour`, `flow`, `rings`, `grid`, `orbit`; tones: `deep`, `forest`, `sage`, `ivory`) |
| Which pattern a page uses | the `art={{ seed, variant }}` prop in the page file, e.g. `src/pages/Services.tsx`, `src/pages/About.tsx` |
| Which pattern a case study / industry / article uses | `art` field in `src/data/caseStudies.ts`, `src/data/industries.ts`, `src/data/insights/index.ts` |
| Service card icons | `src/data/catalog.ts` → `icon` (names from https://lucide.dev/icons) |
| Logo | `src/components/layout/Logo.tsx` · browser icon: `public/favicon.svg` |
| Social-share image | `public/og/springs360-og.png` (1200×630 px) |

**Using real photos instead of line art**

1. Put the image in `public/images/` (e.g. `public/images/team.jpg`, ideally `.webp`, under 300 KB).
2. Articles: set `coverImage: "/images/your-photo.webp"` and `coverAlt` in `src/data/insights/index.ts` — or use the Cover image field in the admin dashboard.
3. Anywhere else: replace `<CoverArt … />` with `<img src="/images/your-photo.webp" alt="Describe the photo" className="h-full w-full object-cover" loading="lazy" />`.

---

## Other common edits

| What | File |
|---|---|
| Colours | `tailwind.config.ts` → `colors` (forest, ivory, sage, gold, ink) |
| Button shape (rounded) | `src/components/ui/Button.tsx` → `rounded-full` in `base` |
| Phone, WhatsApp, email, hours, social links | `src/config/site.ts` |
| Menu items | `src/config/site.ts` → `primaryNav` |
| Services list and order | `src/data/catalog.ts` (order = order on the site; `top: true` = shown on home) |
| Service page content | `src/data/services.ts` |
| Home page sections and their order | `src/pages/Home.tsx` |
| Home hero text | `src/components/sections/home/Hero.tsx` |
| FAQ answers | `src/data/faqs.ts` |
| Case studies | `src/data/caseStudies.ts` |
