import { getCurrentlyPlayingTrack, getTrackDisplayString, formatDuration, isTrackActive } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// Get parent data (from layout.server.ts)
	const parentData = await parent();

	try {
		const track = await getCurrentlyPlayingTrack();

		if (track) {
			return {
				...parentData,
				currentTrack: {
					display: getTrackDisplayString(track),
					name: track.name,
					artists: track.artists,
					image: track.image,
					link: track.link,
					isPlaying: track.isPlaying,
					isActive: isTrackActive(track),
					duration: formatDuration(track.duration),
					progress: track.progress,
					progressMs: track.progress
				}
			};
		}

		return {
			...parentData,
			currentTrack: null
		};
	} catch (error) {
		console.error('Failed to get current track:', error);
		return {
			...parentData,
			currentTrack: null
		};
	}
};