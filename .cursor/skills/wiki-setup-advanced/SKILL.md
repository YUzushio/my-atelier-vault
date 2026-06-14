---
name: wiki-setup-advanced
description: >-
  Optional advanced setup for my-atelier-vault: MCP integrations (Google Calendar,
  GitLab, GitHub) and Obsidian Git tuning. Use AFTER @wiki-setup when the user
  asks for advanced setup, MCP 連携, Google Calendar, GitLab, GitHub integration,
  or @wiki-setup-advanced. Skip by default if user does not need it.
---

# Wiki Setup Advanced

**基本セットアップ（`@wiki-setup`）完了後** の任意フェーズ。  
Google Calendar MCP · GitLab · GitHub など **Cursor MCP 連携**を案内する。

> **デフォルトはスキップで OK。** ユーザーが明示的に欲しいと言ったときだけ実行する。

## 前提

- `vault.config.json` が存在すること（先に `@wiki-setup`）
- 秘密情報（PAT · OAuth Secret · token）は **Wiki / git に書かない**

## 開始前に必ず聞く

基本セットアップ直後、エージェントは **1 回だけ** 確認する:

> **MCP 連携（Google Calendar / GitLab / GitHub）をセットアップしますか？**  
> 不要なら「いいえ」「スキップ」で終了して問題ありません。

- デフォルト: **いいえ（スキップ）**
- 「あとで」→ 本 Skill を再度呼べばよい

## 手順

### 1. Advanced セットアップスクリプト

```bash
node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs
```

対話内容:

1. MCP 連携するか（**[y/N] デフォルト N**）
2. 有効にする項目を選択（Calendar / GitLab / GitHub — 個別に y/N）
3. `vault.config.json` の `integrations` を更新
4. Wiki ノート（`Reference/mcp-integrations.md` · `morning-briefing-sources.md` · `calendar.md`）を更新

非対話（全部スキップ）:

```bash
node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs --non-interactive
```

### 2. Cursor MCP 設定（ユーザー操作）

[reference.md](reference.md) のスニペットを **`~/.cursor/mcp.json`** にマージ。

エージェントがやること:

- スニペットを提示（**credentials パスはユーザー環境に合わせて置換**）
- Settings → Tools & MCP で緑ランプ確認を促す
- **mcp.json に Secret を書かせない**

### 3. 連携別クイックガイド

| 連携 | 設定先 | Wiki | 利用 Skill |
|------|--------|------|-----------|
| Google Calendar | `mcp.json` + OAuth ファイル | `Backroom/sample-company/calendar.md` | `@morning-briefing` |
| GitLab | Cursor GitLab MCP + PAT | `Reference/morning-briefing-sources.md` | `@morning-briefing` |
| GitHub | `gh auth` または GitHub MCP | `integrations.github` | PR / Issue 作業時 |
| Obsidian Git | Obsidian プラグイン | `Reference/mcp-integrations.md` | Vault 同期 |

### 4. 動作確認

**Calendar（有効時）**

- MCP: `get-current-time` → `list-events`
- `@morning-briefing` — 「今日の予定」セクションが出るか

**GitLab（有効時）**

- Open Issue を 1 件取得できるか
- `@morning-briefing` — Issue セクション（任意）

## vault.config.json の integrations 例

```json
"integrations": {
  "googleCalendar": {
    "enabled": true,
    "calendarName": "My Routine",
    "credentialsDir": "C:/Users/you/.google-suite-mcp",
    "wikiNote": "Backroom/sample-company/calendar.md"
  },
  "gitlab": {
    "enabled": true,
    "host": "https://gitlab.com",
    "groupPath": "your-org/your-group"
  },
  "github": {
    "enabled": false,
    "defaultRepo": "you/my-atelier-vault"
  }
}
```

## やらないこと

- 基本セットアップ未完了の状態で integrations だけ書く（先に `@wiki-setup`）
- PAT / OAuth Secret を Wiki · コミット · チャットログに残す
- ユーザーが「不要」と言ったのに MCP 設定を進める

## 参照

- [reference.md](reference.md) — mcp.json スニペット全文
- `@wiki-setup` — 基本セットアップ
- `@morning-briefing` — Calendar / GitLab 利用側
