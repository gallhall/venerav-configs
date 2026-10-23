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
| Pixiv | `pixiv_token.js` | Fill in `refresh_token`, `clientId`, `clientSecret` and `hashSalt` in the source settings |
| Hanime1.me | `hanime1.js` | Video source, needs venera-v 2.0.0 or later |
| Hanime1 H漫画 | `hanime1_comics.js` | |

## Add or update a source

1. Put the `.js` file in the root of the repository.
2. List it in `index_extra.json`, in the same format as `index.json`:
   ```json
   {
       "name": "My source",
       "fileName": "my_source.js",
       "key": "my_source",
       "version": "1.0.0",
       "description": "Optional, shown in the source list"
   }
   ```
3. Push. The `Sync upstream` workflow rebuilds `index.json` and purges jsDelivr.

To update a source, replace its `.js` file **and** raise its `version` in `index_extra.json` to the one in the file. The app only offers an update when that version is higher.

## Create a new configuration

1. Download `_template_.js`, `_venera_.js`, put them in the same directory
2. Rename `_template_.js` to `your_config_name.js`
3. Edit `your_config_name.js` to your needs.
   - The `_template_.js` file contains comments to help you with that.
   - The `_venera_.js` is used for code completion in your IDE.

For video sources, see [Video Source](https://github.com/gallhall/venera-v/blob/master/doc/video_source.md) of venera-v.
