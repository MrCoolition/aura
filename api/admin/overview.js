import { requireAuth, isAdminUser, runWithUserContext, upsertAuraUser } from "../../server/auth.js";
import { getSql, json, missingDatabasePayload } from "../../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const sql = await getSql();
  if (!sql) {
    return json(
      missingDatabasePayload("admin_overview", {
        user: { ...auth.user, role: "admin" },
        totals: {
          users: 4,
          service_requests: 12,
          cleanprints: 6,
          inventory_scans: 9,
          feedback_events: 4
        },
        users: [
          { id: "demo-admin", full_name: "AURA Admin", email: "admin@aura.local", role: "admin", created_at: new Date().toISOString() }
        ],
        serviceRequests: [],
        cleanprints: [],
        feedback: []
      })
    );
  }

  const auraUser = await upsertAuraUser(sql, auth.user);
  if (!isAdminUser(auraUser)) {
    return json({ ok: false, message: "Admin access required" }, 403);
  }

  const [totals, security, users, serviceRequests, cleanprints, inventoryScans, feedback] = await runWithUserContext(sql, auraUser, [
    sql`
      select
        (select count(*)::int from aura_users) as users,
        (select count(*)::int from service_requests) as service_requests,
        (select count(*)::int from cleaning_plans) as cleanprints,
        (select count(*)::int from inventory_image_scans) as inventory_scans,
        (select count(*)::int from feedback_events) as feedback_events
    `,
    sql`
      select
        count(*)::int as protected_tables,
        count(*) filter (where relrowsecurity)::int as rls_enabled,
        count(*) filter (where relforcerowsecurity)::int as rls_forced
      from pg_class
      where relname in (
        'aura_users',
        'user_preferences',
        'client_profiles',
        'assistant_profiles',
        'assistant_services',
        'service_requests',
        'bookings',
        'booking_events',
        'calendar_holds',
        'job_checklist_items',
        'cleaning_plans',
        'cleaning_plan_rooms',
        'cleaning_plan_tasks',
        'feedback_events',
        'inventory_locations',
        'inventory_items',
        'inventory_image_scans',
        'image_scan_detections',
        'match_runs',
        'aura_memory_nodes',
        'autopilot_loops',
        'assistant_missions',
        'assistant_payouts'
      )
    `,
    sql`
      select id, role, full_name, email, auth_subject, created_at
      from aura_users
      order by created_at desc
      limit 20
    `,
    sql`
      select id, client_user_id, client_name, client_email, service_category, task_summary, status, budget_cents, created_at
      from service_requests
      order by created_at desc
      limit 20
    `,
    sql`
      select id, client_user_id, level, priority, room_count, task_count, proof_count, estimated_minutes, status, created_at
      from cleaning_plans
      order by created_at desc
      limit 20
    `,
    sql`
      select id, client_user_id, source_file_name, provider, status, created_at
      from inventory_image_scans
      order by created_at desc
      limit 20
    `,
    sql`
      select id, client_user_id, assistant_profile_id, rating, tip_cents, sentiment, created_at
      from feedback_events
      order by created_at desc
      limit 20
    `
  ]);

  return json({
    ok: true,
    mode: "database",
    data: {
      user: auraUser,
      totals: totals[0],
      security: security[0],
      users,
      serviceRequests,
      cleanprints,
      inventoryScans,
      feedback
    }
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
