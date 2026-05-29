import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Debugger — a specialist in diagnosing and fixing bugs, crashes, and incidents.
You reason from evidence, identify root causes (not symptoms), and always explain the "why".
You never guess. You trace execution paths, check assumptions, and verify fixes.`;

export class DebuggerAgent extends BaseAgent {
  constructor() {
    super("debugger", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "root_cause_analysis",
      description: "Perform systematic root cause analysis on a bug or failure.",
      prompt: (task) => `Root cause analysis:\n${task}\n\nUse the 5-Why method:\n1. Why did this fail?\n2. Why did that happen?\n3. Why did that occur?\n4. Why was that allowed?\n5. Why wasn't this caught?\n\nOutput:\n## Root Cause\n## Contributing Factors\n## Fix (with code)\n## Prevention\n## Monitoring to add`,
    });

    this.registerSkill({
      name: "fix_bug",
      description: "Diagnose and fix a specific bug with explanation.",
      prompt: (task) => `Fix this bug:\n${task}\n\nProvide:\n## Bug Analysis\n## Why It Happens\n## The Fix (complete corrected code)\n## Why the Fix Works\n## How to Verify the Fix\n## Related Code to Check`,
    });

    this.registerSkill({
      name: "crash_analysis",
      description: "Analyze a crash report, stack trace, or core dump.",
      prompt: (task) => `Analyze this crash:\n${task}\n\nIdentify:\n- Crash type and immediate cause\n- Stack trace walk-through\n- Memory/state at crash time\n- Code path that led here\n- Whether this is a regression\n- Severity: CRITICAL (data loss/security) | HIGH | MEDIUM | LOW\n\nProvide immediate fix + long-term hardening.`,
    });

    this.registerSkill({
      name: "memory_leak_hunt",
      description: "Find and fix memory leaks.",
      prompt: (task) => `Hunt memory leaks in:\n${task}\n\nLook for:\n- Event listeners not removed\n- Closures holding references\n- Circular references\n- Growing arrays/maps not cleared\n- Forgotten timers/intervals\n- React component cleanup missing\n- Node.js global leaks\n\nFor each: code location + fix.`,
    });

    this.registerSkill({
      name: "race_condition_hunt",
      description: "Find and fix race conditions and concurrency bugs.",
      prompt: (task) => `Find race conditions in:\n${task}\n\nCheck:\n- Shared state accessed by concurrent operations\n- Missing locks or mutexes\n- Double-fetch TOCTOU bugs\n- Async/await misuse\n- Promise.all without proper error handling\n- DB transactions not atomic\n- Cache stampede scenarios\n\nFor each: scenario + fix.`,
    });

    this.registerSkill({
      name: "performance_debug",
      description: "Debug performance degradation and slow response times.",
      prompt: (task) => `Debug performance issue:\n${task}\n\nInvestigate:\n- Identify the slowest operation\n- Check for N+1 queries\n- Measure DB query times\n- Profile function call durations\n- Check memory usage trend\n- Network waterfall analysis\n- Cache hit rate\n\nProvide: profiling approach + likely culprits + fix.`,
    });

    this.registerSkill({
      name: "incident_postmortem",
      description: "Write an incident postmortem document.",
      prompt: (task) => `Write postmortem for incident:\n${task}\n\n## Incident Summary\n## Timeline (with UTC timestamps)\n## Root Cause\n## Impact (users affected, duration, data)\n## Detection (how was it caught?)\n## Response Actions\n## What Went Well\n## What Went Wrong\n## Action Items (owner, deadline)\n## Prevention Measures`,
    });
  }
}
