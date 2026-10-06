// One-time export of the Sanity dataset into content/, so nothing curated there is lost when
// Sanity goes away. Run it once, review the diff, commit, and then delete the Sanity project.
//
//   SANITY_PROJECT_ID=... SANITY_DATASET=production SANITY_TOKEN=... pnpm content:migrate-sanity
//
// Writes:
//   content/site.json      projects, entry overrides (tech, previews, related projects), skills, contact
//   content/linkedin.json  positions / education / volunteering as Sanity has them (source "sanity"),
//                          so the site keeps rendering exactly the same until the first LinkedIn fetch
//   static/content/images  every preview image, so nothing points at cdn.sanity.io any more

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import type {
	EntryOverride,
	LinkedInSnapshot,
	PreviewItem,
	SiteContent,
	SiteProject
} from '../../src/lib/content/types.ts';
import { slugify } from '../../src/lib/content/util.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const IMAGE_DIR = join(ROOT, 'static/content/images');

const { SANITY_PROJECT_ID, SANITY_DATASET = 'production', SANITY_TOKEN } = process.env;
if (!SANITY_PROJECT_ID) throw new Error('SANITY_PROJECT_ID is required');

const QUERY = `{
  "projects": *[_type == "project"]{
    ..., "identifier": identifier.current,
    previewItems[]{ title, link, "image": image.asset->url }
  },
  "entries": *[_type == "resumeEntry"]{
    ..., "identifier": identifier.current,
    "relatedProjects": relatedProjects[]->identifier.current,
    previewItems[]{ title, link, "image": image.asset->url }
  },
  "skills": *[_type == "skillSection"]{ title, skills[]{ name, proficiency } },
  "contact": *[_type == "contact"][0]
}`;

type SanityPreview = { title: string; link: string; image?: string | null };
type SanityDoc = Record<string, any> & { previewItems?: SanityPreview[] };

async function query(): Promise<{
	projects: SanityDoc[];
	entries: SanityDoc[];
	skills: { title: string; skills?: { name: string; proficiency?: string }[] }[];
	contact: SanityDoc | null;
}> {
	const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-08-09/data/query/${SANITY_DATASET}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : {})
		},
		body: JSON.stringify({ query: QUERY })
	});
	if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
	return (await res.json()).result;
}

/** Sanity stores "YYYY-MM-DD" and uses 9999-12-31 for "present". */
function month(value?: string | null): string | null {
	if (!value || value.startsWith('9999')) return null;
	return value.slice(0, 7);
}

async function localImage(url: string | null | undefined): Promise<string | undefined> {
	if (!url) return undefined;
	const name = basename(new URL(url).pathname);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Downloading ${url} failed: ${res.status}`);
	writeFileSync(join(IMAGE_DIR, name), new Uint8Array(await res.arrayBuffer()));
	return `/content/images/${name}`;
}

async function previews(items?: SanityPreview[]): Promise<PreviewItem[] | undefined> {
	if (!items?.length) return undefined;
	return Promise.all(
		items.map(async (p) => {
			const image = await localImage(p.image);
			return { title: p.title, link: p.link, ...(image ? { image } : {}) };
		})
	);
}

const bullets = (details?: string[]) => (details ?? []).map((d) => `• ${d}`).join('\n') || undefined;

async function main() {
	mkdirSync(IMAGE_DIR, { recursive: true });
	const data = await query();

	const projects: SiteProject[] = [];
	for (const p of data.projects) {
		projects.push({
			id: p.identifier ?? slugify(p.title),
			title: p.title,
			organization: p.organization,
			location: p.location,
			category: p.category,
			startDate: month(p.startDate),
			endDate: month(p.endDate),
			description: p.description,
			details: p.details,
			technologies: p.technologies,
			githubUrl: p.githubUrl,
			showInResume: p.showInResume ?? false,
			previewItems: await previews(p.previewItems)
		});
	}

	const snapshot: LinkedInSnapshot = {
		source: 'sanity',
		fetchedAt: new Date().toISOString(),
		profile: {
			firstName: data.contact?.name?.split(' ')[0] ?? '',
			lastName: data.contact?.name?.split(' ').slice(1).join(' ') ?? '',
			headline: data.contact?.title,
			location: data.contact?.location
		},
		positions: [],
		education: [],
		volunteering: [],
		projects: [],
		skills: [],
		languages: [],
		certifications: [],
		honors: [],
		courses: []
	};

	const entries: Record<string, EntryOverride> = {};
	for (const e of data.entries) {
		const startDate = month(e.startDate);
		const endDate = month(e.endDate);
		const override: EntryOverride = {
			technologies: e.technologies,
			previewItems: await previews(e.previewItems),
			relatedProjects: e.relatedProjects?.filter(Boolean),
			gpa: e.gpa,
			field: e.field
		};

		let id: string;
		if (e.category === 'education') {
			const degree = e.degree || e.title;
			id = slugify(`${e.organization} ${degree}`);
			snapshot.education.push({ id, school: e.organization, degree, notes: bullets(e.details), startDate, endDate });
			if (e.title !== degree) override.title = e.title;
			override.degree = e.degree;
			override.location = e.location;
		} else if (e.category === 'volunteering') {
			id = slugify(`${e.organization} ${e.title}`);
			snapshot.volunteering.push({ id, role: e.title, organization: e.organization, description: bullets(e.details), startDate, endDate });
			override.location = e.location;
		} else {
			id = slugify(`${e.organization} ${e.title}`);
			snapshot.positions.push({ id, title: e.title, company: e.organization, location: e.location, description: bullets(e.details), startDate, endDate });
			if (e.category && e.category !== 'work-experience') override.category = e.category;
		}

		const clean = Object.fromEntries(Object.entries(override).filter(([, v]) => v !== undefined && !(Array.isArray(v) && !v.length)));
		if (Object.keys(clean).length) entries[id] = clean;
	}

	const site: SiteContent = {
		contact: {
			name: data.contact?.name,
			title: data.contact?.title,
			email: data.contact?.email,
			phone: data.contact?.phone,
			location: data.contact?.location,
			website: data.contact?.website,
			linkedin: data.contact?.linkedin,
			github: data.contact?.github
		},
		entries,
		projects,
		skillSections: [],
		ungroupedSkillsSection: { id: 'other-skills', title: 'Other Skills' }
	};

	for (const section of data.skills) {
		const skills = section.skills ?? [];
		if (skills.some((s) => s.proficiency)) {
			// Languages come from LinkedIn (with proficiency) from now on.
			site.languagesSection = { id: slugify(section.title), title: section.title };
			snapshot.languages.push(...skills.map((s) => ({ name: s.name, proficiency: s.proficiency as any })));
		} else {
			site.skillSections.push({ id: slugify(section.title), title: section.title, skills: skills.map((s) => s.name) });
			snapshot.skills.push(...skills.map((s) => s.name));
		}
	}

	writeFileSync(join(ROOT, 'content/site.json'), JSON.stringify(site, null, '\t') + '\n');
	writeFileSync(join(ROOT, 'content/linkedin.json'), JSON.stringify(snapshot, null, '\t') + '\n');
	console.log(
		`Migrated ${projects.length} projects, ${data.entries.length} resume entries and ` +
			`${data.skills.length} skill sections. Review with \`git diff content static/content\`.`
	);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
