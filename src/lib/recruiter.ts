// Recruiter mode used to be a server-read cookie; pages are prerendered now, so it is resolved
// in the browser. The inline script in src/app.html runs before first paint: it applies
// `?recruiter=1|0` to the `isRecruiter` cookie and marks <html data-recruiter> so the loading
// screen never flashes. The layout reads that same marker when it hydrates.

export function isRecruiterMode(): boolean {
	return document.documentElement.hasAttribute('data-recruiter');
}
