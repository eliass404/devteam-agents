import chalk from "chalk";

const LEVEL = { error:0, warn:1, info:2, debug:3 };
const CUR = LEVEL[process.env.LOG_LEVEL || "info"] ?? 2;

export const COLORS = {
  manager:"#FF6B35", orchestrator:"#9b59b6",
  architect:"#3498db", coder:"#00bcd4", reviewer:"#f39c12",
  tester:"#27ae60", debugger:"#e74c3c", ui_designer:"#FF69B4",
  ux_agent:"#FF8C00", optimizer:"#00CED1", db_agent:"#9370DB",
  context_manager:"#95a5a6", security_agent:"#FF4444",
  api_tester:"#20B2AA", memory_agent:"#FFD700", devops_agent:"#48CAE4",
};

const c = (name) => chalk.hex(COLORS[name] || "#ffffff");

export const log = {
  error: (...a) => CUR>=0 && console.error(chalk.red("[ERR]"), ...a),
  warn:  (...a) => CUR>=1 && console.warn(chalk.yellow("[WARN]"), ...a),
  info:  (...a) => CUR>=2 && console.log(chalk.gray("[INFO]"), ...a),
  debug: (...a) => CUR>=3 && console.log(chalk.dim("[DEBUG]"), ...a),
  agent: (name, skill, msg) => {
    const hdr = c(name)(`[${name.toUpperCase()}]`) + (skill ? chalk.dim(` ›${skill}`) : "");
    console.log(`\n${hdr}`);
    console.log(msg);
    console.log(chalk.dim("─".repeat(64)));
  },
  manager: (msg) => console.log(chalk.hex("#FF6B35").bold(`\n[MANAGER] ${msg}`)),
};
