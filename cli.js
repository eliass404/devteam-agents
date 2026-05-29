#!/usr/bin/env node
import "dotenv/config";
import { Manager } from "./manager/manager.js";
import { log } from "./core/logger.js";
import ora from "ora";
import chalk from "chalk";

const args = process.argv.slice(2);

function parse(args) {
  const o = { agent: null, skill: null, session: null, list: false, help: false };
  const pos = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--agent"   && args[i+1]) { o.agent   = args[++i]; }
    else if (args[i] === "--skill"   && args[i+1]) { o.skill   = args[++i]; }
    else if (args[i] === "--session" && args[i+1]) { o.session = args[++i]; }
    else if (args[i] === "--list") { o.list = true; }
    else if (args[i] === "--help" || args[i] === "-h") { o.help = true; }
    else { pos.push(args[i]); }
  }
  o.task = pos.join(" ");
  return o;
}

function help() {
  console.log(`
${chalk.bold("DevTeam AI v2")} — Manager + 14 Agents + 107 Skills

${chalk.yellow("Usage:")}
  node cli.js <goal>                        Full pipeline (Manager routes everything)
  node cli.js --agent coder --skill write_rest_api "Todo API"
  node cli.js --list                        Show all agents and their skills
  node cli.js --session <id> <goal>         Resume a session

${chalk.yellow("Examples:")}
  node cli.js "Build a SaaS billing system with Stripe"
  node cli.js --agent security --skill owasp_audit "Review this Express app"
  node cli.js --agent db_agent --skill schema_design "Multi-tenant SaaS"
  node cli.js --agent devops --skill ci_cd_pipeline "Node.js microservice"
`);
}

async function listAll() {
  const mgr = new Manager();
  const caps = mgr.listCapabilities();
  let total = 0;
  for (const [agent, skills] of Object.entries(caps)) {
    console.log(chalk.bold.cyan(`\n${agent} (${skills.length} skills)`));
    for (const s of skills) {
      console.log(chalk.gray(`  • ${chalk.white(s.name.padEnd(28))} ${s.description.slice(0,60)}...`));
      total++;
    }
  }
  console.log(chalk.bold(`\nTotal: ${total} skills across ${Object.keys(caps).length} agents\n`));
}

async function main() {
  const opts = parse(args);

  if (opts.help || (!opts.task && !opts.list)) { help(); return; }
  if (opts.list) { await listAll(); return; }

  const spinner = ora({ text: "Manager is planning...", color: "magenta" }).start();

  const mgr = new Manager({
    sessionId: opts.session,
    onUpdate: ({ agent, skill, message, isFinal }) => {
      if (!isFinal) {
        spinner.text = chalk.dim(`[${agent}${skill ? `:${skill}` : ""}] ${message.slice(0,70)}...`);
      } else {
        spinner.succeed(chalk.cyan(`[${agent}${skill ? `:${skill}` : ""}] complete`));
        log.agent(agent, skill, message);
        spinner.start("Next...");
      }
    },
  });

  try {
    const result = opts.agent
      ? await mgr.runDirect(opts.agent, opts.skill, opts.task)
      : await mgr.run(opts.task);

    spinner.stop();
    console.log(chalk.bold.green(`\n✅ Done — Session: ${result.sessionId}\n`));
  } catch (e) {
    spinner.fail(e.message);
    process.exit(1);
  }
}

main();
