# Deploying

`dvnl.work` is served by the Cloudflare Worker **`portfolio`**. Every page is prerendered and
served as a static asset; the Worker code only runs for `/api/now-playing` (Spotify) and
`/media/*` (videos, served with byte ranges so Safari can play them).

## How a change goes live

Push to `main`. **Cloudflare Workers Builds** (connected to this GitHub repo) runs
`pnpm install`, `pnpm run build` and `pnpm exec wrangler deploy`. Build logs are in the
Cloudflare dashboard under Workers & Pages → portfolio → Deployments.

GitHub Actions only runs `ci.yml` (type-check and build) on PRs and pushes to `main`; it
doesn't deploy.

## Configuration

| Where | Name | Notes |
| --- | --- | --- |
| Workers Builds variables | `PUBLIC_COMPANY_NAME`, `PUBLIC_DOMAIN` | Baked in at build time. |
| Worker secrets | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | Read at runtime. Set with `wrangler secret put <NAME>`. |

If Spotify stops showing anything, the refresh token was probably revoked. Get a new one with
`scripts/get_spotify_token.py` (paste the whole redirect URL when it asks) and update the secret.

## Domain

- `dvnl.work` is a Worker custom domain, declared in `wrangler.jsonc`. Cloudflare manages its
  DNS record and certificate.
- `www.dvnl.work` is a proxied placeholder record (`AAAA 100::`) with a zone redirect rule that
  sends it to `https://dvnl.work` with a 301, keeping the path and query string.
- The Worker is also reachable at `portfolio.<subdomain>.workers.dev`.
