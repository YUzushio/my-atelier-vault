---
visibility: open
gallery: true
project: Sample SNS Hub
status: active
year: 2020
project_priority: 4
platform: YouTube
url: https://youtube.com/@example
youtube: https://youtube.com/@example
handle: example-channel
tags: [SNS, Music]
---

# Sample SNS Hub

SNS アカウントを **hub** として Gallery に載せる例です。  
子コンテンツ（動画・投稿）は `## Gallery 掲載` 表で receiver が `work` item に展開します。

## 概要

架空の YouTube チャンネル。hub は `showInFeed: false` 想定で、子 work が Feed に載ります。

## Gallery 掲載

| タイトル | 投稿日 | URL | メモ |
|----------|--------|-----|------|
| Sample Video — Intro | 2020-03-01 | https://youtube.com/watch?v=example1 | 紹介動画 |
| Sample Video — Tutorial | 2021-07-20 | https://youtube.com/watch?v=example2 | チュートリアル |

## TODO

- [ ] 実チャンネル URL に差し替え
- [ ] handle / platform を frontmatter に反映
