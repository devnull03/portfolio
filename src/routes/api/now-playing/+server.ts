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

	// no-store, not a short max-age: the zone's Browser Cache TTL (4h) raises any shorter max-age,
	// and the edge then serves that stale copy. The 15s in-isolate cache above already keeps
	// Spotify requests down.
	return json(withElapsed(cached.body, Date.now() - cached.at), {
		headers: { 'Cache-Control': 'no-store' }
	});
};

/** A cached "playing" response is up to TTL_MS old; move its progress forward by that much. */
function withElapsed(body: NowPlaying, elapsedMs: number): NowPlaying {
	const track = body.currentTrack;
	if (body.trackType !== 'current' || !track?.isPlaying || track.progress == null) return body;
	const progress = track.duration
		? Math.min(track.progress + elapsedMs, track.duration)
		: track.progress + elapsedMs;
	return { ...body, currentTrack: { ...track, progress } };
}
