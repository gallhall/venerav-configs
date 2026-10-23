# venerav-configs

[English](README.md) | 简体中文

[venera-v](https://github.com/gallhall/venera-v) 的漫画源列表。

本仓库 fork 自 [venera-configs](https://github.com/venera-app/venera-configs)，每天自动合并它的更新，包含 venera 的全部漫画源，另外加上下面这些 venera-v 的源。

## 使用

venera-v 默认使用这个列表。在其他应用里，把漫画源列表地址设为：

```
https://cdn.jsdelivr.net/gh/gallhall/venerav-configs@main/index.json
```

## venera-v 的源

| 源 | 文件 | 说明 |
|---|---|---|
| Pixiv | `pixiv_token.js` | 需要在源设置里填写 `refresh_token`、`clientId`、`clientSecret`、`hashSalt` |
| Hanime1.me | `hanime1.js` | 视频源，需要 venera-v 2.0.0 及以上 |
| Hanime1 H漫画 | `hanime1_comics.js` | |

## 编写新的源

1. 下载 `_template_.js` 和 `_venera_.js`，放在同一个目录
2. 把 `_template_.js` 改名为 `your_config_name.js`
3. 按需要编辑 `your_config_name.js`。
   - `_template_.js` 里有注释说明怎么写。
   - `_venera_.js` 用于在 IDE 里代码补全。

视频源见 venera-v 的 [Video Source](https://github.com/gallhall/venera-v/blob/master/doc/video_source.md)。
