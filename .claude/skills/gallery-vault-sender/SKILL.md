---
name: gallery-vault-sender
description: >-
  Prepares my-atelier-vault Backroom notes for export to the Gallery SPA. Use
  when creating a new wiki project before gallery.json exists, adding gallery:
  true frontmatter, Gallery 掲載 tables, cover assets, or when the user says
  Vault first then Gallery, wiki to gallery, or Backroom gallery prep.
---

# Gallery Vault Sender

Wiki（正本メタ）→ Gallery（公開 JSON）の **送信側**。  
Gallery リポジトリは触らない。`Backroom/` を整え、受信側 Skill に渡す。

## 役割分担

| 層 | 正本 | Skill |
|----|------|-------|
| **Vault** | 経緯・全文・非公開メモ | **この Skill（sender）** |
| **Gallery** | `public/data/gallery.json` + サムネ | `@gallery-vault-receiver`（gallery リポ） |

`gallery: true` = Gallery へ載せる意思。`visibility` は Gallery 掲載と独立。

## 新規プロジェクト

### 1. ディレクトリ

```
Backroom/{slug}/
├── _index.md          … 必須
└── assets/            … 任意（表紙・サムネ原稿）
    └── cover.png
```

### 2. Frontmatter テンプレ

```yaml
---
visibility: open
gallery: true
project: 表示名
status: active
year: 2024
platform: YouTube
url: https://...
site: https://...
youtube: https://...
github: owner/repo
handle: account-name
tags: [SNS, Web]
---
```

### 3. 本文

- **1 段落の summary**
- **`## Gallery 掲載`** 表（hub の子 work）

### 4. 索引

[`Backroom/_index.md`](../../Backroom/_index.md) に 1 行追加。

### 5. 受信側

Gallery リポで `@gallery-vault-receiver` を実行。

## Gallery テンプレ

- Fork: [YUzushio/yuzushio.github.io](https://github.com/YUzushio/yuzushio.github.io)
- 公開例: [yuzushio.github.io](https://yuzushio.github.io/)

## 参照

- [reference.md](reference.md)
- `@wiki-setup` — 初回セットアップ
