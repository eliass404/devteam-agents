import "dotenv/config";
import { Manager } from "../manager/manager.js";
import { MemoryAgent } from "../agents/memory_agent.js";

let passed = 0, failed = 0;
function ok(cond, label) {
  if (cond) { console.log(`  ✅ ${label}`); passed++; }
  else { console.log(`  ❌ ${label}`); failed++; }
}

async function run() {
  console.log("\n🧪 DevTeam v2 Tests\n");

  console.log("── Capabilities ──");
  const mgr = new Manager();
  const caps = mgr.listCapabilities();
  const agentCount = Object.keys(caps).length;
  ok(agentCount === 14, `14 agents registered (got ${agentCount})`);
  let totalSkills = 0;
  for (const [name, skills] of Object.entries(caps)) {
    ok(skills.length >= 6, `${name} has ${skills.length} skills (>=6)`);
    totalSkills += skills.length;
  }
  ok(totalSkills >= 100, `Total skills >= 100 (got ${totalSkills})`);

  console.log("\n── Memory Agent ──");
  const mem = new MemoryAgent();
  const sid = "test_" + Date.now();
  await mem.store(sid, "Test goal", [
    { step:1, agent:"coder", skill:"write_feature", task:"Write API", output:"Here is the Express REST API..." }
  ]);
  const recalled = await mem.recall("API express", sid);
  ok(recalled !== null, "Memory stored and recalled");
  ok(recalled.includes("coder"), "Recalled memory has agent");

  if (process.env.ANTHROPIC_API_KEY) {
    console.log("\n── Live API Test ──");
    try {
      const r = await mgr.runDirect("coder", "write_feature", "Write a JS function that capitalizes the first letter of each word in a string");
      ok(r.output?.length > 20, "Coder write_feature returned output");
      ok(r.sessionId, "Session ID assigned");
      ok(r.skill === "write_feature", "Skill recorded correctly");
    } catch(e) {
      console.log(`  ⚠️  Live test error: ${e.message}`);
    }
  } else {
    console.log("\n── Live API Test (skipped — no key) ──");
  }

  console.log(`\n${"─".repeat(40)}`);
  console.log(`${passed} passed  ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
