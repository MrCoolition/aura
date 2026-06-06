import { createHmac, randomBytes, timingSafeEqual, webcrypto } from "node:crypto";
import { json } from "./db.js";

const subtle = globalThis.crypto?.subtle || webcrypto.subtle;
let cachedJwks = null;
let cachedJwksAt = 0;
const authTransactionCookie = "aura_auth_tx";
const authSessionCookie = "aura_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

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
  const clientSecret = process.env.AUTH0_CLIENT_SECRET || "";
  const audience = process.env.AUTH0_AUDIENCE || process.env.AUTH0_API_AUDIENCE || "";
  const cookieSecret =
    process.env.AUTH0_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.AURA_AUTH_SECRET ||
    process.env.SESSION_SECRET ||
    clientSecret;

  return {
    enabled: Boolean(domain && clientId),
    apiProtectionEnabled: Boolean(domain && clientId && cookieSecret),
    issuerBaseUrl,
    domain,
    clientId,
    clientSecret,
    cookieSecret,
    audience,
    scope: process.env.AUTH0_SCOPE || "openid profile email"
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
    apiProtectionEnabled: settings.apiProtectionEnabled
  };
}

function base64UrlToBuffer(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${normalized}${"=".repeat((4 - (normalized.length % 4)) % 4)}`;
  return Buffer.from(padded, "base64");
}

function bufferToBase64Url(value) {
  return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomBase64Url(bytes = 32) {
  return bufferToBase64Url(randomBytes(bytes));
}

async function pkceChallenge(verifier) {
  const digest = await subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return bufferToBase64Url(Buffer.from(digest));
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

function validateClaims(payload, settings, expectedNonce = "") {
  const now = Math.floor(Date.now() / 1000);
  const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

  if (payload.iss !== settings.issuerBaseUrl) {
    throw new Error("Invalid issuer");
  }

  const validAudiences = [settings.clientId, settings.audience].filter(Boolean);
  if (!audience.some((item) => validAudiences.includes(item))) {
    throw new Error("Invalid audience");
  }

  if (payload.exp && payload.exp <= now) {
    throw new Error("Token expired");
  }

  if (payload.nbf && payload.nbf > now) {
    throw new Error("Token not active");
  }

  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new Error("Invalid nonce");
  }
}

async function verifyAuth0Token(token, settings, expectedNonce = "") {
  const jwt = parseJwt(token);
  if (jwt.header.alg !== "RS256") {
    throw new Error("Unsupported token algorithm");
  }

  validateClaims(jwt.payload, settings, expectedNonce);

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

function requestBaseUrl(request) {
  const configured = process.env.AUTH0_BASE_URL || process.env.AURA_BASE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || url.host;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto || url.protocol.replace(":", "") || "https";
  return `${proto}://${host}`;
}

function decodeCookieValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return index === -1 ? [item, ""] : [item.slice(0, index), decodeCookieValue(item.slice(index + 1))];
      })
  );
}

function signPayload(payload, settings) {
  const body = bufferToBase64Url(JSON.stringify(payload));
  const signature = createHmac("sha256", settings.cookieSecret).update(body).digest();
  return `${body}.${bufferToBase64Url(signature)}`;
}

function verifySignedPayload(value, settings) {
  if (!value || !settings.cookieSecret) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = createHmac("sha256", settings.cookieSecret).update(body).digest();
  const actual = base64UrlToBuffer(signature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    return decodeBase64UrlJson(body);
  } catch {
    return null;
  }
}

function cookieHeader(name, value, request, maxAgeSeconds) {
  const baseUrl = requestBaseUrl(request);
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`
  ];
  if (baseUrl.startsWith("https://")) attributes.push("Secure");
  return attributes.join("; ");
}

function clearCookieHeader(name, request) {
  return cookieHeader(name, "", request, 0);
}

function safeReturnTo(value) {
  if (!value) return "/";
  try {
    const url = new URL(value, "https://aura.local");
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

function redirectResponse(location, cookies = []) {
  const headers = new Headers({ Location: location });
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  return new Response(null, { status: 302, headers });
}

function authUserFromSession(request, settings) {
  const cookie = parseCookies(request)[authSessionCookie];
  const session = verifySignedPayload(cookie, settings);
  if (!session || !session.user || Number(session.exp || 0) <= Math.floor(Date.now() / 1000)) return null;
  return session.user;
}

function sessionUserFromClaims(claims) {
  return {
    sub: claims.sub,
    name: claims.name,
    nickname: claims.nickname,
    email: claims.email,
    email_verified: claims.email_verified,
    picture: claims.picture,
    roles: claims.roles,
    permissions: claims.permissions,
    groups: claims.groups,
    "https://aura.app/roles": claims["https://aura.app/roles"],
    "https://aura.app/permissions": claims["https://aura.app/permissions"],
    "https://aura.app/groups": claims["https://aura.app/groups"],
    "https://aura-omega-rosy.vercel.app/roles": claims["https://aura-omega-rosy.vercel.app/roles"],
    "https://aura-omega-rosy.vercel.app/permissions": claims["https://aura-omega-rosy.vercel.app/permissions"],
    "https://aura-omega-rosy.vercel.app/groups": claims["https://aura-omega-rosy.vercel.app/groups"]
  };
}

export function currentAuthSession(request) {
  const settings = authSettings();
  const user = settings.apiProtectionEnabled ? authUserFromSession(request, settings) : null;
  return {
    configured: settings.apiProtectionEnabled,
    authenticated: Boolean(user),
    user
  };
}

export async function createAuthLoginResponse(request) {
  const settings = authSettings();
  if (!settings.enabled || !settings.cookieSecret) {
    return redirectResponse("/?error=auth_not_ready");
  }

  const baseUrl = requestBaseUrl(request);
  const url = new URL(request.url);
  const redirectUri = `${baseUrl}/api/auth/callback`;
  const state = randomBase64Url(32);
  const nonce = randomBase64Url(32);
  const codeVerifier = randomBase64Url(64);
  const codeChallenge = await pkceChallenge(codeVerifier);
  const transaction = {
    state,
    nonce,
    codeVerifier,
    redirectUri,
    returnTo: safeReturnTo(url.searchParams.get("returnTo")),
    exp: Math.floor(Date.now() / 1000) + 10 * 60
  };

  const authorizeUrl = new URL("authorize", settings.issuerBaseUrl);
  authorizeUrl.searchParams.set("client_id", settings.clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", settings.scope);
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("nonce", nonce);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  return redirectResponse(authorizeUrl.toString(), [
    cookieHeader(authTransactionCookie, signPayload(transaction, settings), request, 10 * 60)
  ]);
}

export async function createAuthCallbackResponse(request) {
  const settings = authSettings();
  const callbackUrl = new URL(request.url);
  const baseUrl = requestBaseUrl(request);
  const error = callbackUrl.searchParams.get("error");
  if (error) {
    return redirectResponse(`${baseUrl}/?error=auth_failed`, [clearCookieHeader(authTransactionCookie, request)]);
  }

  const transaction = verifySignedPayload(parseCookies(request)[authTransactionCookie], settings);
  const state = callbackUrl.searchParams.get("state");
  const code = callbackUrl.searchParams.get("code");
  if (!transaction || !state || !code || transaction.state !== state || Number(transaction.exp || 0) <= Math.floor(Date.now() / 1000)) {
    return redirectResponse(`${baseUrl}/?error=auth_failed`, [clearCookieHeader(authTransactionCookie, request)]);
  }

  const tokenPayload = {
    grant_type: "authorization_code",
    client_id: settings.clientId,
    code,
    redirect_uri: transaction.redirectUri,
    code_verifier: transaction.codeVerifier
  };
  if (settings.clientSecret) tokenPayload.client_secret = settings.clientSecret;

  const tokenResponse = await fetch(new URL("oauth/token", settings.issuerBaseUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tokenPayload)
  });

  if (!tokenResponse.ok) {
    return redirectResponse(`${baseUrl}/?error=auth_failed`, [clearCookieHeader(authTransactionCookie, request)]);
  }

  let userClaims;
  try {
    const tokens = await tokenResponse.json();
    if (!tokens.id_token) throw new Error("Missing ID token");
    userClaims = await verifyAuth0Token(tokens.id_token, settings, transaction.nonce);
  } catch {
    return redirectResponse(`${baseUrl}/?error=auth_failed`, [clearCookieHeader(authTransactionCookie, request)]);
  }

  const now = Math.floor(Date.now() / 1000);
  const user = sessionUserFromClaims(userClaims);
  const session = {
    user,
    exp: Math.min(Number(userClaims.exp || now + sessionMaxAgeSeconds), now + sessionMaxAgeSeconds)
  };

  return redirectResponse(`${baseUrl}${safeReturnTo(transaction.returnTo)}`, [
    clearCookieHeader(authTransactionCookie, request),
    cookieHeader(authSessionCookie, signPayload(session, settings), request, sessionMaxAgeSeconds)
  ]);
}

export function createAuthLogoutResponse(request) {
  const settings = authSettings();
  const baseUrl = requestBaseUrl(request);
  const cookies = [
    clearCookieHeader(authTransactionCookie, request),
    clearCookieHeader(authSessionCookie, request)
  ];

  if (!settings.enabled) return redirectResponse(baseUrl, cookies);

  const logoutUrl = new URL("v2/logout", settings.issuerBaseUrl);
  logoutUrl.searchParams.set("client_id", settings.clientId);
  logoutUrl.searchParams.set("returnTo", baseUrl);
  return redirectResponse(logoutUrl.toString(), cookies);
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

  const sessionUser = authUserFromSession(request, settings);
  if (sessionUser) {
    return { configured: true, user: sessionUser };
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
