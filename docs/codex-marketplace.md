# Codex CLI Plugin Marketplace

How OpenAI's Codex CLI discovers, distributes, and installs plugins/skills — and
how to add a new one in this repo.

## 1. How it works

Codex has three related-but-distinct mechanisms. Only two matter for git-based
distribution in a shared repo:

- **Skills** — reusable packaged instructions, auto-discovered from
  `.agents/skills/`, scanned starting at the current working directory and
  walking up to the repo root. Meant to be checked into git; no manifest/catalog
  required to just *have* one in the repo.
- **Plugins** — the actual marketplace-style distribution system, closest analog
  to Claude Code's. A plugin has its own manifest (`.codex-plugin/plugin.json`);
  a separate **catalog file** at `.agents/plugins/marketplace.json` lists one or
  more plugins for `codex plugin` commands to discover and install.
- **Custom prompts** (deprecated) — markdown files under `~/.codex/prompts/*.md`.
  These are user-local only, not shareable via a repo — irrelevant for a
  marketplace.

MCP servers are registered separately via `codex mcp add` (a config command, not
a repo file format) and aren't part of the plugin/skill system.

## 2. Plugin catalog: `.agents/plugins/marketplace.json`

Repo-root location (or `~/.agents/plugins/marketplace.json` for a personal,
non-shared catalog):

```json
{
  "name": "agenteer",
  "plugins": [
    {
      "name": "my-plugin",
      "source": { "source": "local", "path": "../../my-plugin" }
    }
  ]
}
```

This repo uses `local` sources since each plugin's folder lives right at the
repo root alongside the catalog (path is relative to the catalog file, i.e.
`.agents/plugins/`, hence the `../..`). For a plugin whose code lives in a
different repo, use `git-subdir` instead.

`source.type` options:
- `local` — path relative to the catalog file
- `git-subdir` — `url` + `path` (subdirectory within that repo) + `ref` (branch/tag/SHA) — the option that lets plugin code live nested inside a monorepo instead of needing its own repo
- `npm` — an npm package

## 3. Plugin structure: `.codex-plugin/plugin.json`

Each plugin's source directory has its own manifest:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What it does",
  "skills": "./skills/"
}
```

Skills referenced by a plugin (or scanned directly from `.agents/skills/` for
repo-wide, non-plugin-packaged skills) each need a `SKILL.md`:

```
.agents/skills/my-skill/
  SKILL.md          # required
  scripts/          # optional
  references/       # optional
  assets/           # optional
  agents/openai.yaml  # optional, Codex-specific metadata
```

## 4. Command reference

```bash
codex plugin marketplace add owner/repo --ref main
codex plugin marketplace list
codex plugin install <plugin-name>
```

(Skills under `.agents/skills/` need no install step — Codex picks them up
automatically by walking up the directory tree from cwd.)

## 5. Updating

```bash
codex plugin marketplace upgrade [marketplace-name]   # refresh Git catalog (all if omitted)
codex plugin remove <plugin-name>                     # uninstall
codex plugin list [--json]                            # installed plugins + versions
```

- No separate `codex plugin update <name>` command. Marketplace entries pin a
  `ref` (branch/tag) rather than auto-resolving, so re-running
  `marketplace upgrade` is what pulls in new commits for plugins on that ref.
- npm-backed plugin sources support a semver `version`/range instead of a git
  `ref`.
- This command surface (`marketplace upgrade`) shipped recently — double-check
  exact flags via `codex plugin marketplace --help` before relying on them.

## 6. Adding a new plugin/skill to this repo

**For a skill** (packaged instructions, no code):
1. Create `.agents/skills/<skill-name>/SKILL.md` (with any `scripts/`,
   `references/`, `assets/` it needs).
2. Nothing else to register — Codex discovers it automatically when run from
   anywhere inside this repo.

**For a plugin** (packaged behavior with its own manifest):

Plugins in this repo are shared across Claude Code, Codex, and Pi: each plugin
lives in one `<plugin-name>/` folder at the repo root with a single `skills/`
directory, plus one manifest per agent pointing at that same folder (see the
repo README for the full layout).

1. Create `<plugin-name>/.codex-plugin/plugin.json` pointing `"skills"` at
   `<plugin-name>/skills/` (reuse the same `skills/` folder the Claude Code
   manifest uses — don't duplicate the `SKILL.md`).
2. Add an entry to `.agents/plugins/marketplace.json` at the repo root:
   ```json
   { "name": "<plugin-name>", "source": { "source": "local", "path": "../../<plugin-name>" } }
   ```
3. From a clean Codex session: `codex plugin marketplace add owner/agenteer --ref main`
   then `codex plugin install <plugin-name>` to smoke-test.

## Caveats

- The plugin/marketplace system is newer and less battle-tested than Claude
  Code's — double check current docs before relying on exact field names, since
  this area of Codex is evolving.
- Skills and plugins are separate systems: a skill alone needs no catalog entry;
  a plugin needs both `.codex-plugin/plugin.json` and a `marketplace.json` entry.

## Sources

- https://learn.chatgpt.com/docs/custom-prompts
- https://learn.chatgpt.com/docs/developer-commands?surface=cli
- https://learn.chatgpt.com/codex/build-skills
- https://learn.chatgpt.com/docs/build-plugins
