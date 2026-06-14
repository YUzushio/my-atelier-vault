---
visibility: open
gallery: true
project: Sample Open Project
status: published
year: 2024
project_priority: 4
github: your-org/sample-open-project
local_root: {{HOME_ROOT}}/your-project
site: https://example.com/sample-open-project
tags: [Web, OpenData]
---

# Sample Open Project

オープンに公開しているプロジェクトの Wiki ノート例です。  
Gallery へ載せる場合は `gallery: true` と `## Gallery 掲載` 表を整備します。

## 概要

架空のオープンデータセット / Web プロジェクト。  
実プロジェクトに差し替えて frontmatter と本文を更新してください。

## 公式サイト

| 項目 | 内容 |
|------|------|
| **URL** | https://example.com/sample-open-project |
| **リポジトリ** | `your-org/sample-open-project` |

## 方針

- **Open** — 公開リポジトリで維持
- Gallery 掲載用の summary は本文 1 段落を receiver が要約元にする

## Gallery 掲載

| タイトル | 投稿日 | URL | メモ |
|----------|--------|-----|------|
| Sample Release v1.0 | 2024-06-01 | https://example.com/release | 初回公開 |
| Sample Blog Post | 2024-09-15 | https://example.com/blog/1 | 任意 |

## 関連

- [[tasks/example-task]] — Gallery 整備タスク例
- `@gallery-vault-sender` — export 前の frontmatter 整備

## TODO

- [ ] Gallery 用 summary を 160 字に要約
- [ ] 表紙画像を `assets/cover.png` に配置
