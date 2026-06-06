import { demoInventoryDetections } from "../server/demo-data.js";
import { requireAuth, upsertAuraUser } from "../server/auth.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.response) return auth.response;

  const body = await readJson(request);
  const fileName = String(body.fileName || "inventory-upload.jpg").trim();
  const detectedItems = Array.isArray(body.detectedItems) && body.detectedItems.length
    ? body.detectedItems
    : demoInventoryDetections;
  const sql = await getSql();

  if (!sql) {
    return json(
      missingDatabasePayload("inventory_scan", {
        file_name: fileName,
        detections: detectedItems,
        auth_subject: auth.user.sub
      })
    );
  }

  const auraUser = await upsertAuraUser(sql, auth.user);

  const scanRows = await sql`
    insert into inventory_image_scans (
      client_user_id,
      source_file_name,
      provider,
      status,
      raw_result
    )
    values (
      ${auraUser.id},
      ${fileName},
      'aura-browser-demo',
      'processed',
      ${JSON.stringify({ detections: detectedItems })}::jsonb
    )
    returning id, source_file_name, status, created_at
  `;

  for (const item of detectedItems) {
    await sql`
      insert into image_scan_detections (
        scan_id,
        item_name,
        item_status,
        recommended_action,
        confidence
      )
      values (
        ${scanRows[0].id},
        ${String(item.item || "Detected item")},
        ${String(item.status || "Review")},
        ${String(item.action || "Review with assistant")},
        0.82
      )
    `;
  }

  return json({
    ok: true,
    mode: "database",
    data: { scan: scanRows[0], detections: detectedItems },
    message: "Inventory scan saved. AURA can now turn detections into assistant tasks."
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
