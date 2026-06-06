import { demoMemoryNodes } from "../server/demo-data.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("memory_nodes", demoMemoryNodes));
  }

  const nodes = await sql`
    select label, memory_value as value, strength
    from aura_memory_nodes
    order by strength desc, updated_at desc
    limit 20
  `;

  return json({ ok: true, mode: "database", data: nodes });
}

export async function POST(request) {
  const body = await readJson(request);
  const label = String(body.label || "Preference").trim();
  const value = String(body.value || body.memory_value || "").trim();
  const strength = Math.max(1, Math.min(100, Number(body.strength || 72)));
  const sql = await getSql();

  if (!value) {
    return json({ ok: false, message: "value is required" }, 400);
  }

  if (!sql) {
    return json(missingDatabasePayload("memory_node", { label, value, strength }));
  }

  const rows = await sql`
    insert into aura_memory_nodes (label, memory_value, strength, source)
    values (${label}, ${value}, ${strength}, 'aura-web')
    returning id, label, memory_value as value, strength, source, updated_at
  `;

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
