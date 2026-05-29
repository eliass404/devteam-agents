import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Context Manager — the team's coherence engine.
You track what has been decided, what is still open, and what matters for the current task.
You are concise, structured, and ruthless about cutting noise.`;

export class ContextManager extends BaseAgent {
  constructor() {
    super("context_manager", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "summarize_session",
      description: "Compress session history into a tight, actionable context summary.",
      prompt: (task) => `Summarize this session context:\n${task}\n\nOutput:\n## Decisions Made (do not revisit)\n## Current State\n## Open Questions\n## Key Artifacts (code files, schemas, endpoints created)\n## What the next agent needs to know\n\nBe brutal with cutting noise. Max 500 words.`,
    });

    this.registerSkill({
      name: "detect_contradictions",
      description: "Find contradictions and inconsistencies across session outputs.",
      prompt: (task) => `Detect contradictions in:\n${task}\n\nLook for:\n- Architecture decisions that conflict\n- API contracts that don't match implementations\n- Test expectations that conflict with code behavior\n- Security requirements violated by code choices\n- Performance targets not achievable with chosen approach\n\nFor each: what conflicts, where, recommended resolution.`,
    });

    this.registerSkill({
      name: "extract_decisions",
      description: "Extract and catalog all technical decisions from a session.",
      prompt: (task) => `Extract decisions from:\n${task}\n\nFor each decision:\n- What was decided\n- Why (the rationale)\n- Alternatives rejected\n- Who/what made the decision\n- Reversibility: EASY | HARD | IRREVERSIBLE\n\nFormat as a decision log table.`,
    });

    this.registerSkill({
      name: "scope_check",
      description: "Check if the work is staying within scope and flag creep.",
      prompt: (task) => `Scope check:\n${task}\n\nOriginal goal vs current work:\n- What's in scope\n- What's scope creep (added without agreement)\n- What's missing from original scope\n- Recommended: cut | include | defer for each item\n\nFlag: is this on track to deliver the original goal?`,
    });

    this.registerSkill({
      name: "handoff_brief",
      description: "Write a handoff brief for passing work between agents or sessions.",
      prompt: (task) => `Write handoff brief for:\n${task}\n\nInclude:\n- What was completed\n- Current state of artifacts\n- What the next agent must do first\n- Known issues or blockers\n- Files created and their purpose\n- Dependencies installed\n- Environment setup needed\n\nFormat: copy-pasteable briefing.`,
    });

    this.registerSkill({
      name: "requirements_check",
      description: "Verify that all original requirements have been addressed.",
      prompt: (task) => `Requirements coverage check:\n${task}\n\nFor each original requirement:\n- Requirement text\n- Status: DONE | PARTIAL | MISSING | OUT_OF_SCOPE\n- Evidence (which agent output covers it)\n- Gap description if not done\n\nOverall coverage: X/Y requirements met.`,
    });
  }
}
