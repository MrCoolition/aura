import { requireAuth } from "../../server/auth.js";
import { databaseErrorPayload, databaseErrorStatus, getSql, json } from "../../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  let sql;
  try {
    sql = await getSql();
  } catch (error) {
    const payload = databaseErrorPayload(error, "db_health");
    return json(payload, databaseErrorStatus(payload.code));
  }

  if (!sql) {
    return json(
      {
        ok: false,
        mode: "local",
        resource: "db_health",
        code: "DATABASE_NOT_CONFIGURED",
        message: "DATABASE_URL is not available to this deployment."
      },
      503
    );
  }

  try {
    const [ping] = await sql`
      select
        current_database() as database,
        current_user as user_name,
        now() as checked_at
    `;
    const tableRows = await sql`
      select
        table_name,
        to_regclass('public.' || table_name) is not null as installed
      from (
        values
          ('aura_users'),
          ('user_preferences'),
          ('client_profiles'),
          ('assistant_profiles'),
          ('service_requests'),
          ('bookings'),
          ('cleaning_plans'),
          ('inventory_locations'),
          ('inventory_image_scans'),
          ('feedback_events')
      ) as required(table_name)
      order by table_name
    `;
    const missingTables = tableRows.filter((row) => !row.installed).map((row) => row.table_name);

    return json(
      {
        ok: missingTables.length === 0,
        mode: "database",
        resource: "db_health",
        code: missingTables.length ? "SCHEMA_NOT_INSTALLED" : "DATABASE_READY",
        message: missingTables.length
          ? "Database connected, but the AURA tables are not installed yet."
          : "Database is connected and the core AURA tables are installed.",
        data: {
          database: ping?.database || "",
          checked_at: ping?.checked_at || new Date().toISOString(),
          required_tables: tableRows,
          missing_tables: missingTables
        }
      },
      missingTables.length ? 503 : 200
    );
  } catch (error) {
    const payload = databaseErrorPayload(error, "db_health");
    return json(payload, databaseErrorStatus(payload.code));
  }
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
