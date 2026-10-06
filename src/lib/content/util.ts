// Shared by the SvelteKit app and the Node scripts in scripts/content, so this file must stay
// dependency-free and import nothing.

export function slugify(value: string): string {
	return value
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const MONTHS: Record<string, string> = {
	jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
	jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

/**
 * Parse the date formats LinkedIn uses ("Aug 2022", "August 2022", "2022", "2022-08",
 * "08/2022") into "YYYY-MM" or "YYYY". Returns null for empty / "Present".
 */
export function parseLinkedInDate(value: string | null | undefined): string | null {
	const v = value?.trim();
	if (!v || /^present$/i.test(v)) return null;

	let m = v.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
	if (m) return `${m[1]}-${m[2].padStart(2, '0')}`;

	m = v.match(/^(\d{1,2})\/(\d{4})$/);
	if (m) return `${m[2]}-${m[1].padStart(2, '0')}`;

	m = v.match(/^([A-Za-z]{3,})\.?\s+(\d{4})/);
	if (m) {
		const month = MONTHS[m[1].slice(0, 3).toLowerCase()];
		if (month) return `${m[2]}-${month}`;
	}

	m = v.match(/^(\d{4})$/);
	if (m) return m[1];

	return null;
}

/** "YYYY-MM" / "YYYY" -> "YYYY-MM-01" / "YYYY-01-01". */
export function toIsoDate(value: string | null | undefined): string | undefined {
	if (!value) return undefined;
	const [year, month = '01', day = '01'] = value.split('-');
	return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const BULLET = /^\s*(?:[•●▪◦‣∙·*–—-]|\d+[.)])\s+/;

/** Split a LinkedIn free-text description into bullet points, one per non-empty line. */
export function splitDetails(description: string | null | undefined): string[] {
	if (!description) return [];
	return description
		.split(/\r?\n/)
		.map((line) => line.replace(BULLET, '').trim())
		.filter(Boolean);
}
