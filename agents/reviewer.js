import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Code Reviewer — a meticulous principal engineer who reviews code for correctness, quality, and security.
You are honest, direct, and constructive. You catch bugs others miss.
You think about edge cases, race conditions, memory leaks, and long-term maintainability.`;

export class ReviewerAgent extends BaseAgent {
  constructor() {
    super("reviewer", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "full_review",
      description: "Complete code review covering correctness, quality, security, and performance.",
      prompt: (task) => `Review this code:\n${task}\n\nOutput:\n## Summary\n## Critical Issues (MUST fix — bugs, security, data loss)\n## Major Issues (SHOULD fix — performance, maintainability)\n## Minor Issues (COULD fix — style, readability)\n## Security Findings\n## Positive Notes\n## Verdict: APPROVED | NEEDS_CHANGES | REJECTED`,
    });

    this.registerSkill({
      name: "security_review",
      description: "Security-focused code review checking for vulnerabilities.",
      prompt: (task) => `Security review:\n${task}\n\nCheck:\n- SQL/NoSQL injection\n- XSS and output encoding\n- CSRF protection\n- Authentication flaws\n- Authorization bypass (IDOR)\n- Sensitive data exposure\n- Insecure direct object references\n- Mass assignment\n- Hardcoded secrets\n- Unsafe deserialization\n\nRate each: CRITICAL / HIGH / MEDIUM / LOW / INFO`,
    });

    this.registerSkill({
      name: "performance_review",
      description: "Review code for performance bottlenecks and inefficiencies.",
      prompt: (task) => `Performance review:\n${task}\n\nIdentify:\n- O(n²) or worse algorithms\n- N+1 query patterns\n- Unnecessary re-renders (React)\n- Missing indexes or cache opportunities\n- Memory leaks\n- Blocking I/O in async code\n- Unthrottled loops or recursive calls\n\nProvide optimized alternatives.`,
    });

    this.registerSkill({
      name: "pr_review",
      description: "Review a pull request description and diff for completeness.",
      prompt: (task) => `Review this PR:\n${task}\n\nCheck:\n- Does the PR description explain WHY not just what\n- Are tests included\n- Does it handle rollback\n- Are migrations backward compatible\n- Are feature flags used for risky changes\n- Is documentation updated\n- Scope: is it too large (split it?)\n\nOutput structured feedback.`,
    });

    this.registerSkill({
      name: "dead_code_analysis",
      description: "Find unused code, unreachable branches, and unnecessary complexity.",
      prompt: (task) => `Analyze for dead code:\n${task}\n\nFind:\n- Unused functions and variables\n- Unreachable code branches\n- Commented-out code blocks\n- Duplicate functions\n- Over-engineered abstractions\n- Feature flags that are always true/false\n\nOutput a list with line references and removal recommendations.`,
    });

    this.registerSkill({
      name: "complexity_analysis",
      description: "Measure cognitive and cyclomatic complexity, suggest simplifications.",
      prompt: (task) => `Analyze complexity:\n${task}\n\nMeasure:\n- Cyclomatic complexity per function (flag anything >10)\n- Cognitive complexity\n- Nesting depth (flag >3)\n- Function length (flag >50 lines)\n- Class size (flag >300 lines)\n\nFor each flagged item, provide a refactored version.`,
    });

    this.registerSkill({
      name: "dependency_audit",
      description: "Audit dependencies for vulnerabilities, bloat, and outdated packages.",
      prompt: (task) => `Audit dependencies in:\n${task}\n\nAnalyze:\n- Known CVEs in listed versions\n- Packages with no recent updates (>2 years)\n- Duplicate functionality packages\n- Packages that could be replaced with stdlib\n- License compliance issues\n- Bundle size impact\n\nRecommend: keep / update / replace / remove for each.`,
    });

    this.registerSkill({
      name: "api_contract_review",
      description: "Review API design for consistency, REST compliance, and usability.",
      prompt: (task) => `Review API design:\n${task}\n\nCheck:\n- REST resource naming conventions\n- Consistent response shapes\n- Correct HTTP status codes\n- Proper use of verbs vs nouns\n- Pagination pattern consistency\n- Error response format\n- Versioning strategy\n- Breaking changes flagged\n\nRate: COMPLIANT | NEEDS_CHANGES | NON_COMPLIANT`,
    });
  }
}
