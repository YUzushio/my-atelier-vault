---
visibility: private
---

# Backroom

Wiki の本体。Open / Private / Closed で、制作・記録をここに書く。

## Projects

### Open

- [[sample-open-project/_index|Sample Open Project]] — open · Gallery 掲載例
- [[sample-sns-hub/_index|Sample SNS Hub]] — open · SNS hub + 子 work 表の例

### Private

- [[sample-company/_index|Sample Company]] — private · 会社・組織ナレッジの例
- [[sample-side-work/_index|Sample Side Work]] — private · 副業・委託の例
- [[sample-product/_index|Sample Product]] — private · frozen · 自社プロダクトの例

### Closed

- [[sample-archived/_index|Sample Archived]] — closed · 終了プロジェクトの例

## Meta

- visibility は frontmatter で管理
- visibility 定義: `open`（公開中） / `private`（非公開で継続・保留） / `closed`（終了）
- 凍結中は `status: frozen` を使い、終了は `visibility: closed` とする
- Gallery に載せるものだけ `gallery: true`
- **Vault → Gallery:** `@gallery-vault-sender` → Gallery 側 `@gallery-vault-receiver`
- **横断 TODO:** `@wiki-todo-query`
- **朝ブリーフィング:** `@morning-briefing`（情報源 [[Reference/morning-briefing-sources]]）
- **タスク優先度・状態:** [[Reference/task-management]] · 台帳 [[priorities]]
- **ローカル clone 先:** [[local-layout]]
