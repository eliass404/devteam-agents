import { BaseAgent } from "../core/base_agent.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const MEM_FILE = "./memory/long_term.json";

function ensureDir() {
  const d = path.dirname(MEM_FILE);
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
}
function loadMem() {
  ensureDir();
  if (!existsSync(MEM_FILE)) return {};
  try { return JSON.parse(readFileSync(MEM_FILE,"utf8")); } catch { return {}; }
}
function saveMem(d) {
  ensureDir();
  writeFileSync(MEM_FILE, JSON.stringify(d,null,2));
}

const SYSTEM = `You are the Memory Agent — the team's long-term brain.
You store structured knowledge across sessions and retrieve only what is relevant.
Inspired by Gary Marcus-style structured cognition: facts, rules, decisions, code artifacts, and outcomes.`;

export class MemoryAgent extends BaseAgent {
  constructor() {
    super("memory_agent", SYSTEM);
    this.db = loadMem();
    this._registerSkills();
  }

  // ── Storage & Retrieval (non-LLM, synchronous) ───────────────────────────

  async store(sessionId, goal, results) {
    if (!this.db[sessionId]) {
      this.db[sessionId] = { goal, created_at: new Date().toISOString(), entries: [] };
    }
    for (const r of results) {
      this.db[sessionId].entries.push({
        id: `${sessionId}_${r.step}`,
        ts: new Date().toISOString(),
        agent: r.agent,
        skill: r.skill,
        task: r.task,
        tags: this._tag(r.output),
        summary: r.output.slice(0, 600),
        full: r.output,
      });
    }
    saveMem(this.db);
  }

  async recall(query, sessionId = null) {
    const entries = [];
    for (const [sid, s] of Object.entries(this.db)) {
      if (sessionId && sid !== sessionId) continue;
      for (const e of s.entries || []) {
        const score = this._score(query, e);
        if (score > 0) entries.push({ ...e, score, sid });
      }
    }
    entries.sort((a,b) => b.score - a.score);
    const top = entries.slice(0,6);
    if (!top.length) return null;
    return top.map(e =>
      `[${e.agent}:${e.skill||"?"} @ ${e.ts.slice(0,10)}]\nTask: ${e.task}\n${e.summary}`
    ).join("\n\n---\n\n");
  }

  getAll(sessionId) { return this.db[sessionId] || null; }
  listSessions() {
    return Object.entries(this.db).map(([id,s])=>({
      id, goal:s.goal, created_at:s.created_at, count:s.entries?.length||0
    }));
  }

  _score(q, e) {
    const words = q.toLowerCase().split(/\W+/).filter(w=>w.length>2);
    const text = `${e.task} ${e.summary} ${e.tags?.join(" ")}`.toLowerCase();
    return words.filter(w=>text.includes(w)).length;
  }
  _tag(text) {
    const kw = text.match(/\b(api|auth|database|redis|react|node|express|sql|test|security|performance|bug|fix|cache|schema|endpoint|component|docker|k8s|jwt|oauth|graphql|rest|migration|index|query)\b/gi);
    return [...new Set((kw||[]).map(t=>t.toLowerCase()))].slice(0,10);
  }

  // ── LLM Skills ────────────────────────────────────────────────────────────

  _registerSkills() {
    this.registerSkill({
      name: "summarize_memory",
      description: "Summarize stored memory for a session into a concise brief.",
      prompt: (task) => `Summarize this memory:\n${task}\n\nOutput a tight summary covering:\n- What was built\n- Key decisions made\n- Known issues\n- Current state\n\nMax 300 words.`,
    });

    this.registerSkill({
      name: "extract_patterns",
      description: "Extract recurring patterns and lessons from past sessions.",
      prompt: (task) => `Extract patterns from:\n${task}\n\nIdentify:\n- Recurring bugs or mistakes\n- Preferred tech choices\n- Common task sequences\n- Successful approaches worth repeating\n- Anti-patterns to avoid\n\nFormat as: Pattern | Evidence | Recommendation`,
    });

    this.registerSkill({
      name: "build_knowledge_base",
      description: "Organize session knowledge into a structured knowledge base.",
      prompt: (task) => `Build knowledge base from:\n${task}\n\nOrganize into:\n## Architecture Facts\n## API Contracts\n## Database Schema\n## Known Bugs & Fixes\n## Performance Benchmarks\n## Security Findings\n## Deployment Notes\n\nThis will be used as reference for future sessions.`,
    });

    this.registerSkill({
      name: "recall_relevant",
      description: "Search memory and return the most relevant context for a task.",
      prompt: (task) => `Find relevant memory for task:\n${task}\n\nReturn:\n- Most relevant prior decisions\n- Related code patterns previously used\n- Known issues that might affect this task\n- Recommended approach based on history\n\nOnly return what is directly relevant. No noise.`,
    });

    this.registerSkill({
      name: "compare_sessions",
      description: "Compare two sessions to find drift or inconsistencies.",
      prompt: (task) => `Compare sessions:\n${task}\n\nIdentify:\n- What changed between sessions\n- Decisions reversed or contradicted\n- New patterns introduced\n- Technical debt added\n- Quality trend (improving or declining)\n\nOutput: change log + assessment.`,
    });

    this.registerSkill({
      name: "generate_readme",
      description: "Generate a project README from session memory.",
      prompt: (task) => `Generate README from project memory:\n${task}\n\nInclude:\n# Project Name\n## What it does\n## Tech Stack\n## Architecture Overview\n## Setup Instructions\n## API Reference (key endpoints)\n## Environment Variables\n## Running Tests\n## Deployment\n## Known Issues\n## Contributors (agents)\n\nWrite as if for a real GitHub repo.`,
    });
  }
}
