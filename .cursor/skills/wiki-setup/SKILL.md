---
name: wiki-setup
description: >-
  First-time setup for my-atelier-vault after fork or clone. Use when the user
  says setup, セットアップ, 初めて使う, fork した, my-atelier-vault を自分用に,
  or @wiki-setup.
---

# Wiki Setup

fork / clone 直後に **my-atelier-vault** を自分用に初期化する。

## いつ使うか

- GitHub で fork して clone した直後
- `vault.config.json` がまだない
- `Backroom/local-layout.md` の `{{HOME_ROOT}}` が未置換

## 手順

### 1. 対話セットアップ（推奨）

リポジトリルートから:

```bash
node .cursor/skills/wiki-setup/scripts/setup.mjs
```

質問に答えると `vault.config.json` を生成し、`Backroom/` のプレースホルダを置換する。

### 2. 非対話（CI / エージェント）

```bash
node .cursor/skills/wiki-setup/scripts/setup.mjs --non-interactive \
  --author "Your Name" \
  --home "C:/Users/you" \
  --remote "https://github.com/you/my-atelier-vault.git" \
  --vault-name "My Atelier Vault"
```

### 3. Obsidian

1. このフォルダを vault として開く
2. **Settings → Community plugins → Turn off restricted mode**
3. **Obsidian Git** をインストール
4. Remote URL を `vault.config.json` の `gitRemote` に設定
5. 初回: `Obsidian Git: Pull` → 以降 auto sync を好みで設定

### 4. 動作確認

```bash
node .cursor/skills/wiki-todo-query/scripts/collect-todos.mjs
node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs --build
```

ブラウザ表示: `open-dashboard.mjs`（引数なし）

### 5. Gallery（任意）

公開ポートフォリオは別リポ:

- テンプレ fork: [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io)
- 公開例: [yuzushio.github.io](https://yuzushio.github.io/)
- Wiki 側: `@gallery-vault-sender` · Gallery 側: `@gallery-vault-receiver`

## 生成ファイル

| ファイル | git |
|---------|-----|
| `vault.config.json` | **ignore**（個人設定） |
| `vault.config.example.json` | コミット済みテンプレ |

## やらないこと

- ユーザーの private 正本（別リポ `atelier-vault`）を触らない
- `vault.config.json` を commit しない
- 秘密情報を Wiki に書かない

## 参照

- リポ README
- `@wiki-todo-query` — TODO ダッシュボード
- `@gallery-vault-sender` — Gallery export 準備
