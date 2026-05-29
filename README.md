# DevTeam Agents

An AI-powered software development and pentesting team built on the Claude API.
One Manager coordinates 14 specialized agents, each with a set of skills — 107 skills total.
You describe what you want to build. The Manager plans, routes, executes, and delivers.

---

## What is this

DevTeam AI is a multi-agent orchestration system where every role in a real engineering team is played by a specialized AI agent:

- You type a goal
- The **Manager** calls Claude to build an execution plan
- The plan assigns each subtask to the right agent + skill
- Each agent runs in sequence, receiving the prior agent's output as context
- The **Memory Agent** stores everything across sessions so the team remembers past work
- The **Context Manager** compresses long sessions so nothing gets lost

The result is a team that can go from a one-line description to architecture, code, tests, security audit, and deployment config — without you micromanaging each step.

---

## The team

### Manager
The top layer. The only thing you talk to in pipeline mode. It reads your goal, calls Claude to produce a JSON execution plan, then runs each step in order — chaining outputs, managing context, and synthesizing a final result.

### 14 Agents

| Agent | Role | Skills |
|---|---|---|
| `architect` | System design, ADRs, RFCs, API contracts, capacity planning | 8 |
| `coder` | Full feature implementation across any stack | 10 |
| `reviewer` | Code quality, security review, complexity analysis, PR review | 8 |
| `tester` | Unit, integration, E2E, load, fuzz, and API tests | 8 |
| `debugger` | Root cause analysis, crash analysis, memory leaks, race conditions | 7 |
| `security` | OWASP Top 10, STRIDE threat modeling, pentesting, CVE scanning | 9 |
| `api_tester` | Endpoint testing, contract testing, data exposure audit | 7 |
| `optimizer` | Algorithm optimization, caching strategy, bundle size, query tuning | 8 |
| `db_agent` | Schema design, migrations, Redis, MongoDB, ORM models, backups | 8 |
| `ui_designer` | React components, design systems, dashboards, forms, landing pages | 7 |
| `ux_agent` | User flows, WCAG accessibility, heuristic review, microcopy | 7 |
| `context_manager` | Session coherence, contradiction detection, scope checking | 6 |
| `memory_agent` | Persistent cross-session memory, knowledge base, README generation | 6 |
| `devops` | Docker, GitHub Actions CI/CD, Kubernetes, Terraform, monitoring | 8 |

**Total: 107 skills**

---

## Requirements

- Node.js 20 or higher
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

---

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/YOUR_USERNAME/devteam-v2.git
cd devteam-v2
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up your environment**

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

Do not commit this file. It is already in `.gitignore`.

**4. Start the server**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The web dashboard is ready.

---

## Usage

### Web Dashboard

Open `http://localhost:3000` after starting the server.

Two modes:

- **Manager Pipeline** — type a goal, the Manager routes everything automatically
- **Direct** — pick an agent and a specific skill, give it a focused task

The dashboard shows each agent thinking in real time via WebSocket. Every session is saved and resumable from the Sessions tab in the sidebar.

---

### CLI

**Run the full pipeline (Manager decides everything):**

```bash
node cli.js "Build a REST API for a todo app with JWT auth and PostgreSQL"
```

**Run a single agent with a specific skill:**

```bash
node cli.js --agent coder --skill write_rest_api "Todo API with CRUD endpoints"
node cli.js --agent security --skill owasp_audit "Review this Express app for vulnerabilities"
node cli.js --agent db_agent --skill schema_design "Multi-tenant SaaS with users, orgs, subscriptions"
node cli.js --agent devops --skill ci_cd_pipeline "Node.js app deploying to AWS ECS"
node cli.js --agent tester --skill write_load_tests "Auth endpoints: POST /login POST /refresh"
node cli.js --agent optimizer --skill caching_strategy "Redis caching for a social media feed API"
node cli.js --agent reviewer --skill full_review "Review this authentication middleware"
node cli.js --agent architect --skill database_design "E-commerce platform with products, orders, inventory"
```

**Resume a previous session (team remembers prior work):**

```bash
node cli.js --session SESSION_ID "Now add rate limiting to all endpoints"
```

**List all agents and their skills:**

```bash
node cli.js --list
```

**Run tests:**

```bash
npm test
```

---

### REST API

The server also exposes a REST API for programmatic use.

**Health check:**
```
GET /api/health
```

**Run a full pipeline:**
```
POST /api/run
{ "goal": "Build a billing system", "sessionId": "optional" }
```

**Run a specific agent + skill:**
```
POST /api/agent/:name/skill/:skill
{ "task": "Your task here", "sessionId": "optional" }
```

**List sessions:**
```
GET /api/sessions
```

**Get session by ID:**
```
GET /api/sessions/:id
```

**List all agent capabilities:**
```
GET /api/capabilities
```

**Get memory for a session:**
```
GET /api/memory/:sessionId
```

---

### WebSocket (real-time streaming)

Connect to `ws://localhost:3000` and send JSON messages:

**Full pipeline:**
```json
{ "type": "run", "goal": "Build a REST API", "sessionId": "optional" }
```

**Direct agent:**
```json
{ "type": "direct", "agent": "coder", "skill": "write_feature", "task": "..." }
```

The server streams back update events as each agent completes:
```json
{ "type": "update", "agent": "coder", "skill": "write_feature", "message": "...", "isFinal": true }
{ "type": "done", "result": { "sessionId": "...", "summary": "..." } }
```

---

## How it works

### Agent + Skill system

Each agent has a **system prompt** that defines its identity and a set of **skills** — pre-engineered task prompts optimized for specific outputs.

Without a skill, an agent is a smart persona. With a skill, it has a structured prompt that forces specific, expert-level output. For example:

- `security → owasp_audit` forces the agent to check all 10 OWASP categories, rate each finding by severity (CRITICAL / HIGH / MEDIUM / LOW), include the CWE ID, provide a proof of concept, and write a code fix
- `db_agent → schema_design` forces full SQL CREATE TABLE statements, every column with types and constraints, index strategy with justification for each index, and relationship definitions
- `tester → write_load_tests` forces k6 scripts covering smoke, load ramp, stress, and spike scenarios with p95 < 500ms thresholds

### Memory system

After every session the `memory_agent` extracts facts, decisions, and code from the output — tags them by topic — and stores them in `memory/long_term.json`.

On the next session, the Manager loads relevant memory before planning. The team remembers:
- Architecture decisions already made
- Tech stack choices
- Known bugs and their fixes
- Database schemas designed in prior sessions
- Any patterns or preferences you have established

### Context management

Every 3 steps in a pipeline, the `context_manager` compresses the accumulated output into a tight summary. This prevents later agents from losing track of what earlier agents decided, even in long 10+ step pipelines.

### Execution flow

```
You type a goal
       ↓
Memory Agent recalls relevant past context
       ↓
Manager calls Claude → gets JSON execution plan
       ↓
Step 1: agent A + skill X → output 1
Step 2: agent B + skill Y → output 1 + output 2 as context
Step 3: agent C + skill Z → output 1 + 2 + 3 as context
       ↓ (every 3 steps)
Context Manager compresses accumulated output
       ↓
Memory Agent stores everything tagged by topic
       ↓
Manager synthesizes final summary
```

---

## Project structure

```
devteam-v2/
├── manager/
│   └── manager.js          ← Top-level orchestrator
├── agents/
│   ├── architect.js        ← 8 skills
│   ├── coder.js            ← 10 skills
│   ├── reviewer.js         ← 8 skills
│   ├── tester.js           ← 8 skills
│   ├── debugger.js         ← 7 skills
│   ├── security.js         ← 9 skills
│   ├── api_tester.js       ← 7 skills
│   ├── optimizer.js        ← 8 skills
│   ├── db.js               ← 8 skills
│   ├── ui_designer.js      ← 7 skills
│   ├── ux.js               ← 7 skills
│   ├── context_manager.js  ← 6 skills
│   ├── memory_agent.js     ← 6 skills
│   └── devops.js           ← 8 skills
├── core/
│   ├── base_agent.js       ← Base class + skill runner
│   ├── session.js          ← Session persistence
│   └── logger.js           ← Colored logging
├── memory/                 ← Auto-created, gitignored
│   ├── store.json          ← Session history
│   └── long_term.json      ← Cross-session memory
├── ui/
│   └── index.html          ← Web dashboard
├── tests/
│   └── run.js              ← Test suite
├── cli.js                  ← CLI entry point
├── server.js               ← Express + WebSocket server
├── .env.example            ← Environment template
├── .gitignore
├── AGENTS_AND_SKILLS.md    ← Full skill reference
└── package.json
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | required | Your Anthropic API key |
| `MODEL` | `claude-sonnet-4-20250514` | Claude model to use |
| `MAX_TOKENS` | `8192` | Max tokens per agent call |
| `PORT` | `3000` | Server port |
| `MEMORY_FILE` | `./memory/store.json` | Session storage path |
| `LOG_LEVEL` | `info` | Logging level: debug, info, warn, error |

---

## All 107 skills

See [AGENTS_AND_SKILLS.md](./AGENTS_AND_SKILLS.md) for the full reference with every agent, every skill name, and what each skill does.

Quick reference:

```
architect    → system_design, write_adr, write_rfc, api_contract, database_design,
               capacity_planning, microservices_split, tech_stack_audit

coder        → write_feature, write_rest_api, write_crud, write_auth, write_tests_unit,
               refactor, write_websocket, write_cli_tool, write_worker, write_sdk

reviewer     → full_review, security_review, performance_review, pr_review,
               dead_code_analysis, complexity_analysis, dependency_audit, api_contract_review

tester       → write_unit_tests, write_integration_tests, write_e2e_tests, write_load_tests,
               write_fuzz_tests, write_api_tests, test_plan, regression_suite

debugger     → root_cause_analysis, fix_bug, crash_analysis, memory_leak_hunt,
               race_condition_hunt, performance_debug, incident_postmortem

security     → owasp_audit, threat_model, pentest_api, injection_audit, secrets_audit,
               auth_audit, dependency_cve_scan, cors_csp_audit, encryption_audit

api_tester   → endpoint_test_suite, contract_testing, auth_flow_test, data_exposure_audit,
               rate_limit_test, websocket_test, graphql_audit

optimizer    → algo_optimize, db_query_optimize, caching_strategy, bundle_optimize,
               memory_optimize, react_optimize, api_latency_optimize, infra_cost_optimize

db_agent     → schema_design, write_migration, query_optimization, redis_design,
               orm_models, mongodb_design, db_seed, backup_recovery

ui_designer  → design_component, design_system, design_dashboard, design_form,
               design_landing_page, responsive_layout, animation_design

ux_agent     → user_flow, accessibility_audit, ux_heuristic_review, onboarding_design,
               error_ux, copy_writing, mobile_ux

context_mgr  → summarize_session, detect_contradictions, extract_decisions,
               scope_check, handoff_brief, requirements_check

memory_agent → summarize_memory, extract_patterns, build_knowledge_base,
               recall_relevant, compare_sessions, generate_readme

devops       → write_dockerfile, ci_cd_pipeline, kubernetes_manifests, terraform_infra,
               monitoring_setup, secrets_management, zero_downtime_deploy, log_management
```

---

## Example pipeline runs

**"Build a SaaS billing system with Stripe"**

The Manager will plan something like:
1. `architect → system_design` — architecture overview, components, data flow
2. `architect → api_contract` — OpenAPI spec for all billing endpoints
3. `db_agent → schema_design` — users, orgs, subscriptions, invoices, plans tables
4. `coder → write_auth` — JWT auth with role-based access (admin, member, billing)
5. `coder → write_rest_api` — Stripe webhook handlers, subscription CRUD
6. `security → owasp_audit` — audit the payment flow for OWASP Top 10
7. `tester → write_api_tests` — test every billing endpoint including edge cases
8. `devops → ci_cd_pipeline` — GitHub Actions pipeline with staging + production

---

**"My API is returning 500 errors under load"**

The Manager will plan:
1. `debugger → crash_analysis` — analyze the error pattern and stack traces
2. `debugger → race_condition_hunt` — check for concurrency issues under load
3. `optimizer → db_query_optimize` — find slow queries causing timeouts
4. `optimizer → caching_strategy` — design Redis caching to reduce DB load
5. `tester → write_load_tests` — k6 tests to reproduce and verify the fix
6. `devops → monitoring_setup` — add metrics and alerts so this is caught earlier

---

**"Security audit my Express app before launch"**

The Manager will plan:
1. `security → owasp_audit` — full OWASP Top 10 check
2. `security → secrets_audit` — scan for hardcoded keys and exposed credentials
3. `security → auth_audit` — review JWT implementation, password hashing, brute force protection
4. `security → cors_csp_audit` — check headers and CSP policy
5. `api_tester → data_exposure_audit` — check what data the API is leaking in responses
6. `reviewer → dependency_audit` — CVE scan on all npm packages

---

## Adding new skills

To add a skill to an existing agent, open its file in `agents/` and call `this.registerSkill()` inside `_registerSkills()`:

```js
this.registerSkill({
  name: "your_skill_name",
  description: "One sentence: what does this skill do.",
  prompt: (task, ctx) => `Your structured prompt here.\n\nTask: ${task}\n\nOutput format:\n- Section 1\n- Section 2`,
});
```

The Manager will automatically discover and use it.

---

## Adding a new agent

1. Create `agents/your_agent.js` extending `BaseAgent`
2. Import it in `manager/manager.js` and add it to `this.agents`
3. Add it to the Manager's system prompt so the Manager knows when to use it

---

## Security

- Never commit your `.env` file — it contains your API key
- The `memory/` directory contains your session history — it is gitignored by default
- The web dashboard has no authentication — do not expose port 3000 publicly without adding auth
- All agent outputs are AI-generated — review security findings before acting on them in production

---

## License

MIT — do whatever you want with it.

---

*1 Manager · 14 Agents · 107 Skills · Built on Claude API*
