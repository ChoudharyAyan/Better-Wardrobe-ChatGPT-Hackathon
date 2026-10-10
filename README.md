# Better Wardrobe — Hackathon Clone

**A fashion discovery and wardrobe prototype for finding a look, exploring similar pieces, and keeping personal style in one place.**

[Production reference](https://app.thewardrobeos.com) · [Source repository](https://github.com/ChoudharyAyan/Better-Wardrobe-ChatGPT-Hackathon)

The reference link is the existing production app. This clone is not connected to that Vercel project; deploy it separately to avoid changing production.

> This repository is a separate copy of the existing Wardrobe OS app for backend experimentation. Keep its screens, copy, navigation, authentication, and user journey aligned with the original. The planned hackathon work is focused on backend Decision API experiments. Model and retrieval choices are pending; no new model has been connected.

## The idea

Fashion discovery is spread across screenshots, shopping sites, saved posts, and the clothes people already own. Better Wardrobe brings those activities into one personal fashion workspace. This clone keeps the original navigation and product flow intact.

## Current prototype

- **Discover:** choose a garment from a reference image, describe what matters, explore product matches, and reach Community.
- **My Wardrobe:** the existing wardrobe flow and local data handling; the original navigation currently labels it “Coming soon.”
- **Style Me:** the existing outfit styling flow; the original navigation currently labels it “Coming soon.”
- **My Profile:** the existing profile and account setup flow.

Use the original app as the reference for the user experience. This clone is for backend and Decision API experiments; changes to screens or navigation are out of scope unless requested.

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

The clone retains the existing provider integrations. Decision API model and retrieval provider choices will be supplied separately before backend changes are made. Keep credentials on the server and do not use API credits until the experiment is agreed.

## Data and setup notes

- Local mode stores wardrobe changes in browser storage; clearing browser data removes them.
- Shared Community requires `COMMUNITY_DATABASE_URL` (or `POSTGRES_URL`) and a reachable Postgres database.
- Discovery provider credentials belong in server environment variables. Keep them out of GitHub Actions logs, browser bundles, and committed files.
- Live provider behavior depends on account access, quotas, and configuration. Example cards and sample results are not proof of current inventory, price, delivery, or exact item identity.

See [`prototype/README.md`](prototype/README.md), [`prototype/DISCOVERY.md`](prototype/DISCOVERY.md), and [`prototype/COMMUNITY.md`](prototype/COMMUNITY.md) for implementation details and limits.

## Sharing and reuse

This repository is public for hackathon review. No open-source license has been added, so public visibility does not grant permission to reuse the code. Contact the project owner for licensing or reuse questions. The production app remains on Vercel; no ChatGPT Sites migration is planned for this clone.
