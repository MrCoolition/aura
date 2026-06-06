import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function POST(request) {
  const body = await readJson(request);
  const rating = Number(body.rating || 5);
  const tipCents = Number(body.tipCents || 0);
  const note = String(body.note || "").trim();
  const sentiment = rating >= 4.5 ? "positive" : "needs_attention";
  const coachingNotes =
    rating >= 4.5
      ? "Reinforce this assistant for similar households."
      : "Trigger concierge review before next match.";
  const sql = await getSql();

  if (!sql) {
    return json(missingDatabasePayload("feedback", { rating, tip_cents: tipCents, note }));
  }

  const rows = await sql`
    insert into feedback_events (
      rating,
      tip_cents,
      client_note,
      sentiment,
      coaching_notes
    )
    values (
      ${rating},
      ${tipCents},
      ${note},
      ${sentiment},
      ${coachingNotes}
    )
    returning id, rating, tip_cents, sentiment, created_at
  `;

  return json({
    ok: true,
    mode: "database",
    data: rows[0],
    message: "Feedback saved. Quality signals are now available for ranking and coaching."
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return OPTIONS(request);
    }

    if (request.method === "POST") {
      return POST(request);
    }

    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
