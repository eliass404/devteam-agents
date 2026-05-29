import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Tester — a QA engineer obsessed with breaking things before users do.
You write exhaustive tests, think adversarially, and never assume the happy path is the only path.
You cover unit, integration, E2E, load, fuzz, and contract tests.`;

export class TesterAgent extends BaseAgent {
  constructor() {
    super("tester", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "write_unit_tests",
      description: "Write unit tests with full edge case coverage.",
      prompt: (task) => `Write unit tests for:\n${task}\n\nCover:\n- Happy path\n- Null/undefined inputs\n- Empty arrays/objects\n- Boundary values (0, -1, MAX_INT)\n- Invalid types\n- Async errors\n- Timeout behavior\n\nUse Jest/Vitest. Mock all I/O. Target 95%+ branch coverage.`,
    });

    this.registerSkill({
      name: "write_integration_tests",
      description: "Write integration tests covering service interactions.",
      prompt: (task) => `Write integration tests for:\n${task}\n\nInclude:\n- Database interactions (use test DB)\n- API endpoint tests (supertest)\n- Auth flow validation\n- Error propagation between layers\n- Transaction rollback on failure\n- Cleanup between tests (beforeEach/afterEach)`,
    });

    this.registerSkill({
      name: "write_e2e_tests",
      description: "Write end-to-end tests simulating real user scenarios.",
      prompt: (task) => `Write E2E tests for:\n${task}\n\nUse Playwright or Cypress. Test:\n- Full user registration + login flow\n- Core user journeys\n- Error states visible to user\n- Form validation messages\n- Responsive behavior\n- Network failure graceful handling`,
    });

    this.registerSkill({
      name: "write_load_tests",
      description: "Write load and stress tests using k6 or Artillery.",
      prompt: (task) => `Write load tests for:\n${task}\n\nUsing k6. Include:\n- Smoke test (1 VU, 1 min)\n- Load test (ramp to 100 VU)\n- Stress test (find breaking point)\n- Spike test (sudden 10x load)\n- Thresholds: p95 < 500ms, error rate < 1%\n- Assertions on response correctness`,
    });

    this.registerSkill({
      name: "write_fuzz_tests",
      description: "Write fuzz/property-based tests to find unexpected inputs.",
      prompt: (task) => `Write fuzz tests for:\n${task}\n\nUsing fast-check or similar. Generate:\n- Arbitrary strings (including unicode, emoji, null bytes)\n- Random numbers (including NaN, Infinity, negative)\n- Deeply nested objects\n- Malformed JSON\n- SQL injection strings\n- XSS payloads\n\nAssert: never crashes, always returns valid shape.`,
    });

    this.registerSkill({
      name: "write_api_tests",
      description: "Write API test suite covering all endpoints and scenarios.",
      prompt: (task) => `Write API tests for:\n${task}\n\nFor each endpoint test:\n- 200 success with valid payload\n- 400 with missing required fields\n- 401 without auth\n- 403 with wrong role\n- 404 for non-existent resource\n- 429 when rate limited\n- 500 behavior on server error\n\nUse supertest or axios. Include auth token setup.`,
    });

    this.registerSkill({
      name: "test_plan",
      description: "Write a complete test plan document for a feature.",
      prompt: (task) => `Write a test plan for:\n${task}\n\nInclude:\n## Scope\n## Test Strategy\n## Test Types & Coverage Goals\n## Test Environment Setup\n## Test Cases (ID, description, steps, expected, priority)\n## Pass/Fail Criteria\n## Automation vs Manual split\n## Risk Assessment`,
    });

    this.registerSkill({
      name: "regression_suite",
      description: "Design a regression test suite to prevent reintroduction of fixed bugs.",
      prompt: (task) => `Create regression test suite for:\n${task}\n\nFor each known bug/fix:\n- What was the bug\n- Reproduction steps\n- The test that catches it\n- Expected behavior\n\nAlso add: Golden path regression tests that must never break.`,
    });
  }
}
