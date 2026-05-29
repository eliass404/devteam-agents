import Anthropic from "@anthropic-ai/sdk";
import { log } from "../core/logger.js";
import { createSession, updateSession } from "../core/session.js";
import { nanoid } from "nanoid";

// Import all agents
import { CoderAgent }         from "../agents/coder.js";
import { ArchitectAgent }     from "../agents/architect.js";
import { ReviewerAgent }      from "../agents/reviewer.js";
import { TesterAgent }        from "../agents/tester.js";
import { DebuggerAgent }      from "../agents/debugger.js";
import { SecurityAgent }      from "../agents/security.js";
import { ApiTesterAgent }     from "../agents/api_tester.js";
import { OptimizerAgent }     from "../agents/optimizer.js";
import { DbAgent }            from "../agents/db.js";
import { UiDesignerAgent }    from "../agents/ui_designer.js";
import { UxAgent }            from "../agents/ux.js";
import { ContextManager }     from "../agents/context_manager.js";
import { MemoryAgent }        from "../agents/memory_agent.js";
import { DevOpsAgent }        from "../agents/devops.js";

const MANAGER_PROMPT = `You are the Engineering Manager — the highest authority in this AI development team.

Your team consists of 14 specialized agents, each with multiple skills:
- architect      → system design, tech stack, ADRs, diagrams, RFC drafts, capacity planning
- coder          → implementation across any language/framework
- reviewer       → code quality, PRs, style, complexity, dead code
- tester         → unit/integration/E2E/load/fuzz tests
- debugger       → root cause analysis, crash reports, hotfixes
- security       → OWASP, pentesting, CVE analysis, threat modeling
- api_tester     → endpoint testing, contract testing, exposure audit
- optimizer      → performance profiling, caching, bundle size, DB queries
- db_agent       → schema design, migrations, query optimization, indexing
- ui_designer    → UI components, design systems, responsive layouts
- ux_agent       → user flows, accessibility, friction analysis
- context_manager→ session coherence, summary, contradiction detection
- memory_agent   → long-term memory storage and retrieval
- devops         → CI/CD, Docker, deployment, infra, monitoring

Your responsibilities:
1. DECOMPOSE the user goal into concrete, ordered subtasks
2. ASSIGN each subtask to the best agent + best skill for that agent
3. MONITOR quality — if output is poor, reassign or add a review step
4. CHAIN outputs — pass each agent's output as context to the next
5. SYNTHESIZE — produce a final coherent deliverable

Output a JSON execution plan:
{
  "goal": "...",
  "complexity": "low|medium|high|critical",
  "estimated_steps": N,
  "plan": [
    {
      "step": 1,
      "agent": "architect",
      "skill": "system_design",
      "task": "Detailed task description...",
      "depends_on": [],
      "priority": "critical|high|medium|low"
    }
  ],
  "final_deliverable": "Description of what the user will receive"
}

Be specific. Do NOT use vague tasks like "write code". Say exactly what code, for what purpose, in what language.
Always include a security review step for any public-facing feature.
Always include a review step after coding.`;

export class Manager {
  constructor(options = {}) {
    this.onUpdate = options.onUpdate || null;
    this.sessionId = options.sessionId || null;

    // Instantiate all agents
    this.agents = {
      architect:       new ArchitectAgent(),
      coder:           new CoderAgent(),
      reviewer:        new ReviewerAgent(),
      tester:          new TesterAgent(),
      debugger:        new DebuggerAgent(),
      security:        new SecurityAgent(),
      api_tester:      new ApiTesterAgent(),
      optimizer:       new OptimizerAgent(),
      db_agent:        new DbAgent(),
      ui_designer:     new UiDesignerAgent(),
      ux_agent:        new UxAgent(),
      context_manager: new ContextManager(),
      memory_agent:    new MemoryAgent(),
      devops:          new DevOpsAgent(),
    };

    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.model = process.env.MODEL || "claude-sonnet-4-20250514";
  }

  // ── Main entry: run a goal end-to-end ─────────────────────────────────────
  async run(goal) {
    const session = this.sessionId
      ? { id: this.sessionId }
      : await createSession(goal);
    this.sessionId = session.id;

    log.manager(`Session ${session.id} | Goal: ${goal}`);
    this._emit("manager", null, `Planning execution for: ${goal}`, false);

    // 1. Recall memory
    const memory = await this.agents.memory_agent.recall(goal);

    // 2. Build execution plan
    const plan = await this._plan(goal, memory);
    this._emit("manager", null, `Plan ready — ${plan.plan.length} steps | Complexity: ${plan.complexity}`, false);

    // 3. Execute plan step by step
    const results = [];
    let priorOutput = "";

    for (const step of plan.plan) {
      const { agent: agentName, skill, task } = step;
      const agent = this.agents[agentName];

      if (!agent) {
        log.warn(`Manager: unknown agent "${agentName}", skipping`);
        continue;
      }

      this._emit(agentName, skill, `Step ${step.step}: ${task.slice(0,80)}...`, false);

      // Refresh context every 3 steps
      if (results.length > 0 && results.length % 3 === 0) {
        priorOutput = await this._compressContext(priorOutput, task);
      }

      let result;
      try {
        if (skill && agent.skills[skill]) {
          result = await agent.useSkill(skill, task, { memory, priorOutput });
        } else {
          result = await agent.run(task, { memory, priorOutput });
        }
      } catch (err) {
        log.error(`Step ${step.step} failed: ${err.message}`);
        result = { agent: agentName, skill, output: `[ERROR] ${err.message}` };
      }

      results.push({ step: step.step, ...result, task });
      priorOutput += `\n\n[${agentName}${skill ? `:${skill}` : ""}]\n${result.output}`;

      this._emit(agentName, skill, result.output, true);
    }

    // 4. Store to memory
    await this.agents.memory_agent.store(session.id, goal, results);

    // 5. Final synthesis
    const summary = await this._synthesize(goal, results);
    this._emit("manager", null, summary, true);

    await updateSession(session.id, { steps: results, summary });
    return { sessionId: session.id, goal, plan, results, summary };
  }

  // ── Run a specific agent + skill directly ─────────────────────────────────
  async runDirect(agentName, skillName, task) {
    const session = this.sessionId
      ? { id: this.sessionId }
      : await createSession(task);
    this.sessionId = session.id;

    const agent = this.agents[agentName];
    if (!agent) throw new Error(`Unknown agent: ${agentName}`);

    const memory = await this.agents.memory_agent.recall(task);
    let result;
    if (skillName && agent.skills[skillName]) {
      result = await agent.useSkill(skillName, task, { memory });
    } else {
      result = await agent.run(task, { memory });
    }
    await this.agents.memory_agent.store(session.id, task, [{ step:1, ...result, task }]);
    return { sessionId: session.id, ...result };
  }

  // ── Plan ──────────────────────────────────────────────────────────────────
  async _plan(goal, memory) {
    const systemCtx = memory ? `\n\n[RELEVANT MEMORY]\n${memory}` : "";
    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: MANAGER_PROMPT + systemCtx,
      messages: [{ role:"user", content: goal }],
    });
    const text = res.content.filter(b=>b.type==="text").map(b=>b.text).join("");
    try {
      const m = text.match(/\{[\s\S]*\}/);
      return JSON.parse(m[0]);
    } catch {
      return {
        goal, complexity:"medium", plan:[
          { step:1, agent:"coder", skill:"write_feature", task:goal, depends_on:[], priority:"high" }
        ], final_deliverable: goal
      };
    }
  }

  // ── Context compression ───────────────────────────────────────────────────
  async _compressContext(ctx, currentTask) {
    const agent = this.agents.context_manager;
    const r = await agent.useSkill("summarize_session", 
      `Compress this context for task: ${currentTask}\n\n${ctx.slice(-5000)}`, {});
    return r.output;
  }

  // ── Final synthesis ───────────────────────────────────────────────────────
  async _synthesize(goal, results) {
    const text = results.map(r => `[${r.agent}:${r.skill||"direct"}]\n${r.output}`).join("\n\n---\n\n");
    const res = await this.client.messages.create({
      model: this.model, max_tokens: 2048,
      system: "You are a technical engineering manager. Write a concise executive summary of what was accomplished.",
      messages: [{ role:"user", content: `Goal: ${goal}\n\nTeam outputs:\n${text.slice(-6000)}` }],
    });
    return res.content.filter(b=>b.type==="text").map(b=>b.text).join("");
  }

  // ── List all agents + their skills ────────────────────────────────────────
  listCapabilities() {
    const out = {};
    for (const [name, agent] of Object.entries(this.agents)) {
      out[name] = agent.listSkills();
    }
    return out;
  }

  _emit(agent, skill, message, isFinal) {
    if (this.onUpdate) this.onUpdate({ agent, skill, message, isFinal, timestamp: Date.now() });
  }
}
