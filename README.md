# AURA

AURA is a friction-free personal assistant marketplace: hire an elite assistant or become one.

The current build is a zero-build Vercel app with:

- A polished interactive marketplace UI.
- Smart calendar and rescheduling flows.
- Checklist playbooks for cleaning, errands, travel, and support work.
- Feedback, tipping, and coaching loops.
- Image inventory upload flow.
- Vercel API functions that persist to Neon when `DATABASE_URL` is configured.
- Neon Postgres schema and seed data in `database/`.

## Local Preview

```bash
npm start
```

Then open `http://localhost:4173`.

## Verify

```bash
npm run check
```

## Deploy

Push these files to the GitHub repo connected to Vercel, then set:

```bash
DATABASE_URL
AURA_PLATFORM_FEE_BPS
AURA_DEFAULT_MARKET
```

The root `index.html` fixes the previous Vercel 404.
