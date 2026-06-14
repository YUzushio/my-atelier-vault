# Wiki Setup Advanced — MCP 連携リファレンス

`vault.config.json` の `integrations` と `~/.cursor/mcp.json` の対応表。  
**Secret / token / PAT は Wiki・git・mcp.json の env に直書きしない**（credentials ファイルパスのみ）。

---

## 1. Google Calendar MCP

パッケージ: [`@cocal/google-calendar-mcp`](https://github.com/nspady/google-calendar-mcp)

### credentials 置き場（推奨）

```
~/.google-suite-mcp/
├── credentials.json          ← OAuth デスクトップクライアント JSON
└── calendar-mcp-tokens.json  ← 初回 auth 後に自動生成
```

### mcp.json スニペット

```json
"google-calendar": {
  "command": "npx",
  "args": ["-y", "@cocal/google-calendar-mcp"],
  "env": {
    "GOOGLE_OAUTH_CREDENTIALS": "C:/Users/you/.google-suite-mcp/credentials.json",
    "GOOGLE_CALENDAR_MCP_TOKEN_PATH": "C:/Users/you/.google-suite-mcp/calendar-mcp-tokens.json"
  }
}
```

### 初回認証

```bash
npx @cocal/google-calendar-mcp auth
```

### 動作確認（Cursor Agent）

- `get-current-time` → 今日の日付
- `list-events` / `search-events` — カレンダー名は `vault.config.json` → `integrations.googleCalendar.calendarName`

### Wiki 連携

- カレンダーノート: `Backroom/sample-company/calendar.md`（または自プロジェクトの `calendar.md`）
- 朝ブリーフィング: `Reference/morning-briefing-sources.md` の Google Calendar 節

---

## 2. GitLab MCP

Cursor の **GitLab MCP プラグイン**（Settings → MCP → GitLab）または `@modelcontextprotocol` 系サーバー。

### 必要情報

| 項目 | 例 |
|------|-----|
| GitLab URL | `https://gitlab.com` |
| グループ / プロジェクト | `your-org/your-group` |
| Personal Access Token | **Cursor MCP 設定 UI のみ**（Wiki に書かない） |

### 朝ブリーフィング連携

`Reference/morning-briefing-sources.md`:

```markdown
## GitLab / GitHub Issue（任意）

- グループ / リポ: `your-org/your-group`
- 用途: Open Issue を朝レポートに 0〜3 件
```

### 動作確認

- `@morning-briefing` 実行時に Open Issue を取得（MCP 利用可能時のみ）

---

## 3. GitHub（gh CLI / MCP）

### gh CLI（ターミナル）

```bash
gh auth login
gh repo view
```

PR / Issue 操作は `gh` または GitHub MCP プラグイン。

### GitHub MCP（Cursor プラグイン）

Settings → MCP → GitHub を有効化。PAT は Cursor 側で管理。

`vault.config.json`:

```json
"github": {
  "enabled": true,
  "defaultRepo": "you/my-atelier-vault"
}
```

---

## 4. Obsidian Git（Vault ↔ GitHub）

MCP ではなく **Obsidian プラグイン**。基本セットアップで案内済み。

| 設定 | 推奨 |
|------|------|
| Remote | `vault.config.json` → `gitRemote` |
| Auto pull on boot | 任意 |
| Auto commit interval | 10 分など好みで |

---

## 5. Google Workspace MCP（任意 · Drive / Sheets）

Calendar とは別。Drive / Docs / Sheets が必要な場合のみ。

- 候補: [google-suite-mcp](https://github.com/abcreativ/google-suite-mcp)
- credentials 置き場は Calendar と共有可能（`~/.google-suite-mcp/`）

```json
"google-suite": {
  "command": "npx",
  "args": ["-y", "google-suite-mcp"]
}
```

npm 未公開の場合はリポジトリ clone 後 `node dist/index.js` を指定。

---

## トラブルシュート

| 症状 | 確認 |
|------|------|
| MCP が赤 | Cursor 再起動 · `mcp.json` JSON 構文 |
| Calendar auth 失敗 | credentials.json パス · OAuth スコープ |
| GitLab 403 | PAT スコープ `api` / `read_api` |
| Obsidian Git push 失敗 | remote URL · SSH/HTTPS 認証 |

## 関連

- `@wiki-setup` — 基本セットアップ
- `@morning-briefing` — Calendar / GitLab 利用
- `Reference/mcp-integrations.md` — Wiki 上の連携一覧
