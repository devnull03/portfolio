import { getCurrentlyPlayingTrack, getTrackDisplayString, formatDuration, isTrackActive } from '$lib/server/spotify';
import type { CurrentTrackData } from '$lib/interfaces/spotify.interface';
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
					...track,
					display: getTrackDisplayString(track),
					isActive: isTrackActive(track),
					durationFmt: formatDuration(track.duration),
				} satisfies CurrentTrackData
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