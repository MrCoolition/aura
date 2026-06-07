import { requireAuth, roleForAuthUser } from "../../server/auth.js";
import { databaseErrorPayload, databaseErrorStatus, getSql, json } from "../../server/db.js";
import { coreSchemaStatus, installAuraSchema } from "../../server/migrate.js";

export async function OPTIONS() {
  return json({ ok: true });
}

function canBootstrapSchema(authUser, schemaStatus) {
  const role = roleForAuthUser(authUser);
  return ["admin", "operator"].includes(role) || !schemaStatus.ready;
}

async function migrationContext(request) {
  const auth = await requireAuth(request);
  if (auth.response) return { response: auth.response };

  let sql;
  try {
    sql = await getSql();
  } catch (error) {
    const payload = databaseErrorPayload(error, "schema_migration");
    return { response: json(payload, databaseErrorStatus(payload.code)) };
  }

  if (!sql) {
    return {
      response: json(
        {
          ok: false,
          mode: "local",
          resource: "schema_migration",
          code: "DATABASE_NOT_CONFIGURED",
          message: "DATABASE_URL is not available to this deployment."
        },
        503
      )
    };
  }

  let schemaStatus;
  try {
    schemaStatus = await coreSchemaStatus(sql);
  } catch (error) {
    const payload = databaseErrorPayload(error, "schema_migration");
    return { response: json(payload, databaseErrorStatus(payload.code)) };
  }

  return { auth, sql, schemaStatus };
}

export async function GET(request) {
  const context = await migrationContext(request);
  if (context.response) return context.response;

  return json({
    ok: context.schemaStatus.ready,
    mode: "database",
    resource: "schema_migration",
    code: context.schemaStatus.ready ? "DATABASE_READY" : "SCHEMA_NOT_INSTALLED",
    message: context.schemaStatus.ready
      ? "AURA database schema is installed."
      : "Database connected, but the AURA tables are not installed yet.",
    data: {
      can_migrate: canBootstrapSchema(context.auth.user, context.schemaStatus),
      required_tables: context.schemaStatus.requiredTables,
      missing_tables: context.schemaStatus.missingTables
    }
  });
}

export async function POST(request) {
  const context = await migrationContext(request);
  if (context.response) return context.response;

  if (!canBootstrapSchema(context.auth.user, context.schemaStatus)) {
    return json({ ok: false, code: "ADMIN_REQUIRED", message: "Admin access required" }, 403);
  }

  try {
    const migration = context.schemaStatus.ready ? { statementCount: 0, executed: 0, durationMs: 0 } : await installAuraSchema(context.sql);
    const nextStatus = await coreSchemaStatus(context.sql);

    return json(
      {
        ok: nextStatus.ready,
        mode: "database",
        resource: "schema_migration",
        code: nextStatus.ready ? "DATABASE_READY" : "SCHEMA_INSTALL_FAILED",
        message: nextStatus.ready
          ? "AURA database schema is installed."
          : "AURA tried to install the database tables, but the schema install did not complete.",
        data: {
          migration,
          required_tables: nextStatus.requiredTables,
          missing_tables: nextStatus.missingTables
        }
      },
      nextStatus.ready ? 200 : 503
    );
  } catch (error) {
    const payload = databaseErrorPayload(error, "schema_migration");
    return json(payload, databaseErrorStatus(payload.code));
  }
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
