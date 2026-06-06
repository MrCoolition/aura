insert into service_categories (slug, name, description, base_price_cents)
values
  ('home', 'Home reset', 'Premium cleaning, staging, restock, and guest prep.', 14000),
  ('calendar', 'Calendar rescue', 'Smart booking, rescheduling, route planning, and reminders.', 12000),
  ('errands', 'Errand route', 'Shopping, returns, dry cleaning, pickup, and drop-off loops.', 9500),
  ('travel', 'Travel support', 'Flights, hotels, cars, packing, and dinner holds.', 18000),
  ('inventory', 'Inventory scan', 'Image based household inventory and restock actions.', 8500)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  base_price_cents = excluded.base_price_cents;

insert into aura_users (id, role, full_name, email, phone)
values
  ('11111111-1111-4111-8111-111111111111', 'assistant', 'Marisol Vega', 'marisol@aura.local', '+13055550101'),
  ('22222222-2222-4222-8222-222222222222', 'assistant', 'Dante Reyes', 'dante@aura.local', '+13055550102'),
  ('33333333-3333-4333-8333-333333333333', 'assistant', 'Imani King', 'imani@aura.local', '+13055550103'),
  ('44444444-4444-4444-8444-444444444444', 'client', 'AURA Demo Client', 'demo@aura.local', '+13055550104')
on conflict (email) do nothing;

insert into assistant_profiles (
  id,
  user_id,
  display_name,
  headline,
  bio,
  home_market,
  status,
  verification_level,
  hourly_rate_cents,
  rating,
  acceptance_rate,
  completed_jobs,
  eta_minutes,
  ai_tags
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'Marisol V.',
    'Estate resets, hosting, pantry flow',
    'Luxury hotel standards with home memory.',
    'Miami',
    'active',
    'elite_verified',
    6800,
    4.98,
    96.00,
    612,
    18,
    '["Home reset", "Events", "Inventory"]'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'Dante R.',
    'Calendar rescue, travel, reservations',
    'Turns chaotic days into clean routes.',
    'Miami',
    'active',
    'elite_verified',
    7400,
    4.96,
    93.00,
    438,
    11,
    '["Calendar", "Travel", "Dining"]'::jsonb
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '33333333-3333-4333-8333-333333333333',
    'Imani K.',
    'Errands, shopping, client taste profiles',
    'Precise, warm, and fast.',
    'Miami',
    'active',
    'elite_verified',
    6200,
    4.94,
    98.00,
    521,
    24,
    '["Errands", "Wardrobe", "Gifts"]'::jsonb
  )
on conflict (id) do update set
  headline = excluded.headline,
  bio = excluded.bio,
  status = excluded.status,
  rating = excluded.rating,
  completed_jobs = excluded.completed_jobs,
  ai_tags = excluded.ai_tags;

insert into client_profiles (user_id, default_market, household_notes, preference_memory, membership_tier)
values (
  '44444444-4444-4444-8444-444444444444',
  'Miami',
  '{"building_access": "Front desk cleared after ID check", "pet": "No pets"}'::jsonb,
  '{"water": "Topo Chico", "towels": "white only", "dining": "late seating preferred"}'::jsonb,
  'black'
)
on conflict do nothing;

insert into task_templates (id, category_slug, title, description, default_duration_minutes)
values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'home', 'Hotel-level home reset', 'Cleaning and staging flow for premium client spaces.', 120),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'errands', 'Errand route', 'Batch errands by location, time sensitivity, and proof needs.', 90),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'travel', 'Travel ready', 'Build a calm travel plan around timing, packing, and reservations.', 75)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  default_duration_minutes = excluded.default_duration_minutes;

insert into task_template_items (template_id, position, label, requires_photo, requires_client_confirmation)
values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 1, 'Clear surfaces', true, false),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 2, 'Fresh towels', true, false),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 3, 'Restock drinks', true, false),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 4, 'Scent check', false, true),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 1, 'Confirm stops', false, true),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 2, 'Optimize route', false, false),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 3, 'Track receipts', true, false),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 1, 'Flight options', false, true),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 2, 'Packing list', false, true),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 3, 'Dining hold', false, false)
on conflict do nothing;
