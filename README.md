# AURA

AURA is a friction-free personal assistant marketplace: hire an elite assistant or become one.

The current build is a zero-build Vercel app with:

- A polished interactive marketplace UI.
- Smart calendar and rescheduling flows.
- Checklist playbooks for cleaning, errands, travel, and support work.
- Feedback, tipping, and coaching loops.
- Image inventory upload flow.
- Vercel API functions that persist to Neon when `DATABASE_URL` is configured.
- Auth0/Okta login with protected API writes when Auth0 env vars are configured.
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
AUTH0_DOMAIN
AUTH0_CLIENT_ID
AUTH0_AUDIENCE
AUTH0_SCOPE
AUTH0_CACHE_LOCATION
```

The root `index.html` fixes the previous Vercel 404.

## Auth0 Setup

Create an Auth0 **Single Page Application**. In the quickstart picker, search for **JavaScript**. If you only see framework cards, skip the code quickstart and use the values from the Application Settings.

Allowed Callback URLs:

```text
http://localhost:4173, https://aura-omega-rosy.vercel.app
```

Allowed Logout URLs:

```text
http://localhost:4173, https://aura-omega-rosy.vercel.app
```

Allowed Web Origins:

```text
http://localhost:4173, https://aura-omega-rosy.vercel.app
```

Create an Auth0 API and use its Identifier as `AUTH0_AUDIENCE`. Without an audience, the UI can sign in but API writes stay in demo mode instead of JWT-protected mode.
