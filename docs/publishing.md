# Publishing Checklist

Steps to publish a new version of an existing plugin, or add a brand-new
plugin, to this repo. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the
overall layout and the per-agent docs for background on each catalog format.

## A. Publishing a new version of an existing plugin

1. Make your content/code changes inside `<plugin-name>/`.
2. Bump the version number in all three manifests so they stay in sync:
   - `<plugin-name>/package.json` (`"version"`)
   - `<plugin-name>/.claude-plugin/plugin.json` (`"version"`)
   - `<plugin-name>/.codex-plugin/plugin.json` (`"version"`)
3. Validate the Claude Code manifest: `claude plugin validate ./<plugin-name> --strict`
4. Sanity-check the npm tarball contents before publishing:
   ```bash
   make pack PKG=<plugin-name>
   tar tzf <plugin-name>/*.tgz   # confirm only the intended files are in it
   make clean                    # remove the local tarball
   ```
5. Publish to npm (this is what Pi installs from):
   ```bash
   make publish PKG=<plugin-name>
   ```
   Requires `npm whoami` to show you're logged in with publish rights to that
   package name/scope (`npm login` if not).
6. Commit and push. Claude Code and Codex don't read the `version` field to
   decide what to install — they track the pinned git ref, so pushing the
   commit is what makes the update available to them.
7. Tell/remind consumers how to pick up the update:
   - **Claude Code**: `claude plugin marketplace update agenteer && claude plugin update <plugin-name>@agenteer`
   - **Codex**: `codex plugin marketplace upgrade agenteer` (no per-plugin update command — this re-pulls everything on the pinned ref)
   - **Pi**: `pi install npm:<npm-package-name>@<new-version>` (npm-sourced packages are version-pinned; `pi update --extensions` won't move to a newer version on its own)

## B. Adding a brand-new plugin

1. Create the skill content:
   ```
   <plugin-name>/skills/<plugin-name>/SKILL.md
   ```
   with the usual frontmatter (`name`, `description`).
2. Create the three manifests inside `<plugin-name>/`, all pointing at the
   same `skills/` folder — don't duplicate `SKILL.md`:
   - `.claude-plugin/plugin.json` — `{ "name", "description", "version", "author", "skills": "./skills/" }`
   - `.codex-plugin/plugin.json` — `{ "name", "version", "description", "skills": "./skills/" }`
   - `package.json` — `{ "name": "<unique-npm-name>", "version", "keywords": ["pi-package"], "pi": { "skills": ["./skills"] } }`
     Pick a unique, unclaimed npm name (check with `npm view <name>` — a 404 means it's free).
3. Register the plugin in both root catalogs:
   - `.claude-plugin/marketplace.json` — add `{ "name": "<plugin-name>", "source": "./<plugin-name>", "description": "...", "category": "..." }`
   - `.agents/plugins/marketplace.json` — add `{ "name": "<plugin-name>", "source": { "type": "local", "path": "../../<plugin-name>" } }`
4. Validate: `claude plugin validate ./<plugin-name> --strict`
5. Smoke-test locally, then clean up the test install:
   ```bash
   claude plugin marketplace add ./
   claude plugin install <plugin-name>@agenteer
   # ... try it out ...
   claude plugin uninstall <plugin-name>@agenteer
   claude plugin marketplace remove agenteer
   ```
6. Confirm `make list` picks up the new package, then publish it to npm:
   ```bash
   make pack PKG=<plugin-name>     # inspect the tarball first
   make publish PKG=<plugin-name>
   ```
7. Commit and push everything (`<plugin-name>/`, both marketplace catalog
   edits) in one commit.
