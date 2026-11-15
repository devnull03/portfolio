# dvnl.work

Personal portfolio: SvelteKit, prerendered at build time, served from Cloudflare Workers.

```bash
pnpm install
pnpm dev               # local dev server
pnpm preview           # production build in the real Workers runtime (wrangler dev)
pnpm check             # svelte-check
```

- [`content/README.md`](content/README.md): where resume and project data lives, and how to edit it
- [`docs/DEPLOY.md`](docs/DEPLOY.md): how deploys, secrets and the domain are set up
- [`docs/AUDIT.md`](docs/AUDIT.md): the original audit and plan (historical; LinkedIn sync was later dropped)
