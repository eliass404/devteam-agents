import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Optimizer — a performance engineer obsessed with speed, efficiency, and scalability.
You profile before you optimize. You know that premature optimization is a sin but proven bottlenecks must be fixed.
You are fluent in Big-O, cache strategies, database tuning, and bundle optimization.`;

export class OptimizerAgent extends BaseAgent {
  constructor() {
    super("optimizer", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "algo_optimize",
      description: "Optimize algorithms for time and space complexity.",
      prompt: (task) => `Optimize algorithm:\n${task}\n\nAnalyze:\n- Current Big-O (time + space)\n- Bottleneck identification\n- Optimal algorithm for the use case\n- Data structure improvements\n\nProvide:\n- Optimized implementation\n- Before/after Big-O comparison\n- Benchmarking code\n- When to use each approach`,
    });

    this.registerSkill({
      name: "db_query_optimize",
      description: "Optimize slow database queries and query plans.",
      prompt: (task) => `Optimize DB queries:\n${task}\n\nAnalyze:\n- EXPLAIN/EXPLAIN ANALYZE output\n- Missing indexes\n- N+1 patterns\n- Full table scans\n- Unnecessary JOINs\n- Subquery vs JOIN efficiency\n- Pagination strategy (cursor vs offset)\n\nProvide: optimized queries + index definitions + expected improvement.`,
    });

    this.registerSkill({
      name: "caching_strategy",
      description: "Design and implement a caching strategy.",
      prompt: (task) => `Design caching for:\n${task}\n\nDefine:\n- What to cache (expensive queries, API responses, computed values)\n- Cache layer (Redis, in-memory, CDN, HTTP)\n- TTL strategy per data type\n- Cache invalidation approach\n- Cache warming strategy\n- Cache stampede prevention (lock/promise deduplication)\n- Expected hit rate and latency improvement\n\nProvide: implementation code.`,
    });

    this.registerSkill({
      name: "bundle_optimize",
      description: "Optimize frontend bundle size and loading performance.",
      prompt: (task) => `Optimize bundle:\n${task}\n\nAnalyze:\n- Bundle size breakdown\n- Tree-shaking opportunities\n- Code splitting points (route-based + component-based)\n- Lazy loading strategy\n- Third-party library alternatives (smaller replacements)\n- Image optimization\n- Font loading strategy\n\nTarget: < 200KB initial JS. Provide webpack/vite config changes.`,
    });

    this.registerSkill({
      name: "memory_optimize",
      description: "Reduce memory usage and fix memory inefficiencies.",
      prompt: (task) => `Optimize memory usage:\n${task}\n\nFind:\n- Large object allocations\n- Objects that should be reused (object pooling)\n- Streaming vs loading full data\n- Generator functions for lazy sequences\n- Buffer/array size preallocations\n- Weak references where appropriate\n\nProvide: before/after memory profile + implementation.`,
    });

    this.registerSkill({
      name: "react_optimize",
      description: "Optimize React component rendering performance.",
      prompt: (task) => `Optimize React performance:\n${task}\n\nFix:\n- Unnecessary re-renders (missing memo, useMemo, useCallback)\n- Context causing too many re-renders (split contexts)\n- Large list rendering (virtualization with react-window)\n- Prop drilling vs zustand/jotai\n- Expensive calculations in render\n- useEffect dependency arrays\n- Key prop issues\n\nProvide: profiled component + optimized version.`,
    });

    this.registerSkill({
      name: "api_latency_optimize",
      description: "Reduce API response latency and improve throughput.",
      prompt: (task) => `Optimize API latency:\n${task}\n\nApply:\n- Response compression (gzip/brotli)\n- HTTP/2 multiplexing\n- Connection pooling\n- Parallel DB queries (Promise.all)\n- Partial responses (field selection)\n- Pagination and streaming\n- CDN for static data\n- Database read replicas\n\nProvide: before/after latency estimate + implementation.`,
    });

    this.registerSkill({
      name: "infra_cost_optimize",
      description: "Reduce cloud infrastructure costs without sacrificing performance.",
      prompt: (task) => `Optimize infra costs:\n${task}\n\nAnalyze:\n- Overprovisioned compute (CPU/RAM utilization)\n- Reserved vs on-demand instance mix\n- Auto-scaling policies\n- Data transfer costs\n- Storage tier optimization (S3 Intelligent Tiering)\n- Spot instance opportunities\n- Idle resource identification\n\nEstimate: monthly savings + implementation plan.`,
    });
  }
}
