import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const apiRoutes = {
  "/api/assistants": "api/assistants.js",
  "/api/bookings": "api/bookings.js",
  "/api/cleaning-plan": "api/cleaning-plan.js",
  "/api/feedback": "api/feedback.js",
  "/api/inventory": "api/inventory.js",
  "/api/memory": "api/memory.js",
  "/api/missions": "api/missions.js"
};

function resolvePath(url) {
  const requestPath = new URL(url, `http://localhost:${port}`).pathname;
  const cleanPath = requestPath === "/" ? "/index.html" : requestPath;
  const resolved = normalize(join(root, cleanPath));

  if (!resolved.startsWith(root)) {
    return join(root, "index.html");
  }

  return resolved;
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

async function handleApi(request, response, requestUrl) {
  const routePath = apiRoutes[requestUrl.pathname];
  if (!routePath) {
    response.writeHead(404, { "Content-Type": mimeTypes[".json"] });
    response.end(JSON.stringify({ ok: false, message: "API route not found" }));
    return;
  }

  const moduleUrl = pathToFileURL(join(root, routePath)).href;
  const route = await import(moduleUrl);
  const method = (request.method || "GET").toUpperCase();
  const handler = route[method];

  if (!handler) {
    response.writeHead(405, { "Content-Type": mimeTypes[".json"] });
    response.end(JSON.stringify({ ok: false, message: `${method} is not supported` }));
    return;
  }

  const body = method === "GET" || method === "HEAD" ? undefined : await readRequestBody(request);
  const fetchRequest = new Request(`http://localhost:${port}${request.url}`, {
    method,
    headers: request.headers,
    body
  });
  const fetchResponse = await handler(fetchRequest);
  const headers = Object.fromEntries(fetchResponse.headers.entries());
  const responseBody = Buffer.from(await fetchResponse.arrayBuffer());

  response.writeHead(fetchResponse.status, headers);
  response.end(responseBody);
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://localhost:${port}`);
    if (requestUrl.pathname.startsWith("/api/")) {
      await handleApi(request, response, requestUrl);
      return;
    }

    const filePath = resolvePath(request.url || "/");
    const body = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    response.end(body);
  }
});

server.listen(port, () => {
  console.log(`AURA preview running at http://localhost:${port}`);
});
