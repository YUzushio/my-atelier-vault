#!/usr/bin/env node
/**
 * First-time setup for my-atelier-vault fork.
 *
 * Usage:
 *   node scripts/setup.mjs
 *   node scripts/setup.mjs --non-interactive --author "Name" --home "C:/Users/you" --remote "https://github.com/you/my-atelier-vault.git"
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, "../../../..");
const EXAMPLE_CONFIG = path.join(VAULT_ROOT, "vault.config.example.json");
const CONFIG_PATH = path.join(VAULT_ROOT, "vault.config.json");

function parseArgs(argv) {
  const opts = { nonInteractive: false, force: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--non-interactive") opts.nonInteractive = true;
    else if (arg === "--force") opts.force = true;
    else if (arg === "--author" && argv[i + 1]) opts.author = argv[++i];
    else if (arg === "--home" && argv[i + 1]) opts.homeRoot = argv[++i];
    else if (arg === "--remote" && argv[i + 1]) opts.gitRemote = argv[++i];
    else if (arg === "--gallery-repo" && argv[i + 1]) opts.galleryRepo = argv[++i];
    else if (arg === "--gallery-url" && argv[i + 1]) opts.gallerySiteUrl = argv[++i];
    else if (arg === "--vault-name" && argv[i + 1]) opts.vaultName = argv[++i];
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

async function promptConfig(opts) {
  const example = JSON.parse(fs.readFileSync(EXAMPLE_CONFIG, "utf8"));
  if (opts.nonInteractive && opts.author && opts.homeRoot) {
    return {
      config: {
        vaultName: opts.vaultName || example.vaultName,
        author: opts.author,
        homeRoot: opts.homeRoot.replace(/\\/g, "/"),
        gitRemote: opts.gitRemote || example.gitRemote,
        galleryRepo: opts.galleryRepo || example.galleryRepo,
        gallerySiteUrl: opts.gallerySiteUrl || example.gallerySiteUrl,
        projectPriorities: example.projectPriorities,
        integrations: example.integrations,
      },
      wantAdvanced: false,
    };
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const defaultHome = (process.env.HOME || process.env.USERPROFILE || "C:/Users/you").replace(/\\/g, "/");

  const config = {
    vaultName: await ask(rl, "Vault 表示名", opts.vaultName || example.vaultName),
    author: await ask(rl, "作者名", opts.author || example.author),
    homeRoot: (await ask(rl, "ホームディレクトリ", opts.homeRoot || defaultHome)).replace(/\\/g, "/"),
    gitRemote: await ask(rl, "Git remote URL", opts.gitRemote || example.gitRemote),
    galleryRepo: await ask(rl, "Gallery リポ URL（任意）", opts.galleryRepo || example.galleryRepo),
    gallerySiteUrl: await ask(rl, "Gallery 公開 URL（任意）", opts.gallerySiteUrl || example.gallerySiteUrl),
    projectPriorities: example.projectPriorities,
    integrations: example.integrations || undefined,
  };
  const wantAdvanced = await askYesNo(
    rl,
    "基本セットアップ後に MCP 連携（Google Calendar / GitLab / GitHub）も設定しますか？",
    false
  );
  rl.close();
  return { config, wantAdvanced };
}

function applyReplacements(content, replacements) {
  let out = content;
  for (const [from, to] of replacements) {
    out = out.split(from).join(to);
  }
  return out;
}

function walkMd(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(full, files);
    else if (ent.name.endsWith(".md")) files.push(full);
  }
  return files;
}

function applyPlaceholders(config) {
  const home = config.homeRoot.replace(/\/$/, "");
  const vaultFolder = path.basename(VAULT_ROOT);
  const replacements = [
    ["{{HOME_ROOT}}", home],
    ["{{AUTHOR}}", config.author],
    ["{{VAULT_NAME}}", config.vaultName],
    ["{{GIT_REMOTE}}", config.gitRemote],
    [`${home}/my-atelier-vault/`, `${home}/${vaultFolder}/`],
  ];

  let fileCount = 0;
  for (const file of walkMd(path.join(VAULT_ROOT, "Backroom"))) {
    const before = fs.readFileSync(file, "utf8");
    const after = applyReplacements(before, replacements);
    if (before !== after) {
      fs.writeFileSync(file, after, "utf8");
      fileCount++;
    }
  }
  return fileCount;
}

async function main() {
  const opts = parseArgs(process.argv);

  if (fs.existsSync(CONFIG_PATH) && !opts.force && !opts.nonInteractive) {
    console.log(`vault.config.json already exists: ${CONFIG_PATH}`);
    console.log("Use --force to overwrite, or delete the file first.");
    process.exit(0);
  }

  const { config, wantAdvanced } = await promptConfig(opts);
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`Wrote ${CONFIG_PATH}`);

  const patched = applyPlaceholders(config);
  console.log(`Updated ${patched} Backroom markdown file(s)`);

  try {
    const collect = path.join(VAULT_ROOT, ".cursor/skills/wiki-todo-query/scripts/collect-todos.mjs");
    const out = execFileSync(process.execPath, [collect, "--format", "json"], { encoding: "utf8" });
    console.log(`Wiki TODO scan OK: ${JSON.parse(out).count} open item(s)`);
  } catch (err) {
    console.warn("TODO scan skipped:", err.message);
  }

  console.log("\nNext steps:");
  console.log("1. Open this folder in Obsidian");
  console.log("2. Community plugins → Obsidian Git → remote:", config.gitRemote);
  console.log("3. @wiki-todo-query — open-dashboard.mjs でダッシュボード");
  console.log("4. Gallery: https://github.com/YUzushio/yuzushio.github.io");

  if (wantAdvanced) {
    console.log("\n--- Advanced MCP setup ---");
    const advanced = path.join(VAULT_ROOT, ".cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs");
    execFileSync(process.execPath, [advanced], { stdio: "inherit", cwd: VAULT_ROOT });
  } else if (!opts.nonInteractive) {
    console.log("\nMCP 連携（Calendar / GitLab / GitHub）はスキップしました。");
    console.log("  後から: @wiki-setup-advanced または");
    console.log("  node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs");
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
