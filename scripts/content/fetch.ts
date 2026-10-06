// Refreshes content/linkedin.json from LinkedIn.
//
//   pnpm content:fetch                        # auto: dma if LINKEDIN_DMA_TOKEN, else export if LINKEDIN_EXPORT
//   pnpm content:fetch --provider export      # LINKEDIN_EXPORT=<zip | folder | https url>
//   pnpm content:fetch --provider dma         # LINKEDIN_DMA_TOKEN=<token>  (EEA/CH accounts only)
//   pnpm content:fetch --force                # overwrite even if the new snapshot lost all positions
//
// With no source configured it exits 0 and leaves the committed snapshot alone, so builds without
// LinkedIn credentials still work.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { unzipSync, strFromU8 } from 'fflate';
import type { LinkedInSnapshot, SiteContent } from '../../src/lib/content/types.ts';
import { csvToRecords } from './csv.ts';
import { DOMAINS, normalize, type Domain, type DomainRows, type Row } from './linkedin.ts';

const ROOT = resolve(import.meta.dirname, '../..');
const SNAPSHOT_PATH = join(ROOT, 'content/linkedin.json');
const SITE_PATH = join(ROOT, 'content/site.json');

const { values: args } = parseArgs({
	options: {
		provider: { type: 'string' },
		force: { type: 'boolean', default: false }
	}
});

// ---------------------------------------------------------------------------
// Provider: official data export (Settings -> Data privacy -> Get a copy of your data)
// ---------------------------------------------------------------------------

async function readExport(location: string): Promise<DomainRows> {
	const files = new Map<string, string>();

	if (/^https?:\/\//.test(location)) {
		const token = process.env.LINKEDIN_EXPORT_TOKEN;
		const res = await fetch(location, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
		if (!res.ok) throw new Error(`Downloading export failed: ${res.status} ${res.statusText}`);
		addZip(files, new Uint8Array(await res.arrayBuffer()));
	} else if (statSync(location).isDirectory()) {
		for (const name of readdirSync(location, { recursive: true }) as string[]) {
			if (name.toLowerCase().endsWith('.csv')) files.set(basename(name), readFileSync(join(location, name), 'utf8'));
		}
	} else {
		addZip(files, new Uint8Array(readFileSync(location)));
	}

	const rows: DomainRows = {};
	for (const [domain, { file, header }] of Object.entries(DOMAINS) as [Domain, (typeof DOMAINS)[Domain]][]) {
		const text = files.get(file);
		if (text) rows[domain] = csvToRecords(text, header);
	}
	return rows;
}

function addZip(files: Map<string, string>, zip: Uint8Array) {
	for (const [name, data] of Object.entries(unzipSync(zip))) {
		if (name.toLowerCase().endsWith('.csv')) files.set(basename(name), strFromU8(data));
	}
}

// ---------------------------------------------------------------------------
// Provider: DMA Member Snapshot API (only for members in the EEA / Switzerland)
// https://learn.microsoft.com/linkedin/dma/member-data-portability/shared/member-snapshot-api
// ---------------------------------------------------------------------------

async function readSnapshotApi(token: string): Promise<DomainRows> {
	const rows: DomainRows = {};
	for (const domain of Object.keys(DOMAINS) as Domain[]) {
		rows[domain] = await fetchSnapshotDomain(token, domain);
	}
	return rows;
}

async function fetchSnapshotDomain(token: string, domain: Domain): Promise<Row[]> {
	const out: Row[] = [];
	// The API paginates by page index; `total` is unreliable, so follow `next` links until LinkedIn
	// says there is no more data.
	for (let start = 0; start < 100; start++) {
		const url = `https://api.linkedin.com/rest/memberSnapshotData?q=criteria&domain=${domain}&start=${start}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${token}`, 'Linkedin-Version': '202312' }
		});
		const body = (await res.json().catch(() => ({}))) as {
			message?: string;
			paging?: { links?: { rel: string }[] };
			elements?: { snapshotData?: Row[] }[];
		};
		if (!res.ok) {
			if (res.status === 404 || /no data found/i.test(body.message ?? '')) break;
			throw new Error(`Snapshot API ${domain} failed: ${res.status} ${body.message ?? ''}`);
		}
		for (const el of body.elements ?? []) out.push(...(el.snapshotData ?? []));
		if (!body.paging?.links?.some((l) => l.rel === 'next')) break;
	}
	return out;
}

// ---------------------------------------------------------------------------

function withoutTimestamp(s: LinkedInSnapshot) {
	return JSON.stringify({ ...s, fetchedAt: undefined });
}

/** Point out site.json overrides that no longer match anything, e.g. after a job title change. */
function reportOrphans(snapshot: LinkedInSnapshot) {
	const site = JSON.parse(readFileSync(SITE_PATH, 'utf8')) as SiteContent;
	const ids = new Set([
		...snapshot.positions.map((p) => p.id),
		...snapshot.education.map((e) => e.id),
		...snapshot.volunteering.map((v) => v.id)
	]);
	const orphans = Object.keys(site.entries).filter((id) => !ids.has(id));
	if (orphans.length) {
		console.warn(`\nsite.json has overrides for entries that are no longer on LinkedIn:`);
		for (const id of orphans) console.warn(`  - ${id}`);
		console.warn(`Rename the keys to match one of:\n${[...ids].map((id) => `  + ${id}`).join('\n')}\n`);
	}
}

async function main() {
	const dmaToken = process.env.LINKEDIN_DMA_TOKEN;
	const exportLocation = process.env.LINKEDIN_EXPORT;
	const provider = args.provider ?? (dmaToken ? 'dma' : exportLocation ? 'export' : undefined);

	if (!provider) {
		console.log('No LinkedIn source configured (LINKEDIN_DMA_TOKEN / LINKEDIN_EXPORT); keeping content/linkedin.json.');
		return;
	}

	let rows: DomainRows;
	if (provider === 'dma') {
		if (!dmaToken) throw new Error('LINKEDIN_DMA_TOKEN is not set');
		rows = await readSnapshotApi(dmaToken);
	} else if (provider === 'export') {
		if (!exportLocation) throw new Error('LINKEDIN_EXPORT is not set');
		rows = await readExport(exportLocation);
	} else {
		throw new Error(`Unknown provider "${provider}" (expected "dma" or "export")`);
	}

	const next = normalize(rows, provider);
	const previous = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as LinkedInSnapshot;

	// An empty response is far more likely to be an API or export problem than a wiped profile.
	if (!args.force && previous.positions.length && !next.positions.length) {
		throw new Error('New snapshot has no positions; refusing to overwrite. Re-run with --force if intended.');
	}

	reportOrphans(next);

	if (withoutTimestamp(next) === withoutTimestamp(previous)) {
		console.log('LinkedIn data unchanged.');
		return;
	}

	writeFileSync(SNAPSHOT_PATH, JSON.stringify(next, null, '\t') + '\n');
	console.log(
		`Updated content/linkedin.json from ${provider}: ${next.positions.length} positions, ` +
			`${next.education.length} education, ${next.volunteering.length} volunteering, ` +
			`${next.projects.length} projects, ${next.skills.length} skills, ${next.languages.length} languages.`
	);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
