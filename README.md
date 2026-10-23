# venerav-configs

English | [简体中文](README.zh-CN.md)

Source list of [venera-v](https://github.com/gallhall/venera-v).

This is a fork of [venera-configs](https://github.com/venera-app/venera-configs). It has every source of venera, merged from there every day, plus the sources of venera-v below.

## Use it

venera-v uses this list by default. In another app, set the source list URL to:

```
https://cdn.jsdelivr.net/gh/gallhall/venerav-configs@main/index.json
```

## Sources of venera-v

| Source | File | Notes |
|---|---|---|
| Pixiv | `pixiv_token.js` | Fill in `refresh_token`, `clientId`, `clientSecret` and `hashSalt` in the source settings. They can be obtained with [pixivpy](https://github.com/upbit/pixivpy) |
| Hanime1.me | `hanime1.js` | Video source, needs venera-v 2.0.0 or later |
| Hanime1 H漫画 | `hanime1_comics.js` | |

## Create a new configuration

1. Download `_template_.js`, `_venera_.js`, put them in the same directory
2. Rename `_template_.js` to `your_config_name.js`
3. Edit `your_config_name.js` to your needs.
   - The `_template_.js` file contains comments to help you with that.
   - The `_venera_.js` is used for code completion in your IDE.

For video sources, see [Video Source](https://github.com/gallhall/venera-v/blob/master/doc/video_source.md) of venera-v.
