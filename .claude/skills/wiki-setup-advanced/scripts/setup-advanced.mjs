#!/usr/bin/env node
/**
 * Optional MCP integrations setup for my-atelier-vault.
 * Run AFTER setup.mjs. Default: skip all integrations.
 *
 * Usage:
 *   node scripts/setup-advanced.mjs
 *   node scripts/setup-advanced.mjs --non-interactive
 *   node scripts/setup-advanced.mjs --enable calendar,gitlab
 */
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, "../../../..");
const CONFIG_PATH = path.join(VAULT_ROOT, "vault.config.json");
const EXAMPLE_CONFIG = path.join(VAULT_ROOT, "vault.config.example.json");

const DEFAULT_INTEGRATIONS = {
  googleCalendar: {
    enabled: false,
    calendarName: "",
    credentialsDir: "",
    wikiNote: "Backroom/sample-company/calendar.md",
  },
  gitlab: {
    enabled: false,
    host: "https://gitlab.com",
    groupPath: "",
  },
  github: {
    enabled: false,
    defaultRepo: "",
  },
};

function parseArgs(argv) {
  const opts = { nonInteractive: false, enable: null };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--non-interactive") opts.nonInteractive = true;
    else if (arg === "--enable" && argv[i + 1]) {
      opts.enable = argv[++i].split(",").map((s) => s.trim().toLowerCase());
    }
  }
  return opts;
}

function ask(rl, question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  return new Promise((resolve) => {
    rl.question(`${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askYesNo(rl, question, defaultYes = false) {
  const hint = defaultYes ? " [Y/n]" : " [y/N]";
  return new Promise((resolve) => {
    rl.question(`${question}${hint}: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (!a) return resolve(defaultYes);
      resolve(a === "y" || a === "yes");
    });
  });
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`vault.config.json not found. Run @wiki-setup first: ${CONFIG_PATH}`);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function defaultCredentialsDir(homeRoot) {
  return `${homeRoot.replace(/\/$/, "")}/.google-suite-mcp`.replace(/\\/g, "/");
}

async function promptIntegrations(config, opts) {
  const home = config.homeRoot || "C:/Users/you";
  const integrations = JSON.parse(JSON.stringify(DEFAULT_INTEGRATIONS));

  if (opts.nonInteractive && !opts.enable) {
    return integrations;
  }

  if (opts.enable) {
    if (opts.enable.includes("calendar") || opts.enable.includes("googlecalendar")) {
      integrations.googleCalendar.enabled = true;
      integrations.googleCalendar.calendarName = "My Routine";
      integrations.googleCalendar.credentialsDir = defaultCredentialsDir(home);
    }
    if (opts.enable.includes("gitlab")) {
      integrations.gitlab.enabled = true;
    }
    if (opts.enable.includes("github")) {
      integrations.github.enabled = true;
      integrations.github.defaultRepo = "";
    }
    return integrations;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const wantAny = await askYesNo(
    rl,
    "MCP 連携（Google Calendar / GitLab / GitHub）をセットアップしますか？",
    false
  );

  if (!wantAny) {
    rl.close();
    return integrations;
  }

  if (await askYesNo(rl, "Google Calendar MCP を有効にしますか？", false)) {
    integrations.googleCalendar.enabled = true;
    integrations.googleCalendar.calendarName = await ask(rl, "カレンダー名", "My Routine");
    integrations.googleCalendar.credentialsDir = await ask(
      rl,
      "credentials ディレクトリ",
      defaultCredentialsDir(home)
    );
  }

  if (await askYesNo(rl, "GitLab MCP を有効にしますか？", false)) {
    integrations.gitlab.enabled = true;
    integrations.gitlab.host = await ask(rl, "GitLab URL", "https://gitlab.com");
    integrations.gitlab.groupPath = await ask(rl, "グループ / プロジェクトパス", "your-org/your-group");
  }

  if (await askYesNo(rl, "GitHub（gh / GitHub MCP）を有効にしますか？", false)) {
    integrations.github.enabled = true;
    integrations.github.defaultRepo = await ask(rl, "デフォルト repo（owner/name）", "");
  }

  rl.close();
  return integrations;
}

function patchCalendarNote(integrations) {
  const cal = integrations.googleCalendar;
  if (!cal.enabled) return false;

  const notePath = path.join(VAULT_ROOT, cal.wikiNote.replace(/\//g, path.sep));
  if (!fs.existsSync(notePath)) return false;

  let content = fs.readFileSync(notePath, "utf8");
  content = content
    .split("{{CALENDAR_NAME}}")
    .join(cal.calendarName || "My Routine")
    .split("{{CREDENTIALS_DIR}}")
    .join(cal.credentialsDir || "");

  fs.writeFileSync(notePath, content, "utf8");
  return true;
}

function patchMorningBriefingSources(integrations) {
  const srcPath = path.join(VAULT_ROOT, "Reference/morning-briefing-sources.md");
  if (!fs.existsSync(srcPath)) return;

  let content = fs.readFileSync(srcPath, "utf8");
  const cal = integrations.googleCalendar;
  const gl = integrations.gitlab;

  if (cal.enabled) {
    content = content.replace(
      /- カレンダー名: `（未設定[^`]*）`/,
      `- カレンダー名: \`${cal.calendarName}\``
    );
    content = content.replace(
      /- プロジェクト別 calendar ノート: `.+`/,
      `- プロジェクト別 calendar ノート: [[Backroom/sample-company/calendar]]`
    );
  }

  if (gl.enabled) {
    content = content.replace(
      /- グループ \/ リポ: `（未設定）`/,
      `- グループ / リポ: \`${gl.groupPath}\`（${gl.host}）`
    );
  }

  fs.writeFileSync(srcPath, content, "utf8");
}

function patchMcpIntegrationsDoc(integrations) {
  const docPath = path.join(VAULT_ROOT, "Reference/mcp-integrations.md");
  if (!fs.existsSync(docPath)) return;

  const lines = ["（未設定 — 基本セットアップのみ。必要なら `@wiki-setup-advanced`）"];
  const enabled = [];

  if (integrations.googleCalendar.enabled) {
    enabled.push(
      `- **Google Calendar** — カレンダー \`${integrations.googleCalendar.calendarName}\` · ノート [[Backroom/sample-company/calendar]]`
    );
  }
  if (integrations.gitlab.enabled) {
    enabled.push(
      `- **GitLab** — \`${integrations.gitlab.groupPath}\` @ ${integrations.gitlab.host}`
    );
  }
  if (integrations.github.enabled) {
    const repo = integrations.github.defaultRepo || "（default repo 未指定）";
    enabled.push(`- **GitHub** — \`${repo}\``);
  }

  const block =
    enabled.length > 0
      ? enabled.join("\n")
      : lines[0];

  let content = fs.readFileSync(docPath, "utf8");
  content = content.replace(
    /<!-- wiki-setup-advanced が enabled な項目を追記 -->[\s\S]*?(?=## Cursor MCP)/,
    `<!-- wiki-setup-advanced が enabled な項目を追記 -->\n\n${block}\n\n`
  );

  fs.writeFileSync(docPath, content, "utf8");
}

async function main() {
  const opts = parseArgs(process.argv);
  const config = loadConfig();
  const example = fs.existsSync(EXAMPLE_CONFIG)
    ? JSON.parse(fs.readFileSync(EXAMPLE_CONFIG, "utf8"))
    : {};

  const integrations = await promptIntegrations(config, opts);
  config.integrations = integrations;

  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`Updated ${CONFIG_PATH} → integrations`);

  const anyEnabled =
    integrations.googleCalendar.enabled ||
    integrations.gitlab.enabled ||
    integrations.github.enabled;

  if (!anyEnabled) {
    console.log("MCP 連携はスキップしました（デフォルト）。必要になったら再度実行してください。");
    console.log("  node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs");
    console.log("  または Cursor: @wiki-setup-advanced");
    return;
  }

  if (integrations.googleCalendar.enabled) {
    patchCalendarNote(integrations);
    console.log("Updated calendar wiki note");
  }

  patchMorningBriefingSources(integrations);
  patchMcpIntegrationsDoc(integrations);
  console.log("Updated Reference/mcp-integrations.md and morning-briefing-sources.md");

  console.log("\nNext steps (manual):");
  console.log("1. ~/.cursor/mcp.json — see .cursor/skills/wiki-setup-advanced/reference.md");
  console.log("2. Cursor restart → Settings → Tools & MCP");
  if (integrations.googleCalendar.enabled) {
    console.log("3. Place OAuth credentials.json in:", integrations.googleCalendar.credentialsDir);
    console.log("4. npx @cocal/google-calendar-mcp auth");
  }
  if (integrations.gitlab.enabled) {
    console.log("5. GitLab MCP — add PAT in Cursor MCP settings (not in Wiki)");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
