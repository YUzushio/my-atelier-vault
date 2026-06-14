---
visibility: private
---

# タスク管理 — Wiki 正本方針

Backroom の **タスクノート**（`{project}/tasks/*.md`）と [[Backroom/priorities]] で、プロジェクト優先度・タスク優先度・難易度・状態を管理する。

Cursor から `@wiki-todo-query` で横断参照。タスクの **優先度・難易度はユーザーが口頭で答える** — エージェントは未設定なら聞いてから Wiki に書く。

## プロジェクト優先度

数値が **小さいほど優先**（1 = 最優先）。

| 順位 | 値 | プロジェクト（例） | 備考 |
|------|-----|-------------------|------|
| 1 | `1` | [[sample-side-work/_index\|Sample Side Work]] | 稼働の柱 |
| 2 | `2` | [[sample-product/_index\|Sample Product]] | 自社プロダクト |
| 3 | `3` | [[sample-company/_index\|Sample Company]] | 組織・経理 |
| 4 | `4` | Open（Gallery / SNS 等） | メタ追記・公開整備 |
| 5 | `5` | 保留 | 再開時期未定 |

`_index.md` の frontmatter に `project_priority: 1` を書く。一覧は [[Backroom/priorities]]。  
`vault.config.json` の `projectPriorities` もダッシュボード・着手提案で参照される。

## 公開区分（visibility）

| 値 | 意味 |
|----|------|
| `open` | 公開中（Gallery/SNS/公開リポジトリ前提） |
| `private` | 非公開で継続中または一時停止中 |
| `closed` | 終了済み |

## プロジェクト状態（status）

| 値 | 意味 |
|----|------|
| `active` | 現在進行中 |
| `frozen` | 凍結（再開余地あり） |
| `closed` | 終了 |

## タスク優先度

| 値 | 表示 | 意味 |
|----|------|------|
| `high` | **高** | 今スプリント / 期限・依存の上流 |
| `medium` | **中** | 重要だが即時でなくてよい |
| `low` | **低** | backlog |
| `unset` | （未設定） | **ユーザーに聞いてから** 記入 |

## 実装難易度（予想）

| 値 | 表示 | 目安 |
|----|------|------|
| `low` | 低 | 半日〜1日 |
| `medium` | 中 | 数日 |
| `high` | 高 | 1週間+ |
| `unset` | （未設定） | 着手前に埋める |

## 状態（state）

| 値 | 表示 |
|----|------|
| `not-started` | 未着手 |
| `in-progress` | 実施中 |
| `blocked-by-dependency` | 依存ブロック |
| `waiting-external` | 他者待ち |
| `stalled` | 継続困難 |
| `done` | 完了 |
| `rejected` | 却下 |

## タスクノート frontmatter

テンプレ: [[Templates/task]]

```yaml
---
visibility: private
project: PROJECT_SLUG
area: frontend
priority: high
difficulty: medium
state: in-progress
status: active
depends_on: []
blocks: []
---
```

## エージェント向け

1. タスク一覧 → まず [[Backroom/priorities]] と `{project}/tasks/`
2. `priority: unset` / `difficulty: unset` があれば **ユーザーに聞く**
3. 横断一覧は `@wiki-todo-query`

## 関連

- [[Backroom/priorities]] — 横断タスク台帳
- `@wiki-todo-query` — 未完了チェックボックス収集
