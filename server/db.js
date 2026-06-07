let cachedSql = null;

export async function getSql() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!cachedSql) {
    const { neon } = await import("@neondatabase/serverless");
    cachedSql = neon(process.env.DATABASE_URL);
  }

  return cachedSql;
}

export function json(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function missingDatabasePayload(resource, data) {
  return {
    ok: true,
    mode: "local",
    resource,
    data,
    message: "Local fallback returned. Set DATABASE_URL on Vercel to persist this resource in Neon."
  };
}
