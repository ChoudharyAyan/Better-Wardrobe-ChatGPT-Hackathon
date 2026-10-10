# Better Wardrobe — ChatGPT Hackathon

**A fashion discovery and wardrobe prototype for finding a look, exploring similar pieces, and keeping personal style in one place.**

[Try the Vercel preview](https://better-wardrobe-hackathon.vercel.app) · [Source repository](https://github.com/ChoudharyAyan/Better-Wardrobe-ChatGPT-Hackathon)

> This is an evolving hackathon prototype. The existing Wardrobe OS journey remains intact. The optional Decisions API path is being tested separately; it is off by default.

## The idea

Fashion discovery is spread across screenshots, shopping sites, saved posts, and the clothes people already own. Better Wardrobe brings those activities into one personal fashion workspace. The longer-term navigation groups the experience into **Discover**, **The Mall**, **Community**, and **Profile**.

## Current prototype

- **Discover:** choose a garment from a reference image, describe what matters, and explore product matches. Sample results are available; live image and shopping search depend on server-side provider configuration.
- **The Mall:** browse the existing brand and product discovery experience, including its source-backed feed and store directory.
- **Community:** post a “find this” question and share a product lead. The Vercel preview shows three read-only sample threads; shared posts require a dedicated Postgres database.
- **Profile:** use the existing profile and account setup flow.
- **Wardrobe and styling:** the codebase contains wardrobe and outfit flows, but they are currently marked as coming soon in the main navigation.

The current Vercel deployment preserves the original navigation and user journey. ChatGPT Sites is not the deployment target for this preview.

## Run locally

Requirements: Node.js 20 or newer.

```bash
cd prototype
npm ci
npm start
```

Open [http://localhost:5173](http://localhost:5173). The browser walkthrough uses local sample data. Some features need external services and credentials; copy `prototype/.env.example` to `prototype/.env` and configure credentials on the server only. Never commit `.env` or paste provider keys into client-side code.

To run the checks:

```bash
npm run check
npm test
```

## Architecture

- `prototype/dist/` contains the browser app and static assets. It uses plain JavaScript, HTML, and CSS with hash-based navigation.
- `prototype/server.mjs` is the local Node.js API server.
- `prototype/api/index.mjs` adapts API routes for Vercel deployment.
- `prototype/lib/` contains server-side discovery, accounts, community, wardrobe, and related service modules.
- `prototype/tests/` contains Node test-runner coverage for service and HTTP behavior.

Discover uses OpenAI Responses for garment understanding, screenshot analysis, detection, order extraction, and candidate comparison. It uses GPT-5.4 mini (Max) or GPT-5.4 nano (Lite). Typed results are ranked with OpenAI Decisions (`gpt-6-luna`) when the API key is configured. Calls are server-side and pause at the $45 in-app spend guard. Production requires a durable Postgres URL and a SerpApi key for product retrieval; other model providers remain explicit local benchmarks.

## Data and setup notes

- The local walkthrough stores wardrobe changes in browser storage; clearing browser data removes them.
- Shared Community requires `COMMUNITY_DATABASE_URL` (or `POSTGRES_URL`) and a reachable Postgres database.
- OpenAI Decisions testing requires `OPENAI_API_KEY`, a separate hackathon Postgres database (`OPENAI_SPEND_DATABASE_URL` or `POSTGRES_URL`) for the durable $45 in-app spend stop, and `SERPAPI_API_KEY` for product retrieval. Set the OpenAI project cap to $50 in the OpenAI dashboard too. Add secrets directly in the `better-wardrobe-hackathon` Vercel project; never send or commit them.
- Without Postgres on Vercel, the app keeps the existing 120 preview credits, disables the 50-credit welcome award, and serves sample Community threads read-only. This prevents an ephemeral serverless instance from issuing non-durable promotional credits.
- Discovery provider credentials belong in server environment variables. Keep them out of GitHub Actions logs, browser bundles, and committed files.
- Live provider behavior depends on account access, quotas, and configuration. Example cards and sample results are not proof of current inventory, price, delivery, or exact item identity.

See [`prototype/README.md`](prototype/README.md), [`prototype/DISCOVERY.md`](prototype/DISCOVERY.md), and [`prototype/COMMUNITY.md`](prototype/COMMUNITY.md) for implementation details and limits.

## Sharing and reuse

This repository is public for hackathon review. No open-source license has been added, so public visibility does not grant permission to reuse the code. Contact the project owner for licensing or reuse questions.
