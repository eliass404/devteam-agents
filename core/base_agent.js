import Anthropic from "@anthropic-ai/sdk";
import { log } from "./logger.js";

export class BaseAgent {
  constructor(name, systemPrompt) {
    this.name = name;
    this.systemPrompt = systemPrompt;
    this.skills = {}; // populated by subclasses
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.model = process.env.MODEL || "claude-sonnet-4-20250514";
    this.maxTokens = parseInt(process.env.MAX_TOKENS || "8192");
  }

  // Register a skill: { name, description, prompt(task, ctx) -> string }
  registerSkill(skill) {
    this.skills[skill.name] = skill;
  }

  // Run a named skill
  async useSkill(skillName, task, context = {}) {
    const skill = this.skills[skillName];
    if (!skill) throw new Error(`Agent ${this.name} has no skill: ${skillName}`);

    const prompt = typeof skill.prompt === "function"
      ? skill.prompt(task, context)
      : skill.prompt;

    log.agent(this.name, skillName, `Running...`);

    const messages = this._buildMessages(prompt, context);
    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: this.systemPrompt + `\n\n# Active Skill: ${skill.name}\n${skill.description}`,
      messages,
    });

    const output = res.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    return { agent: this.name, skill: skillName, output, usage: res.usage };
  }

  // Run agent without a specific skill (direct task)
  async run(task, context = {}) {
    const messages = this._buildMessages(task, context);
    const res = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokens,
      system: this.systemPrompt,
      messages,
    });
    const output = res.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    return { agent: this.name, skill: null, output, usage: res.usage };
  }

  listSkills() {
    return Object.values(this.skills).map(s => ({ name: s.name, description: s.description }));
  }

  _buildMessages(task, context = {}) {
    const msgs = [];
    if (context.memory) {
      msgs.push({ role:"user", content:`[MEMORY]\n${context.memory}\n[/MEMORY]` });
      msgs.push({ role:"assistant", content:"Memory loaded." });
    }
    if (context.priorOutput) {
      msgs.push({ role:"user", content:`[PRIOR AGENT OUTPUT]\n${context.priorOutput}\n[/PRIOR]` });
      msgs.push({ role:"assistant", content:"Prior context received." });
    }
    if (context.history?.length) msgs.push(...context.history.slice(-10));
    msgs.push({ role:"user", content: task });
    return msgs;
  }
}
