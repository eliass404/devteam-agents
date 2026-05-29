import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Architect — a principal engineer with deep expertise in system design.
You think in systems, trade-offs, and long-term consequences. You are decisive and opinionated.
You produce clear, structured technical documentation that engineers can act on immediately.`;

export class ArchitectAgent extends BaseAgent {
  constructor() {
    super("architect", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "system_design",
      description: "Design a full system architecture with components, data flow, and trade-offs.",
      prompt: (task) => `Design the system architecture for: ${task}\n\nDeliver:\n## Overview\n## Components & Responsibilities\n## Data Flow Diagram (ASCII)\n## Tech Stack (with justification for each choice)\n## Key Design Decisions\n## Trade-offs Accepted\n## What NOT to build yet (scope control)\n## Implementation Order`,
    });

    this.registerSkill({
      name: "write_adr",
      description: "Write an Architecture Decision Record (ADR) for a specific decision.",
      prompt: (task) => `Write an ADR for: ${task}\n\nFormat:\n# ADR-XXX: Title\n## Status\n## Context\n## Decision\n## Consequences\n## Alternatives Considered\n## Date`,
    });

    this.registerSkill({
      name: "write_rfc",
      description: "Write a Request For Comments (RFC) document for a proposed change.",
      prompt: (task) => `Write a technical RFC for: ${task}\n\nInclude:\n## Summary\n## Motivation\n## Detailed Design\n## Drawbacks\n## Alternatives\n## Unresolved Questions\n## Migration Plan`,
    });

    this.registerSkill({
      name: "api_contract",
      description: "Design a complete API contract (OpenAPI/REST or GraphQL schema).",
      prompt: (task) => `Design API contract for: ${task}\n\nProvide:\n- OpenAPI 3.0 YAML definition\n- All endpoints with methods, paths, params\n- Request/response schemas\n- Auth requirements per endpoint\n- Error response shapes\n- Versioning strategy`,
    });

    this.registerSkill({
      name: "database_design",
      description: "Design entity relationships, schema, and data model.",
      prompt: (task) => `Design data model for: ${task}\n\nDeliver:\n- Entity Relationship Diagram (ASCII/text)\n- Table definitions with types and constraints\n- Index strategy\n- Relationships and foreign keys\n- Data access patterns\n- Estimated row sizes\n- Partitioning strategy if needed`,
    });

    this.registerSkill({
      name: "capacity_planning",
      description: "Estimate load, storage, and compute requirements.",
      prompt: (task) => `Capacity plan for: ${task}\n\nEstimate:\n- DAU/MAU assumptions\n- Requests per second (p50, p95, p99)\n- Storage growth per month\n- Bandwidth requirements\n- Compute sizing (CPU/RAM)\n- Database connections needed\n- Caching requirements\n- Cost estimate (AWS/GCP pricing ballpark)`,
    });

    this.registerSkill({
      name: "microservices_split",
      description: "Define service boundaries and decompose a monolith into microservices.",
      prompt: (task) => `Define microservices boundaries for: ${task}\n\nFor each service:\n- Name and responsibility\n- Owns which data\n- Exposes which APIs\n- Consumes which events\n- Technology choice\n- Team ownership\n\nAlso define:\n- Inter-service communication (sync/async)\n- Event schema\n- Shared libraries vs duplication policy`,
    });

    this.registerSkill({
      name: "tech_stack_audit",
      description: "Audit an existing tech stack and recommend improvements.",
      prompt: (task) => `Audit this tech stack: ${task}\n\nAnalyze:\n- Current stack assessment (strengths/weaknesses)\n- Bottlenecks and risks\n- Outdated dependencies or EOL components\n- Security posture\n- Developer experience issues\n- Recommended changes (with migration path)\n- Priority order for changes`,
    });
  }
}
