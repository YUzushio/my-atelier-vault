---
visibility: closed
updated: 2026-06-14
---

# 朝ブリーフィング — 情報ソース

`@morning-briefing` Skill が Web / X 検索・Wiki 参照するときの **正本**。  
ここを編集すると翌朝のレポート対象が変わる。

> **未設定のセクション**（Calendar MCP / GitLab / X アカウント）は `@morning-briefing` がスキップします。  
> fork 後に自分のプロジェクト・情報源に差し替えてください。

Skill: `.cursor/skills/morning-briefing/`

## プロジェクト文脈（Wiki を毎朝スキム）

| 優先 | パス | 用途 |
|------|------|------|
| P1 | [[sample-side-work/_index]] · [[sample-side-work/tasks/main-deliverable]] | 今週の主戦場 |
| P2 | [[sample-product/_index]] · [[Backroom/priorities]] | 自社プロダクト backlog |
| P3 | [[sample-company/_index]] · [[sample-company/operations]] | 組織・定期タスク |
| — | [[Reference/task-management]] | 状態・優先の定義 |

## HowTo / 手順（プロジェクト関連）

| トピック | Wiki |
|---------|------|
| クライアント報告 | [[sample-side-work/_index]] |
| 定期経理 | [[sample-company/operations]] |
| Vault → Gallery | `.cursor/skills/gallery-vault-sender/SKILL.md` |

## Web 検索クエリ（プレースホルダ）

エージェントは **最大 4 クエリ** に絞る。未設定時はスキップ。

```
（例）your-stack release notes 2026
（例）your-framework breaking changes
```

## X アカウント（プレースホルダ）

| handle | 用途 |
|--------|------|
| `@your_account` | メインアカウント |

## Google Calendar MCP（任意）

- カレンダー名: `（未設定 — MCP 連携後に記入）`
- プロジェクト別 calendar ノート: `sample-company/calendar.md` 等を作成可

## GitLab / GitHub Issue（任意）

- グループ / リポ: `（未設定）`

## AI が簡略化しがちなトピック

| タグ | 例 |
|------|-----|
| AI要約注意 | 法改正 · CVE · 破壊的変更 · 料金改定 |
