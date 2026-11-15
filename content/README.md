# Site content

Resume and project data is plain JSON in this folder. It is read **at build time**;
nothing is fetched while someone is browsing the site.

| File | What's in it |
| --- | --- |
| `linkedin.json` | Positions, education, volunteering, skills, languages, certifications, honors and courses. The schema mirrors LinkedIn's data export (it used to be generated from it), but the file is now edited by hand. |
| `site.json` | Site-only data: projects, skill groups, contact details, and per-entry extras (technologies, related projects, preview images, overrides). See below. |

Edit either file, push to `main`, and Cloudflare Workers Builds rebuilds and deploys the site.
An entry's id is the slug its `site.json` overrides are keyed by, so keep ids stable when you
rename a title.

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
