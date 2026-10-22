# WardrobeOS architecture

![WardrobeOS system design](architecture.svg)

A one-page view of how a Discover request moves through the app, drawn from the code as of 22 October 2026.

- **UI and frontend:** plain JavaScript, HTML and CSS in `prototype/dist/`, with hash routes. Wardrobe, persona and saved finds live in browser storage.
- **Backend:** `prototype/server.mjs`, deployed as one Vercel function through `prototype/api/index.mjs`. It handles sign-in, Discover, the mall feed, Community, imports, credits and the spend guard.
- **LLM reasoning engine:** `prototype/lib/discovery.mjs` and `prototype/lib/decisions.mjs`. It understands the garment with OpenAI Responses, plans the query, retrieves candidates through SerpApi, judges them with OpenAI Decisions, and ranks them by vibe match.
- **Data:** Neon Postgres for accounts, credits, chats and Community; browser storage; an in-process replay cache; and the mall feed snapshot refreshed by GitHub Actions.
- **Feedback loop:** confirmed attributes, saves, swaps, ownership and wear logs update the persona and wardrobe, which go back into the engine as context.

Dashed items are planned and not in the code yet: outfit ideas from the engine, and learning the ranking from rejected matches.
