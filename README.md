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
AUTH0_CLIENT_SECRET
AUTH0_SECRET
AUTH0_AUDIENCE
AUTH0_SCOPE
AURA_ADMIN_EMAILS
AURA_ADMIN_SUBJECTS
```

The root `index.html` fixes the previous Vercel 404.

## Auth0 Setup

Create an Auth0 **Regular Web Application** and use the values from **Application Settings**. AURA uses a server-side callback and HttpOnly session cookie, so set `AUTH0_CLIENT_SECRET` in Vercel from the Auth0 application's client secret. Set `AUTH0_SECRET` to a long random value for signing AURA session cookies.

Allowed Callback URLs:

```text
http://localhost:4173/api/auth/callback, https://aura-omega-rosy.vercel.app/api/auth/callback
```

Allowed Logout URLs:

```text
http://localhost:4173, https://aura-omega-rosy.vercel.app
```

Allowed Web Origins:

```text
http://localhost:4173, https://aura-omega-rosy.vercel.app
```

`AUTH0_AUDIENCE` is optional. Leave it blank unless you created an Auth0 API. If you do create one, the value must exactly match that API's **Identifier** in Auth0. Do not use the Vercel app URL as the audience unless an Auth0 API exists with that exact identifier.

## Admin + RLS

Run the updated `database/schema.sql` against Neon to activate Postgres row-level security, then run `database/seed.sql` if you want demo supply. The seed script now sets an admin session context before inserting sample rows.

Use a Neon application role for `DATABASE_URL` that does **not** have `BYPASSRLS`. The schema enables and forces RLS across user, booking, cleaning, inventory, feedback, memory, mission, and payout tables.

Bootstrap the first admin with either:

```bash
AURA_ADMIN_EMAILS="you@example.com"
```

or the stable Auth0 subject:

```bash
AURA_ADMIN_SUBJECTS="auth0|xxxxxxxx"
```

AURA also honors Auth0 role/permission claims containing `admin`, `operator`, `aura:admin`, `admin:all`, or `read:admin`. Admins see the hidden **Admin** control plane after sign-in.
