# Better Wardrobe — ChatGPT Hackathon

**A fashion discovery and wardrobe prototype for finding a look, exploring similar pieces, and keeping personal style in one place.**

[Live project tour](https://wardrobeos-hackathon.ayan-ayan-choudhary.chatgpt.site) · [Source repository](https://github.com/ChoudharyAyan/Better-Wardrobe-ChatGPT-Hackathon)

> This is an evolving hackathon prototype. The current app and the planned four-tab presentation are described separately below so the project status stays clear. AI model and retrieval API choices are pending; no ChatGPT API has been wired in yet.

## The idea

Fashion discovery is spread across screenshots, shopping sites, saved posts, and the clothes people already own. Better Wardrobe brings those activities into one personal fashion workspace. The longer-term navigation groups the experience into **Discover**, **The Mall**, **Community**, and **Profile**.

## Current prototype

- **Discover:** choose a garment from a reference image, describe what matters, and explore product matches. Sample results are available; live image and shopping search depend on server-side provider configuration.
- **The Mall:** browse the existing brand and product discovery experience, including its source-backed feed and store directory.
- **Community:** post a “find this” question and share a product lead. Shared posts require the Postgres-backed community API; without it, the app reports that Community is unavailable.
- **Profile:** use the existing profile and account setup flow.
- **Wardrobe and styling:** the codebase contains wardrobe and outfit flows, but they are currently marked as coming soon in the main navigation.

The intended hackathon change is to expose Discover, The Mall, Community, and Profile as independent tabs while reusing the existing modules. That navigation restructuring is not yet represented as complete in this repository.

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

The current app uses Gemini or OpenRouter for configured vision analysis, SerpApi for configured shopping/image retrieval, and Ollama for the local walkthrough model. These are the existing prototype integrations, not the final hackathon API decision. The team will select the ChatGPT model and retrieval providers separately before changing them.

## Data and setup notes

- The local walkthrough stores wardrobe changes in browser storage; clearing browser data removes them.
- Shared Community requires `COMMUNITY_DATABASE_URL` (or `POSTGRES_URL`) and a reachable Postgres database.
- Discovery provider credentials belong in server environment variables. Keep them out of GitHub Actions logs, browser bundles, and committed files.
- Live provider behavior depends on account access, quotas, and configuration. Example cards and sample results are not proof of current inventory, price, delivery, or exact item identity.

See [`prototype/README.md`](prototype/README.md), [`prototype/DISCOVERY.md`](prototype/DISCOVERY.md), and [`prototype/COMMUNITY.md`](prototype/COMMUNITY.md) for implementation details and limits.

## Sharing and reuse

This repository is public for hackathon review. No open-source license has been added, so public visibility does not grant permission to reuse the code. Contact the project owner for licensing or reuse questions.
