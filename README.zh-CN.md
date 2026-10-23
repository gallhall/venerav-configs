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

## 添加或更新源

1. 把 `.js` 文件放在仓库根目录。
2. 在 `index_extra.json` 里登记，格式和 `index.json` 一样：
   ```json
   {
       "name": "我的源",
       "fileName": "my_source.js",
       "key": "my_source",
       "version": "1.0.0",
       "description": "可选，显示在源列表里"
   }
   ```
3. 推送。`Sync upstream` 工作流会重新生成 `index.json`，并清除 jsDelivr 缓存。

更新源时，替换 `.js` 文件，**同时**把 `index_extra.json` 里的 `version` 改成文件里的版本号。应用只有在这个版本号变大时才会提示更新。

## 注意事项

- **不要直接改 `index.json`。** 每次同步都会用 venera 的 `index.json` 加上 `index_extra.json` 重新生成它，直接改的内容会丢失。
- **不要改 venera 的 `.js` 文件。** 要改的话，复制一份另起文件名。复制的文件用同样的 `key` 登记，就会替换掉 venera 的那个源。
- **key 和文件名要独特。** 如果以后 venera 加了同名文件，同步会因冲突停下。源发布后不要再改 `key`：改了之后，已经安装过的设备会丢掉这个源的设置。
- **更新要几分钟才生效。** jsDelivr 会缓存文件，工作流在推送后 30 秒和 2 分钟各清一次缓存。
- **同步失败时**，GitHub 会发邮件通知你，说明有文件在本仓库和 venera 两边都改了：手动合并 `venera-app/venera-configs` 的 `main`，或者点 **Sync fork → Update branch**。千万不要点 **Discard commits**，它会删掉本仓库自己的源。
- **venera 改了它的工作流文件时**，内置 token 没有权限推送，同步也会失败。点一次 **Sync fork → Update branch**，或者把带 `repo` 和 `workflow` 权限的 token 添加为名叫 `SYNC_TOKEN` 的 secret。
- **README 和 venera 都改了时，保留本仓库的版本。**

## 编写新的源

1. 下载 `_template_.js` 和 `_venera_.js`，放在同一个目录
2. 把 `_template_.js` 改名为 `your_config_name.js`
3. 按需要编辑 `your_config_name.js`。
   - `_template_.js` 里有注释说明怎么写。
   - `_venera_.js` 用于在 IDE 里代码补全。

视频源见 venera-v 的 [Video Source](https://github.com/gallhall/venera-v/blob/master/doc/video_source.md)。
