import { getContactInfo } from '$lib/server/content';
import type { PageServerLoad } from './$types';

// Spotify data is no longer loaded here: the page is prerendered, and the widget fetches
// /api/now-playing in the browser.
export const load: PageServerLoad = () => ({
	contact: getContactInfo()
});
