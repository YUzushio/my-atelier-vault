---
visibility: private
---

# Sample Company — Calendar

定期ルーティンと Google Calendar 連携の例。  
`@wiki-setup-advanced` で Calendar を有効化するとこのノートが更新されます。

## 登録済みカレンダー

| 項目 | 値 |
|------|-----|
| **カレンダー名** | {{CALENDAR_NAME}} |
| **用途** | 定期タスクリマインダー |

## 定期タスク（Wiki 正本）

| 頻度 | 内容 | 備考 |
|------|------|------|
| 毎月 | 経理チェック | [[operations]] と対応 |

## MCP 設定（Cursor）

`~/.cursor/mcp.json` に `google-calendar` を追加（**credentials パスは各自の環境**）:

```json
"google-calendar": {
  "command": "npx",
  "args": ["-y", "@cocal/google-calendar-mcp"],
  "env": {
    "GOOGLE_OAUTH_CREDENTIALS": "{{CREDENTIALS_DIR}}/credentials.json",
    "GOOGLE_CALENDAR_MCP_TOKEN_PATH": "{{CREDENTIALS_DIR}}/calendar-mcp-tokens.json"
  }
}
```

### 有効化手順

1. [Google Cloud Console](https://console.cloud.google.com/) で OAuth デスクトップクライアントを作成
2. JSON を `{{CREDENTIALS_DIR}}/credentials.json` に保存（**git に含めない**）
3. Cursor を再起動 → Settings → Tools & MCP → `google-calendar` が緑か確認
4. 初回 OAuth: `npx @cocal/google-calendar-mcp auth`

### 使い方の例

- 「来月の経理チェック予定を確認して」
- 「毎月1日にリマインダーを追加して」

## 関連

- [[operations]] — 定期 TODO 定義
- [[Reference/mcp-integrations]] — 連携一覧
