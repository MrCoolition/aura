import { publicAuthConfig } from "../server/auth.js";
import { json } from "../server/db.js";

export async function OPTIONS() {
  return json({ ok: true });
}

export async function GET() {
  return json({ ok: true, data: publicAuthConfig() });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return OPTIONS(request);
    if (request.method === "GET") return GET(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
