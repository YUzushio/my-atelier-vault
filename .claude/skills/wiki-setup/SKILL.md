---
name: wiki-setup
description: >-
  First-time setup for my-atelier-vault after fork or clone. Use when the user
  says setup, セットアップ, 初めて使う, fork した, my-atelier-vault を自分用に,
  or @wiki-setup. After basic setup, optionally offer @wiki-setup-advanced for
  MCP integrations (default skip).
---

# Wiki Setup

fork / clone 直後に **my-atelier-vault** を自分用に初期化する。

## いつ使うか

- GitHub で fork して clone した直後
- `vault.config.json` がまだない
- `Backroom/local-layout.md` の `{{HOME_ROOT}}` が未置換

## 手順

### 1. 対話セットアップ（推奨）

```bash
node .cursor/skills/wiki-setup/scripts/setup.mjs
```

質問に答えると `vault.config.json` を生成し、`Backroom/` のプレースホルダを置換する。

**最後に 1 回だけ質問:**

> MCP 連携（Google Calendar / GitLab / GitHub）も設定しますか？ **[y/N] デフォルト N**

- **いいえ / Enter** → 基本セットアップのみで完了（問題なし）
- **はい** → `@wiki-setup-advanced`（`setup-advanced.mjs`）へ続行

### 2. 非対話（CI / エージェント）

```bash
node .cursor/skills/wiki-setup/scripts/setup.mjs --non-interactive \
  --author "Your Name" \
  --home "C:/Users/you" \
  --remote "https://github.com/you/my-atelier-vault.git" \
  --vault-name "My Atelier Vault"
```

非対話では **MCP 連携はスキップ**（デフォルト）。必要なら後から `@wiki-setup-advanced`。

### 3. Obsidian

1. このフォルダを vault として開く
2. **Settings → Community plugins → Turn off restricted mode**
3. **Obsidian Git** をインストール
4. Remote URL を `vault.config.json` の `gitRemote` に設定

### 4. 動作確認

```bash
node .cursor/skills/wiki-todo-query/scripts/collect-todos.mjs
node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs --build
```

### 5. Gallery（任意）

- 公開サイト: [yuzushio.github.io](https://yuzushio.github.io/)
- テンプレ fork: [github.com/YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io/fork)
- Wiki: `@gallery-vault-sender` · Gallery: `@gallery-vault-receiver`

### 6. Advanced（任意 · 後からでも可）

MCP 連携: **`@wiki-setup-advanced`**

```bash
node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs
```

## 生成ファイル

| ファイル | git |
|---------|-----|
| `vault.config.json` | **ignore** |
| `vault.config.example.json` | テンプレ |

## やらないこと

- MCP 連携をユーザー未確認で強制する
- `vault.config.json` を commit する
- 秘密情報を Wiki に書く

## 参照

- `@wiki-setup-advanced` — Google Calendar / GitLab / GitHub MCP
- `@wiki-todo-query` — TODO ダッシュボード
