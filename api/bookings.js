import { requireAuth, runWithUserContext, upsertAuraUser } from "../server/auth.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const taskSummary = String(body.taskSummary || "").trim();
  const serviceCategory = String(body.serviceCategory || "home").trim();
  const urgency = String(body.urgency || "today").trim();
  const budgetCents = Number(body.budgetCents || 14000);
  const market = String(body.market || process.env.AURA_DEFAULT_MARKET || "Your market").trim();
  const matchScore = Math.max(0, Math.min(100, Number(body.matchScore || 88)));

  if (!taskSummary) {
    return json({ ok: false, message: "taskSummary is required" }, 400);
  }

  const platformFeeBps = Number(process.env.AURA_PLATFORM_FEE_BPS || 1800);
  const platformFeeCents = Number(body.platformFeeCents || Math.round(budgetCents * (platformFeeBps / 10000)));
  const assistantPayoutCents = budgetCents - platformFeeCents;
  const sql = await getSql();

  if (!sql) {
    return json(
      missingDatabasePayload("booking", {
        id: `local_${Date.now()}`,
        task_summary: taskSummary,
        service_category: serviceCategory,
        urgency,
        market,
        budget_cents: budgetCents,
        platform_fee_cents: platformFeeCents,
        assistant_payout_cents: assistantPayoutCents,
        auth_subject: auth.user.sub
      })
    );
  }

  const auraUser = await upsertAuraUser(sql, auth.user);

  const [rows] = await runWithUserContext(sql, auraUser, [
    sql`
      insert into service_requests (
        client_name,
        client_email,
        client_user_id,
        service_category,
        task_summary,
        market,
        urgency,
        budget_cents,
        ai_plan
      )
      values (
        ${auraUser.full_name || "AURA Web Client"},
        ${auraUser.email || "client@aura.local"},
        ${auraUser.id},
        ${serviceCategory},
        ${taskSummary},
        ${market},
        ${urgency},
        ${budgetCents},
        ${JSON.stringify({
          platformFeeCents,
          assistantPayoutCents,
          matchScore,
          source: "web-console"
        })}::jsonb
      )
      returning id, status, service_category, task_summary, budget_cents, created_at
    `
  ]);

  await runWithUserContext(sql, auraUser, [
    sql`
      insert into match_runs (
        service_request_id,
        service_category,
        match_score,
        client_total_cents,
        platform_fee_cents,
        assistant_payout_cents,
        task_atoms,
        scorecard
      )
      values (
        ${rows[0].id},
        ${serviceCategory},
        ${matchScore},
        ${budgetCents},
        ${platformFeeCents},
        ${assistantPayoutCents},
        ${JSON.stringify(body.taskAtoms || [])}::jsonb,
        ${JSON.stringify({
          assistantId: body.assistantId || null,
          urgency,
          market,
          source: "intent-reactor"
        })}::jsonb
      )
    `
  ]);

  return json({
    ok: true,
    mode: "database",
    data: rows[0],
    message: "Booking request saved. AURA is ready to match the best assistant."
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
