// Fingerprints the profile data from LinkedIn's DMA Member Snapshot API, so the hourly cron can
// tell whether anything changed. Only works for members in the EEA / Switzerland.
// https://learn.microsoft.com/linkedin/dma/member-data-portability/shared/member-snapshot-api

/** The domains the site renders (same list as scripts/content/linkedin.ts). */
const DOMAINS = [
	'PROFILE',
	'POSITIONS',
	'EDUCATION',
	'VOLUNTEERING_EXPERIENCES',
	'PROJECTS',
	'SKILLS',
	'LANGUAGES',
	'CERTIFICATIONS',
	'HONORS',
	'COURSES'
] as const;

type Row = Record<string, unknown>;

async function fetchDomain(token: string, domain: string): Promise<Row[]> {
	const rows: Row[] = [];
	for (let start = 0; start < 100; start++) {
		const res = await fetch(
			`https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=${domain}&start=${start}`,
			{ headers: { Authorization: `Bearer ${token}`, 'Linkedin-Version': '202312' } }
		);
		const body = (await res.json().catch(() => ({}))) as {
			message?: string;
			paging?: { links?: { rel: string }[] };
			elements?: { snapshotData?: Row[] }[];
		};
		if (!res.ok) {
			if (res.status === 404 || /no data found/i.test(body.message ?? '')) break;
			throw new Error(`Snapshot API ${domain} failed: ${res.status} ${body.message ?? ''}`);
		}
		for (const el of body.elements ?? []) rows.push(...(el.snapshotData ?? []));
		if (!body.paging?.links?.some((l) => l.rel === 'next')) break;
	}
	return rows;
}

/** Key order inside rows isn't guaranteed, so serialise them canonically. */
function canonical(value: unknown): string {
	if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
	if (value && typeof value === 'object') {
		return `{${Object.keys(value)
			.sort()
			.map((k) => `${JSON.stringify(k)}:${canonical((value as Row)[k])}`)
			.join(',')}}`;
	}
	return JSON.stringify(value);
}

export async function snapshotFingerprint(token: string): Promise<string> {
	const data: Record<string, string[]> = {};
	for (const domain of DOMAINS) {
		// Row order isn't meaningful either; sort so reordering alone doesn't trigger a deploy.
		data[domain] = (await fetchDomain(token, domain)).map(canonical).sort();
	}
	return canonical(data);
}
