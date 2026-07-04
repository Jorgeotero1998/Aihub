import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

const root = process.cwd();

function rand(len = 24) {
  return randomBytes(len).toString("base64url");
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function writeIfMissing(filePath, content) {
  try {
    await readFile(filePath, "utf8");
    return false;
  } catch {
    await writeFile(filePath, content, "utf8");
    return true;
  }
}

const postgresPassword = rand(18);
const jwtSecret = rand(32);
const webAuthSecret = rand(32);

await ensureDir(path.join(root, "apps/api"));
await ensureDir(path.join(root, "apps/web"));

const created = [];

// Root .env (optional helper for docker compose)
if (
  await writeIfMissing(
    path.join(root, ".env"),
    `POSTGRES_PASSWORD=${postgresPassword}\n`
  )
) {
  created.push(".env");
}

// API env
if (
  await writeIfMissing(
    path.join(root, "apps/api/.env"),
    `NODE_ENV=development
PORT=3001

DATABASE_URL=postgresql://aihub:${postgresPassword}@localhost:5432/aihub?schema=public
REDIS_URL=redis://localhost:6379

JWT_SECRET=${jwtSecret}
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=1209600

AI_PROVIDER=openai_compatible
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=__set_me__

STRIPE_SECRET_KEY=__set_me__
STRIPE_WEBHOOK_SECRET=__set_me__
STRIPE_PRICE_ID=__set_me__
`
  )
) {
  created.push("apps/api/.env");
}

// Web env
if (
  await writeIfMissing(
    path.join(root, "apps/web/.env"),
    `NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

AUTH_COOKIE_NAME=aihub_session
AUTH_SECRET=${webAuthSecret}
`
  )
) {
  created.push("apps/web/.env");
}

console.log(
  created.length
    ? `Created: ${created.join(", ")}`
    : "No files created (already exist)."
);
console.log(
  "Reminder: set AI_API_KEY / Stripe keys in apps/api/.env when needed."
);

