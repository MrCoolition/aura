# AURA Platform Blueprint

AURA is built as a two-sided marketplace:

- Clients hire assistants for premium daily-life work.
- Assistants earn from verified, routed, checklist-driven jobs.
- AURA monetizes through platform fees, memberships, assistant boosts, and recurring household plans.

## Product Pillars

1. Smart booking and rescheduling
   - Scores time windows by urgency, travel, weather, assistant ETA, and client preferences.
   - Converts conflicts into actionable reschedule suggestions.

2. Checklist intelligence
   - Every service category has repeatable playbooks.
   - Assistants complete steps with proof, notes, and client confirmations.
   - Cleanprint Builder generates room-by-room cleaning plans with timing, proof counts, and assistant-ready tasks.

3. Feedback engine
   - Ratings, tips, sentiment, and coaching notes feed assistant ranking.
   - Low-score jobs can trigger concierge review before the next match.

4. AI inventory by image
   - Image scans become detected household items and restock actions.
   - Detections can convert into shopping lists, cleaning prep, and recurring assistant tasks.

## Artillery Layer

1. Intent Reactor
   - Decomposes a client request into task atoms.
   - Scores assistant fit, route compression, friction saved, repeat odds, and platform take.
   - Persists match runs through `match_runs` when Neon is connected.

2. Lifeprint OS
   - Stores household memory as weighted nodes rather than flat notes.
   - Produces a pre-ask queue so AURA can suggest work before the client asks.
   - Uses `aura_memory_nodes` and `autopilot_loops` as the persistence layer.

3. Assistant Mission Control
   - Gives assistants a cockpit for payout gravity, route loops, trust proof, and weekly earnings.
   - Uses `assistant_missions` for future supply-side job dispatch.

## Data Model

Run `database/schema.sql` on Neon first, then `database/seed.sql` for demo data.

Core tables:

- `aura_users`
- `client_profiles`
- `assistant_profiles`
- `service_requests`
- `bookings`
- `booking_events`
- `calendar_holds`
- `task_templates`
- `job_checklist_items`
- `cleaning_plans`
- `cleaning_plan_rooms`
- `cleaning_plan_tasks`
- `feedback_events`
- `inventory_locations`
- `inventory_items`
- `inventory_image_scans`
- `image_scan_detections`
- `assistant_payouts`

## Vercel Setup

Set these environment variables in Vercel:

- `DATABASE_URL`
- `AURA_PLATFORM_FEE_BPS`
- `AURA_DEFAULT_MARKET`

The app is intentionally zero-build for fast deployment. `index.html`, `styles.css`, and `app.js` ship the client app. Files in `api/` are Vercel Functions and use Neon only when `DATABASE_URL` exists.

## Profit Loops

- Per booking platform fee, default 18%.
- Premium memberships for faster ETAs and household memory.
- Assistant paid boosts for verified specialties and priority market access.
- Recurring home plans for weekly resets, inventory, errands, and admin work.
