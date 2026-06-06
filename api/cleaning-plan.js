import { demoCleaningRooms } from "../server/demo-data.js";
import { getSql, json, missingDatabasePayload, readJson } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  return json({ ok: true, mode: "demo", data: demoCleaningRooms });
}

function normalizedRooms(rooms) {
  if (!Array.isArray(rooms)) return [];

  return rooms
    .map((room, roomIndex) => {
      const tasks = Array.isArray(room.tasks)
        ? room.tasks
            .map((task, taskIndex) => ({
              label: String(task.label || task || "").trim(),
              position: Number(task.position || taskIndex + 1),
              requiresPhoto: Boolean(task.requiresPhoto || task.requires_photo)
            }))
            .filter((task) => task.label)
        : [];

      return {
        name: String(room.name || "Room").trim(),
        zone: String(room.zone || "General").trim(),
        position: Number(room.position || roomIndex + 1),
        estimatedMinutes: Math.max(0, Number(room.estimatedMinutes || room.estimated_minutes || 0)),
        proofCount: Math.max(0, Number(room.proofCount || room.proof_count || 0)),
        tasks
      };
    })
    .filter((room) => room.name && room.tasks.length);
}

export async function POST(request) {
  const body = await readJson(request);
  const rooms = normalizedRooms(body.rooms);

  if (!rooms.length) {
    return json({ ok: false, message: "rooms with tasks are required" }, 400);
  }

  const level = String(body.level || "reset").trim();
  const priority = String(body.priority || "detail").trim();
  const taskCount = rooms.reduce((sum, room) => sum + room.tasks.length, 0);
  const proofCount = rooms.reduce((sum, room) => sum + room.proofCount, 0);
  const estimatedMinutes = rooms.reduce((sum, room) => sum + room.estimatedMinutes, 0);
  const planPayload = {
    level,
    priority,
    market: String(body.market || "Miami").trim(),
    rooms,
    generatedBy: "cleanprint-builder"
  };
  const sql = await getSql();

  if (!sql) {
    return json(
      missingDatabasePayload("cleaning_plan", {
        id: `demo_cleanprint_${Date.now()}`,
        level,
        priority,
        room_count: rooms.length,
        task_count: taskCount,
        proof_count: proofCount,
        estimated_minutes: estimatedMinutes,
        rooms
      })
    );
  }

  const planRows = await sql`
    insert into cleaning_plans (
      level,
      priority,
      room_count,
      task_count,
      proof_count,
      estimated_minutes,
      status,
      payload
    )
    values (
      ${level},
      ${priority},
      ${rooms.length},
      ${taskCount},
      ${proofCount},
      ${estimatedMinutes},
      'ready',
      ${JSON.stringify(planPayload)}::jsonb
    )
    returning id, level, priority, room_count, task_count, proof_count, estimated_minutes, status, created_at
  `;

  for (const room of rooms) {
    const roomRows = await sql`
      insert into cleaning_plan_rooms (
        cleaning_plan_id,
        room_name,
        room_zone,
        estimated_minutes,
        proof_count,
        position
      )
      values (
        ${planRows[0].id},
        ${room.name},
        ${room.zone},
        ${room.estimatedMinutes},
        ${room.proofCount},
        ${room.position}
      )
      returning id
    `;

    for (const task of room.tasks) {
      await sql`
        insert into cleaning_plan_tasks (
          cleaning_plan_room_id,
          label,
          position,
          requires_photo
        )
        values (
          ${roomRows[0].id},
          ${task.label},
          ${task.position},
          ${task.requiresPhoto}
        )
      `;
    }
  }

  return json({
    ok: true,
    mode: "database",
    data: { ...planRows[0], rooms },
    message: "Cleanprint saved. AURA can dispatch the room plan with proof requirements."
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
