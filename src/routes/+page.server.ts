import { getCurrentOrRecentTrack, getTrackDisplayString, getRecentlyPlayedDisplayString, formatDuration, isTrackActive, formatPlayedAt } from '$lib/server/spotify';
import type { CurrentTrackData, CurrentlyPlayingTrack, RecentlyPlayedTrack } from '$lib/interfaces/spotify.interface';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	try {
		const result = await getCurrentOrRecentTrack();

		if (result) {
			if (result.type === 'current') {
				const track = result.track as CurrentlyPlayingTrack;
				return {
					...parentData,
					currentTrack: {
						...track,
						display: getTrackDisplayString(track),
						isActive: isTrackActive(track),
						durationFmt: formatDuration(track.duration)
					} satisfies CurrentTrackData,
					trackType: 'current' as const
				};
			} else {
				const track = result.track as RecentlyPlayedTrack;
				return {
					...parentData,
					currentTrack: {
						name: track.name,
						artists: track.artists,
						image: track.image,
						link: track.link,
						isPlaying: false,
						progress: null,
						duration: track.duration,
						display: getRecentlyPlayedDisplayString(track),
						isActive: false,
						durationFmt: formatDuration(track.duration)
					} satisfies CurrentTrackData,
					trackType: 'recent' as const,
					playedAt: formatPlayedAt(track.playedAtMs)
				};
			}
		}

		return {
			...parentData,
			currentTrack: null
		};
	} catch (error) {
		console.error('Failed to get current or recent track:', error);
		return {
			...parentData,
			currentTrack: null
		};
	}
};