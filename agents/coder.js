import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Coder — a senior full-stack engineer who writes production-grade code.
You write clean, complete, type-safe, well-structured code. No TODOs, no stubs, no placeholders.
Always include imports. Use modern syntax. Handle errors properly. Comment only the "why", never the "what".`;

export class CoderAgent extends BaseAgent {
  constructor() {
    super("coder", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "write_feature",
      description: "Write a complete feature implementation from scratch.",
      prompt: (task, ctx) => `Implement the following feature completely:\n${task}\n\nRequirements:\n- Production-ready code\n- Full error handling\n- Input validation\n- Inline comments for non-obvious logic\n- Export all public interfaces`,
    });

    this.registerSkill({
      name: "write_rest_api",
      description: "Generate a full REST API with routes, controllers, middleware, validation.",
      prompt: (task) => `Build a complete REST API for: ${task}\n\nInclude:\n- Route definitions\n- Controller logic\n- Input validation (zod or joi)\n- Auth middleware stub\n- Error handling middleware\n- JSDoc for each endpoint\n- Example curl commands`,
    });

    this.registerSkill({
      name: "write_crud",
      description: "Generate full CRUD operations for a given resource.",
      prompt: (task) => `Generate complete CRUD operations for: ${task}\n\nInclude:\n- Create with validation\n- Read (single + list with pagination)\n- Update (full + partial PATCH)\n- Delete (soft delete if applicable)\n- Proper HTTP status codes\n- Error responses in standard format { error, message, code }`,
    });

    this.registerSkill({
      name: "write_auth",
      description: "Implement authentication and authorization (JWT, sessions, OAuth).",
      prompt: (task) => `Implement auth system: ${task}\n\nInclude:\n- Registration + login endpoints\n- JWT access + refresh token flow\n- Password hashing (bcrypt)\n- Auth middleware\n- Role-based access control\n- Logout + token revocation\n- Rate limiting on auth endpoints`,
    });

    this.registerSkill({
      name: "write_tests_unit",
      description: "Write unit tests for given code.",
      prompt: (task) => `Write comprehensive unit tests for: ${task}\n\nUse Jest/Vitest. Cover:\n- Happy path\n- All edge cases\n- Error paths\n- Boundary values\n- Mock all external dependencies\n- Aim for 90%+ branch coverage`,
    });

    this.registerSkill({
      name: "refactor",
      description: "Refactor existing code for clarity, maintainability, and SOLID principles.",
      prompt: (task) => `Refactor this code: ${task}\n\nApply:\n- SOLID principles\n- DRY — eliminate repetition\n- Single responsibility per function\n- Meaningful naming\n- Reduce complexity (max cyclomatic complexity 10)\n- Remove dead code\n- Show before/after diff explanation`,
    });

    this.registerSkill({
      name: "write_websocket",
      description: "Implement WebSocket server/client with reconnection and event handling.",
      prompt: (task) => `Implement WebSocket solution for: ${task}\n\nInclude:\n- Server setup\n- Connection lifecycle (connect, disconnect, error)\n- Event-based messaging\n- Client reconnection logic\n- Heartbeat/ping-pong\n- Message queue for offline clients`,
    });

    this.registerSkill({
      name: "write_cli_tool",
      description: "Build a CLI tool with argument parsing, help, and colored output.",
      prompt: (task) => `Build a CLI tool: ${task}\n\nInclude:\n- Argument parsing (commander or yargs)\n- Help text and usage examples\n- Colored output (chalk)\n- Progress indicators\n- Error messages with exit codes\n- Config file support`,
    });

    this.registerSkill({
      name: "write_worker",
      description: "Implement a background worker, job queue, or async processor.",
      prompt: (task) => `Implement background worker: ${task}\n\nInclude:\n- Job queue setup (Bull/BullMQ or similar)\n- Worker consumer\n- Retry logic with exponential backoff\n- Dead letter queue\n- Progress tracking\n- Graceful shutdown`,
    });

    this.registerSkill({
      name: "write_sdk",
      description: "Generate a typed SDK/client library for an API.",
      prompt: (task) => `Generate a typed SDK for: ${task}\n\nInclude:\n- TypeScript types/interfaces\n- HTTP client wrapper\n- All API methods\n- Automatic auth header injection\n- Retry on 429/503\n- Proper error classes\n- Usage examples in README format`,
    });
  }
}
