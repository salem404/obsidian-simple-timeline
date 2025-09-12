# Obsidian Simple Timeline

Display a list of dates and times as a timeline in Obsidian.

![A timeline in an Obsidian note](./timeline.png)

## Usage

This plugin will look for text formatted in various datetime formats that you can configure in the plugin settings:

**Date formats:**

```markdown
- YYYY-MM-DD: <Any text>        (optional)
- YYYY-MM-DD <Any text>         (optional)
```

**DateTime formats:**

```markdown
- YYYY-MM-DD HH:MM: <Any text>  (enabled by default)
- YYYY-MM-DD HH:MM <Any text>   (optional)
```

**Time-only formats** (require file name to contain a date like `2024-12-31-notes.md`):

```markdown
- HH:MM: <Any text>             (enabled by default)
- HH:MM? <Any text>             (enabled by default, wrapped in div)
- HH:MM <Any text>              (enabled by default)
- HH:MM - HH:MM <Any text>      (time ranges, wrapped in div)
```

**Note:**

- Single-digit hours are supported (e.g., `5:09`, `0:17`)
- Time ranges like `17:00 - 20:30` create a div with two time elements
- Times ending with `?` are wrapped in a div with class `ost-date`
- Regular times show only the time element with class `ost-date`

Any matching text will be styled with the CSS class `.ost-date`. In Reading Mode the date/time will be displayed to the left of the document. For time-only formats, only the time portion is displayed while the full datetime is stored in the `datetime` attribute.

### Settings

Access the plugin settings to enable/disable specific datetime formats according to your needs. By default, the plugin recognizes:

- Date with colon (YYYY-MM-DD:)
- DateTime with colon (YYYY-MM-DD HH:MM:)
- Time-only formats (HH:MM, HH:MM:, HH:MM?)

## Development

### Deploying

- Update version in package.json, manifest.json, and versions.json
- Create release in Github
- Build app and attach `main.js`, `styles.css`, and `manifest.json` to release.

### Developing locally

1. `npm run dev`
2. `mv ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js.bak`
3. `mv ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json.bak`
4. `mv  ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css.bak`
5. `ln -s ~/Documents/Development/obsidian-simple-timeline/main.js ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js`
6. `ln -s ~/Documents/Development/obsidian-simple-timeline/manifest.json ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json`
7. `ln -s ~/Documents/Development/obsidian-simple-timeline/styles.css ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css`
8. Reload plugin in Obsidian

To revert:

1. `rm ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js`
2. `rm ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json`
3. `rm ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css`
4. `mv ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js.bak ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/main.js`
5. `mv ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json.bak ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/manifest.json`
6. `mv ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css.bak ~/Obsidian/Personal/.obsidian/plugins/obsidian-simple-timeline/styles.css`
