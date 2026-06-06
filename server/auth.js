import { webcrypto } from "node:crypto";
import { json } from "./db.js";

const subtle = globalThis.crypto?.subtle || webcrypto.subtle;
let cachedJwks = null;
let cachedJwksAt = 0;

function normalizeIssuer(value) {
  if (!value) return "";
  const issuer = value.startsWith("http") ? value : `https://${value}`;
  return issuer.endsWith("/") ? issuer : `${issuer}/`;
}

function authSettings() {
  const issuerBaseUrl = normalizeIssuer(
    process.env.AUTH0_ISSUER_BASE_URL || process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER
  );
  const domain = issuerBaseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const clientId = process.env.AUTH0_CLIENT_ID || "";
  const audience = process.env.AUTH0_AUDIENCE || process.env.AUTH0_API_AUDIENCE || "";

  return {
    enabled: Boolean(domain && clientId),
    apiProtectionEnabled: Boolean(domain && clientId && audience),
    issuerBaseUrl,
    domain,
    clientId,
    audience,
    scope: process.env.AUTH0_SCOPE || "openid profile email",
    cacheLocation: process.env.AUTH0_CACHE_LOCATION || "memory"
  };
}

function envList(name) {
  return String(process.env[name] || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function arrayClaim(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.map((item) => String(item).toLowerCase()) : [String(value).toLowerCase()];
}

function authRoles(authUser) {
  return [
    ...arrayClaim(authUser.roles),
    ...arrayClaim(authUser.permissions),
    ...arrayClaim(authUser.groups),
    ...arrayClaim(authUser["https://aura.app/roles"]),
    ...arrayClaim(authUser["https://aura.app/permissions"]),
    ...arrayClaim(authUser["https://aura.app/groups"]),
    ...arrayClaim(authUser["https://aura-omega-rosy.vercel.app/roles"]),
    ...arrayClaim(authUser["https://aura-omega-rosy.vercel.app/permissions"]),
    ...arrayClaim(authUser["https://aura-omega-rosy.vercel.app/groups"])
  ];
}

export function roleForAuthUser(authUser) {
  const email = String(authUser.email || "").toLowerCase();
  const emailVerified = authUser.email_verified !== false;
  const subject = String(authUser.sub || "").toLowerCase();
  const roles = authRoles(authUser);
  const adminEmails = envList("AURA_ADMIN_EMAILS");
  const adminSubjects = envList("AURA_ADMIN_SUBJECTS");

  if (
    (emailVerified && adminEmails.includes(email)) ||
    adminSubjects.includes(subject) ||
    roles.some((role) => ["admin", "operator", "aura-admin", "aura:admin", "admin:all", "read:admin"].includes(role))
  ) {
    return "admin";
  }

  if (roles.some((role) => ["assistant", "provider", "aura:assistant"].includes(role))) {
    return "assistant";
  }

  return "client";
}

export function isAdminUser(auraUser) {
  return ["admin", "operator"].includes(String(auraUser?.role || ""));
}

export function publicAuthConfig() {
  const settings = authSettings();

  return {
    enabled: settings.enabled,
    apiProtectionEnabled: settings.apiProtectionEnabled,
    domain: settings.domain,
    clientId: settings.clientId,
    audience: settings.audience,
    scope: settings.scope,
    cacheLocation: settings.cacheLocation
  };
}

function base64UrlToBuffer(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4)) % 4)}`;
  return Buffer.from(padded, "base64");
}

function decodeBase64UrlJson(value) {
  return JSON.parse(base64UrlToBuffer(value).toString("utf8"));
}

function parseJwt(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Malformed JWT");
  }

  return {
    header: decodeBase64UrlJson(parts[0]),
    payload: decodeBase64UrlJson(parts[1]),
    signingInput: Buffer.from(`${parts[0]}.${parts[1]}`),
    signature: base64UrlToBuffer(parts[2])
  };
}

async function fetchJwks(issuerBaseUrl) {
  const now = Date.now();
  if (cachedJwks && now - cachedJwksAt < 60 * 60 * 1000) {
    return cachedJwks;
  }

  const response = await fetch(`${issuerBaseUrl}.well-known/jwks.json`);
  if (!response.ok) {
    throw new Error("Unable to fetch Auth0 JWKS");
  }

  cachedJwks = await response.json();
  cachedJwksAt = now;
  return cachedJwks;
}

function validateClaims(payload, settings) {
  const now = Math.floor(Date.now() / 1000);
  const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (payload.iss !== settings.issuerBaseUrl) {
    throw new Error("Invalid issuer");
  }

  if (!audience.includes(settings.audience)) {
    throw new Error("Invalid audience");
  }

  if (payload.exp && payload.exp <= now) {
    throw new Error("Token expired");
  }

  if (payload.nbf && payload.nbf > now) {
    throw new Error("Token not active");
  }
}

async function verifyAuth0Token(token, settings) {
  const jwt = parseJwt(token);
  if (jwt.header.alg !== "RS256") {
    throw new Error("Unsupported token algorithm");
  }

  validateClaims(jwt.payload, settings);

  const jwks = await fetchJwks(settings.issuerBaseUrl);
  const key = jwks.keys?.find((item) => item.kid === jwt.header.kid);
  if (!key) {
    cachedJwks = null;
    throw new Error("Signing key not found");
  }

  const cryptoKey = await subtle.importKey(
    "jwk",
    key,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const verified = await subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, jwt.signature, jwt.signingInput);

  if (!verified) {
    throw new Error("Invalid token signature");
  }

  return jwt.payload;
}

function bearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

export async function requireAuth(request) {
  const settings = authSettings();

  if (!settings.apiProtectionEnabled) {
    return {
      configured: false,
      user: {
        sub: "demo|local",
        name: "AURA Demo Client",
        email: "demo@aura.local",
        picture: ""
      }
    };
  }

  const token = bearerToken(request);
  if (!token) {
    return { response: json({ ok: false, message: "Authentication required" }, 401) };
  }

  try {
    return { configured: true, user: await verifyAuth0Token(token, settings) };
  } catch {
    return { response: json({ ok: false, message: "Invalid or expired access token" }, 401) };
  }
}

export async function upsertAuraUser(sql, authUser, role = roleForAuthUser(authUser)) {
  const fallbackEmail = `${String(authUser.sub || "user").replace(/[^a-z0-9]+/gi, "_")}@auth.aura.local`;
  const email = String(authUser.email || fallbackEmail).toLowerCase();
  const fullName = String(authUser.name || authUser.nickname || email);
  const picture = authUser.picture ? String(authUser.picture) : null;
  const subject = String(authUser.sub || "");

  const rows = await sql`
    with _ctx as (
      select
        set_config('app.auth_subject', ${subject}, true),
        set_config('app.auth_email', ${email}, true),
        set_config('app.current_role', ${role}, true)
    ),
    existing as (
      select id
      from aura_users, _ctx
      where auth_subject = ${subject}
        or (auth_subject is null and lower(email) = ${email})
      order by created_at asc
      limit 1
    ),
    updated as (
      update aura_users
      set
        role = case
          when aura_users.role in ('admin', 'operator') then aura_users.role
          else ${role}::aura_user_role
        end,
        full_name = ${fullName},
        email = ${email},
        avatar_url = ${picture},
        auth_provider = 'auth0',
        auth_subject = coalesce(aura_users.auth_subject, ${subject}),
        updated_at = now()
      where id in (select id from existing)
      returning id, role, full_name, email, auth_subject
    ),
    inserted as (
      insert into aura_users (
        role,
        full_name,
        email,
        avatar_url,
        auth_provider,
        auth_subject
      )
      select
        ${role}::aura_user_role,
        ${fullName},
        ${email},
        ${picture},
        'auth0',
        ${subject}
      from _ctx
      where not exists (select 1 from updated)
      returning id, role, full_name, email, auth_subject
    )
    select id, role, full_name, email, auth_subject from updated
    union all
    select id, role, full_name, email, auth_subject from inserted
    limit 1
  `;

  return rows[0];
}

export async function runWithUserContext(sql, auraUser, queriesOrFactory) {
  const queries = typeof queriesOrFactory === "function" ? queriesOrFactory(sql) : queriesOrFactory;
  const queryList = Array.isArray(queries) ? queries : [queries];
  const results = await sql.transaction([
    sql`select set_config('app.current_user_id', ${auraUser.id}, true)`,
    sql`select set_config('app.current_role', ${auraUser.role}, true)`,
    sql`select set_config('app.auth_subject', ${auraUser.auth_subject || ""}, true)`,
    sql`select set_config('app.auth_email', ${auraUser.email || ""}, true)`,
    ...queryList
  ]);

  return results.slice(4);
}
