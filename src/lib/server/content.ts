// Merges the LinkedIn snapshot with site-only data into what the pages render.
// Everything here runs at build time (or on the server); none of it ships to the browser.

import linkedinJson from '../../../content/linkedin.json';
import siteJson from '../../../content/site.json';
import type {
	Contact,
	ContentExtras,
	EntryCategory,
	EntryOverride,
	LinkedInSnapshot,
	PartialDate,
	Project,
	ResumeEntry,
	SiteContent,
	SiteProject,
	SkillSection
} from '$lib/content/types';
import { slugify, splitDetails, toIsoDate } from '$lib/content/util';

const linkedin = linkedinJson as LinkedInSnapshot;
const site = siteJson as SiteContent;

const ENTRY_ORDER: string[] = ['work-experience', 'education', 'volunteering'];
const PROJECT_ORDER: string[] = ['work-experience', 'personal', 'academic', 'freelance', 'hackathon'];

/** Newest first by end date, falling back to the start date for ongoing items. */
function byRecency(a: { startDate?: string; endDate?: string }, b: { startDate?: string; endDate?: string }) {
	const ka = a.endDate ?? a.startDate;
	const kb = b.endDate ?? b.startDate;
	if (ka === kb) return 0;
	if (ka === undefined) return 1;
	if (kb === undefined) return -1;
	return ka < kb ? 1 : -1;
}

function groupBy<T>(items: T[], key: (item: T) => string, order: string[]): Record<string, T[]> {
	const grouped: Record<string, T[]> = {};
	for (const item of items) (grouped[key(item)] ??= []).push(item);

	const ordered: Record<string, T[]> = {};
	for (const k of order) if (grouped[k]?.length) ordered[k] = grouped[k];
	for (const k of Object.keys(grouped)
		.filter((k) => !order.includes(k))
		.sort((a, b) => a.localeCompare(b)))
		ordered[k] = grouped[k];
	return ordered;
}

/** Copy only the keys that are actually set, so `undefined` in an override never erases data. */
function defined<T extends object>(value: T): Partial<T> {
	return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function date(value: PartialDate | undefined): string | undefined {
	return toIsoDate(value ?? undefined);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function toProject(p: SiteProject): Project {
	return {
		kind: 'project',
		id: p.id,
		category: p.category ?? 'personal',
		title: p.title ?? p.id,
		organization: p.organization,
		location: p.location,
		startDate: date(p.startDate),
		endDate: date(p.endDate),
		showInResume: p.showInResume ?? false,
		description: p.description,
		details: p.details ?? [],
		technologies: p.technologies,
		githubUrl: p.githubUrl,
		url: p.url,
		previewItems: p.previewItems
	};
}

function buildProjects(): Project[] {
	const fromLinkedIn = new Map<string, SiteProject>(
		linkedin.projects.map((p) => [
			p.id,
			{
				id: p.id,
				title: p.title,
				description: p.description,
				details: splitDetails(p.description),
				url: p.url,
				startDate: p.startDate,
				endDate: p.endDate
			}
		])
	);

	const merged: SiteProject[] = site.projects.map((p) => {
		const base = fromLinkedIn.get(p.id);
		fromLinkedIn.delete(p.id);
		return { ...base, ...defined(p), id: p.id };
	});
	// LinkedIn projects the site doesn't curate yet still show up, with defaults.
	merged.push(...fromLinkedIn.values());

	return merged
		.filter((p) => !p.hidden)
		.map(toProject)
		.sort(byRecency);
}

// ---------------------------------------------------------------------------
// Resume entries
// ---------------------------------------------------------------------------

interface BaseEntry {
	id: string;
	category: EntryCategory;
	title: string;
	organization: string;
	location?: string;
	startDate: PartialDate;
	endDate: PartialDate;
	description?: string;
	details: string[];
	degree?: string;
}

function linkedInEntries(): BaseEntry[] {
	return [
		...linkedin.positions.map((p) => ({
			id: p.id,
			category: 'work-experience' as const,
			title: p.title,
			organization: p.company,
			location: p.location,
			startDate: p.startDate,
			endDate: p.endDate,
			description: p.description,
			details: splitDetails(p.description)
		})),
		...linkedin.education.map((e) => ({
			id: e.id,
			category: 'education' as const,
			title: e.degree || e.school,
			organization: e.school,
			startDate: e.startDate,
			endDate: e.endDate,
			description: e.notes,
			details: [...splitDetails(e.notes), ...splitDetails(e.activities)],
			degree: e.degree
		})),
		...linkedin.volunteering.map((v) => ({
			id: v.id,
			category: 'volunteering' as const,
			title: v.role,
			organization: v.organization,
			startDate: v.startDate,
			endDate: v.endDate,
			description: v.description,
			details: splitDetails(v.description)
		}))
	];
}

function buildEntries(projects: Project[]): ResumeEntry[] {
	const projectsById = new Map(projects.map((p) => [p.id, p]));

	return linkedInEntries()
		.map((base): ResumeEntry | null => {
			const o: EntryOverride = site.entries[base.id] ?? {};
			if (o.hidden) return null;

			const startDate = date(o.startDate !== undefined ? o.startDate : base.startDate);
			const endDate = date(o.endDate !== undefined ? o.endDate : base.endDate);

			return {
				kind: 'entry',
				id: base.id,
				category: o.category ?? base.category,
				title: o.title ?? base.title,
				organization: o.organization ?? base.organization,
				location: o.location ?? base.location ?? '',
				startDate: startDate ?? '',
				endDate,
				description: base.description,
				details: o.details ?? base.details,
				technologies: o.technologies,
				previewItems: o.previewItems,
				relatedProjects: o.relatedProjects
					?.map((id) => projectsById.get(id))
					.filter((p): p is Project => p !== undefined),
				gpa: o.gpa,
				field: o.field,
				degree: o.degree ?? base.degree
			};
		})
		.filter((e): e is ResumeEntry => e !== null)
		.sort(byRecency);
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

function buildSkillSections(): SkillSection[] {
	const toSkill = (name: string) => ({ id: slugify(name), name });

	const grouped = new Set(site.skillSections.flatMap((s) => s.skills.map((n) => n.toLowerCase())));
	const ungrouped = linkedin.skills.filter((s) => !grouped.has(s.toLowerCase()));

	const sections: SkillSection[] = site.skillSections.map((s) => ({
		id: s.id,
		title: s.title,
		skills: s.skills.map(toSkill)
	}));

	if (site.ungroupedSkillsSection && ungrouped.length) {
		sections.push({ ...site.ungroupedSkillsSection, skills: ungrouped.map(toSkill) });
	}

	if (site.languagesSection && linkedin.languages.length) {
		sections.push({
			...site.languagesSection,
			skills: linkedin.languages.map((l) => ({ ...toSkill(l.name), proficiency: l.proficiency }))
		});
	}

	return sections.filter((s) => s.skills.length);
}

// ---------------------------------------------------------------------------
// Public API (mirrors the old Sanity queries)
// ---------------------------------------------------------------------------

const projects = buildProjects();
const entries = buildEntries(projects);
const skillSections = buildSkillSections();

const contact: Contact = {
	name: `${linkedin.profile.firstName} ${linkedin.profile.lastName}`.trim(),
	title: linkedin.profile.headline,
	email: '',
	location: linkedin.profile.location ?? '',
	...defined(site.contact)
};

export const getProjects = (): Project[] => projects;

export const getResumePageProjects = (): Project[] => projects.filter((p) => p.showInResume);

export const getProjectsByCategory = (): Record<string, Project[]> =>
	groupBy(projects, (p) => p.category, PROJECT_ORDER);

export const getResumeEntriesByCategory = (): Record<string, ResumeEntry[]> =>
	groupBy(entries, (e) => e.category, ENTRY_ORDER);

export const getSkillSections = (): SkillSection[] => skillSections;

export const getContactInfo = (): Contact => contact;

export const getExtras = (): ContentExtras => ({
	certifications: linkedin.certifications,
	honors: linkedin.honors,
	courses: linkedin.courses
});
