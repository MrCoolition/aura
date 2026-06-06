create extension if not exists pgcrypto;

do $$
begin
  create type aura_user_role as enum ('client', 'assistant', 'operator', 'admin');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type assistant_status as enum ('draft', 'active', 'paused', 'suspended');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type request_status as enum ('draft', 'matching', 'booked', 'in_progress', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type booking_status as enum ('pending', 'accepted', 'on_route', 'in_progress', 'completed', 'cancelled', 'disputed');
exception when duplicate_object then null;
end $$;

create table if not exists aura_users (
  id uuid primary key default gen_random_uuid(),
  role aura_user_role not null,
  full_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references aura_users(id) on delete cascade,
  default_market text not null default 'Miami',
  household_notes jsonb not null default '{}'::jsonb,
  preference_memory jsonb not null default '{}'::jsonb,
  membership_tier text not null default 'plus',
  created_at timestamptz not null default now()
);

create table if not exists assistant_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references aura_users(id) on delete cascade,
  display_name text not null,
  headline text not null,
  bio text not null,
  home_market text not null,
  status assistant_status not null default 'draft',
  verification_level text not null default 'background_pending',
  hourly_rate_cents integer not null check (hourly_rate_cents >= 2500),
  platform_take_rate_bps integer not null default 1800 check (platform_take_rate_bps between 0 and 5000),
  rating numeric(3,2) not null default 5.00,
  acceptance_rate numeric(5,2) not null default 100.00,
  completed_jobs integer not null default 0,
  eta_minutes integer not null default 30,
  ai_tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  base_price_cents integer not null,
  is_active boolean not null default true
);

create table if not exists assistant_services (
  assistant_profile_id uuid references assistant_profiles(id) on delete cascade,
  service_category_id uuid references service_categories(id) on delete cascade,
  minimum_price_cents integer not null,
  primary key (assistant_profile_id, service_category_id)
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid references aura_users(id) on delete set null,
  client_name text,
  client_email text,
  service_category text not null,
  task_summary text not null,
  market text not null default 'Miami',
  location_label text,
  requested_start timestamptz,
  urgency text not null default 'today',
  budget_cents integer not null default 14000,
  status request_status not null default 'matching',
  ai_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id) on delete cascade,
  assistant_profile_id uuid references assistant_profiles(id) on delete set null,
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  status booking_status not null default 'pending',
  total_price_cents integer not null,
  platform_fee_cents integer not null,
  assistant_payout_cents integer not null,
  client_private_notes text,
  assistant_private_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists calendar_holds (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id) on delete cascade,
  candidate_start timestamptz not null,
  candidate_end timestamptz not null,
  score integer not null check (score between 0 and 100),
  reason text not null,
  status text not null default 'suggested',
  created_at timestamptz not null default now()
);

create table if not exists task_templates (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null,
  title text not null,
  description text not null,
  default_duration_minutes integer not null default 90,
  created_at timestamptz not null default now()
);

create table if not exists task_template_items (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references task_templates(id) on delete cascade,
  position integer not null,
  label text not null,
  requires_photo boolean not null default false,
  requires_client_confirmation boolean not null default false
);

create table if not exists job_checklist_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  label text not null,
  status text not null default 'open',
  proof_url text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists feedback_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete set null,
  assistant_profile_id uuid references assistant_profiles(id) on delete set null,
  client_user_id uuid references aura_users(id) on delete set null,
  rating numeric(2,1) not null check (rating between 1 and 5),
  tip_cents integer not null default 0,
  client_note text,
  sentiment text not null default 'positive',
  coaching_notes text,
  created_at timestamptz not null default now()
);

create table if not exists inventory_locations (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid references aura_users(id) on delete cascade,
  name text not null,
  room_type text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references inventory_locations(id) on delete cascade,
  name text not null,
  quantity numeric(10,2),
  unit text,
  status text not null default 'ok',
  restock_threshold numeric(10,2),
  preferred_vendor text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists inventory_image_scans (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid references aura_users(id) on delete set null,
  location_id uuid references inventory_locations(id) on delete set null,
  source_file_name text,
  provider text not null,
  status text not null default 'queued',
  raw_result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists image_scan_detections (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references inventory_image_scans(id) on delete cascade,
  inventory_item_id uuid references inventory_items(id) on delete set null,
  item_name text not null,
  item_status text,
  recommended_action text,
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  created_at timestamptz not null default now()
);

create table if not exists assistant_payouts (
  id uuid primary key default gen_random_uuid(),
  assistant_profile_id uuid references assistant_profiles(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  gross_cents integer not null,
  platform_fee_cents integer not null,
  net_cents integer not null,
  status text not null default 'pending',
  available_on date,
  created_at timestamptz not null default now()
);

create table if not exists marketplace_metrics_daily (
  metric_date date primary key,
  market text not null,
  requests_count integer not null default 0,
  completed_bookings integer not null default 0,
  gross_booking_value_cents bigint not null default 0,
  platform_revenue_cents bigint not null default 0,
  average_rating numeric(3,2) not null default 5.00
);

create table if not exists match_runs (
  id uuid primary key default gen_random_uuid(),
  service_request_id uuid references service_requests(id) on delete cascade,
  winning_assistant_profile_id uuid references assistant_profiles(id) on delete set null,
  service_category text not null,
  match_score integer not null check (match_score between 0 and 100),
  client_total_cents integer not null,
  platform_fee_cents integer not null,
  assistant_payout_cents integer not null,
  task_atoms jsonb not null default '[]'::jsonb,
  scorecard jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists aura_memory_nodes (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid references aura_users(id) on delete cascade,
  label text not null,
  memory_value text not null,
  strength integer not null default 72 check (strength between 1 and 100),
  source text not null default 'aura',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists autopilot_loops (
  id uuid primary key default gen_random_uuid(),
  client_user_id uuid references aura_users(id) on delete cascade,
  title text not null,
  body text not null,
  readiness integer not null default 72 check (readiness between 1 and 100),
  estimated_value text,
  status text not null default 'suggested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assistant_missions (
  id uuid primary key default gen_random_uuid(),
  assistant_profile_id uuid references assistant_profiles(id) on delete set null,
  title text not null,
  market text not null default 'Miami',
  payout_cents integer not null,
  route_minutes integer not null,
  trust_score integer not null check (trust_score between 0 and 100),
  mission_brief text not null,
  status text not null default 'available',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists idx_assistant_profiles_market_status on assistant_profiles (home_market, status, rating desc);
create index if not exists idx_service_requests_market_status on service_requests (market, status, created_at desc);
create index if not exists idx_bookings_assistant_status on bookings (assistant_profile_id, status, scheduled_start);
create index if not exists idx_feedback_assistant_created on feedback_events (assistant_profile_id, created_at desc);
create index if not exists idx_inventory_items_location_status on inventory_items (location_id, status);
create index if not exists idx_match_runs_request_created on match_runs (service_request_id, created_at desc);
create index if not exists idx_memory_nodes_client_strength on aura_memory_nodes (client_user_id, strength desc);
create index if not exists idx_autopilot_loops_client_status on autopilot_loops (client_user_id, status, readiness desc);
create index if not exists idx_assistant_missions_market_status on assistant_missions (market, status, trust_score desc);

create or replace view assistant_marketplace_view as
select
  ap.id,
  ap.display_name,
  ap.headline,
  ap.home_market,
  ap.status,
  ap.hourly_rate_cents,
  ap.rating,
  ap.completed_jobs,
  ap.eta_minutes,
  ap.ai_tags,
  ap.acceptance_rate
from assistant_profiles ap;
