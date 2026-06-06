import http from "node:http";
import { mkdirSync } from "node:fs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const port = Number(process.env.AUTH_API_PORT || 4000);
mkdirSync(".data", { recursive: true });
const db = new DatabaseSync(".data/contentshield-local.sqlite");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS creator_content (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    safety_score INTEGER NOT NULL,
    risk_count INTEGER NOT NULL,
    notes TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const demoEmail = "maya@contentshield.local";
const demoPassword = "ShieldDemo#2026";

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}

function verifyPassword(password, user) {
  const hash = scryptSync(password, user.salt, 64);
  const stored = Buffer.from(user.password_hash, "hex");
  return stored.length === hash.length && timingSafeEqual(stored, hash);
}

function seed() {
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail);
  if (exists) return;
  const { salt, hash } = hashPassword(demoPassword);
  const userId = "user_demo_maya";
  db.prepare("INSERT INTO users (id, name, email, password_hash, salt, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    userId,
    "Maya Chen",
    demoEmail,
    hash,
    salt,
    "owner",
    new Date().toISOString()
  );
  const content = [
    ["content_border_explainer", "Border Conflict Explainer - Final Cut", "YouTube", "review_ready", 67, 14, "Highest-risk moments are conflict/death wording between 01:10 and 03:40."],
    ["content_podcast_41", "Podcast Episode 41 - Creator Burnout", "YouTube", "safe", 91, 3, "Low risk. Minor sensitive mental-health context needs careful framing."],
    ["content_gaming_weekly", "Gaming News Weekly", "YouTube", "limited_risk", 78, 8, "Gaming violence terms are present but mostly contextual."]
  ];
  for (const row of content) {
    db.prepare("INSERT INTO creator_content (id, user_id, title, platform, status, safety_score, risk_count, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      row[0],
      userId,
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      row[6],
      new Date().toISOString()
    );
  }
}

seed();

const sessions = new Map();

function send(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "http://127.0.0.1:4173",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization"
  });
  response.end(JSON.stringify(body, null, 2));
}

function ok(response, data) {
  send(response, 200, { success: true, data });
}

function error(response, code, message, status = 400) {
  send(response, status, { success: false, error: { code, message } });
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function currentUser(request) {
  const token = request.headers.authorization?.replace("Bearer ", "");
  const userId = token ? sessions.get(token) : null;
  return userId ? db.prepare("SELECT * FROM users WHERE id = ?").get(userId) : null;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://127.0.0.1:${port}`);
  if (request.method === "OPTIONS") return send(response, 204, {});
  try {
    if (url.pathname === "/api/v1/health") return ok(response, { api: "ok", database: "sqlite", dbFile: ".data/contentshield-local.sqlite" });
    if (url.pathname === "/api/v1/auth/demo") return ok(response, { email: demoEmail, password: demoPassword });
    if (url.pathname === "/api/v1/auth/login" && request.method === "POST") {
      const body = await readJson(request);
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(body.email || "").toLowerCase());
      if (!user || !verifyPassword(String(body.password || ""), user)) return error(response, "INVALID_CREDENTIALS", "Email or password is incorrect.", 401);
      const token = randomBytes(24).toString("hex");
      sessions.set(token, user.id);
      return ok(response, { token, user: publicUser(user) });
    }
    if (url.pathname === "/api/v1/auth/signup" && request.method === "POST") {
      const body = await readJson(request);
      const email = String(body.email || "").toLowerCase();
      const password = String(body.password || "");
      const name = String(body.name || "ContentShield Creator");
      if (!email.includes("@") || password.length < 8) return error(response, "VALIDATION_ERROR", "Use a valid email and at least 8 password characters.");
      if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return error(response, "EMAIL_EXISTS", "An account already exists for this email.", 409);
      const { salt, hash } = hashPassword(password);
      const id = `user_${randomBytes(8).toString("hex")}`;
      db.prepare("INSERT INTO users (id, name, email, password_hash, salt, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(id, name, email, hash, salt, "owner", new Date().toISOString());
      db.prepare("INSERT INTO creator_content (id, user_id, title, platform, status, safety_score, risk_count, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
        `content_${randomBytes(8).toString("hex")}`,
        id,
        "First Draft Upload Placeholder",
        "YouTube",
        "not_scanned",
        0,
        0,
        "Upload your first video to generate a monetization safety report.",
        new Date().toISOString()
      );
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
      const token = randomBytes(24).toString("hex");
      sessions.set(token, id);
      return ok(response, { token, user: publicUser(user) });
    }
    if (url.pathname === "/api/v1/auth/me") {
      const user = currentUser(request);
      if (!user) return error(response, "UNAUTHENTICATED", "Log in first.", 401);
      return ok(response, { user: publicUser(user) });
    }
    if (url.pathname === "/api/v1/content") {
      const user = currentUser(request);
      if (!user) return error(response, "UNAUTHENTICATED", "Log in first.", 401);
      const items = db.prepare("SELECT * FROM creator_content WHERE user_id = ? ORDER BY created_at DESC").all(user.id);
      return ok(response, { user: publicUser(user), items });
    }
    return error(response, "NOT_FOUND", "Route not found.", 404);
  } catch (err) {
    return error(response, "SERVER_ERROR", err.message || "Unexpected server error.", 500);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`ContentShield local auth API running at http://127.0.0.1:${port}`);
  console.log(`Demo login: ${demoEmail} / ${demoPassword}`);
});
