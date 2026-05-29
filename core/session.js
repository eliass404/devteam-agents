import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { nanoid } from "nanoid";
import path from "path";

const FILE = process.env.MEMORY_FILE || "./memory/store.json";

function ensure() {
  const d = path.dirname(FILE);
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}
function load() {
  ensure();
  if (!existsSync(FILE)) return {};
  try { return JSON.parse(readFileSync(FILE, "utf8")); } catch { return {}; }
}
function save(data) {
  ensure();
  writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export async function createSession(goal) {
  const db = load();
  const id = nanoid(10);
  db[id] = { id, goal, created_at: new Date().toISOString(), history: [], steps: [] };
  save(db);
  return db[id];
}
export async function getSession(id) {
  const db = load();
  if (!db[id]) throw new Error(`Session ${id} not found`);
  return db[id];
}
export async function updateSession(id, patch) {
  const db = load();
  db[id] = { ...db[id], ...patch };
  save(db);
  return db[id];
}
export async function listSessions() {
  const db = load();
  return Object.values(db)
    .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)
    .map(s => ({ id: s.id, goal: s.goal, created_at: s.created_at, steps: s.steps?.length || 0 }));
}
