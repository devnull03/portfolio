import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';
import type {
	SpotifyTokenResponse,
	SpotifyCurrentlyPlayingResponse,
	CurrentlyPlayingTrack
} from '$lib/interfaces/spotify.interface';

// Types for Spotify API responses
class SpotifyError extends Error {
	constructor(message: string, public status?: number) {
		super(message);
		this.name = 'SpotifyError';
	}
}

/**
 * Get access token for your personal Spotify account using refresh token
 * This requires a refresh token from your Spotify account
 */
async function getPersonalAccessToken(): Promise<string> {
	const clientId = SPOTIFY_CLIENT_ID;
	const clientSecret = SPOTIFY_CLIENT_SECRET;
	const refreshToken = SPOTIFY_REFRESH_TOKEN;

	if (!clientId || !clientSecret || !refreshToken) {
		throw new SpotifyError('Spotify credentials not configured. Need CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN');
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
		},
		body: `grant_type=refresh_token&refresh_token=${refreshToken}`
	});

	if (!response.ok) {
		throw new SpotifyError('Failed to refresh Spotify access token', response.status);
	}

	const data: SpotifyTokenResponse = await response.json();
	return data.access_token;
}

/**
 * Get your currently playing track
 * Uses your personal refresh token to get current track info
 */
export async function getCurrentlyPlayingTrack(): Promise<CurrentlyPlayingTrack | null> {
	try {
		const accessToken = await getPersonalAccessToken();

		const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		// 204 No Content means no track is currently playing
		if (response.status === 204) {
			return null;
		}

		if (!response.ok) {
			if (response.status === 401) {
				throw new SpotifyError('Invalid or expired refresh token', 401);
			}
			if (response.status === 403) {
				throw new SpotifyError('Insufficient permissions. Need user-read-currently-playing scope', 403);
			}
			if (response.status === 429) {
				throw new SpotifyError('Rate limit exceeded', 429);
			}
			throw new SpotifyError(`Spotify API error: ${response.status}`, response.status);
		}

		const data: SpotifyCurrentlyPlayingResponse = await response.json();

		// If no track is playing or it's not a track
		if (!data.item || data.currently_playing_type !== 'track') {
			return null;
		}

		const track = data.item;
		const artists = track.artists.map(artist => artist.name);

		// Get the best quality image (usually the first one is the largest)
		const image = track.album.images.length > 0 ? track.album.images[0].url : null;

		return {
			name: track.name,
			artists,
			image,
			link: track.external_urls.spotify,
			isPlaying: data.is_playing,
			progress: data.progress_ms,
			duration: track.duration_ms
		};
	} catch (error) {
		if (error instanceof SpotifyError) {
			throw error;
		}
		throw new SpotifyError(`Failed to get currently playing track: ${error}`);
	}
}


/**
 * Format track duration from milliseconds to MM:SS
 */
export function formatDuration(durationMs: number | null): string {
	if (!durationMs) return '0:00';

	const totalSeconds = Math.floor(durationMs / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format track progress as a percentage
 */
export function getProgressPercentage(progress: number | null, duration: number | null): number {
	if (!progress || !duration || duration === 0) return 0;
	return Math.round((progress / duration) * 100);
}

/**
 * Get a simplified track display string
 */
export function getTrackDisplayString(track: CurrentlyPlayingTrack): string {
	const artistsString = track.artists.join(', ');
	return `${track.name} by ${artistsString}`;
}

/**
 * Check if the track is currently playing and not paused
 */
export function isTrackActive(track: CurrentlyPlayingTrack | null): boolean {
	return track !== null && track.isPlaying;
}
