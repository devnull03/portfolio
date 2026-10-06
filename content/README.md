# Site content

Resume and project data is plain JSON in this folder. It is read **at build time**;
nothing is fetched while someone is browsing the site.

| File | Edited by | What's in it |
| --- | --- | --- |
| `linkedin.json` | `pnpm content:fetch` (don't hand-edit) | Positions, education, volunteering, projects, skills, languages, certifications, honors and courses, as LinkedIn has them. |
| `site.json` | you | Site-only data LinkedIn has no field for. See below. |

## Refreshing from LinkedIn

```bash
# Works for every account: Settings → Data privacy → Get a copy of your data.
LINKEDIN_EXPORT=~/Downloads/Basic_LinkedInDataExport_10-06-2026.zip pnpm content:fetch

# Only for accounts in the EEA / Switzerland (DMA Member Data Portability API):
LINKEDIN_DMA_TOKEN=... pnpm content:fetch
```

The script prints a summary and does nothing if the data hasn't changed. It
refuses to overwrite a snapshot that has positions with one that has none
(`--force` to override). It also warns when a `site.json` override no longer
matches any LinkedIn entry, for example after you rename a job title, and lists
the new ids to rename it to.

With no LinkedIn source configured, the command is a no-op and the committed
`linkedin.json` is used as-is, so builds never need LinkedIn credentials.

## `site.json`

```jsonc
{
  "contact": { "email": "...", "github": "...", "linkedin": "..." },

  // Extra fields for entries derived from LinkedIn, keyed by entry id.
  // id = slug of "<company> <title>" (positions), "<school> <degree>" (education),
  //      "<organization> <role>" (volunteering)
  "entries": {
    "job-unicorn-software-engineering-intern": {
      "technologies": ["TypeScript", "Go"],
      "relatedProjects": ["job-unicorn-platform"],   // project ids
      "previewItems": [{ "title": "...", "link": "...", "image": "/content/images/x.png" }],
      "hidden": false                                  // hide without touching LinkedIn
      // any of: title, organization, location, startDate, endDate, details, category, gpa, field, degree
    }
  },

  // Projects shown on /projects (and on /resume when showInResume is true).
  // A LinkedIn project whose slugified title equals an id here is merged underneath it;
  // LinkedIn projects without a match are appended with category "personal".
  "projects": [{ "id": "zkare", "category": "hackathon", "githubUrl": "...", "showInResume": true }],

  // How skills are grouped on /resume. LinkedIn skills not listed here go to
  // `ungroupedSkillsSection` (omit it to drop them); LinkedIn languages, with
  // proficiency, go to `languagesSection`.
  "skillSections": [{ "id": "programming-languages", "title": "Programming Languages", "skills": ["Python"] }],
  "languagesSection": { "id": "languages", "title": "Languages" },
  "ungroupedSkillsSection": { "id": "other-skills", "title": "Other Skills" }
}
```

Dates are `"YYYY-MM"`, or `null` for "Present".

## Migrating from Sanity (one-time)

The committed data was seeded from the old `src/lib/data/*.data.ts`. To bring
over what is currently in Sanity, including preview images (downloaded into
`static/content/images`):

```bash
SANITY_PROJECT_ID=wt0c9f6z SANITY_DATASET=production SANITY_TOKEN=... pnpm content:migrate-sanity
git diff content static/content
```
