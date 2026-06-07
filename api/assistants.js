import { getSql, json } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  const sql = await getSql();

  if (!sql) {
    return json({
      ok: true,
      mode: "empty",
      resource: "assistants",
      data: [],
      message: "No verified assistant supply is connected yet."
    });
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
      and id::text not in (
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
      )
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
