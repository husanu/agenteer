# GitHub Copilot CLI Plugin Marketplace

How GitHub Copilot CLI discovers, distributes, and installs this repository's
shared skill plugins.

## 1. How it works

Copilot CLI plugins bundle skills and other agent extensions. This repository
uses the portable [Agent Plugins 1.0](https://agent-plugins.org) format:

- Each plugin has a root `plugin.json` manifest with the Agent Plugins schema.
- A plugin's skills live in immediate `skills/<skill-name>/SKILL.md`
  subdirectories. The existing shared `skills/` folders therefore work without
  copying skill content.
- The marketplace catalog lives at `.github/plugin/marketplace.json` and lists
  each top-level plugin directory relative to the repository root.

## 2. Install and update

Add the marketplace once:

```bash
copilot plugin marketplace add husanu/agenteer
copilot plugin marketplace browse agenteer
```

Install a plugin:

```bash
copilot plugin install <plugin-name>@agenteer
```

Refresh the catalog and update an installed plugin:

```bash
copilot plugin marketplace update agenteer
copilot plugin update <plugin-name>
```

Use `copilot plugin list` to see installed plugins and `copilot plugin
uninstall <plugin-name>` to remove one.

## 3. Marketplace catalog

Copilot CLI discovers a repository marketplace from
`.github/plugin/marketplace.json`. The catalog needs a marketplace name, owner,
and plugin list. A plugin entry points to its source relative to the repository
root:

```json
{
  "name": "agenteer",
  "owner": { "name": "Andrei Husanu", "email": "agenteer@egitr.com" },
  "metadata": {
    "description": "Productivity skills for GitHub Copilot CLI",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "What it does",
      "version": "1.0.0"
    }
  ]
}
```

## 4. Plugin structure

Each top-level plugin uses the root `plugin.json` manifest and the shared skill
layout:

```text
<plugin-name>/
  plugin.json
  skills/<plugin-name>/SKILL.md
```

Use the portable Agent Plugins 1.0 schema so skills remain compatible with
other supporting clients:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "my-plugin",
  "description": "What it does",
  "version": "1.0.0",
  "author": { "name": "Andrei Husanu", "email": "agenteer@egitr.com" },
  "license": "Apache-2.0"
}
```

The schema fixes the skill location at `skills/`; do not add a `skills` field
to this manifest.

## 5. Adding a new plugin

1. Create `<plugin-name>/skills/<plugin-name>/SKILL.md`.
2. Add `<plugin-name>/plugin.json` using the Agent Plugins 1.0 manifest above.
3. Register the plugin in `.github/plugin/marketplace.json` with its name,
   relative source path, description, and version.
4. Test it locally:
   ```bash
   copilot plugin install ./<plugin-name>
   copilot plugin list
   copilot plugin uninstall <plugin-name>
   ```

The same shared skills and plugin directory must also be registered in this
repository's Claude Code, Codex CLI, and Pi integration files. See
[CONTRIBUTING.md](../CONTRIBUTING.md) and the
[publishing checklist](publishing.md).

## Sources

- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-creating
- https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference
