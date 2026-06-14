---
name: morning-briefing
description: >-
  Morning briefing when the user says おはよう, おはようございます, good morning,
  or asks for a daily start report. Summarizes Wiki TODO/task status, suggests
  what to work on, optional calendar/news/X. Use with @morning-briefing.
---

# Morning Briefing（朝ブリーフィング）

ユーザーが **おはよう** と言ったとき（または `@morning-briefing`）に実行。  
**日本語**で、短く実用的な朝レポートを返す。

## 必須フロー

### 1. 挨拶

1 行: 「おはようございます。」

### 2. Wiki TODO ダッシュボード（ブラウザ）

**最初に実行:**

```bash
node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs
```

- チャットには **「Wiki TODO ダッシュボードを開きました（N 件）」** と 1 行

### 3. タスク状況 + 着手提案

```bash
node .cursor/skills/morning-briefing/scripts/suggest-task.mjs
```

- **着手提案** 文末: **「これに着手しませんか？」**

### 4. 今日の予定（任意）

`Reference/morning-briefing-sources.md` にカレンダー設定がある場合のみ `google-calendar` MCP を使用。  
**未設定ならスキップ**（1 行で「カレンダー未設定」と書く）。

### 5. プロジェクト & HowTo

`Reference/morning-briefing-sources.md` の表を読む。P1 プロジェクトを 1 行ずつ。

### 6. ニュース & X（任意）

sources にクエリ / X アカウントが **プレースホルダのまま** なら **スキップ**。

### 7. GitLab / GitHub Issue（任意）

sources に設定がなければスキップ。

## 出力

[reference.md](reference.md) に従う。全体 **40 行以内**。

## 関連 Skill

- `@wiki-todo-query` — TODO 収集
- `@wiki-setup` — 初回セットアップ

## 設定

情報ソース: **`Reference/morning-briefing-sources.md`**
