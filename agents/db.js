import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Database Agent — an expert in relational and NoSQL databases, query optimization, and caching.
You design schemas for correctness first, performance second. You know PostgreSQL, MySQL, MongoDB, Redis, and Elasticsearch deeply.
You always include indexes, constraints, and migration scripts.`;

export class DbAgent extends BaseAgent {
  constructor() {
    super("db_agent", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "schema_design",
      description: "Design a normalized database schema with tables, indexes, and constraints.",
      prompt: (task) => `Design database schema for:\n${task}\n\nProvide:\n- SQL CREATE TABLE statements\n- All columns with types and constraints\n- Primary and foreign keys\n- Unique constraints\n- CHECK constraints\n- Indexes (explain why each exists)\n- Enum types if applicable\n- Entity relationship description`,
    });

    this.registerSkill({
      name: "write_migration",
      description: "Write forward and rollback database migrations.",
      prompt: (task) => `Write migration for:\n${task}\n\nProvide:\n- Up migration (forward)\n- Down migration (rollback)\n- Data migration if schema changes affect existing data\n- Zero-downtime migration approach\n- Backward compatibility notes\n- Estimated migration duration for 1M rows`,
    });

    this.registerSkill({
      name: "query_optimization",
      description: "Optimize slow queries with indexes and query rewrites.",
      prompt: (task) => `Optimize this query:\n${task}\n\nAnalyze:\n- Query execution plan (EXPLAIN)\n- Missing indexes\n- Full sequential scans\n- JOIN optimization\n- Subquery vs CTE vs JOIN\n\nProvide:\n- Optimized query\n- Index definitions (CREATE INDEX)\n- Estimated performance improvement\n- When to use partial indexes`,
    });

    this.registerSkill({
      name: "redis_design",
      description: "Design Redis data structures and caching patterns.",
      prompt: (task) => `Design Redis solution for:\n${task}\n\nDefine:\n- Data structure per use case (String, Hash, List, Set, ZSet, Stream)\n- Key naming convention\n- TTL per key type\n- Eviction policy recommendation\n- Memory estimation\n- Cache invalidation strategy\n- Pub/Sub vs Streams for events\n\nProvide: implementation code.`,
    });

    this.registerSkill({
      name: "orm_models",
      description: "Generate ORM models and repository pattern for a schema.",
      prompt: (task) => `Generate ORM models for:\n${task}\n\nUsing Prisma or TypeORM or Sequelize (match the tech stack):\n- Model definitions\n- Associations/relations\n- Hooks (beforeCreate, afterUpdate)\n- Repository class with typed methods\n- Query builder examples\n- Transaction handling`,
    });

    this.registerSkill({
      name: "mongodb_design",
      description: "Design MongoDB collections with embedding vs referencing decisions.",
      prompt: (task) => `Design MongoDB schema for:\n${task}\n\nDecide for each entity:\n- Embed vs reference (with justification)\n- Document structure\n- Index strategy\n- Aggregation pipeline for common queries\n- Collection naming\n- Compound indexes\n- TTL indexes for time-based data\n\nAvoid common anti-patterns.`,
    });

    this.registerSkill({
      name: "db_seed",
      description: "Write database seed scripts with realistic test data.",
      prompt: (task) => `Write seed script for:\n${task}\n\nGenerate:\n- Realistic fake data (using faker.js)\n- Proper relation ordering (no FK violations)\n- Dev seed (small, fast)\n- Test seed (deterministic, predictable IDs)\n- Load test seed (100K+ rows)\n- Idempotent (safe to run multiple times)`,
    });

    this.registerSkill({
      name: "backup_recovery",
      description: "Design backup, recovery, and disaster recovery strategy.",
      prompt: (task) => `Design backup/recovery for:\n${task}\n\nDefine:\n- Backup frequency (full, incremental, WAL)\n- Retention policy\n- RPO (Recovery Point Objective) target\n- RTO (Recovery Time Objective) target\n- Backup storage and encryption\n- Point-in-time recovery procedure\n- Failover strategy\n- Regular restore testing plan\n\nProvide: backup scripts and runbook.`,
    });
  }
}
