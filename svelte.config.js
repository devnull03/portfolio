import cloudflare from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Every page is prerendered at build time (see src/routes/+layout.ts) and served as a
		// Workers static asset. The Worker itself only runs for the dynamic routes
		// (/api/now-playing, /media/*).
		adapter: cloudflare()
	}
};

export default config;
