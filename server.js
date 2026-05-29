import "dotenv/config";
import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Manager } from "./manager/manager.js";
import { listSessions, getSession } from "./core/session.js";
import { MemoryAgent } from "./agents/memory_agent.js";
import { log } from "./core/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "ui")));

// ── REST ─────────────────────────────────────────────────────────────────────

app.get("/api/health", (_, res) => res.json({ status: "ok", version: "2.0", timestamp: Date.now() }));

app.get("/api/capabilities", (_, res) => {
  const mgr = new Manager();
  res.json(mgr.listCapabilities());
});

app.post("/api/run", async (req, res) => {
  const { goal, sessionId } = req.body;
  if (!goal) return res.status(400).json({ error: "goal required" });
  try {
    const mgr = new Manager({ sessionId });
    const result = await mgr.run(goal);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/agent/:name/skill/:skill", async (req, res) => {
  const { name, skill } = req.params;
  const { task, sessionId } = req.body;
  if (!task) return res.status(400).json({ error: "task required" });
  try {
    const mgr = new Manager({ sessionId });
    const result = await mgr.runDirect(name, skill, task);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/sessions", async (_, res) => {
  try { res.json(await listSessions()); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/sessions/:id", async (req, res) => {
  try { res.json(await getSession(req.params.id)); } catch (e) { res.status(404).json({ error: e.message }); }
});

app.get("/api/memory", (_, res) => { const m = new MemoryAgent(); res.json(m.listSessions()); });
app.get("/api/memory/:sid", (req, res) => {
  const m = new MemoryAgent();
  const d = m.getAll(req.params.sid);
  d ? res.json(d) : res.status(404).json({ error: "not found" });
});

app.get("*", (_, res) => res.sendFile(path.join(__dirname, "ui/index.html")));

// ── WebSocket ────────────────────────────────────────────────────────────────

wss.on("connection", (ws) => {
  log.info("WS connected");

  ws.on("message", async (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); }
    catch { ws.send(JSON.stringify({ type:"error", message:"Invalid JSON" })); return; }

    const send = (d) => ws.readyState === 1 && ws.send(JSON.stringify(d));
    const { type, goal, agent, skill, task, sessionId } = msg;

    const mgr = new Manager({
      sessionId,
      onUpdate: ({ agent, skill, message, isFinal }) =>
        send({ type: "update", agent, skill, message, isFinal, timestamp: Date.now() }),
    });

    try {
      if (type === "run") {
        const result = await mgr.run(goal);
        send({ type: "done", result });
      } else if (type === "direct") {
        const result = await mgr.runDirect(agent, skill, task);
        send({ type: "done", result });
      }
    } catch (e) {
      send({ type: "error", message: e.message });
    }
  });

  ws.on("close", () => log.info("WS disconnected"));
});

httpServer.listen(PORT, () => {
  log.info(`DevTeam v2 → http://localhost:${PORT}`);
  log.info(`WS ready → ws://localhost:${PORT}`);
});
