// linkedin-sync: notices LinkedIn profile changes and, once they have settled for
// DEBOUNCE_MINUTES (2 h by default), asks GitHub to rebuild and redeploy the portfolio.
//
// LinkedIn has no "profile changed" webhook, so changes are signalled in three ways:
//   POST /hook           anything that can make an HTTP call (iOS Shortcut, email rule, curl)
//   PUT  /export         upload a fresh LinkedIn data-export ZIP (stored in R2 for CI to build from)
//   cron (hourly)        if LINKEDIN_DMA_TOKEN is set (EEA/CH accounts only), hash the official
//                        Member Snapshot API data and signal when it changes
//
// All signals go to one Durable Object, whose alarm is the debounce timer. When it fires, the
// worker sends `repository_dispatch: content-changed`, which runs .github/workflows/content-release.yml.

import { DurableObject } from 'cloudflare:workers';
import * as debounce from './debounce';
import { snapshotFingerprint } from './linkedin';

export interface Env {
	DEBOUNCER: DurableObjectNamespace<Debouncer>;
	/** Optional: holds uploaded LinkedIn exports. */
	EXPORTS?: R2Bucket;

	/** Bearer token for /hook, /flush, /status and PUT /export. */
	HOOK_SECRET: string;
	/** Optional separate read-only token CI uses for GET /export (falls back to HOOK_SECRET). */
	EXPORT_READ_TOKEN?: string;
	/** Fine-grained PAT for GITHUB_REPO with "Contents: read and write" (needed for repository_dispatch). */
	GITHUB_TOKEN: string;
	GITHUB_REPO: string;
	/** Override for tests; defaults to https://api.github.com. */
	GITHUB_API_URL?: string;
	DEBOUNCE_MINUTES?: string;
	MAX_WAIT_MINUTES?: string;
	/** Optional: DMA Member Data Portability token (EEA/CH accounts only). */
	LINKEDIN_DMA_TOKEN?: string;
}

const EXPORT_KEY = 'exports/latest.zip';

// ---------------------------------------------------------------------------
// Durable Object: one instance ("profile") owns the debounce timer
// ---------------------------------------------------------------------------

export class Debouncer extends DurableObject<Env> {
	private config(): debounce.DebounceConfig {
		const minutes = (v: string | undefined, fallback: number) => {
			const n = Number(v);
			return (Number.isFinite(n) && n > 0 ? n : fallback) * 60_000;
		};
		return {
			debounceMs: minutes(this.env.DEBOUNCE_MINUTES, 120),
			maxWaitMs: minutes(this.env.MAX_WAIT_MINUTES, 24 * 60)
		};
	}

	async signal(reason: string) {
		return debounce.signal(this.ctx.storage, this.config(), reason, Date.now());
	}

	async status() {
		return debounce.status(this.ctx.storage);
	}

	/** Returns true (and signals) when `value` differs from the last fingerprint stored under `key`. */
	async signalIfChanged(key: string, value: string, reason: string, firstIsChange = false) {
		if (!(await debounce.fingerprintChanged(this.ctx.storage, key, value, firstIsChange))) return null;
		return this.signal(reason);
	}

	/** Dispatch now instead of waiting for the debounce window. */
	async flush() {
		return debounce.fire(this.ctx.storage, (p) => dispatch(this.env, p), Date.now());
	}

	async alarm() {
		await debounce.fire(this.ctx.storage, (p) => dispatch(this.env, p), Date.now());
	}
}

async function dispatch(env: Env, pending: debounce.PendingDeploy): Promise<string> {
	const res = await fetch(`${env.GITHUB_API_URL ?? 'https://api.github.com'}/repos/${env.GITHUB_REPO}/dispatches`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.GITHUB_TOKEN}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28',
			'User-Agent': 'linkedin-sync-worker'
		},
		body: JSON.stringify({
			event_type: 'content-changed',
			client_payload: {
				reason: [...new Set(pending.reasons)].join(', '),
				signals: pending.signals,
				pendingSince: new Date(pending.pendingSince).toISOString()
			}
		})
	});
	if (res.status !== 204) {
		throw new Error(`GitHub repository_dispatch failed: ${res.status} ${await res.text()}`);
	}
	return `repository_dispatch sent to ${env.GITHUB_REPO}`;
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

const encoder = new TextEncoder();

function tokenMatches(provided: string | null, expected: string | undefined): boolean {
	if (!provided || !expected) return false;
	const a = encoder.encode(provided);
	const b = encoder.encode(expected);
	return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

function bearer(request: Request, url: URL): string | null {
	const header = request.headers.get('Authorization');
	if (header?.startsWith('Bearer ')) return header.slice(7);
	// For webhook senders that can't set headers.
	return url.searchParams.get('token');
}

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body, null, 2), {
		status,
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
	});

function debouncer(env: Env) {
	return env.DEBOUNCER.get(env.DEBOUNCER.idFromName('profile'));
}

async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
	const bytes = typeof data === 'string' ? encoder.encode(data) : data;
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function handle(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const token = bearer(request, url);
	const route = `${request.method} ${url.pathname}`;

	if (route === 'GET /') {
		return json({ service: 'linkedin-sync', endpoints: ['POST /hook', 'POST /flush', 'GET /status', 'PUT /export', 'GET /export'] });
	}

	// CI downloads the latest export with a read-only token.
	if (route === 'GET /export') {
		if (!tokenMatches(token, env.EXPORT_READ_TOKEN) && !tokenMatches(token, env.HOOK_SECRET)) {
			return json({ error: 'unauthorized' }, 401);
		}
		const object = await env.EXPORTS?.get(EXPORT_KEY);
		if (!object) return json({ error: 'no export uploaded yet' }, 404);
		return new Response(object.body, {
			headers: {
				'Content-Type': 'application/zip',
				'Cache-Control': 'no-store',
				'Last-Modified': object.uploaded.toUTCString()
			}
		});
	}

	if (!tokenMatches(token, env.HOOK_SECRET)) return json({ error: 'unauthorized' }, 401);

	switch (route) {
		case 'POST /hook': {
			const body = (await request.json().catch(() => ({}))) as { reason?: unknown };
			const reason = typeof body.reason === 'string' && body.reason ? body.reason.slice(0, 200) : 'webhook';
			const { firesAt, pending } = await debouncer(env).signal(reason);
			return json({ scheduled: new Date(firesAt).toISOString(), signals: pending.signals }, 202);
		}

		case 'POST /flush': {
			const record = await debouncer(env).flush();
			return json(record ?? { message: 'nothing pending' });
		}

		case 'GET /status':
			return json(await debouncer(env).status());

		case 'PUT /export':
		case 'POST /export': {
			if (!env.EXPORTS) return json({ error: 'EXPORTS R2 bucket is not bound' }, 501);
			const zip = await request.arrayBuffer();
			// ZIP files start with "PK\x03\x04".
			const magic = new Uint8Array(zip, 0, Math.min(4, zip.byteLength));
			if (magic[0] !== 0x50 || magic[1] !== 0x4b) return json({ error: 'expected a .zip body' }, 400);

			await env.EXPORTS.put(EXPORT_KEY, zip, { httpMetadata: { contentType: 'application/zip' } });
			// Re-uploading the same file is not a change. (The ZIP bytes are a good-enough proxy:
			// every new export from LinkedIn differs.)
			const result = await debouncer(env).signalIfChanged('export', await sha256Hex(zip), 'linkedin export uploaded', true);
			return json(
				result
					? { stored: true, scheduled: new Date(result.firesAt).toISOString() }
					: { stored: true, scheduled: null, message: 'same export as last time; nothing scheduled' },
				202
			);
		}
	}

	return json({ error: 'not found' }, 404);
}

export default {
	fetch: (request, env) => handle(request, env),

	async scheduled(_controller, env, ctx) {
		if (!env.LINKEDIN_DMA_TOKEN) return;
		ctx.waitUntil(
			(async () => {
				const fingerprint = await sha256Hex(await snapshotFingerprint(env.LINKEDIN_DMA_TOKEN!));
				await debouncer(env).signalIfChanged('dma', fingerprint, 'linkedin profile changed');
			})()
		);
	}
} satisfies ExportedHandler<Env>;
