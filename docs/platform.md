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

3. Feedback engine
   - Ratings, tips, sentiment, and coaching notes feed assistant ranking.
   - Low-score jobs can trigger concierge review before the next match.

4. AI inventory by image
   - Image scans become detected household items and restock actions.
   - Detections can convert into shopping lists, cleaning prep, and recurring assistant tasks.

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
