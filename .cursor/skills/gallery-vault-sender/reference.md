# Vault → Gallery フィールド対応

Sender（Vault）frontmatter / 本文 → Receiver が `gallery.json` item に写す。

## Frontmatter → item

| Vault | Gallery field |
|-------|---------------|
| フォルダ名 `{slug}` | `id`, `slug` |
| `project` | `title` |
| 本文 1 段落 | `summary` |
| `year` | `year` |
| `url` / `site` / `youtube` / `github` | 同名 |
| `tags` | `tags` |
| （推論） | `kind`, `category`, `genres` |

## `## Gallery 掲載` 表 → 子 item

各行を `kind: "work"` で追加。`parentId` = 親 hub の `id`。

## 配置例

```
{homeRoot}/
├── my-atelier-vault/Backroom/   … sender（このリポ）
└── your-gallery/                … receiver
```

`vault.config.json` の `galleryRepo` / `homeRoot` を参照。

## Receiver ドキュメント

- [gallery-vault-receiver/reference.md](https://github.com/YUzushio/yuzushio.github.io/blob/main/.cursor/skills/gallery-vault-receiver/reference.md)
