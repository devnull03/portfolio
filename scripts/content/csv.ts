// Minimal RFC 4180 CSV parser. LinkedIn exports quote multi-line descriptions, so splitting on
// newlines is not enough.

export function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = '';
	let quoted = false;

	const src = text.replace(/^﻿/, '');
	for (let i = 0; i < src.length; i++) {
		const c = src[i];
		if (quoted) {
			if (c === '"') {
				if (src[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					quoted = false;
				}
			} else {
				field += c;
			}
		} else if (c === '"') {
			quoted = true;
		} else if (c === ',') {
			row.push(field);
			field = '';
		} else if (c === '\n' || c === '\r') {
			if (c === '\r' && src[i + 1] === '\n') i++;
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
		} else {
			field += c;
		}
	}
	if (field !== '' || row.length) {
		row.push(field);
		rows.push(row);
	}
	return rows.filter((r) => r.some((f) => f.trim() !== ''));
}

/**
 * Parse a CSV into objects keyed by header. Some LinkedIn exports start with a "Notes:" preamble,
 * so the header is the first row that contains `expectedHeader`.
 */
export function csvToRecords(text: string, expectedHeader: string): Record<string, string>[] {
	const rows = parseCsv(text);
	const headerIndex = rows.findIndex((r) => r.includes(expectedHeader));
	if (headerIndex === -1) return [];
	const header = rows[headerIndex].map((h) => h.trim());
	return rows.slice(headerIndex + 1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}
