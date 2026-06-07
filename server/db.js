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

export function databaseErrorCode(error) {
  const pgCode = String(error?.code || "");
  const message = String(error?.message || "");

  if (["42P01", "42704", "42883"].includes(pgCode) || /relation .* does not exist|type .* does not exist|function .* does not exist/i.test(message)) {
    return "SCHEMA_NOT_INSTALLED";
  }

  if (["28P01", "28000"].includes(pgCode) || /password authentication failed|role .* does not exist|authentication failed/i.test(message)) {
    return "DATABASE_AUTH_FAILED";
  }

  if (pgCode === "3D000" || /database .* does not exist/i.test(message)) {
    return "DATABASE_NOT_FOUND";
  }

  if (pgCode === "42501" || /permission denied|row-level security/i.test(message)) {
    return "DATABASE_PERMISSION_DENIED";
  }

  if (
    ["08000", "08001", "08003", "08004", "08006", "53300", "57P01", "57P02", "57P03"].includes(pgCode) ||
    /connection|connect|timeout|fetch failed|enotfound|etimedout|econnrefused/i.test(message)
  ) {
    return "DATABASE_CONNECTION_FAILED";
  }

  return "DATABASE_QUERY_FAILED";
}

export function databaseErrorMessage(code) {
  const messages = {
    SCHEMA_NOT_INSTALLED: "Database connected, but the AURA tables are not installed yet.",
    SCHEMA_INSTALL_FAILED: "AURA tried to install the database tables, but the schema install did not complete.",
    DATABASE_AUTH_FAILED: "Database connection was rejected. Check the saved connection credentials.",
    DATABASE_NOT_FOUND: "Database connection points to a database that does not exist.",
    DATABASE_PERMISSION_DENIED: "Database rejected this profile write.",
    DATABASE_CONNECTION_FAILED: "Database connection failed from this deployment.",
    DATABASE_QUERY_FAILED: "Database query failed while saving the profile."
  };

  return messages[code] || messages.DATABASE_QUERY_FAILED;
}

export function databaseErrorStatus(code) {
  if (code === "DATABASE_PERMISSION_DENIED") return 403;
  if (["SCHEMA_NOT_INSTALLED", "SCHEMA_INSTALL_FAILED", "DATABASE_AUTH_FAILED", "DATABASE_NOT_FOUND", "DATABASE_CONNECTION_FAILED"].includes(code)) {
    return 503;
  }
  return 500;
}

export function databaseErrorPayload(error, resource = "database") {
  const code = databaseErrorCode(error);
  return {
    ok: false,
    mode: "database",
    resource,
    code,
    pgCode: error?.code || "",
    message: databaseErrorMessage(code)
  };
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
    message: "Local fallback returned. Connect persistent storage to save this resource across sessions."
  };
}
