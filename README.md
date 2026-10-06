# dvnl.work

Personal portfolio: SvelteKit, prerendered at build time, served from Cloudflare Workers.

```bash
pnpm install
pnpm dev               # local dev server
pnpm preview           # production build in the real Workers runtime (wrangler dev)
pnpm check             # svelte-check
pnpm content:fetch     # refresh content/linkedin.json from LinkedIn
```

- [`content/README.md`](content/README.md): where resume and project data comes from, and how to edit it
- [`docs/DEPLOY.md`](docs/DEPLOY.md): tag-based deploys, secrets, Cloudflare setup
- [`docs/AUDIT.md`](docs/AUDIT.md): the audit and plan behind the current architecture
