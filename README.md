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

## Notes

- **Never edit `index.json`.** Every sync rebuilds it from venera's `index.json` and `index_extra.json`, so direct edits are lost.
- **Do not edit venera's `.js` files.** Copy the file under a new name instead. If you list the copy with the same `key`, it replaces venera's source.
- **Use unique keys and file names.** If venera adds a file with the same name later, the sync stops at a conflict. Keep a source's `key` once it is published: devices that installed it lose its settings when the key changes.
- **Updates take a few minutes.** jsDelivr caches files, and the workflow purges them 30 seconds and again 2 minutes after a push.
- **When a sync fails**, GitHub emails you. A file was changed both here and in venera: merge `venera-app/venera-configs` `main` by hand, or press **Sync fork → Update branch**. Never press **Discard commits**, which deletes the sources of this fork.
- **Changes to venera's workflow files** cannot be pushed by the built-in token, so that sync fails too. Press **Sync fork → Update branch** once, or add a token with the `repo` and `workflow` scopes as the `SYNC_TOKEN` secret.
- **This README is kept over venera's** when both change it.

## Create a new configuration

1. Download `_template_.js`, `_venera_.js`, put them in the same directory
2. Rename `_template_.js` to `your_config_name.js`
3. Edit `your_config_name.js` to your needs.
   - The `_template_.js` file contains comments to help you with that.
   - The `_venera_.js` is used for code completion in your IDE.

For video sources, see [Video Source](https://github.com/gallhall/venera-v/blob/master/doc/video_source.md) of venera-v.
