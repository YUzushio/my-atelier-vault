# my-atelier-vault

Obsidian Wiki + Cursor Agent Skills の **fork 用テンプレート**です。  
Backroom に制作ログ・タスクを書き、Wiki TODO ダッシュボードで横断管理し、必要なら [Gallery](https://github.com/YUzushio/yuzushio.github.io) へ公開します。

- **テンプレリポ:** このリポジトリ（`YUzushio/my-atelier-vault`）
- **作者の private 正本:** 別リポ [`atelier-vault`](https://github.com/YUzushio/atelier-vault)（非公開運用想定）

Copyright (c) YUzushio · [MIT License](LICENSE)

---

## Quick start

### 1. Fork & clone

1. [YUzushio/my-atelier-vault](https://github.com/YUzushio/my-atelier-vault) を GitHub で **fork**
2. clone して Cursor / Obsidian で開く

### 2. セットアップ

**A. Agent Skill（推奨）**

Cursor で `@wiki-setup` と入力し、対話に従う。

**B. スクリプト**

```bash
node .cursor/skills/wiki-setup/scripts/setup.mjs
```

`vault.config.json` が生成され、`Backroom/` の `{{HOME_ROOT}}` 等が置換されます。

### 3. Obsidian

1. このフォルダを vault として開く
2. **Settings → Community plugins → Turn off restricted mode**
3. **Obsidian Git** をインストール
4. Remote を自分の fork URL に設定

### 4. Wiki TODO ダッシュボード

```bash
node .cursor/skills/wiki-todo-query/scripts/open-dashboard.mjs
```

`http://127.0.0.1:47847/` でブラウザ表示。

![Wiki TODO Dashboard プレースホルダ](.cursor/skills/wiki-todo-query/dashboard/examples/wiki-todo-dashboard-placeholder.svg)

---

## Structure

| パス | 用途 |
|------|------|
| `Backroom/` | Wiki 本体（Open / Private / Closed） |
| `Gallery Prep/` | Gallery 公開前の下書き・素材（任意） |
| `Reference/` | タスク管理・朝ブリーフィング情報源 |
| `Templates/` | タスク・セッションログ等 |
| `.cursor/skills/` | Cursor Agent Skills |

### サンプルプロジェクト（テンプレ）

| slug | 用途 |
|------|------|
| `sample-open-project` | Open · Gallery 掲載例 |
| `sample-sns-hub` | SNS hub + 子 work 表 |
| `sample-company` | Private · 組織ナレッジ |
| `sample-side-work` | Private · P1 委託 |
| `sample-product` | Private · frozen プロダクト |
| `sample-archived` | Closed · 終了プロジェクト |

---

## Agent Skills

| Skill | 用途 |
|-------|------|
| `@wiki-setup` | fork 直後の初回セットアップ |
| `@wiki-setup-advanced` | **任意** — Google Calendar / GitLab / GitHub MCP 連携 |
| `@wiki-todo-query` | Backroom 横断 TODO · ダッシュボード |
| `@gallery-vault-sender` | Wiki → Gallery 送信側メタ整備 |
| `@morning-briefing` | おはようブリーフィング |

### Advanced MCP（任意）

基本セットアップ後、必要な場合のみ:

```bash
node .cursor/skills/wiki-setup-advanced/scripts/setup-advanced.mjs
```

デフォルトは **スキップで OK**。Calendar · GitLab · GitHub の Cursor MCP 設定を案内します。

---

## Gallery 連携

公開ポートフォリオ SPA は **別リポ** です。

| | URL |
|---|-----|
| **Fork テンプレ** | [github.com/YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io) |
| **公開例** | [yuzushio.github.io](https://yuzushio.github.io/) |

### フロー

1. **Sender（このリポ）:** `@gallery-vault-sender` — `Backroom/{slug}/_index.md` に `gallery: true`
2. **Receiver（Gallery リポ）:** `@gallery-vault-receiver` — `public/data/gallery.json` にマージ

---

## Configuration

| ファイル | 説明 |
|---------|------|
| `vault.config.example.json` | コミット済みテンプレ |
| `vault.config.json` | 個人設定（**gitignore**） |

---

## License

MIT License — Copyright (c) YUzushio. See [LICENSE](LICENSE).
