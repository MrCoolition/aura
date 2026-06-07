import { requireAuth } from "../../server/auth.js";
import { databaseErrorPayload, databaseErrorStatus, getSql, json } from "../../server/db.js";
import { coreSchemaStatus } from "../../server/migrate.js";

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
    const schemaStatus = await coreSchemaStatus(sql);

    return json(
      {
        ok: schemaStatus.ready,
        mode: "database",
        resource: "db_health",
        code: schemaStatus.ready ? "DATABASE_READY" : "SCHEMA_NOT_INSTALLED",
        message: schemaStatus.ready
          ? "Database is connected and the core AURA tables are installed."
          : "Database connected, but the AURA tables are not installed yet.",
        data: {
          database: ping?.database || "",
          checked_at: ping?.checked_at || new Date().toISOString(),
          required_tables: schemaStatus.requiredTables,
          missing_tables: schemaStatus.missingTables
        }
      },
      schemaStatus.ready ? 200 : 503
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
