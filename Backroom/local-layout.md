---
visibility: closed
---

# ローカル配置 — `{{HOME_ROOT}}/` 直下

Wiki に載っているプロジェクト・基盤は **ホーム直下** に集約する想定です。  
`@wiki-setup` 実行後にこのファイルがあなたの環境用に更新されます。

```
{{HOME_ROOT}}/
├── my-atelier-vault/       … この Wiki（Obsidian vault）
├── your-gallery/           … 公開 Gallery SPA（任意）
└── your-project/           … 開発 clone 先（例）
```

## Wiki プロジェクト対応表

| Wiki | ローカル | リモート |
|------|----------|----------|
| [[sample-open-project/_index\|Sample Open Project]] | `your-project/` | `your-org/your-repo` |
| [[sample-product/_index\|Sample Product]] | `your-product/` | `your-org/your-product` |
| Gallery（メタ） | `your-gallery/` | `you/your-gallery` |

## Vault の物理パス

- **正本:** `{{HOME_ROOT}}/my-atelier-vault/`（clone 先に合わせて変更）
- Obsidian でこのパスを開く

## セットアップ

fork 後は Cursor で `@wiki-setup` を実行し、`vault.config.json` を生成してください。
