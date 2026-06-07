import { requireAuth, runWithUserContext, upsertAuraUser } from "../server/auth.js";
import {
  databaseErrorPayload,
  databaseErrorStatus,
  getSql,
  json,
  missingDatabasePayload,
  readJson
} from "../server/db.js";
import { installAuraSchema } from "../server/migrate.js";

const defaultPreferences = {
  mode: "hire",
  defaultService: "home",
  defaultBudget: "140",
  defaultUrgency: "today",
  intake: {
    mode: "client",
    client: {
      market: "",
      homeType: "Condo",
      cadence: "Weekly flow",
      budgetStyle: "140",
      services: ["Home reset", "Calendar", "Errands", "Inventory"],
      preferences: ["Topo Chico glass bottles", "White towels folded thirds", "Late seating, quiet room"],
      boundaries: ["Ask before substitutions", "Photo proof before checkout"],
      access: "Front desk release",
      proof: "Photo proof"
    },
    assistant: {
      market: "",
      radius: "8 miles",
      hours: "24",
      minimum: "85",
      services: ["Home reset", "Errands", "Inventory", "Events"],
      strengths: ["Hotel reset standards", "Receipt capture", "Hosting prep"],
      filters: ["No heavy lifting", "Premium routes preferred"],
      availability: ["Weekday mornings", "Afternoons", "Rush windows"],
      payoutStrategy: "High trust, high payout"
    }
  },
  cleanprint: {
    level: "reset",
    priority: "detail",
    rooms: ["bathrooms", "kitchens", "living-areas", "sleeping-areas"]
  },
  market: ""
};

export async function OPTIONS() {
  return json({ ok: true });
}

async function loadProfileFromDatabase(sql, authUser) {
  const auraUser = await upsertAuraUser(sql, authUser);
  const [rows] = await runWithUserContext(sql, auraUser, [
    sql`
      select preferences
      from user_preferences
      where user_id = ${auraUser.id} and namespace = 'aura'
      limit 1
    `
  ]);

  return { auraUser, preferences: rows[0]?.preferences || defaultPreferences };
}

async function saveProfileToDatabase(sql, authUser, preferences) {
  const auraUser = await upsertAuraUser(sql, authUser);
  const [rows] = await runWithUserContext(sql, auraUser, [
    sql`
      insert into user_preferences (
        user_id,
        namespace,
        preferences
      )
      values (
        ${auraUser.id},
        'aura',
        ${JSON.stringify(preferences)}::jsonb
      )
      on conflict (user_id, namespace) do update set
        preferences = excluded.preferences,
        updated_at = now()
      returning id, namespace, preferences, updated_at
    `
  ]);

  return { auraUser, preferences: rows[0].preferences };
}

async function runWithSchemaBootstrap(sql, operation) {
  try {
    return { migrated: false, migration: null, value: await operation() };
  } catch (error) {
    const payload = databaseErrorPayload(error, "profile");
    if (payload.code !== "SCHEMA_NOT_INSTALLED") {
      return { error: payload };
    }

    try {
      const migration = await installAuraSchema(sql);
      return { migrated: true, migration, value: await operation() };
    } catch (migrationError) {
      const migrationPayload = databaseErrorPayload(migrationError, "profile");
      return {
        error: {
          ...migrationPayload,
          code: migrationPayload.code === "SCHEMA_NOT_INSTALLED" ? "SCHEMA_INSTALL_FAILED" : migrationPayload.code,
          message:
            migrationPayload.code === "SCHEMA_NOT_INSTALLED"
              ? "AURA tried to install the database tables, but the schema install did not complete."
              : migrationPayload.message
        }
      };
    }
  }
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  let sql;
  try {
    sql = await getSql();
  } catch (error) {
    const payload = databaseErrorPayload(error, "profile");
    return json(payload, databaseErrorStatus(payload.code));
  }

  if (!sql) {
    return json(
      missingDatabasePayload("profile", {
        user: auth.user,
        preferences: defaultPreferences
      })
    );
  }

  const loaded = await runWithSchemaBootstrap(sql, () => loadProfileFromDatabase(sql, auth.user));
  if (loaded.error) {
    const payload = loaded.error;
    return json(payload, databaseErrorStatus(payload.code));
  }

  return json({
    ok: true,
    mode: "database",
    migrated: loaded.migrated,
    migration: loaded.migration,
    data: {
      user: loaded.value.auraUser,
      preferences: loaded.value.preferences
    }
  });
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const preferences = {
    ...defaultPreferences,
    ...(typeof body.preferences === "object" && body.preferences ? body.preferences : {})
  };
  let sql;
  try {
    sql = await getSql();
  } catch (error) {
    const payload = databaseErrorPayload(error, "profile");
    return json(payload, databaseErrorStatus(payload.code));
  }

  if (!sql) {
    return json(
      {
        ok: false,
        mode: "local",
        code: "DATABASE_NOT_CONFIGURED",
        message: "Profile saving is not connected on this deployment.",
        data: { user: auth.user }
      },
      503
    );
  }

  const saved = await runWithSchemaBootstrap(sql, () => saveProfileToDatabase(sql, auth.user, preferences));
  if (saved.error) {
    const payload = saved.error;
    return json(payload, databaseErrorStatus(payload.code));
  }

  return json({
    ok: true,
    mode: "database",
    migrated: saved.migrated,
    migration: saved.migration,
    data: { user: saved.value.auraUser, preferences: saved.value.preferences }
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
