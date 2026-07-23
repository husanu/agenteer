# Claude Code Plugin Marketplace

How Claude Code discovers, distributes, and installs plugins — and how to add a new one in this repo.

## 1. How it works

A **marketplace** is just a git repo (or subdirectory, or local path) containing a
catalog file at `.claude-plugin/marketplace.json`. The catalog lists one or more
**plugins**, each pointing at a `source` (a relative path, a git repo, a git
subdirectory, or an npm package).

Users add the marketplace once, then install any plugin listed in it:

```bash
claude plugin marketplace add owner/repo[@ref]      # GitHub shorthand, ref = branch/tag
claude plugin marketplace add https://gitlab.com/team/plugins.git
claude plugin marketplace add ./path/to/marketplace # local path
claude plugin install plugin-name@marketplace-name
```

A plugin, once installed, can contribute: skills, slash commands, subagents, hooks,
MCP servers, LSP servers, output styles, themes, and background monitors.

## 2. Marketplace catalog: `.claude-plugin/marketplace.json`

```json
{
  "name": "agenteer",
  "owner": { "name": "Andrei Husanu", "email": "agenteer@egitr.com" },
  "description": "Plugins for this repo's Claude Code workflows",
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "What it does",
      "version": "1.0.0",
      "category": "productivity"
    }
  ]
}
```

(`metadata.pluginRoot` is an optional field to prefix every relative `source`
with a shared base directory — this repo doesn't use it since each plugin's
`source` already points directly at its own top-level folder.)

Required fields: `name`, `owner`, `plugins`. Each plugin entry needs at least
`name` + `source`.

**Useful optional marketplace fields:**
- `metadata.pluginRoot` — base directory prepended to every relative `source` (lets
  you keep all plugin sources under one folder, e.g. `./claude`, instead of
  repeating the prefix in every entry).
- `renames` — map old plugin names to new names (or `null` to mark removed).
- `allowCrossMarketplaceDependenciesOn` — other marketplaces this one's plugins may
  depend on.

**Useful optional plugin-entry fields:** `displayName`, `description`, `version`
(omit to auto-version by git SHA), `author`, `homepage`, `repository`, `license`,
`keywords`, `category`, `tags`, `strict` (default `true`; set `false` if the
marketplace entry itself is the complete plugin definition, no separate
`plugin.json` needed), `defaultEnabled` (default `true`).

**`source` types:**

```json
"source": "./plugins/my-plugin"

"source": { "source": "github", "repo": "owner/repo", "ref": "v1.0" }

"source": { "source": "url", "url": "https://example.com/repo.git", "ref": "main" }

"source": { "source": "git-subdir", "url": "owner/repo", "path": "tools/my-plugin", "ref": "v1.0" }

"source": { "source": "npm", "package": "@scope/my-plugin", "version": "^2.0.0" }
```

`git-subdir` is the important one for monorepos: it lets a plugin's actual code
live in a subdirectory of a larger repo instead of requiring its own repo/branch.

## 3. Plugin structure

Each plugin's `source` directory can optionally have its own manifest at
`.claude-plugin/plugin.json` (paths inside it are relative to the plugin root,
*not* inside `.claude-plugin/`):

```json
{
  "name": "my-plugin",
  "description": "What it does",
  "version": "1.0.0",
  "author": { "name": "Andrei Husanu" },
  "skills": "./skills/",
  "agents": "./agents/",
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

If you skip `plugin.json` entirely (and set `"strict": false` in the marketplace
entry), Claude Code falls back to scanning conventional subdirectories:

| Path | Purpose |
|---|---|
| `skills/<name>/SKILL.md` | Skill, with YAML frontmatter (`description`, `disable-model-invocation`) — preferred over `commands/` for new plugins |
| `commands/*.md` | Flat slash-command files (deprecated in favor of `skills/`) |
| `agents/<name>.md` | Subagent definitions, YAML frontmatter |
| `hooks/hooks.json` | Hook configuration |
| `.mcp.json` | MCP server configs |
| `.lsp.json` | LSP server configs |
| `output-styles/<name>.md` | Output style templates |
| `bin/` | Executables added to `PATH` while the plugin is enabled |
| `settings.json` | Default settings applied when the plugin is enabled |

## 4. Command reference

```bash
# Marketplace
claude plugin marketplace add owner/repo[@ref]
claude plugin marketplace list [--json]
claude plugin marketplace update [marketplace-name]   # all if omitted
claude plugin marketplace remove <name> [--scope user|project|local]

# Plugins
claude plugin init <name> [--with skills hooks agents mcp lsp output-style]
claude plugin install plugin-name@marketplace [--scope user|project|local]
claude plugin uninstall plugin-name@marketplace [--prune] [--keep-data]
claude plugin enable|disable plugin-name@marketplace
claude plugin update plugin-name@marketplace
claude plugin list [--json] [--available] [--enabled|--disabled]
claude plugin details plugin-name@marketplace
claude plugin validate [path] [--strict]
```

## 5. Updating

Two-step model: refresh the catalog, then update the plugin.

```bash
claude plugin marketplace update [marketplace-name]   # re-fetch catalog (all if omitted)
claude plugin update plugin-name@marketplace          # update one installed plugin
```

- If a marketplace entry's `source` omits `version`/`sha`, the plugin
  auto-versions by git SHA — `plugin update` then just pulls the latest commit
  on the pinned `ref`.
- If `version`/`sha` is pinned explicitly in `marketplace.json`, updating the
  plugin means bumping that field in the catalog first, then re-running
  `marketplace update` + `plugin update`.

## 6. Adding a new plugin to this repo

Plugins in this repo are shared across Claude Code, Codex, and Pi: each plugin
lives in one `<plugin-name>/` folder with a single `skills/` directory, plus
one manifest per agent pointing at that same folder (see the repo README for
the full layout).

1. Create `<plugin-name>/skills/<plugin-name>/SKILL.md` and
   `<plugin-name>/.claude-plugin/plugin.json`:
   ```json
   { "name": "<plugin-name>", "description": "...", "version": "1.0.0", "skills": "./skills/" }
   ```
2. Add an entry to `.claude-plugin/marketplace.json` at the repo root:
   ```json
   { "name": "<plugin-name>", "source": "./<plugin-name>" }
   ```
3. Validate locally: `claude plugin validate ./<plugin-name> --strict`.
4. From a clean Claude Code session: `claude plugin marketplace update agenteer`
   then `claude plugin install <plugin-name>@agenteer` to smoke-test.

## Sources

- https://code.claude.com/docs/en/plugins.md
- https://code.claude.com/docs/en/plugins-reference.md
- https://code.claude.com/docs/en/plugin-marketplaces.md
- https://code.claude.com/docs/en/discover-plugins.md
