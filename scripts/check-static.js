import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "vercel.json",
  "package.json",
  "api/admin/db-health.js",
  "api/admin/migrate.js",
  "api/admin/overview.js",
  "api/assistants.js",
  "api/auth/callback.js",
  "api/auth-config.js",
  "api/auth/login.js",
  "api/auth/logout.js",
  "api/auth/session.js",
  "api/bookings.js",
  "api/cleaning-plan.js",
  "api/feedback.js",
  "api/inventory.js",
  "api/memory.js",
  "api/missions.js",
  "api/profile.js",
  "server/auth.js",
  "server/db.js",
  "server/migrate.js",
  "server/local-data.js",
  "database/schema.sql",
  "database/seed.sql",
  "assets/aura-app-icon.png",
  "assets/aura-logo-transparent.png"
];

const missing = requiredFiles.filter((file) => !existsSync(join(root, file)));
if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

for (const file of ["app.js", "api/admin/db-health.js", "api/admin/migrate.js", "api/admin/overview.js", "api/assistants.js", "api/auth/callback.js", "api/auth-config.js", "api/auth/login.js", "api/auth/logout.js", "api/auth/session.js", "api/bookings.js", "api/cleaning-plan.js", "api/feedback.js", "api/inventory.js", "api/memory.js", "api/missions.js", "api/profile.js", "server/auth.js", "server/db.js", "server/migrate.js", "server/local-data.js", "scripts/static-server.js"]) {
  execFileSync(process.execPath, ["--check", join(root, file)], { stdio: "inherit" });
}

JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));

const html = readFileSync(join(root, "index.html"), "utf8");
for (const asset of ["/styles.css", "/app.js", "/assets/aura-app-icon.png", "/assets/aura-logo-transparent.png"]) {
  if (!html.includes(asset)) {
    console.error(`index.html does not reference ${asset}`);
    process.exit(1);
  }
}

console.log("AURA static app check passed.");
