# DevTeam AI — Full Agent & Skills Reference

**1 Manager · 14 Agents · 107 Skills**

---

## How It Works

### The Manager (Top Layer)

The Manager is the only entity you talk to. You give it a goal like:

> _"Build a SaaS billing system with Stripe"_

The Manager calls Claude internally to produce a JSON execution plan:

```json
{
  "goal": "Build a SaaS billing system with Stripe",
  "complexity": "high",
  "plan": [
    {
      "step": 1,
      "agent": "architect",
      "skill": "system_design",
      "task": "Design billing system architecture..."
    },
    {
      "step": 2,
      "agent": "db_agent",
      "skill": "schema_design",
      "task": "Design subscriptions/invoices schema..."
    },
    {
      "step": 3,
      "agent": "coder",
      "skill": "write_rest_api",
      "task": "Implement Stripe webhook endpoints..."
    },
    {
      "step": 4,
      "agent": "security",
      "skill": "owasp_audit",
      "task": "Audit payment flow for OWASP top 10..."
    },
    {
      "step": 5,
      "agent": "tester",
      "skill": "write_api_tests",
      "task": "Write tests for all billing endpoints..."
    },
    {
      "step": 6,
      "agent": "devops",
      "skill": "ci_cd_pipeline",
      "task": "Create deployment pipeline..."
    }
  ]
}
```

Then it **executes** each step in order, passing each agent's output as context to the next.

### Agent + Skill = Precision

Each agent has a **base identity** (system prompt) + **named skills** (specific task templates).

- Without a skill → agent runs in general mode
- With a skill → agent uses a pre-engineered prompt optimized for that exact task

### Memory (Cross-Session)

After every run, the `memory_agent` extracts facts, decisions, and code from the session and stores them tagged by topic. On the next session, the Manager loads relevant memory before planning — so the team remembers what was decided before.

### Context Manager (Long Sessions)

Every 3 steps, the `context_manager` compresses the accumulated output into a tight summary so no agent ever loses the thread — even across 20+ step pipelines.

---

## All 14 Agents + 107 Skills

---

### MANAGER

_Top-level orchestrator. Reads your goal, builds the execution plan, routes to agents, chains outputs, synthesizes the final result. You never call agents directly in pipeline mode — the Manager decides._

---

### ARCHITECT — 8 skills

Design authority. Produces artifacts other agents implement.

| Skill                 | What it does                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `system_design`       | Full system architecture: components, data flow, tech stack, trade-offs, implementation order |
| `write_adr`           | Architecture Decision Record — context, decision, consequences, alternatives                  |
| `write_rfc`           | Request For Comments — motivation, detailed design, drawbacks, migration plan                 |
| `api_contract`        | OpenAPI 3.0 YAML — all endpoints, schemas, auth, error shapes, versioning                     |
| `database_design`     | ER diagram, table definitions, indexes, relationships, data access patterns                   |
| `capacity_planning`   | DAU estimates, RPS, storage growth, compute sizing, cost ballpark                             |
| `microservices_split` | Service boundaries, owns-what-data, inter-service comms, event schema                         |
| `tech_stack_audit`    | Audit existing stack: strengths, risks, EOL components, migration roadmap                     |

---

### CODER — 10 skills

Writes complete, production-ready code. No stubs, no TODOs.

| Skill              | What it does                                                                     |
| ------------------ | -------------------------------------------------------------------------------- |
| `write_feature`    | Full feature implementation from scratch                                         |
| `write_rest_api`   | Routes, controllers, middleware, validation, error handling, curl examples       |
| `write_crud`       | Create/Read/List/Update/Patch/Delete with pagination, status codes, error format |
| `write_auth`       | JWT + refresh tokens, password hashing, RBAC, rate limiting on auth endpoints    |
| `write_tests_unit` | Unit tests: happy path, edge cases, boundaries, mocks — 90%+ branch coverage     |
| `refactor`         | SOLID, DRY, reduce cyclomatic complexity, before/after explanation               |
| `write_websocket`  | Server + client, reconnection, heartbeat, message queue for offline clients      |
| `write_cli_tool`   | Commander.js, help text, colored output, progress indicators, config file        |
| `write_worker`     | BullMQ job queue, retry with backoff, dead letter queue, graceful shutdown       |
| `write_sdk`        | Typed SDK: TypeScript types, HTTP wrapper, auth injection, retry on 429/503      |

---

### REVIEWER — 8 skills

Meticulous. Catches what others miss.

| Skill                 | What it does                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------- |
| `full_review`         | Bugs, security, performance, dead code — verdict: APPROVED / NEEDS_CHANGES / REJECTED       |
| `security_review`     | Injection, XSS, CSRF, IDOR, mass assignment, hardcoded secrets — severity rated             |
| `performance_review`  | O(n²), N+1, memory leaks, blocking I/O, unnecessary re-renders                              |
| `pr_review`           | PR completeness: tests, migrations, feature flags, scope, documentation                     |
| `dead_code_analysis`  | Unused functions, unreachable branches, commented-out blocks, always-true flags             |
| `complexity_analysis` | Cyclomatic + cognitive complexity, nesting depth, function/class size — refactored versions |
| `dependency_audit`    | CVEs, stale packages, license issues, bundle weight, replacement recommendations            |
| `api_contract_review` | REST naming, status codes, response shape consistency, breaking changes                     |

---

### TESTER — 8 skills

Thinks adversarially. Covers every path.

| Skill                     | What it does                                                                  |
| ------------------------- | ----------------------------------------------------------------------------- |
| `write_unit_tests`        | Jest/Vitest, null/empty/boundary inputs, async errors, 95%+ branch coverage   |
| `write_integration_tests` | Supertest, DB interactions, auth flows, transaction rollback, test cleanup    |
| `write_e2e_tests`         | Playwright/Cypress, full user journeys, error states, offline handling        |
| `write_load_tests`        | k6: smoke, load ramp, stress, spike tests — p95 < 500ms threshold             |
| `write_fuzz_tests`        | fast-check: arbitrary strings, unicode, NaN, deeply nested, SQL/XSS payloads  |
| `write_api_tests`         | Every endpoint: 200/400/401/403/404/429/500 scenarios with auth setup         |
| `test_plan`               | Scope, strategy, test cases (ID/steps/expected/priority), pass criteria, risk |
| `regression_suite`        | Bug→test mapping: what broke, reproduction, test that catches it              |

---

### DEBUGGER — 7 skills

Root cause, not symptoms. Always explains the "why".

| Skill                 | What it does                                                                  |
| --------------------- | ----------------------------------------------------------------------------- |
| `root_cause_analysis` | 5-Why method: root cause, contributing factors, fix, prevention, monitoring   |
| `fix_bug`             | Diagnose + complete fix with explanation of why it works + verification steps |
| `crash_analysis`      | Stack trace walk-through, state at crash, severity, immediate fix + hardening |
| `memory_leak_hunt`    | Event listeners, closures, circular refs, growing maps, forgotten timers      |
| `race_condition_hunt` | Shared state, TOCTOU, Promise.all errors, DB atomicity, cache stampede        |
| `performance_debug`   | Slowest operation, N+1 queries, query times, memory trend, network waterfall  |
| `incident_postmortem` | Timeline, root cause, impact, detection, what went well/wrong, action items   |

---

### SECURITY — 9 skills

Thinks like an attacker. Always provides remediation with code.

| Skill                 | What it does                                                                     |
| --------------------- | -------------------------------------------------------------------------------- |
| `owasp_audit`         | All OWASP Top 10: Severity + CWE + location + PoC + code fix                     |
| `threat_model`        | STRIDE: Spoofing/Tampering/Repudiation/Disclosure/DoS/Elevation — risk matrix    |
| `pentest_api`         | BOLA/IDOR, broken function auth, mass assignment, JWT attacks, GraphQL attacks   |
| `injection_audit`     | SQL, NoSQL, command, LDAP, XSS, SSTI, XXE — payload + secure fix                 |
| `secrets_audit`       | API keys, passwords, private keys, JWT secrets, base64-encoded creds             |
| `auth_audit`          | Password hashing, session management, JWT impl, brute force, account enumeration |
| `dependency_cve_scan` | CVEs per dependency, CVSS scores, fixed versions, exploitability in context      |
| `cors_csp_audit`      | Wildcard CORS risks, CSP directives, unsafe-inline, hardened header examples     |
| `encryption_audit`    | TLS version, cipher suites, HSTS, at-rest encryption, key management, PII        |

---

### API_TESTER — 7 skills

Tests every endpoint as both developer and attacker.

| Skill                 | What it does                                                                       |
| --------------------- | ---------------------------------------------------------------------------------- |
| `endpoint_test_suite` | All endpoints: curl + JS fetch for success, 400, 401, 403, 404, 422, 429           |
| `contract_testing`    | Pact.js consumer contracts, provider verification, schema validation               |
| `auth_flow_test`      | Login, wrong password, expired token, tampered JWT, IDOR check, token refresh      |
| `data_exposure_audit` | Password hashes, internal IDs, PII, stack traces, over-fetched fields in responses |
| `rate_limit_test`     | 429 trigger, Retry-After headers, bypass attempts, auth endpoint limits            |
| `websocket_test`      | Connection, auth, malformed messages, reconnection, 1000+ concurrent connections   |
| `graphql_audit`       | Introspection, depth limits, batching attacks, field auth, DataLoader N+1          |

---

### OPTIMIZER — 8 skills

Profiles first, optimizes what matters.

| Skill                  | What it does                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `algo_optimize`        | Big-O analysis, data structure improvements, before/after + benchmarking code         |
| `db_query_optimize`    | EXPLAIN output, missing indexes, N+1, cursor pagination, query rewrites               |
| `caching_strategy`     | What/where/how to cache, TTL, invalidation, stampede prevention, hit rate estimate    |
| `bundle_optimize`      | Tree-shaking, code splitting, lazy loading, lib alternatives — target < 200KB initial |
| `memory_optimize`      | Object pooling, streaming, generators, weak refs, before/after memory profile         |
| `react_optimize`       | memo/useMemo/useCallback, context splitting, virtualization, useEffect deps           |
| `api_latency_optimize` | Compression, HTTP/2, connection pooling, parallel queries, partial responses          |
| `infra_cost_optimize`  | Overprovisioned compute, reserved instances, spot instances, storage tiers            |

---

### DB_AGENT — 8 skills

Correctness first, performance second.

| Skill                | What it does                                                                       |
| -------------------- | ---------------------------------------------------------------------------------- |
| `schema_design`      | CREATE TABLE with types, constraints, PKs, FKs, unique, check, indexes explained   |
| `write_migration`    | Up + down migration, data migration, zero-downtime approach, duration estimate     |
| `query_optimization` | EXPLAIN analysis, index creation, JOIN vs subquery, cursor pagination              |
| `redis_design`       | String/Hash/List/Set/ZSet/Stream per use case, key naming, TTL, eviction, pub/sub  |
| `orm_models`         | Prisma/TypeORM/Sequelize models, associations, hooks, typed repository pattern     |
| `mongodb_design`     | Embed vs reference decisions, aggregation pipelines, compound indexes, TTL indexes |
| `db_seed`            | faker.js realistic data, FK ordering, dev/test/load variants, idempotent           |
| `backup_recovery`    | RPO/RTO targets, backup scripts, PITR, failover strategy, restore testing plan     |

---

### UI_DESIGNER — 7 skills

Production-ready components. All states covered.

| Skill                 | What it does                                                                       |
| --------------------- | ---------------------------------------------------------------------------------- |
| `design_component`    | TypeScript React component: all states, CSS, ARIA, keyboard nav, Storybook story   |
| `design_system`       | Color tokens, typography scale, spacing, dark mode variables, component variants   |
| `design_dashboard`    | Grid layout, metric cards, charts, sortable table, filters, skeleton states        |
| `design_form`         | Multi-step, inline validation, error summary, auto-focus, react-hook-form          |
| `design_landing_page` | Hero, social proof, features, how-it-works, CTA — conversion-focused               |
| `responsive_layout`   | Mobile-first 320/768/1024/1440px, hamburger, Grid + Flexbox, touch targets         |
| `animation_design`    | Route transitions, mount/unmount, hover micro-interactions, prefers-reduced-motion |

---

### UX_AGENT — 7 skills

Champions the user. Removes friction.

| Skill                 | What it does                                                                      |
| --------------------- | --------------------------------------------------------------------------------- |
| `user_flow`           | Entry points, decision nodes, happy path, error paths, empty states, exit points  |
| `accessibility_audit` | WCAG 2.1 AA: contrast, semantic HTML, keyboard nav, ARIA — code fixes for each    |
| `ux_heuristic_review` | Nielsen's 10 heuristics — PASS/PARTIAL/FAIL with fix per failure                  |
| `onboarding_design`   | Welcome → progressive disclosure → quick win → empty state → success moment       |
| `error_ux`            | Per error type (400/401/403/404/500/offline/timeout): copy + interaction pattern  |
| `copy_writing`        | Buttons, labels, placeholders, error messages, empty states, tooltips — no jargon |
| `mobile_ux`           | Touch targets, thumb zones, gesture support, 3G performance, one-handed use       |

---

### CONTEXT_MANAGER — 6 skills

Keeps long pipelines coherent. Prevents contradictions.

| Skill                   | What it does                                                                     |
| ----------------------- | -------------------------------------------------------------------------------- |
| `summarize_session`     | Decisions made, current state, open questions, key artifacts — max 500 words     |
| `detect_contradictions` | Architecture conflicts, API/impl mismatches, security violations by code choices |
| `extract_decisions`     | Decision log: what, why, alternatives rejected, reversibility rating             |
| `scope_check`           | In scope vs creep vs missing — flag if off-track from original goal              |
| `handoff_brief`         | What's done, current state, what next agent must do first, known blockers        |
| `requirements_check`    | Per requirement: DONE / PARTIAL / MISSING / OUT_OF_SCOPE with evidence           |

---

### MEMORY_AGENT — 6 skills

Persistent cross-session brain. Gary-M style structured memory.

| Skill                  | What it does                                                                      |
| ---------------------- | --------------------------------------------------------------------------------- |
| `summarize_memory`     | Concise session brief: what was built, key decisions, known issues, current state |
| `extract_patterns`     | Recurring bugs, preferred choices, successful approaches, anti-patterns to avoid  |
| `build_knowledge_base` | Organized reference: architecture facts, API contracts, schemas, bugs, perf data  |
| `recall_relevant`      | Retrieve only what's relevant to current task — no noise                          |
| `compare_sessions`     | Drift detection: what changed, decisions reversed, quality trend                  |
| `generate_readme`      | Full GitHub README from memory: setup, API ref, env vars, deployment, issues      |

---

### DEVOPS — 8 skills

Automates everything. Reproducible infrastructure.

| Skill                  | What it does                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `write_dockerfile`     | Multi-stage, alpine/distroless, layer caching, non-root user, HEALTHCHECK           |
| `ci_cd_pipeline`       | GitHub Actions: lint → test → security scan → build → staging → prod with approval  |
| `kubernetes_manifests` | Deployment, Service, Ingress+TLS, HPA, ConfigMap, Secret, NetworkPolicy             |
| `terraform_infra`      | VPC, compute, RDS, ALB, IAM, S3, CloudWatch alarms, variables, outputs              |
| `monitoring_setup`     | Prometheus+Grafana, log aggregation, distributed tracing, SLO definitions, runbooks |
| `secrets_management`   | Vault/AWS Secrets Manager, rotation, least-privilege, audit logging, git hooks      |
| `zero_downtime_deploy` | Blue/green or canary, DB migration compat, feature flags, < 5 min rollback          |
| `log_management`       | Structured JSON logging, request ID correlation, PII redaction, log shipping        |

---

## Usage Examples

### Pipeline Mode (Manager decides everything)

```bash
node cli.js "Build a multi-tenant SaaS with Stripe billing and JWT auth"
```

### Direct Mode (you pick agent + skill)

```bash
node cli.js --agent security --skill owasp_audit "Review this Express router code: ..."
node cli.js --agent db_agent --skill schema_design "Multi-tenant SaaS: users, orgs, subscriptions, invoices"
node cli.js --agent coder --skill write_auth "JWT + refresh token auth for Express"
node cli.js --agent devops --skill ci_cd_pipeline "Node.js microservice on AWS ECS"
node cli.js --agent optimizer --skill caching_strategy "Redis caching for a social feed API"
node cli.js --agent tester --skill write_load_tests "Auth endpoints: POST /login POST /refresh"
```

### Resume a Session

```bash
node cli.js --session abc123XYZ "Now add rate limiting to all endpoints"
```

---

_107 skills · 14 agents · 1 manager_
