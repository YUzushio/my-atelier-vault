import fs from "fs";
import path from "path";

const DEFAULT_PRIORITIES = {
  "sample-side-work": 1,
  "sample-product": 2,
  "sample-company": 3,
  "sample-open-project": 4,
  "sample-sns-hub": 4,
};

export function resolveVaultRoot(fromDir, levelsUp = 4) {
  return path.resolve(fromDir, ...Array(levelsUp).fill(".."));
}

export function loadVaultConfig(vaultRoot) {
  const configPath = path.join(vaultRoot, "vault.config.json");
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
}

export function loadProjectPriorities(vaultRoot) {
  const cfg = loadVaultConfig(vaultRoot);
  if (cfg.projectPriorities && typeof cfg.projectPriorities === "object") {
    return cfg.projectPriorities;
  }
  return { ...DEFAULT_PRIORITIES };
}

export function projectRank(name, priorities) {
  return priorities[name] ?? 9;
}

export function priorityLabel(priority) {
  if (priority === 1) return "P1";
  if (priority === 2) return "P2";
  if (priority === 3) return "P3";
  if (priority === 4) return "P4";
  return `P${priority}`;
}

export function buildReason(task, priorities) {
  const parts = [];
  const rank = projectRank(task.project, priorities);
  if (rank <= 4) parts.push(`${priorityLabel(rank)} ${task.project}`);
  if (task.state === "in-progress") parts.push("実施中");
  if (task.priority === "high") parts.push("優先=高");
  return parts.join(" · ") || "台帳上の次タスク";
}
