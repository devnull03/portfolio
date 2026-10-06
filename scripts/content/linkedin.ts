// Turns LinkedIn's tabular data into content/linkedin.json.
//
// The data export ZIP (Positions.csv, Education.csv, ...) and the DMA Member Snapshot API
// (snapshotData rows per domain) use the same column names, so both providers feed this one
// normalizer with `Record<string, string>` rows grouped by domain.

import type {
	LanguageProficiency,
	LinkedInSnapshot
} from '../../src/lib/content/types.ts';
import { parseLinkedInDate, slugify } from '../../src/lib/content/util.ts';

export type Row = Record<string, string>;

/** Snapshot API domain -> export file name and a header that identifies it. */
export const DOMAINS = {
	PROFILE: { file: 'Profile.csv', header: 'First Name' },
	POSITIONS: { file: 'Positions.csv', header: 'Company Name' },
	EDUCATION: { file: 'Education.csv', header: 'School Name' },
	VOLUNTEERING_EXPERIENCES: { file: 'Volunteering.csv', header: 'Role' },
	PROJECTS: { file: 'Projects.csv', header: 'Title' },
	SKILLS: { file: 'Skills.csv', header: 'Name' },
	LANGUAGES: { file: 'Languages.csv', header: 'Name' },
	CERTIFICATIONS: { file: 'Certifications.csv', header: 'Name' },
	HONORS: { file: 'Honors.csv', header: 'Title' },
	COURSES: { file: 'Courses.csv', header: 'Name' }
} as const;

export type Domain = keyof typeof DOMAINS;
export type DomainRows = Partial<Record<Domain, Row[]>>;

/** Read the first non-empty value among several possible column names. */
function pick(row: Row, ...keys: string[]): string | undefined {
	for (const k of keys) {
		const v = row[k]?.trim();
		if (v) return v;
	}
	return undefined;
}

function proficiency(value: string | undefined): LanguageProficiency | undefined {
	const v = value?.toLowerCase() ?? '';
	if (!v) return undefined;
	if (v.includes('native') || v.includes('bilingual')) return 'Native';
	if (v.includes('full professional') || v.includes('professional working')) return 'Fluent';
	if (v.includes('limited working')) return 'Conversational';
	return 'Basic';
}

/** Keep ids stable when two rows would collide (same company + title held twice). */
function uniqueIds<T extends { id: string }>(items: T[]): T[] {
	const seen = new Map<string, number>();
	return items.map((item) => {
		const n = seen.get(item.id) ?? 0;
		seen.set(item.id, n + 1);
		return n ? { ...item, id: `${item.id}-${n + 1}` } : item;
	});
}

export function normalize(rows: DomainRows, source: string): LinkedInSnapshot {
	const profile = rows.PROFILE?.[0] ?? {};

	return {
		source,
		fetchedAt: new Date().toISOString(),
		profile: {
			firstName: pick(profile, 'First Name') ?? '',
			lastName: pick(profile, 'Last Name') ?? '',
			headline: pick(profile, 'Headline'),
			summary: pick(profile, 'Summary'),
			location: pick(profile, 'Geo Location', 'Location'),
			websites: (pick(profile, 'Websites') ?? '')
				.replace(/^\[|\]$/g, '')
				.split(',')
				.map((w) => w.replace(/^[A-Z_]+:/, '').trim())
				.filter(Boolean)
		},
		positions: uniqueIds(
			(rows.POSITIONS ?? []).map((r) => {
				const company = pick(r, 'Company Name') ?? '';
				const title = pick(r, 'Title') ?? '';
				return {
					id: slugify(`${company} ${title}`),
					title,
					company,
					location: pick(r, 'Location'),
					description: pick(r, 'Description'),
					startDate: parseLinkedInDate(pick(r, 'Started On')),
					endDate: parseLinkedInDate(pick(r, 'Finished On'))
				};
			})
		),
		education: uniqueIds(
			(rows.EDUCATION ?? []).map((r) => {
				const school = pick(r, 'School Name') ?? '';
				const degree = pick(r, 'Degree Name');
				return {
					id: slugify(`${school} ${degree ?? ''}`),
					school,
					degree,
					notes: pick(r, 'Notes'),
					activities: pick(r, 'Activities'),
					startDate: parseLinkedInDate(pick(r, 'Start Date', 'Started On')),
					endDate: parseLinkedInDate(pick(r, 'End Date', 'Finished On'))
				};
			})
		),
		volunteering: uniqueIds(
			(rows.VOLUNTEERING_EXPERIENCES ?? []).map((r) => {
				const organization = pick(r, 'Company Name', 'Organization') ?? '';
				const role = pick(r, 'Role') ?? '';
				return {
					id: slugify(`${organization} ${role}`),
					role,
					organization,
					cause: pick(r, 'Cause'),
					description: pick(r, 'Description'),
					startDate: parseLinkedInDate(pick(r, 'Started On')),
					endDate: parseLinkedInDate(pick(r, 'Finished On'))
				};
			})
		),
		projects: uniqueIds(
			(rows.PROJECTS ?? []).map((r) => {
				const title = pick(r, 'Title') ?? '';
				return {
					id: slugify(title),
					title,
					description: pick(r, 'Description'),
					url: pick(r, 'Url', 'URL'),
					startDate: parseLinkedInDate(pick(r, 'Started On')),
					endDate: parseLinkedInDate(pick(r, 'Finished On'))
				};
			})
		),
		skills: (rows.SKILLS ?? []).map((r) => pick(r, 'Name')).filter((s): s is string => !!s),
		languages: (rows.LANGUAGES ?? [])
			.map((r) => ({ name: pick(r, 'Name') ?? '', proficiency: proficiency(pick(r, 'Proficiency')) }))
			.filter((l) => l.name),
		certifications: (rows.CERTIFICATIONS ?? []).map((r) => ({
			name: pick(r, 'Name') ?? '',
			authority: pick(r, 'Authority'),
			url: pick(r, 'Url', 'URL'),
			startDate: parseLinkedInDate(pick(r, 'Started On')),
			endDate: parseLinkedInDate(pick(r, 'Finished On'))
		})),
		honors: (rows.HONORS ?? []).map((r) => ({
			title: pick(r, 'Title') ?? '',
			description: pick(r, 'Description'),
			issuedOn: parseLinkedInDate(pick(r, 'Issued On'))
		})),
		courses: (rows.COURSES ?? []).map((r) => ({
			name: pick(r, 'Name') ?? '',
			number: pick(r, 'Number')
		}))
	};
}
