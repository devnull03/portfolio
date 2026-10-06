# Building and deploying

The site is fully static. Every page is prerendered at build time from `content/`
and served from Cloudflare Workers static assets. A Worker only runs for
`/api/now-playing` (Spotify) and for 404s. Pages never call LinkedIn or Spotify
when someone visits.

```
 git tag v1.4.0 && git push --tags ─┐
                                    ├─► deploy.yml: content:fetch → build → wrangler deploy
 linkedin-sync worker (debounced) ──┘     (via content-release.yml, which creates a content-* tag)
```

## Day to day

| I want to… | Do this |
| --- | --- |
| Ship a code change | Merge to `main`, then `git tag vX.Y.Z && git push --tags`. |
| Ship a LinkedIn profile change | Upload a fresh export to the sync worker (`PUT /export`), or ping `POST /hook`. It waits for 2 quiet hours, then triggers a content release. See [`workers/linkedin-sync`](../workers/linkedin-sync/README.md). You can also run **Actions → Content release → Run workflow**. |
| Redeploy a specific tag | **Actions → Deploy → Run workflow**, with `ref` set to the tag. |
| Preview locally in the real Workers runtime | `pnpm preview` (builds, then runs `wrangler dev`). |

## One-time setup

### Cloudflare

1. Create an API token from the **Edit Cloudflare Workers** template.
2. Set the Spotify secrets on the Worker (they are read at runtime, not at build time):
   ```bash
   pnpm exec wrangler secret put SPOTIFY_CLIENT_ID
   pnpm exec wrangler secret put SPOTIFY_CLIENT_SECRET
   pnpm exec wrangler secret put SPOTIFY_REFRESH_TOKEN
   ```
3. **Cutover from Vercel.** `wrangler.jsonc` routes `dvnl.work/*` to the Worker.
   The route only takes effect when the `dvnl.work` DNS record is proxied
   (orange cloud). If the apex record points at Vercel and is DNS-only, either
   proxy it, or delete it and replace the `routes` entry with
   `{ "pattern": "dvnl.work", "custom_domain": true }`, which makes Cloudflare
   create the record. Remove the project from Vercel once the Cloudflare
   deploy is serving.

### GitHub (Settings → Secrets and variables → Actions)

| Name | Kind | Needed for |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | secret | deploy |
| `CLOUDFLARE_ACCOUNT_ID` | secret | deploy |
| `PUBLIC_COMPANY_NAME` | variable | page title (defaults to `Arnav Mehta / devnull03`) |
| `PUBLIC_DOMAIN` | variable | defaults to `dvnl.work` |
| `LINKEDIN_EXPORT_URL` | variable | optional: where CI downloads the latest LinkedIn export (e.g. `https://linkedin-sync.<you>.workers.dev/export`) |
| `LINKEDIN_EXPORT_TOKEN` | secret | optional: bearer token for that URL |
| `LINKEDIN_DMA_TOKEN` | secret | optional: EEA/CH accounts only |

With none of the `LINKEDIN_*` values set, CI deploys the committed
`content/linkedin.json`. The exact `content/` used for each deploy is attached
to the workflow run as an artifact.

## What runs where

| Path | Served by |
| --- | --- |
| `/`, `/resume`, `/projects` (+ `__data.json`) | static assets (prerendered HTML) |
| `/_app/*`, images, `resume.pdf` | static assets |
| `/api/now-playing` | Worker; caches the result for 15 s per isolate and reuses the Spotify access token |
| anything else | Worker → SvelteKit 404 |

Recruiter mode (`?recruiter=1`) is handled in the browser by a small inline
script in `src/app.html`, because there is no per-request server rendering any
more.
