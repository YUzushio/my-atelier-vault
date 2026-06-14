#!/usr/bin/env node
/**
 * Wiki TODO dashboard — scan Backroom, render HTML, serve on localhost, open browser.
 *
 * Usage:
 *   node open-dashboard.mjs           # build + ensure server + open browser
 *   node open-dashboard.mjs --serve   # run HTTP server (background / detached)
 *   node open-dashboard.mjs --build   # build HTML only
 */
import { execFileSync, spawn } from "child_process";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import {
  resolveVaultRoot,
  loadProjectPriorities,
  loadVaultConfig,
} from "../../_lib/project-priority.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, "..");
const VAULT_ROOT = resolveVaultRoot(__dirname);
const PROJECT_PRIORITY = loadProjectPriorities(VAULT_ROOT);
const VAULT_CONFIG = loadVaultConfig(VAULT_ROOT);
const VAULT_NAME = VAULT_CONFIG.vaultName || "My Atelier Vault";
const DASHBOARD_DIR = path.join(SKILL_ROOT, "dashboard");
const LATEST_HTML = path.join(DASHBOARD_DIR, "latest.html");
const PID_FILE = path.join(DASHBOARD_DIR, "server.pid");
const PORT_FILE = path.join(DASHBOARD_DIR, "port.txt");
const DEFAULT_PORT = 47847;
const HOST = "127.0.0.1";

const STATE_JA = {
  "not-started": "未着手",
  "in-progress": "実施中",
  "blocked-by-dependency": "依存ブロック",
  "waiting-external": "他者待ち",
  stalled: "継続困難",
  done: "完了",
  rejected: "却下",
};

function runJson(scriptRel, extraArgs = []) {
  const script = path.join(SKILL_ROOT, scriptRel);
  const out = execFileSync(process.execPath, [script, ...extraArgs], {
    encoding: "utf8",
    cwd: path.dirname(script),
  });
  return JSON.parse(out);
}


function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPayload() {
  const todos = runJson("scripts/collect-todos.mjs", ["--format", "json"]);
  const briefing = runJson("../morning-briefing/scripts/suggest-task.mjs", ["--format", "json"]);
  return {
    generatedAt: new Date().toISOString(),
    todos,
    tasks: briefing.tasks,
    suggestion: briefing.suggestion,
  };
}

function renderHtml(payload) {
  const dataJson = JSON.stringify(payload).replace(/</g, "\\u003c");
  const generated = new Date(payload.generatedAt).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const port = readPort();

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Wiki TODO Dashboard</title>
  <style>
    :root {
      --bg: #0f1419;
      --panel: #1a2332;
      --panel2: #243044;
      --text: #e7ecf3;
      --muted: #8b9cb3;
      --accent: #5b9fd4;
      --accent2: #7c6cf0;
      --ok: #3ecf8e;
      --warn: #f0b429;
      --border: #2d3a4f;
      --p1: #ff6b6b;
      --p2: #ffa94d;
      --p3: #5b9fd4;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", "Hiragino Sans", "Yu Gothic UI", sans-serif;
      background: radial-gradient(1200px 600px at 10% -10%, #1a2840 0%, var(--bg) 55%);
      color: var(--text);
      line-height: 1.5;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(10px);
      background: rgba(15, 20, 25, 0.85);
      border-bottom: 1px solid var(--border);
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px 20px;
      align-items: center;
      justify-content: space-between;
    }
    h1 { margin: 0; font-size: 1.25rem; font-weight: 650; }
    .meta { color: var(--muted); font-size: 0.85rem; }
    main { max-width: 1200px; margin: 0 auto; padding: 20px 24px 48px; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }
    .stat {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
    }
    .stat .label { color: var(--muted); font-size: 0.8rem; }
    .stat .value { font-size: 1.6rem; font-weight: 700; margin-top: 4px; }
    .hero {
      background: linear-gradient(135deg, rgba(91,159,212,0.18), rgba(124,108,240,0.18));
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
    }
    .hero h2 { margin: 0 0 8px; font-size: 1rem; color: var(--muted); font-weight: 600; }
    .hero .title { font-size: 1.2rem; font-weight: 700; }
    .hero .reason { color: var(--muted); margin-top: 6px; }
    .hero .cta {
      display: inline-block;
      margin-top: 12px;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--accent2);
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      align-items: center;
    }
    .toolbar input {
      flex: 1 1 220px;
      min-width: 180px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--panel);
      color: var(--text);
    }
    .chip {
      border: 1px solid var(--border);
      background: var(--panel);
      color: var(--text);
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .chip.active { background: var(--accent); border-color: var(--accent); color: #061018; font-weight: 600; }
    section { margin-top: 28px; }
    section h2 {
      font-size: 1.05rem;
      margin: 0 0 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid var(--border);
      color: var(--muted);
    }
    .project {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .project-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 14px;
      background: var(--panel2);
      cursor: pointer;
      user-select: none;
    }
    .project-head h3 { margin: 0; font-size: 0.98rem; }
    .priority-p1 { color: var(--p1); }
    .priority-p2 { color: var(--p2); }
    .priority-p3 { color: var(--p3); }
    .items { padding: 6px 0; }
    .item, .task-row {
      padding: 10px 14px;
      border-top: 1px solid rgba(45,58,79,0.6);
      display: grid;
      gap: 4px;
    }
    .item:first-child, .task-row:first-child { border-top: none; }
    .item-text { font-size: 0.95rem; }
    .item-meta, .task-meta {
      color: var(--muted);
      font-size: 0.8rem;
      font-family: Consolas, "Cascadia Mono", monospace;
    }
    .state-in-progress { color: var(--ok); }
    .state-blocked-by-dependency { color: var(--warn); }
    .empty { color: var(--muted); padding: 16px; text-align: center; }
    @media (max-width: 640px) {
      main { padding: 16px; }
      header { padding: 14px 16px; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Wiki TODO Dashboard</h1>
      <div class="meta">${escapeHtml(VAULT_NAME)} / Backroom · 生成 ${escapeHtml(generated)}</div>
    </div>
    <div class="meta">localhost:${port}</div>
  </header>
  <main id="app"></main>
  <script>
    const DATA = ${dataJson};

    function rankProject(name) {
      const order = ${JSON.stringify(PROJECT_PRIORITY)};
      return order[name] ?? 9;
    }

    function priorityClass(name) {
      const r = rankProject(name);
      if (r === 1) return "priority-p1";
      if (r === 2) return "priority-p2";
      if (r === 3) return "priority-p3";
      return "";
    }

    function stateClass(state) {
      if (state === "in-progress") return "state-in-progress";
      if (state === "blocked-by-dependency") return "state-blocked-by-dependency";
      return "";
    }

    const STATE_JA = ${JSON.stringify(STATE_JA)};

    let activeProject = "all";
    let query = "";

    function render() {
      const root = document.getElementById("app");
      const todos = DATA.todos.items.filter((item) => {
        if (activeProject !== "all" && item.project !== activeProject) return false;
        if (query) {
          const q = query.toLowerCase();
          return (
            item.text.toLowerCase().includes(q) ||
            item.note.toLowerCase().includes(q) ||
            (item.section || "").toLowerCase().includes(q)
          );
        }
        return true;
      });

      const projects = [...new Set(DATA.todos.items.map((i) => i.project))].sort(
        (a, b) => rankProject(a) - rankProject(b) || a.localeCompare(b, "ja")
      );

      const tasks = DATA.tasks
        .filter((t) => activeProject === "all" || t.project === activeProject)
        .sort((a, b) => (a.projectPriority ?? 9) - (b.projectPriority ?? 9));

      const grouped = new Map();
      for (const item of todos) {
        if (!grouped.has(item.project)) grouped.set(item.project, []);
        grouped.get(item.project).push(item);
      }

      const suggestion = DATA.suggestion;
      let hero = "";
      if (suggestion && suggestion.task) {
        const t = suggestion.task;
        hero = \`
          <div class="hero">
            <h2>着手提案</h2>
            <div class="title">\${escape(t.title)} <span class="badge">\${escape(t.project)}</span></div>
            <div class="reason">\${escape(suggestion.reason || "")}</div>
            <div class="item-meta">\${escape(t.note)} · 優先=\${escape(t.priority)} · 難易=\${escape(t.difficulty)} · \${STATE_JA[t.state] || t.state}</div>
            <div class="cta">これに着手しませんか？</div>
          </div>\`;
      }

      const chips = ['<button class="chip ' + (activeProject === "all" ? "active" : "") + '" data-project="all">すべて (' + DATA.todos.count + ')</button>']
        .concat(projects.map((p) => {
          const count = DATA.todos.items.filter((i) => i.project === p).length;
          const active = activeProject === p ? "active" : "";
          return '<button class="chip ' + active + '" data-project="' + escape(p) + '">' + escape(p) + ' (' + count + ')</button>';
        }))
        .join("");

      const taskRows = tasks.length
        ? tasks.map((t) => \`
            <div class="task-row">
              <div class="item-text"><strong>\${escape(t.title)}</strong> <span class="badge">\${escape(t.project)}</span></div>
              <div class="task-meta \${stateClass(t.state)}">\${STATE_JA[t.state] || t.state} · 優先=\${escape(t.priority)} · 難易=\${escape(t.difficulty)} · \${escape(t.note)}</div>
            </div>\`).join("")
        : '<div class="empty">タスクノートはありません</div>';

      const todoBlocks = [...grouped.entries()]
        .sort(([a], [b]) => rankProject(a) - rankProject(b) || a.localeCompare(b, "ja"))
        .map(([project, items]) => \`
          <div class="project" data-project-block="\${escape(project)}">
            <div class="project-head">
              <h3 class="\${priorityClass(project)}">\${escape(project)} <span class="badge">P\${rankProject(project) < 9 ? rankProject(project) : "?"} · \${items.length} 件</span></h3>
              <span class="badge">toggle</span>
            </div>
            <div class="items">
              \${items.map((item) => \`
                <div class="item">
                  <div class="item-text">☐ \${escape(item.text)}</div>
                  <div class="item-meta">\${escape(item.note)} L\${item.line}\${item.section ? " · " + escape(item.section) : ""}</div>
                </div>\`).join("")}
            </div>
          </div>\`).join("");

      root.innerHTML = \`
        <div class="stats">
          <div class="stat"><div class="label">Wiki TODO</div><div class="value">\${DATA.todos.count}</div></div>
          <div class="stat"><div class="label">プロジェクト</div><div class="value">\${projects.length}</div></div>
          <div class="stat"><div class="label">タスクノート</div><div class="value">\${DATA.tasks.length}</div></div>
          <div class="stat"><div class="label">表示中</div><div class="value">\${todos.length}</div></div>
        </div>
        \${hero}
        <div class="toolbar">
          <input id="search" type="search" placeholder="TODO / ノート / セクションで検索..." value="\${escape(query)}" />
          \${chips}
        </div>
        <section>
          <h2>タスクノート <span class="badge">tasks/*.md</span></h2>
          <div class="project"><div class="items">\${taskRows}</div></div>
        </section>
        <section>
          <h2>Wiki チェックボックス <span class="badge">Backroom 横断</span></h2>
          \${todoBlocks || '<div class="empty">未完了 TODO はありません</div>'}
        </section>\`;

      document.getElementById("search").addEventListener("input", (e) => {
        query = e.target.value;
        render();
      });
      root.querySelectorAll(".chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeProject = btn.dataset.project;
          render();
        });
      });
      root.querySelectorAll(".project-head").forEach((head) => {
        head.addEventListener("click", () => {
          const items = head.parentElement.querySelector(".items");
          if (items) items.style.display = items.style.display === "none" ? "" : "none";
        });
      });
    }

    function escape(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    render();
  </script>
</body>
</html>`;
}

function ensureDashboardDir() {
  fs.mkdirSync(DASHBOARD_DIR, { recursive: true });
}

function writeHtml(html) {
  ensureDashboardDir();
  fs.writeFileSync(LATEST_HTML, html, "utf8");
}

function readPort() {
  try {
    const n = Number(fs.readFileSync(PORT_FILE, "utf8").trim());
    if (n > 0) return n;
  } catch {
    /* ignore */
  }
  return DEFAULT_PORT;
}

function writePort(port) {
  fs.writeFileSync(PORT_FILE, String(port), "utf8");
}

function isServerUp(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${HOST}:${port}/health`, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startDetachedServer() {
  const child = spawn(process.execPath, [path.join(__dirname, "open-dashboard.mjs"), "--serve"], {
    detached: true,
    stdio: "ignore",
    cwd: __dirname,
  });
  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid), "utf8");
  return child.pid;
}

function openBrowser(url) {
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  } else if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  }
}

function runServer() {
  ensureDashboardDir();
  const port = readPort();
  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
      return;
    }
    if (!fs.existsSync(LATEST_HTML)) {
      res.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("dashboard not built yet");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(LATEST_HTML));
  });

  server.on("error", (err) => {
    console.error(`server error on port ${port}:`, err.message);
    process.exit(1);
  });

  server.listen(port, HOST, () => {
    writePort(port);
    fs.writeFileSync(PID_FILE, String(process.pid), "utf8");
  });

  const shutdown = () => {
    try {
      fs.unlinkSync(PID_FILE);
    } catch {
      /* ignore */
    }
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function main() {
  const mode = process.argv.includes("--serve")
    ? "serve"
    : process.argv.includes("--build")
      ? "build"
      : "open";

  if (mode === "serve") {
    runServer();
    return;
  }

  const payload = buildPayload();
  const html = renderHtml(payload);
  writeHtml(html);

  if (mode === "build") {
    console.log(LATEST_HTML);
    return;
  }

  writePort(DEFAULT_PORT);
  const port = readPort();
  const up = await isServerUp(port);
  if (!up) {
    startDetachedServer();
    await new Promise((r) => setTimeout(r, 600));
  }

  const activePort = readPort();
  const finalUp = await isServerUp(activePort);
  if (!finalUp) {
    console.error(`dashboard server failed to start on port ${activePort}`);
    process.exit(1);
  }

  const url = `http://${HOST}:${activePort}/`;
  openBrowser(url);
  console.log(`Wiki TODO dashboard: ${url}`);
  console.log(`Open TODOs: ${payload.todos.count}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
