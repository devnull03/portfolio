import cloudflare from '@sveltejs/adapter-cloudflare';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Every page is prerendered at build time (see src/routes/+layout.ts) and served as a
		// Workers static asset. The Worker itself only runs for the dynamic /api routes.
		//
		// Vercel still builds this repo until dvnl.work moves to Cloudflare (docs/DEPLOY.md), so
		// builds there keep using adapter-vercel; drop it once Vercel is disconnected.
		adapter: process.env.VERCEL ? vercel() : cloudflare()
	}
};

export default config;
