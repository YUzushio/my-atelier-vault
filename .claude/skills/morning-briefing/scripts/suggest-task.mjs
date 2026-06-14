#!/usr/bin/env node
/**
 * Rank Wiki tasks and pick a morning suggestion.
 * Usage: node scripts/suggest-task.mjs [--format md|json]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  resolveVaultRoot,
  loadProjectPriorities,
  buildReason,
  projectRank,
} from "../../_lib/project-priority.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = resolveVaultRoot(__dirname);
const BACKROOM = path.join(VAULT_ROOT, "Backroom");
const PROJECT_PRIORITY = loadProjectPriorities(VAULT_ROOT);

const PRIORITY_SCORE = { high: 3, medium: 2, low: 1, unset: 0 };
const STATE_JA = {
  "not-started": "未着手",
  "in-progress": "実施中",
  "blocked-by-dependency": "依存ブロック",
  "waiting-external": "他者待ち",
  stalled: "継続困難",
  done: "完了",
  rejected: "却下",
};

const SKIP_SUGGEST = new Set(["done", "rejected", "stalled", "waiting-external"]);

function parseFrontmatter(content) {
  const stripped = content.replace(/^\uFEFF/, "");
  const m = stripped.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const raw of m[1].split("\n")) {
    const line = raw.replace(/\r$/, "").trimEnd();
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function titleFromContent(content) {
  const h1 = content.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : "（無題）";
}

function notePath(relPath) {
  const parts = relPath.replace(/\\/g, "/").split("/");
  parts.shift();
  const fileName = parts.pop().replace(/\.md$/, "");
  if (fileName === "_index") return parts.length ? `${parts.join("/")}/_index` : "_index";
  return parts.length ? `${parts.join("/")}/${fileName}` : fileName;
}

function walkTasks(dir, files = []) {
  const tasksDir = path.join(dir, "tasks");
  if (!fs.existsSync(tasksDir)) return files;
  for (const ent of fs.readdirSync(tasksDir, { withFileTypes: true })) {
    if (ent.isFile() && ent.name.endsWith(".md")) {
      files.push(path.join(tasksDir, ent.name));
    }
  }
  return files;
}

function loadTasks() {
  const tasks = [];
  if (!fs.existsSync(BACKROOM)) return tasks;
  for (const ent of fs.readdirSync(BACKROOM, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name.startsWith(".")) continue;
    for (const file of walkTasks(path.join(BACKROOM, ent.name))) {
      const content = fs.readFileSync(file, "utf8");
      const meta = parseFrontmatter(content);
      const rel = path.relative(VAULT_ROOT, file).replace(/\\/g, "/");
      const project = ent.name;
      tasks.push({
        project,
        projectPriority: PROJECT_PRIORITY[project] ?? 9,
        note: notePath(rel),
        title: titleFromContent(content),
        priority: meta.priority || "unset",
        difficulty: meta.difficulty || "unset",
        state: meta.state || "not-started",
        dependsOn: meta.depends_on || "",
      });
    }
  }
  return tasks;
}

function scoreTask(t) {
  if (SKIP_SUGGEST.has(t.state)) return -1;
  if (t.state === "blocked-by-dependency") return -1;
  let s = (4 - t.projectPriority) * 100;
  s += (PRIORITY_SCORE[t.priority] || 0) * 20;
  if (t.state === "in-progress") s += 50;
  if (t.difficulty === "low") s += 5;
  if (t.difficulty === "medium") s += 2;
  return s;
}

function findUnblocker(blocked, all) {
  for (const b of blocked) {
    const dep = b.dependsOn.match(/\[\[tasks\/([^\]|]+)/);
    if (!dep) continue;
    const slug = dep[1];
    const upstream = all.find((t) => t.note.endsWith(`/${slug}`) || t.note.endsWith(slug));
    if (upstream && !SKIP_SUGGEST.has(upstream.state) && upstream.state !== "blocked-by-dependency") {
      return { task: upstream, unblocks: b };
    }
  }
  return null;
}

function pickSuggestion(tasks) {
  const active = tasks.filter((t) => scoreTask(t) >= 0);
  active.sort((a, b) => scoreTask(b) - scoreTask(a));
  if (active.length) {
    const t = active[0];
    return {
      task: t,
      reason: buildReasonLocal(t),
    };
  }
  const blocked = tasks.filter((t) => t.state === "blocked-by-dependency");
  const unblock = findUnblocker(blocked, tasks);
  if (unblock) {
    return {
      task: unblock.task,
      reason: `「${unblock.unblocks.title}」が依存ブロック中。上流の ${unblock.task.title} を進めると解消に近づきます。`,
      unblocks: unblock.unblocks.title,
    };
  }
  return null;
}

function buildReasonLocal(t) {
  return buildReason(t, PROJECT_PRIORITY);
}

function formatMd(tasks, suggestion) {
  const lines = ["## タスク状況\n"];
  const byProject = new Map();
  for (const t of tasks) {
    if (!byProject.has(t.project)) byProject.set(t.project, []);
    byProject.get(t.project).push(t);
  }
  for (const [project, list] of [...byProject.entries()].sort(
    (a, b) => (PROJECT_PRIORITY[a[0]] ?? 9) - (PROJECT_PRIORITY[b[0]] ?? 9)
  )) {
    lines.push(`### ${project} (P${PROJECT_PRIORITY[project] ?? "?"})`);
    for (const t of list) {
      lines.push(
        `- **${t.title}** — ${STATE_JA[t.state] || t.state} · 優先=${t.priority} · 難易=${t.difficulty} · \`${t.note}\``
      );
    }
    lines.push("");
  }
  if (suggestion) {
    const t = suggestion.task;
    lines.push("## 着手提案\n");
    lines.push(`**${t.title}**（\`${t.note}\`）`);
    lines.push(`- 理由: ${suggestion.reason}`);
    if (suggestion.unblocks) lines.push(`- 解除: ${suggestion.unblocks}`);
    lines.push(`\n> **これに着手しませんか？**`);
  }
  return lines.join("\n");
}

const tasks = loadTasks();
const suggestion = pickSuggestion(tasks);
const format = process.argv.includes("--format") ? process.argv[process.argv.indexOf("--format") + 1] : "md";

if (format === "json") {
  console.log(JSON.stringify({ tasks, suggestion }, null, 2));
} else {
  process.stdout.write(formatMd(tasks, suggestion));
}
