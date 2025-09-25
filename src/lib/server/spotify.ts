import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } from '$env/static/private';
import type {
	SpotifyTokenResponse,
	SpotifyCurrentlyPlayingResponse,
	CurrentlyPlayingTrack,
	SpotifyRecentlyPlayedResponse,
	RecentlyPlayedTrack
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
 * Get the most recently played track
 * Uses limit=1 and before=current_time to get the last played track
 */
export async function getRecentlyPlayedTrack(): Promise<RecentlyPlayedTrack | null> {
	try {
		const accessToken = await getPersonalAccessToken();
		const beforeTimestamp = Date.now(); // Current time in milliseconds

		const response = await fetch(
			`https://api.spotify.com/v1/me/player/recently-played?limit=1&before=${beforeTimestamp}`,
			{
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				throw new SpotifyError('Invalid or expired refresh token', 401);
			}
			if (response.status === 403) {
				throw new SpotifyError('Insufficient permissions. Need user-read-recently-played scope', 403);
			}
			if (response.status === 429) {
				throw new SpotifyError('Rate limit exceeded', 429);
			}
			throw new SpotifyError(`Spotify API error: ${response.status}`, response.status);
		}

		const data: SpotifyRecentlyPlayedResponse = await response.json();

		// If no tracks in history
		if (!data.items || data.items.length === 0) {
			return null;
		}

		const historyItem = data.items[0];
		const track = historyItem.track;
		const artists = track.artists.map(artist => artist.name);

		// Get the best quality image (usually the first one is the largest)
		const image = track.album.images.length > 0 ? track.album.images[0].url : null;

		return {
			name: track.name,
			artists,
			image,
			link: track.external_urls.spotify,
			playedAt: historyItem.played_at,
			playedAtMs: new Date(historyItem.played_at).getTime(),
			duration: track.duration_ms
		};
	} catch (error) {
		if (error instanceof SpotifyError) {
			throw error;
		}
		throw new SpotifyError(`Failed to get recently played track: ${error}`);
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

/**
 * Get a simplified recently played track display string
 */
export function getRecentlyPlayedDisplayString(track: RecentlyPlayedTrack): string {
	const artistsString = track.artists.join(', ');
	return `${track.name} by ${artistsString}`;
}

/**
 * Format when a track was played (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatPlayedAt(playedAtMs: number): string {
	const now = Date.now();
	const diffMs = now - playedAtMs;
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMinutes < 1) {
		return 'Just now';
	} else if (diffMinutes < 60) {
		return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
	} else if (diffHours < 24) {
		return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	} else {
		return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
	}
}

/**
 * Get the current track or fallback to the most recently played track
 * This is the main function to use when you want to display what the user is/was listening to
 */
export async function getCurrentOrRecentTrack(): Promise<{
	track: CurrentlyPlayingTrack | RecentlyPlayedTrack;
	type: 'current' | 'recent';
} | null> {
	try {
		// First try to get currently playing track
		const currentTrack = await getCurrentlyPlayingTrack();
		if (currentTrack) {
			return {
				track: currentTrack,
				type: 'current'
			};
		}

		// If no current track, get the most recently played
		const recentTrack = await getRecentlyPlayedTrack();
		if (recentTrack) {
			return {
				track: recentTrack,
				type: 'recent'
			};
		}

		return null;
	} catch (error) {
		if (error instanceof SpotifyError) {
			throw error;
		}
		throw new SpotifyError(`Failed to get current or recent track: ${error}`);
	}
}
