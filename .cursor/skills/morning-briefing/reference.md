# 朝ブリーフィング — 出力例

## 全体構成

```markdown
おはようございます。

（Wiki TODO ダッシュボードをブラウザ表示）

## タスク状況
（suggest-task.mjs 出力）

## 着手提案
**Main Deliverable** — P1 sample-side-work · 実施中
> これに着手しませんか？

## プロジェクト & HowTo
- sample-side-work: （_index から 1 行）
```

## 未設定時のスキップ

| セクション | 条件 |
|-----------|------|
| 今日の予定 | `morning-briefing-sources.md` にカレンダー未設定 |
| ニュース / X | クエリ・アカウントがプレースホルダ |
| GitLab | グループ未設定 |

## 着手提案ロジック

`suggest-task.mjs` — `vault.config.json` の `projectPriorities` を参照。

## トーン

- 日本語 · 簡潔 · 箇条書き中心
