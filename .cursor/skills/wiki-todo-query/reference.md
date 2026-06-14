# Wiki TODO Query — Reference

## ブラウザダッシュボード

`scripts/open-dashboard.mjs` が `collect-todos.mjs` + `suggest-task.mjs` の結果を HTML にまとめる。

| 表示 | 内容 |
|------|------|
| 統計 | 未完了件数 · プロジェクト数 · タスクノート数 |
| 着手提案 | suggest-task のトップ候補 |
| タスクノート | `tasks/*.md` の frontmatter 一覧 |
| Wiki チェックボックス | Backroom 横断 `- [ ]` |

URL: `http://127.0.0.1:47847/`

### 画面イメージ（プレースホルダ）

セットアップ後、`node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs` で実際のダッシュボードが生成されます。

![Wiki TODO Dashboard プレースホルダ](dashboard/examples/wiki-todo-dashboard-placeholder.svg)

- 上部: 統計カード（Wiki TODO **N 件（例）** · プロジェクト **M** · タスクノート **K**）
- 着手提案: P1 プロジェクトの実施中タスクをハイライト
- プロジェクトチップで絞り込み · 検索ボックスでノート横断検索

## よくあるフィルタ

```bash
node scripts/collect-todos.mjs --project sample-product
node scripts/collect-todos.mjs --format json
node scripts/collect-todos.mjs --project sample-company | head -n 40
```

## タスク frontmatter（`tasks/*.md`）

| フィールド | 値 |
|-----------|-----|
| `priority` | `high` / `medium` / `low` / `unset` |
| `difficulty` | `low` / `medium` / `high` / `unset` |
| `state` | `not-started`, `in-progress`, `blocked-by-dependency`, … |

横断台帳: `Backroom/priorities.md`  
方針: `Reference/task-management.md`

## プロジェクト優先度

`vault.config.json` の `projectPriorities` で上書き。未設定時はテンプレ既定（sample-side-work=1 等）。
