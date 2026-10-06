import { json } from '@sveltejs/kit';
import { getNowPlaying } from '$lib/server/spotify';
import type { NowPlaying } from '$lib/interfaces/spotify.interface';
import type { RequestHandler } from './$types';

// The one dynamic route: everything else is prerendered.
export const prerender = false;

const TTL_MS = 15_000;
let cached: { body: NowPlaying; at: number } | null = null;

export const GET: RequestHandler = async () => {
	if (!cached || Date.now() - cached.at > TTL_MS) {
		try {
			cached = { body: await getNowPlaying(), at: Date.now() };
		} catch (error) {
			console.error('Failed to get current or recent track:', error);
			return json({ currentTrack: null } satisfies NowPlaying, {
				headers: { 'Cache-Control': 'no-store' }
			});
		}
	}

	return json(cached.body, {
		headers: { 'Cache-Control': `public, max-age=${TTL_MS / 1000}` }
	});
};
