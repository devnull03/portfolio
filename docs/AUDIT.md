# Portfolio audit — Sanity → LinkedIn, static builds, performance

Snapshot of `main` at `f885cb1`. This document is the plan for the stacked PRs
that follow it; each section names the PR that addresses it.

```
main
 └─ claude/focused-rubin-f5wiq7   docs: this audit
     └─ claude/content-pipeline   1. drop Sanity, build-time content from LinkedIn
         └─ claude/static-build   3. prerender everything, deploy on tag (Cloudflare)
             └─ claude/linkedin-sync-worker   2. worker: change detection, 2h debounce, redeploy
                 └─ claude/perf   4. performance (shader, assets, bundle)
```

Merge bottom-up: each PR targets the branch below it, so once one merges, the
next one retargets to `main` automatically on GitHub.

The order differs from the request's numbering on purpose: the sync worker (2)
triggers the tag-driven deploy, so it sits on top of the deploy pipeline (3).

---

## How the site works today

| Concern | Today |
| --- | --- |
| Hosting | Vercel (`adapter-vercel`). `wrangler.jsonc` is still around from an earlier Cloudflare attempt (commit `811c820`). |
| Resume / projects data | Sanity, fetched with GROQ **on every request** (`src/lib/server/queries.ts`), streamed to the page as promises, and shown with skeletons while it loads. |
| Home page | Server load calls Spotify on every request (two API calls plus a token refresh), even though the widget only shows after you scroll. |
| Recruiter mode | `?recruiter=1` sets a cookie that the server reads in `+layout.server.ts`, so every page has to be server-rendered. |
| Loading screen | `LoadingScreen.svelte`, fixed 1.8 s, then the page mounts. |
| CRT effect | `CrtOverlay.svelte`: a full **Babylon.js** engine (scene, camera, post-process), re-rendering a full-screen shader **every frame**. |
| Leftover local data | `src/lib/data/{resume,project}.data.ts`: an older hand-written copy of the resume. Only `contact.linkedin` and `contact.github` are still used, by the home page. |

### Baseline numbers (`pnpm build` on `main`)

| Metric | Value |
| --- | --- |
| Client JS, all chunks, gzip | **1.31 MB** |
| Largest chunk (Babylon.js + MorphSVG), raw / gzip | **5.38 MB / 1.18 MB**, loaded by the root layout, so on every page |
| `static/assets/Gradient.png` | 3.43 MB (home hero) |
| `static/assets/bg.png` | 2.13 MB (home hero) |
| Noise texture (`HomeIntro.svelte`) | 592 KB PNG behind **3 redirects across 3 Dropbox hosts** |
| Cloudflare Web Analytics beacon | Included **twice** (`app.html` and `+layout.svelte`) |

---

## 1. Replacing Sanity with LinkedIn → PR `claude/content-pipeline`

### What LinkedIn actually offers (Oct 2026)

* **There is no LinkedIn API that returns your own positions, education, skills or
  projects for a normal developer app.** Sign In with LinkedIn (OpenID Connect)
  returns name, email and photo only. Full-profile scopes are limited to
  partner programs.
* **The Member Data Portability API** (the DMA APIs: *Member Snapshot* plus
  *Member Changelog*) does return exactly this data, and the changelog is the
  closest thing to a profile-change feed. It is **only available to members
  located in the EEA or Switzerland**. A Canadian account gets an error when it
  applies.
* **LinkedIn has no webhook for "my profile changed."** The webhooks it does
  offer are for organization and marketing products.
* **The official data export** (Settings → Data privacy → *Get a copy of your
  data*) works for every account. It is a ZIP of CSVs (`Profile.csv`,
  `Positions.csv`, `Education.csv`, `Skills.csv`, `Projects.csv`,
  `Languages.csv`, `Certifications.csv`, `Honors.csv`, `Courses.csv`,
  `Volunteering.csv`…). It cannot be requested from code.
* Third-party scraping APIs exist (the best-known, Proxycurl, shut down in 2025
  after LinkedIn sued). They break LinkedIn's terms of service and are not part
  of this plan.

### Design

The data is fetched **at build time** into JSON committed to the repo, so a
build never depends on a third-party service being up:

```
content/
  linkedin.json   normalized LinkedIn snapshot (generated; do not hand-edit)
  site.json       hand-maintained, site-only data LinkedIn has no field for:
                  project categories, GitHub links, preview images,
                  showInResume, skill groupings, hidden entries, contact overrides
```

`pnpm content:fetch` refreshes `linkedin.json` from one of two **providers**:

| Provider | When | How |
| --- | --- | --- |
| `export` | Works for everyone (default) | Point `LINKEDIN_EXPORT` at the downloaded ZIP or the unzipped folder. |
| `dma` | Only if the account is in the EEA/CH | Official Member Snapshot API with `LINKEDIN_DMA_TOKEN`. |

`src/lib/content/` merges the two files into the shapes the pages already
render: work experience, education, volunteering, projects, skill sections and
contact. Data that LinkedIn has and Sanity didn't (languages with proficiency,
certifications, honors, courses) comes along too. Languages fill the existing
"Languages" skill group, which already supports a proficiency label.
Certifications, honors and courses are in the data but not rendered, so the
site looks the same.

`scripts/content/migrate-sanity.ts` is a **one-time** export of the current
Sanity dataset into `content/site.json` (images are downloaded into
`static/content/`), so nothing hand-curated in Sanity is lost. The Sanity
dataset is private, so this needs `SANITY_TOKEN` and has to be run by you. Until
then, the committed content is seeded from `src/lib/data/*.data.ts`.

`@sanity/client`, `sanity.ts`, `queries.ts` and the generated Sanity types are
removed. The surprise video in `FunnyHaha.svelte` is still a file on
`cdn.sanity.io`. That is plain asset hosting rather than an API dependency, but
it will break if the Sanity project is ever deleted. Moving it to R2 is a
one-line change once uploaded.

## 3. Static builds on a tag → PR `claude/static-build`

This mirrors the qrate site: everything is prerendered at build time and served
as Workers static assets, and a Worker handles only the routes that are
actually dynamic.

* Switch to `adapter-cloudflare` and set `export const prerender = true` at the
  root. `/`, `/resume` and `/projects` become plain HTML plus `__data.json`.
* **Spotify** moves to `GET /api/now-playing`, the only non-prerendered route.
  It sends `Cache-Control: s-maxage=30` so Spotify isn't called on every hit.
  The home page fetches it on mount. The widget only appears after scrolling,
  so nothing visible changes.
* **Recruiter mode** moves to the client. A tiny inline script in `app.html`
  reads `?recruiter=` and the cookie before first paint, and hides the loading
  screen for recruiters so there's no flash. The layout reads the same value
  when it hydrates.
* `wrangler.jsonc` sets `run_worker_first` only for `/api/*`, so HTML and assets
  never start the Worker.
* **Deploys**: `.github/workflows/deploy.yml` runs on any `v*` tag, and is also
  callable from other workflows. It runs `pnpm content:fetch` (when LinkedIn
  credentials are configured), builds, and runs `wrangler deploy`.
  `.github/workflows/content-release.yml` is the entry point for automation:
  `repository_dispatch: content-changed` (sent by the sync worker) or a manual
  run creates the next `content-*` tag and calls `deploy.yml` for it.

Side effects worth knowing:

* Resume and projects render immediately; the skeleton loading states go away
  because there's nothing left to wait for.
* Dates are formatted in UTC. Previously the browser's timezone could shift
  `2022-05-01` to "Apr 2022" for visitors west of UTC.

## 2. LinkedIn change detection → PR `claude/linkedin-sync-worker`

`workers/linkedin-sync/` is a standalone Cloudflare Worker:

* **Debounce: a Durable Object alarm.** Every change signal calls
  `setAlarm(now + DEBOUNCE)`, which resets the timer. The default is 2 hours,
  configurable. Only when the alarm fires does the Worker send one
  `repository_dispatch` to GitHub, which runs the content release above.
  Ten edits in an afternoon produce one deploy.
* **Signals**:
  * `POST /hook`, authenticated with a bearer secret. Use it for anything that
    can make an HTTP call: an iOS Shortcut after you edit your profile, an email
    rule on LinkedIn's "profile updated" notifications, or a manual `curl`.
  * **Cron poll** (hourly). If `LINKEDIN_DMA_TOKEN` is set, the Worker reads the
    official **Member Changelog API** for profile-domain events since the last
    cursor, and any new event resets the debounce. This only works for EEA/CH
    accounts. Without the token the cron does nothing, and `/hook` is the trigger.
* `GET /status` reports whether a deploy is pending and when it will fire.

## 4. Performance → PR `claude/perf`

The site has to look **pixel-identical**. Each change below is checked by
diffing Playwright screenshots against `main`.

| Problem | Fix | Visual change |
| --- | --- | --- |
| Babylon.js (1.18 MB gzip) renders a **static** CRT mask 60×/s | ~100 lines of raw WebGL: the same shader math, drawn **only on mount, resize and toggle**. Babylon's empty scene only contributed its clear colour `(0.2, 0.2, 0.3)`, so the shader takes that as a constant instead of sampling a render target. | None (pixel-diffed) |
| `gsap/all` pulls in every GSAP plugin | Import `ScrollTrigger`, `ScrollSmoother`, `MorphSVGPlugin` and `Draggable` individually | None |
| 5.5 MB of hero PNGs that only start loading **after** the loading screen | Lossless WebP (pixel-identical), plus `<link rel="preload">` so they download *during* the loading screen | None, apart from less pop-in |
| Dropbox noise texture (3 redirects) | Self-hosted, lossless WebP | None |
| Cursor runs `elementFromPoint` 2–3× and `getComputedStyle` on **every** mousemove, plus text-node range scans | Coalesced to one hit test per animation frame | None |
| Analytics beacon loaded twice | Keep a single copy | None |
| `console.log` on every resume entry render, debug logging on mount | Removed | None |
| Unused dependencies (`@babylonjs/inspector`, `@sanity/client`, Vercel packages, `adapter-auto`, …) | Removed | None |

The loading screen stays as it is.

### Results (measured on `claude/perf` vs `main`)

| | `main` | after |
| --- | --- | --- |
| Client JS, all chunks, gzip | 1.31 MB | **141 KB** (−89%) |
| JS decoded on the home page | 16.7 MB | **1.0 MB** |
| Bytes transferred on the home page (includes the 13 MB surprise video) | 29.0 MB | **13.8 MB** |
| Hero + background images | 5.59 MB PNG | **3.89 MB** lossless WebP (0 differing pixels) |
| CRT overlay | re-rendered every frame | drawn on mount, resize and toggle only |
| Server work per page view | Sanity queries plus Spotify calls | none (static HTML); Spotify only via `/api/now-playing` |

**Visual check.** Playwright screenshots of `/`, `/resume` and `/projects` were
taken at desktop and mobile sizes, at the top and two scroll positions, and
compared against `main` with the same content:

* Rendered text is identical on every page.
* Most screenshots differ by at most 1–2/255 per channel on well under 1% of
  pixels. That is rounding noise from the software GL renderer, and invisible.
* Read back directly, the CRT canvas differs from Babylon's by 1 pixel out of
  329k on mobile and 5 out of 1.08M on desktop, each by 1/255.
* The only larger local differences are the cursor halo, caught a sub-pixel
  apart mid-spring, and ScrollSmoother's inertia landing at a slightly
  different offset. The same noise shows up when `main` is compared with
  itself across runs.
