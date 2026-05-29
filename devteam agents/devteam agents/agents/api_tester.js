import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the API Tester — a specialist in testing APIs for correctness, security, performance, and reliability.
You test every endpoint as both a developer and an attacker. You look for data leakage, broken auth, and inconsistencies.`;

export class ApiTesterAgent extends BaseAgent {
  constructor() {
    super("api_tester", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "endpoint_test_suite",
      description: "Generate complete test suite for all API endpoints.",
      prompt: (task) => `Generate API test suite for:\n${task}\n\nFor each endpoint:\n- Method + URL\n- Auth setup\n- 200 success case (curl + expected response)\n- 400 missing fields\n- 401 no token\n- 403 wrong role\n- 404 not found\n- 422 invalid data\n- 429 rate limit\n\nFormat as executable curl commands + JS fetch examples.`,
    });

    this.registerSkill({
      name: "contract_testing",
      description: "Write consumer-driven contract tests for API consumers.",
      prompt: (task) => `Write contract tests for:\n${task}\n\nUsing Pact.js:\n- Define consumer expectations\n- Provider verification\n- Schema validation for all response fields\n- Handle optional vs required fields\n- Test all status code contracts\n- Breaking change detection`,
    });

    this.registerSkill({
      name: "auth_flow_test",
      description: "Test the complete authentication and authorization flow.",
      prompt: (task) => `Test auth flow:\n${task}\n\nTest scenarios:\n- Login with valid credentials\n- Login with wrong password\n- Login with non-existent user (timing attack?)\n- Access protected route with valid token\n- Access with expired token\n- Access with tampered token\n- Access with another user's token (IDOR check)\n- Role escalation attempts\n- Token refresh flow\n- Logout + token reuse`,
    });

    this.registerSkill({
      name: "data_exposure_audit",
      description: "Audit API responses for sensitive data exposure.",
      prompt: (task) => `Audit data exposure in API:\n${task}\n\nCheck responses for:\n- Password hashes or plaintext\n- Internal IDs that reveal system info\n- Other users' data\n- Server paths or stack traces\n- Internal IP addresses\n- Debug information in production\n- PII that shouldn't be returned\n- Over-fetching (returning more fields than needed)\n\nFor each: endpoint + field + severity + fix.`,
    });

    this.registerSkill({
      name: "rate_limit_test",
      description: "Test rate limiting and throttling behavior.",
      prompt: (task) => `Test rate limiting on:\n${task}\n\nTest:\n- Does 429 get returned after limit exceeded\n- Are Retry-After headers present\n- Can limits be bypassed with different IPs/headers\n- Are auth endpoints rate-limited separately\n- Does rate limit reset correctly\n- Behavior under sustained load\n\nProvide: curl scripts for each scenario.`,
    });

    this.registerSkill({
      name: "websocket_test",
      description: "Test WebSocket connections and message handling.",
      prompt: (task) => `Test WebSocket implementation:\n${task}\n\nTest:\n- Connection establishment\n- Auth on connection\n- Valid message handling\n- Malformed message handling\n- Binary vs text frames\n- Disconnection and reconnection\n- Message ordering guarantees\n- Broadcasting to multiple clients\n- Memory with 1000+ concurrent connections`,
    });

    this.registerSkill({
      name: "graphql_audit",
      description: "Security and correctness audit of a GraphQL API.",
      prompt: (task) => `GraphQL API audit:\n${task}\n\nCheck:\n- Introspection disabled in production\n- Query depth limiting\n- Query complexity limiting\n- Batching attack protection\n- Field-level authorization\n- N+1 resolver issue (DataLoader)\n- Subscription security\n- Input validation\n- Error message sanitization\n\nProvide: PoC queries + fixes.`,
    });
  }
}
