# resurface-landing

Marketing site for Resurface. Astro, static output, no client JavaScript.

Related repos: `resurface-app`, `resurface-backend`.

---

## Where this sits

```
   this repo  →  resurface.<tld>          public marketing page
   app        →  app.resurface.<tld>      the study app itself
   backend    →  api.resurface.<tld>      question generation
```

Nothing here talks to the backend. It is a static page whose only job is to
explain the product and link to the app.

## Running locally

```bash
npm install
npm run dev            # http://localhost:4321
```

Requires **Node 22.12+** — Astro 7 will not run on Node 20.

```bash
cp .env.example .env
# PUBLIC_APP_URL=https://app.resurface.example
```

## What's built

A single page: hero, three explanatory cards, footer. Dark, using the same two
blues as the app (`--deep` #1D4ED8, `--bright` #4D8EF5), where the colour
encodes depth — submerged versus surfaced.

## Known gaps

- **Placeholder copy.** Written to be replaced, not shipped as final.
- **No logo.** The mark is still being designed; the hero is type-only and the
  favicon is Astro's default.
- No screenshots of the app, no pricing, no signup — there is nothing to sign up
  for yet.
- No analytics and no OG image.

## Out of scope

Not the app, and not a blog. If this page ever needs a login or a dashboard,
that belongs in `resurface-app`.
