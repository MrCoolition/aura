import { demoAssistants } from "../server/demo-data.js";
import { getSql, json, missingDatabasePayload } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("assistants", demoAssistants));
  }

  const assistants = await sql`
    select
      id,
      display_name,
      headline,
      home_market,
      hourly_rate_cents,
      rating,
      completed_jobs,
      eta_minutes,
      ai_tags
    from assistant_marketplace_view
    where status = 'active'
    order by rating desc, completed_jobs desc
    limit 12
  `;

  return json({ ok: true, mode: "database", data: assistants });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return OPTIONS(request);
    }

    if (request.method === "GET") {
      return GET(request);
    }

    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
