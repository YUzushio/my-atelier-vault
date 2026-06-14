---
visibility: private
updated: 2026-06-14
---

# MCP 連携 — Cursor / Obsidian

`@wiki-setup-advanced` で有効化した連携のメモ。**Client Secret や token は Wiki に書かない。**

設定の正本: `vault.config.json` の `integrations`（gitignore）

## 有効な連携

<!-- wiki-setup-advanced が enabled な項目を追記 -->

（未設定 — 基本セットアップのみ。必要なら `@wiki-setup-advanced`）

## Cursor MCP 設定ファイル

| OS | パス |
|----|------|
| Windows | `%USERPROFILE%\.cursor\mcp.json` |
| macOS / Linux | `~/.cursor/mcp.json` |

詳細スニペット: `.cursor/skills/wiki-setup-advanced/reference.md`

## Obsidian Git（Vault 同期）

基本セットアップで Obsidian Git を有効化。auto pull / auto commit は任意。

- Remote: `vault.config.json` の `gitRemote`
- 手動: Command palette → `Obsidian Git: Commit-and-sync`

## 関連 Skill

- `@morning-briefing` — Calendar MCP 連携時に今日の予定を表示
- `@wiki-todo-query` — TODO ダッシュボード
