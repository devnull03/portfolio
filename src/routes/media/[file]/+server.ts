import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Workers static assets ignore `Range` (always 200 + the whole file), and Safari won't play a
// <video> unless the server answers byte-range requests with 206. So videos are served through
// this route, which reads the file from static/assets and returns just the requested bytes.
export const prerender = false;

type Assets = { fetch(input: Request | URL | string): Promise<Response> };

const CACHE = 'public, max-age=604800, stale-while-revalidate=86400';

export const GET: RequestHandler = async ({ params, request, platform, url, fetch }) => {
	if (!/^[\w-]+\.mp4$/.test(params.file)) error(404);

	const assetUrl = new URL(`/assets/${params.file}`, url);
	const assets = (platform as { env?: { ASSETS?: Assets } } | undefined)?.env?.ASSETS;
	// `vite dev` has no ASSETS binding; it serves static/ itself.
	const res = assets ? await assets.fetch(assetUrl) : await fetch(assetUrl);
	if (!res.ok || !res.body) error(res.status === 404 ? 404 : 502);

	let body: ReadableStream<Uint8Array> = res.body;
	let size = Number(res.headers.get('content-length') || NaN);
	// A cold asset fetch can arrive without Content-Length. A range can't be answered without the
	// size (and Safari's first probe is `bytes=0-1`), so read it out in that case.
	if (!Number.isFinite(size) && request.headers.has('range')) {
		const bytes = new Uint8Array(await res.arrayBuffer());
		size = bytes.byteLength;
		body = new Response(bytes).body!;
	}

	const headers = new Headers({
		'Content-Type': 'video/mp4',
		'Accept-Ranges': 'bytes',
		'Cache-Control': CACHE
	});
	const etag = res.headers.get('etag');
	if (etag) headers.set('ETag', etag);

	const range = parseRange(request.headers.get('range'), size);
	if (range === null || !Number.isFinite(size) || size <= 0) {
		if (Number.isFinite(size) && size > 0) headers.set('Content-Length', String(size));
		return new Response(body, { status: 200, headers });
	}
	if (range === 'unsatisfiable') {
		body.cancel();
		headers.set('Content-Range', `bytes */${size}`);
		return new Response(null, { status: 416, headers });
	}

	const [start, end] = range;
	headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
	headers.set('Content-Length', String(end - start + 1));
	return new Response(sliceStream(body, start, end), { status: 206, headers });
};

/** Parses a single `bytes=` range. null = serve the whole file. */
function parseRange(header: string | null, size: number): [number, number] | 'unsatisfiable' | null {
	const m = header?.match(/^bytes=(\d*)-(\d*)$/);
	if (!m || (m[1] === '' && m[2] === '')) return null;

	let start: number;
	let end: number;
	if (m[1] === '') {
		// Suffix range: the last N bytes.
		const n = Number(m[2]);
		if (n === 0) return 'unsatisfiable';
		start = Math.max(0, size - n);
		end = size - 1;
	} else {
		start = Number(m[1]);
		end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
	}
	if (start >= size || start > end) return 'unsatisfiable';
	return [start, end];
}

/** Streams bytes [start, end] of `body` without buffering the whole file. */
function sliceStream(body: ReadableStream<Uint8Array>, start: number, end: number) {
	const reader = body.getReader();
	let pos = 0;
	return new ReadableStream<Uint8Array>({
		async pull(controller) {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) return controller.close();
				const chunkStart = pos;
				pos += value.byteLength;
				if (pos <= start) continue;
				controller.enqueue(
					value.subarray(Math.max(0, start - chunkStart), Math.min(value.byteLength, end + 1 - chunkStart))
				);
				if (pos > end) {
					await reader.cancel();
					controller.close();
				}
				return;
			}
		},
		cancel(reason) {
			return reader.cancel(reason);
		}
	});
}
