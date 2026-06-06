import { createAuthLoginResponse } from "../../server/auth.js";
import { json } from "../../server/db.js";

export async function GET(request) {
  return createAuthLoginResponse(request);
}

export default {
  async fetch(request) {
    if (request.method === "GET") return GET(request);
    return json({ ok: false, message: `${request.method} is not supported` }, 405);
  }
};
