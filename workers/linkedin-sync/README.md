# linkedin-sync

A Cloudflare Worker that turns "I edited my LinkedIn profile" into a redeploy of
the portfolio. Changes are **debounced**: a deploy happens only after no new
change has arrived for `DEBOUNCE_MINUTES` (2 hours by default), so an afternoon
of edits produces one deploy. `MAX_WAIT_MINUTES` (24 hours) caps how long a
constant stream of edits can postpone it.

```
 POST /hook ───────────┐
 PUT  /export (zip) ───┼──► Debouncer (Durable Object)          content-release.yml
 hourly cron (DMA) ────┘    alarm = last signal + 2h  ──────►  repository_dispatch ──► tag ──► deploy.yml
```

## Why there's no LinkedIn webhook

LinkedIn doesn't offer one for personal profiles. The only official
programmatic access to your own positions, education and skills is the DMA
Member Data Portability API, and that is limited to accounts in the EEA or
Switzerland. So the worker accepts change signals from three places:

| Signal | Use it when |
| --- | --- |
| `POST /hook` | You've just edited your profile. Call it from an iOS/macOS Shortcut, a mail rule on LinkedIn's notification emails, or `curl`. |
| `PUT /export` | You've downloaded a fresh export (LinkedIn → Settings → Data privacy → *Get a copy of your data*). The ZIP is stored in R2, and CI builds from it via `GET /export`. **This is the path that gets new data onto the site for non-EEA accounts.** |
| hourly cron | `LINKEDIN_DMA_TOKEN` is set (EEA/CH only). The worker hashes your Snapshot API data and signals when it changes. |

## Endpoints

All endpoints take `Authorization: Bearer <token>`. For senders that can't set
headers, `?token=<token>` also works.

| | Token | |
| --- | --- | --- |
| `POST /hook` | `HOOK_SECRET` | Signal a change. Optional JSON body `{"reason": "..."}`. Returns when the deploy will fire. |
| `PUT /export` | `HOOK_SECRET` | Upload a LinkedIn export ZIP as the request body. It signals a change unless the file is identical to the last upload. |
| `GET /export` | `EXPORT_READ_TOKEN` or `HOOK_SECRET` | Download the latest export (used by CI). |
| `GET /status` | `HOOK_SECRET` | Pending change (signals, reasons, `firesAt`) and the last dispatch result. |
| `POST /flush` | `HOOK_SECRET` | Dispatch now instead of waiting out the debounce window. |

```bash
W=https://linkedin-sync.<your-subdomain>.workers.dev
curl -X POST -H "Authorization: Bearer $HOOK_SECRET" -d '{"reason":"new job"}' $W/hook
curl -X PUT  -H "Authorization: Bearer $HOOK_SECRET" --data-binary @Basic_LinkedInDataExport.zip $W/export
curl         -H "Authorization: Bearer $HOOK_SECRET" $W/status
```

## Setup

Run these from the repo root:

```bash
pnpm exec wrangler r2 bucket create linkedin-exports
pnpm worker:secret HOOK_SECRET          # e.g. `openssl rand -hex 32`
pnpm worker:secret EXPORT_READ_TOKEN    # a second random token, for CI
pnpm worker:secret GITHUB_TOKEN         # fine-grained PAT: devnull03/portfolio, Contents: read & write
# optional, EEA/CH accounts only:
pnpm worker:secret LINKEDIN_DMA_TOKEN
pnpm worker:deploy
```

Then, in the portfolio repo's GitHub settings, so that deploys build from the
uploaded export:

- variable `LINKEDIN_EXPORT_URL` = `https://linkedin-sync.<your-subdomain>.workers.dev/export`
- secret `LINKEDIN_EXPORT_TOKEN` = the `EXPORT_READ_TOKEN` value

The GitHub token needs **Contents: write** because that is what the
`repository_dispatch` endpoint requires. It isn't used to push anything.

## Development

```bash
pnpm worker:test     # debounce state machine, plain node --test
pnpm worker:check    # generate Workers types + tsc
pnpm worker:dev      # local; try a short window: --var DEBOUNCE_MINUTES:0.1
```
