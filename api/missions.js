import { demoAssistantMissions } from "../server/demo-data.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("assistant_missions", demoAssistantMissions));
  }

  const missions = await sql`
    select title, market, payout_cents, route_minutes, trust_score, mission_brief, status
    from assistant_missions
    order by trust_score desc, payout_cents desc
    limit 20
  `;

  return json({ ok: true, mode: "database", data: missions });
}

export async function POST(request) {
  const body = await readJson(request);
  const title = String(body.title || "AURA mission").trim();
  const market = String(body.market || "Miami").trim();
  const payoutCents = Number(body.payoutCents || body.payout_cents || 10000);
  const routeMinutes = Number(body.routeMinutes || body.route_minutes || 30);
  const trustScore = Number(body.trustScore || body.trust_score || 90);
  const brief = String(body.missionBrief || body.mission_brief || "").trim();
  const sql = await getSql();

  if (!sql) {
    return json(
      missingDatabasePayload("assistant_mission", {
        title,
        market,
        payout_cents: payoutCents,
        route_minutes: routeMinutes,
        trust_score: trustScore,
        mission_brief: brief
      })
    );
  }

  const rows = await sql`
    insert into assistant_missions (
      title,
      market,
      payout_cents,
      route_minutes,
      trust_score,
      mission_brief
    )
    values (${title}, ${market}, ${payoutCents}, ${routeMinutes}, ${trustScore}, ${brief})
    returning id, title, market, payout_cents, route_minutes, trust_score, mission_brief, status
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
