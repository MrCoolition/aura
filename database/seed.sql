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

insert into cleaning_plans (
  id,
  client_user_id,
  level,
  priority,
  room_count,
  task_count,
  proof_count,
  estimated_minutes,
  status,
  payload
)
values (
  '12121212-1212-4121-8121-121212121212',
  '44444444-4444-4444-8444-444444444444',
  'reset',
  'detail',
  4,
  19,
  10,
  102,
  'ready',
  '{"source": "seed", "name": "Guest-ready Cleanprint"}'::jsonb
)
on conflict (id) do update set
  task_count = excluded.task_count,
  proof_count = excluded.proof_count,
  estimated_minutes = excluded.estimated_minutes,
  payload = excluded.payload;

insert into cleaning_plan_rooms (
  id,
  cleaning_plan_id,
  room_name,
  room_zone,
  estimated_minutes,
  proof_count,
  position
)
values
  ('13131313-1313-4131-8131-131313131313', '12121212-1212-4121-8121-121212121212', 'Kitchen', 'Food + surfaces', 34, 3, 1),
  ('14141414-1414-4141-8141-141414141414', '12121212-1212-4121-8121-121212121212', 'Primary bath', 'Spa standard', 28, 3, 2),
  ('15151515-1515-4151-8151-151515151515', '12121212-1212-4121-8121-121212121212', 'Living room', 'Flow + comfort', 24, 2, 3),
  ('16161616-1616-4161-8161-161616161616', '12121212-1212-4121-8121-121212121212', 'Entry', 'First impression', 16, 2, 4)
on conflict (id) do update set
  estimated_minutes = excluded.estimated_minutes,
  proof_count = excluded.proof_count;

insert into cleaning_plan_tasks (id, cleaning_plan_room_id, label, position, requires_photo)
values
  ('17171717-1717-4171-8171-171717171717', '13131313-1313-4131-8131-131313131313', 'Clear counters and stage items by use', 1, false),
  ('18181818-1818-4181-8181-181818181818', '13131313-1313-4131-8131-131313131313', 'Sanitize sink, faucet, handles, and backsplash', 2, false),
  ('19191919-1919-4191-8191-191919191919', '13131313-1313-4131-8131-131313131313', 'Final photo proof from kitchen entry', 3, true),
  ('20202020-2020-4202-8202-202020202020', '14141414-1414-4141-8141-141414141414', 'Disinfect vanity, sink, faucet, and mirror', 1, false),
  ('21212121-2121-4212-8212-212121212121', '14141414-1414-4141-8141-141414141414', 'Replace towels with saved fold standard', 2, false),
  ('22222222-2222-4222-8222-222222222221', '14141414-1414-4141-8141-141414141414', 'Final photo proof from bath threshold', 3, true),
  ('23232323-2323-4232-8232-232323232323', '15151515-1515-4151-8151-151515151515', 'Reset pillows, throws, remotes, books, and surfaces', 1, false),
  ('24242424-2424-4242-8242-242424242424', '15151515-1515-4151-8151-151515151515', 'Final photo proof from seating angle', 2, true),
  ('25252525-2525-4252-8252-252525252525', '16161616-1616-4161-8161-161616161616', 'Clear entry clutter and align keys, shoes, and bags', 1, false),
  ('26262626-2626-4262-8262-262626262626', '16161616-1616-4161-8161-161616161616', 'Final photo proof from arrival angle', 2, true)
on conflict (id) do update set
  label = excluded.label,
  position = excluded.position,
  requires_photo = excluded.requires_photo;

insert into aura_memory_nodes (client_user_id, label, memory_value, strength, source)
values
  ('44444444-4444-4444-8444-444444444444', 'Dining', 'Late seating, quiet tables', 92, 'seed'),
  ('44444444-4444-4444-8444-444444444444', 'Home', 'White towels, citrus scent', 88, 'seed'),
  ('44444444-4444-4444-8444-444444444444', 'Inventory', 'Topo Chico, olive oil, pods', 84, 'seed'),
  ('44444444-4444-4444-8444-444444444444', 'Calendar', 'No calls after airport days', 79, 'seed')
on conflict do nothing;

insert into autopilot_loops (client_user_id, title, body, readiness, estimated_value)
values
  ('44444444-4444-4444-8444-444444444444', 'Guest Mode', 'Arm a 2-hour reset before guests arrive.', 91, '$54 saved friction'),
  ('44444444-4444-4444-8444-444444444444', 'Fridge Sentinel', 'Restock before the week gets loud.', 84, '18 min decision saved'),
  ('44444444-4444-4444-8444-444444444444', 'Calendar Shield', 'Move a low-value call without touching protected focus time.', 78, '2.1h reclaimed')
on conflict do nothing;

insert into assistant_missions (assistant_profile_id, title, market, payout_cents, route_minutes, trust_score, mission_brief)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Penthouse reset + restock', 'Miami', 14800, 31, 97, 'Home reset, guest towels, sparkling water, reservation watch.'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Dry cleaning + gift run', 'Miami', 8600, 18, 91, 'Two pickups, one return, client taste profile attached.'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Travel calm pack', 'Miami', 12200, 42, 94, 'Packing list, car timing, dinner hold, weather note.')
on conflict do nothing;
