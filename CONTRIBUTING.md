# Contributing

Notes for maintaining and extending this repo. If you just want to *use* a
plugin, see [README.md](README.md) instead.

## Layout

Each agent (Claude Code, Codex CLI, Pi) has its own plugin mechanism, but all
three discover skills from the same `skills/<name>/SKILL.md` convention. So
each plugin lives in a single `<plugin-name>/` folder with one shared
`skills/` directory, plus one manifest per agent pointing at it:

```
<plugin-name>/
  skills/<plugin-name>/SKILL.md   # shared by all three agents
  .claude-plugin/plugin.json      # Claude Code manifest ("skills": "./skills/")
  .codex-plugin/plugin.json       # Codex manifest ("skills": "./skills/")
  package.json                    # Pi manifest ("pi": {"skills": ["./skills"]}), publishable to npm
```

Catalog/manifest files live at distinct, non-colliding paths at the repo root,
so all three agents can discover plugins from this one repo:

| Agent | Catalog file | Plugin source |
|---|---|---|
| Claude Code | `.claude-plugin/marketplace.json` | `source: "./<plugin-name>"` |
| Codex CLI | `.agents/plugins/marketplace.json` | `source: { type: "local", path: "../../<plugin-name>" }` |
| Pi | no repo catalog — each plugin's own `package.json` is published to npm | `pi install npm:<package-name>` |

## Docs

- [Claude Code marketplace](docs/claude-code-marketplace.md) — marketplace/plugin schema, commands, how to add a plugin
- [Codex marketplace](docs/codex-marketplace.md) — skills vs. plugins, catalog schema, commands, how to add either
- [Pi packages](docs/pi-marketplace.md) — package model, native skill support, how to add a skill
- [Publishing checklist](docs/publishing.md) — steps to ship a new version of a plugin, or add a brand-new one

## Adding something new

Follow the [publishing checklist](docs/publishing.md), which covers creating
a plugin's `skills/` + manifests, wiring both root catalogs, validating,
smoke-testing, and publishing to npm for Pi.

## Makefile

`make list` / `make pack PKG=<name>` / `make publish PKG=<name>` — see the
[publishing checklist](docs/publishing.md) for the full flow.
