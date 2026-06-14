#!/usr/bin/env node
/**
 * Scan Backroom for open TODO checkboxes.
 * Usage: node scripts/collect-todos.mjs [--format md|json] [--project NAME] [--include-done]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, "../../../..");
const BACKROOM = path.join(VAULT_ROOT, "Backroom");

const SKIP_DIRS = new Set([".git", ".obsidian", "assets"]);

function parseArgs(argv) {
  const opts = { format: "md", project: null, includeDone: false };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--format" && argv[i + 1]) opts.format = argv[++i];
    else if (arg === "--project" && argv[i + 1]) opts.project = argv[++i];
    else if (arg === "--include-done") opts.includeDone = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(`Usage: node collect-todos.mjs [--format md|json] [--project NAME] [--include-done]`);
      process.exit(0);
    }
  }
  return opts;
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else if (ent.name.endsWith(".md")) files.push(full);
  }
  return files;
}

function projectKey(relPath) {
  const parts = relPath.replace(/\\/g, "/").split("/");
  return parts[1] || "Backroom";
}

function notePath(relPath) {
  const parts = relPath.replace(/\\/g, "/").split("/");
  parts.shift(); // Backroom
  const fileName = parts.pop().replace(/\.md$/, "");
  if (fileName === "_index") {
    return parts.length ? `${parts.join("/")}/_index` : "_index";
  }
  return parts.length ? `${parts.join("/")}/${fileName}` : fileName;
}

function scanFile(absPath, opts) {
  const rel = path.relative(VAULT_ROOT, absPath).replace(/\\/g, "/");
  const project = projectKey(rel);
  if (opts.project && project.toLowerCase() !== opts.project.toLowerCase()) {
    return [];
  }

  const lines = fs.readFileSync(absPath, "utf8").split(/\r?\n/);
  const items = [];
  let currentSection = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) currentSection = heading[2].trim();

    const open = line.match(/^(\s*)- \[ \] (.+)$/);
    if (open) {
      items.push({
        project,
        file: rel,
        note: notePath(rel),
        line: i + 1,
        section: currentSection || null,
        text: open[2].trim(),
        done: false,
      });
      continue;
    }

    if (opts.includeDone) {
      const done = line.match(/^(\s*)- \[x\] (.+)$/i);
      if (done) {
        items.push({
          project,
          file: rel,
          note: notePath(rel),
          line: i + 1,
          section: currentSection || null,
          text: done[2].trim(),
          done: true,
        });
      }
    }
  }

  return items;
}

function groupByProject(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.project)) groups.set(item.project, []);
    groups.get(item.project).push(item);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "ja"));
}

function formatMarkdown(items) {
  if (items.length === 0) return "_未完了 TODO は見つかりませんでした。_\n";

  const lines = [`# Wiki TODO 一覧 (${items.length} 件)\n`];
  for (const [project, group] of groupByProject(items)) {
    lines.push(`## ${project} (${group.length})\n`);
    for (const item of group) {
      const section = item.section ? ` — ${item.section}` : "";
      const status = item.done ? "x" : " ";
      lines.push(`- [${status}] ${item.text}${section}`);
      lines.push(`  - \`${item.note}\` L${item.line}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const opts = parseArgs(process.argv);
  if (!fs.existsSync(BACKROOM)) {
    console.error(`Backroom not found: ${BACKROOM}`);
    process.exit(1);
  }

  const files = walk(BACKROOM);
  const items = files.flatMap((f) => scanFile(f, opts));

  if (opts.format === "json") {
    console.log(JSON.stringify({ count: items.length, items }, null, 2));
  } else {
    process.stdout.write(formatMarkdown(items));
  }
}

main();
