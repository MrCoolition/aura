import { localMemoryNodes } from "../server/local-data.js";
import { requireAuth, runWithUserContext, upsertAuraUser } from "../server/auth.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("memory_nodes", localMemoryNodes));
  }

  const auraUser = await upsertAuraUser(sql, auth.user);
  const [nodes] = await runWithUserContext(sql, auraUser, [
    sql`
      select label, memory_value as value, strength
      from aura_memory_nodes
      order by strength desc, updated_at desc
      limit 20
    `
  ]);

  return json({ ok: true, mode: "database", data: nodes });
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const label = String(body.label || "Preference").trim();
  const value = String(body.value || body.memory_value || "").trim();
  const strength = Math.max(1, Math.min(100, Number(body.strength || 72)));
  const sql = await getSql();

  if (!value) {
    return json({ ok: false, message: "value is required" }, 400);
  }

  if (!sql) {
    return json(missingDatabasePayload("memory_node", { label, value, strength, auth_subject: auth.user.sub }));
  }

  const auraUser = await upsertAuraUser(sql, auth.user);

  const [rows] = await runWithUserContext(sql, auraUser, [
    sql`
      insert into aura_memory_nodes (client_user_id, label, memory_value, strength, source)
      values (${auraUser.id}, ${label}, ${value}, ${strength}, 'aura-web')
      returning id, label, memory_value as value, strength, source, updated_at
    `
  ]);

  return json({ ok: true, mode: "database", data: rows[0] });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    if (request.method === "POST") return POST(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
