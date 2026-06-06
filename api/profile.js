import { requireAuth, runWithUserContext, upsertAuraUser } from "../server/auth.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

const defaultPreferences = {
  mode: "hire",
  defaultService: "home",
  defaultBudget: "140",
  defaultUrgency: "today",
  cleanprint: {
    level: "reset",
    priority: "detail",
    rooms: ["kitchen", "primary-bath", "living", "entry"]
  },
  market: "Miami"
};

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const sql = await getSql();
  if (!sql) {
    return json(
      missingDatabasePayload("profile", {
        user: auth.user,
        preferences: defaultPreferences
      })
    );
  }

  const auraUser = await upsertAuraUser(sql, auth.user);
  const [rows] = await runWithUserContext(sql, auraUser, [
    sql`
      select preferences
      from user_preferences
      where user_id = ${auraUser.id} and namespace = 'aura'
      limit 1
    `
  ]);

  return json({
    ok: true,
    mode: "database",
    data: {
      user: auraUser,
      preferences: rows[0]?.preferences || defaultPreferences
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
  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("profile", { user: auth.user, preferences }));
  }

  const auraUser = await upsertAuraUser(sql, auth.user);
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

  return json({ ok: true, mode: "database", data: { user: auraUser, preferences: rows[0].preferences } });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
