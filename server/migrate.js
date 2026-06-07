import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(here, "../database/schema.sql");

function dollarTagAt(sqlText, index) {
  const match = sqlText.slice(index).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
  return match?.[0] || "";
}

export function readAuraSchema() {
  return readFileSync(schemaPath, "utf8");
}

export function splitSqlStatements(sqlText) {
  const statements = [];
  let current = "";
  let singleQuote = false;
  let doubleQuote = false;
  let dollarTag = "";
  let lineComment = false;
  let blockComment = false;

  for (let index = 0; index < sqlText.length; index += 1) {
    const char = sqlText[index];
    const next = sqlText[index + 1] || "";

    if (lineComment) {
      current += char;
      if (char === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      current += char;
      if (char === "*" && next === "/") {
        current += next;
        index += 1;
        blockComment = false;
      }
      continue;
    }

    if (singleQuote) {
      current += char;
      if (char === "'" && next === "'") {
        current += next;
        index += 1;
      } else if (char === "'") {
        singleQuote = false;
      }
      continue;
    }

    if (doubleQuote) {
      current += char;
      if (char === '"' && next === '"') {
        current += next;
        index += 1;
      } else if (char === '"') {
        doubleQuote = false;
      }
      continue;
    }

    if (dollarTag) {
      if (sqlText.startsWith(dollarTag, index)) {
        current += dollarTag;
        index += dollarTag.length - 1;
        dollarTag = "";
      } else {
        current += char;
      }
      continue;
    }

    if (char === "-" && next === "-") {
      current += char + next;
      index += 1;
      lineComment = true;
      continue;
    }

    if (char === "/" && next === "*") {
      current += char + next;
      index += 1;
      blockComment = true;
      continue;
    }

    if (char === "'") {
      current += char;
      singleQuote = true;
      continue;
    }

    if (char === '"') {
      current += char;
      doubleQuote = true;
      continue;
    }

    if (char === "$") {
      const tag = dollarTagAt(sqlText, index);
      if (tag) {
        current += tag;
        index += tag.length - 1;
        dollarTag = tag;
        continue;
      }
    }

    if (char === ";") {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = "";
      continue;
    }

    current += char;
  }

  const trailing = current.trim();
  if (trailing) statements.push(trailing);
  return statements;
}

async function runRawStatement(sql, statement) {
  if (typeof sql.query === "function") {
    return sql.query(statement, []);
  }

  if (typeof sql.unsafe === "function") {
    return sql`${sql.unsafe(statement)}`;
  }

  throw new Error("The configured database driver does not support raw schema statements.");
}

export async function installAuraSchema(sql) {
  const startedAt = Date.now();
  const statements = splitSqlStatements(readAuraSchema());
  let executed = 0;

  for (const statement of statements) {
    await runRawStatement(sql, statement);
    executed += 1;
  }

  return {
    statementCount: statements.length,
    executed,
    durationMs: Date.now() - startedAt
  };
}

export async function coreSchemaStatus(sql) {
  const tableRows = await sql`
    select
      table_name,
      to_regclass('public.' || table_name) is not null as installed
    from (
      values
        ('aura_users'),
        ('user_preferences'),
        ('client_profiles'),
        ('assistant_profiles'),
        ('service_requests'),
        ('bookings'),
        ('cleaning_plans'),
        ('inventory_locations'),
        ('inventory_image_scans'),
        ('feedback_events')
    ) as required(table_name)
    order by table_name
  `;
  const missingTables = tableRows.filter((row) => !row.installed).map((row) => row.table_name);
  return {
    ready: missingTables.length === 0,
    requiredTables: tableRows,
    missingTables
  };
}
