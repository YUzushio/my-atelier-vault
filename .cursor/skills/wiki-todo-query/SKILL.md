---
name: wiki-todo-query
description: >-
  Collects open TODO checkboxes from my-atelier-vault Wiki (Backroom) across
  projects. Use when the user asks for wiki TODOs, project-wide task lists,
  Backroom pending items, cross-project TODO summary, or 未完了 / やること in
  the Obsidian vault.
---

# Wiki TODO Query

**Backroom/** から、プロジェクト横断の TODO を集める。

正本 = **このリポジトリのルート**（clone 先）。`vault.config.json` で表示名・優先度を上書き可能。

## いつ使うか

- 「Wiki の TODO 一覧」「プロジェクト横断で未完了は？」
- 「sample-company だけの TODO」
- 作業前の棚卸し

## 手順

### 1. スクリプトで一括取得（推奨）

```bash
node .cursor/skills/wiki-todo-query/scripts/collect-todos.mjs
```

### 1b. ブラウザダッシュボード（推奨）

```bash
node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs
```

- Backroom をスキャンして `dashboard/latest.html` を生成
- ローカルサーバー `http://127.0.0.1:47847/` で表示
- 画面例（プレースホルダ）: [reference.md](reference.md)
- `@morning-briefing` からも自動キックされる
- HTML のみ再生成: `--build`

| オプション | 意味 |
|-----------|------|
| `--format json` | JSON 出力 |
| `--project sample-company` | プロジェクトフォルダ名で絞り込み |
| `--include-done` | 完了済みも含める |

### 2. 回答フォーマット

プロジェクト別に短くまとめ、各項目に **ノートパス** を付ける。

### 3. 優先度・状態

方針: [[Reference/task-management]] · 台帳 [[Backroom/priorities]]

1. **`tasks/*.md` の frontmatter** を先に読む
2. `priority: unset` → **ユーザーに聞いてから** Wiki を更新
3. ソート: `projectPriorities`（`vault.config.json`）→ task priority → state

## プロジェクト早見（テンプレ）

| フォルダ | 種別 |
|---------|------|
| `sample-side-work/` | Private · P1 |
| `sample-product/` | Private · P2 |
| `sample-company/` | Private · P3 |
| `sample-open-project/` | Open · Gallery |
| `sample-sns-hub/` | Open · SNS hub |

索引: [[Backroom/_index]]

## やらないこと

- TODO を **完了に書き換えない**（ユーザー依頼時のみ）
- 秘密情報を回答に再掲しない

## 参照

- [reference.md](reference.md)
- `@wiki-setup` — 初回セットアップ
