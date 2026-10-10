# ChatGPT Sites compatibility audit

**Audit date:** 10 October 2026  
**Scope:** Current public Site, hackathon checkout, app hosting/runtime, OAuth, database, and API boundaries.

The handoff file named `BETTER_WARDROBE_HACKATHON_HANDOFF.md` was not present in the checkout or Downloads during this audit. The full handoff included in the task message is the specification used here.

## Current state

- The public ChatGPT Site is `https://wardrobeos-hackathon.ayan-ayan-choudhary.chatgpt.site`.
- Its manifest selects only the root `dist/` directory. That directory is a static project walkthrough, not the application. The application is under `prototype/dist/` and its API server is under `prototype/`.
- The Site is currently public. No auth, database, or provider behavior has been verified on the Site because the app is not what it serves.
- The first-party app is a Vercel Node application. Its cloned UI keeps the original Discover, My Wardrobe, Style Me, and My Profile navigation. Community remains part of Discover, as in the existing app.

## Compatibility findings

| Area | Existing implementation | ChatGPT Sites consequence |
|---|---|---|
| API runtime | Vercel Node function imports `prototype/server.mjs` and Node's `http`, `crypto`, filesystem, and URL modules. | A Site server runtime is a Cloudflare Worker. The Vercel function entry point cannot be deployed as-is; each API route needs a Worker-compatible handler. |
| PostgreSQL | Account, chat, credit, and Community persistence use `pg` with a PostgreSQL connection string. | Workers do not support raw TCP connections. The current database client cannot connect directly. Migrating to D1 would change the storage layer and data path, so it is not a safe compatibility-only change. |
| OAuth and sessions | Google OAuth callback URI is built from a small host allowlist; unrecognized hosts fall back to `PUBLIC_BASE_URL`. Signed account sessions use `HttpOnly; SameSite=Lax` cookies and same-origin API requests. | The `chatgpt.site` host is not allow-listed. The OAuth callback would return to the current Vercel domain and set a Vercel-host cookie, which the Site cannot use. Cross-origin cookie/CORS changes would affect the security boundary and Google OAuth configuration. OAuth has not been tested on ChatGPT Sites. |
| Image processing | The server imports `sharp` for native image transforms. | Native Node dependencies do not transfer directly to the Worker runtime. Any replacement must preserve upload validation, limits, privacy, and image behavior. |
| External APIs | Browser calls use same-origin `/api/*` routes; provider credentials are server-side. | Pointing the Site at the current Vercel API would make requests cross-origin and would not preserve the existing session behavior or current same-origin checks. A proxy or API migration is required before live provider features can work from the Site. |
| Environment and secrets | Provider, OAuth, and database variables are configured for the existing Vercel app. | Those settings do not automatically carry over to the ChatGPT Site. Secrets must be configured in the Site Worker environment, without exposing them to browser code. No secret values were inspected or copied. |

## Decision

The owner chose to keep this clone on the existing Vercel architecture. No ChatGPT Sites migration, navigation redesign, authentication change, or API/database rewrite is planned. The original UI, routes, Profile, auth, providers, and server integrations stay in place. Decision API work will be limited to backend behavior after the owner selects the model and retrieval providers. No model calls or API credits have been used for that work.

## Verification limits

The compatibility notes above describe why a platform migration would require more work. The existing Vercel deployment is the target for this clone. No live ChatGPT Sites OAuth, cookie, database, or provider validation was performed; live provider calls and credit use remain out of scope until the Decision API choices are provided.
