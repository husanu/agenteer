# Pi Coding Agent — Packages

How the Pi coding agent (`earendil-works/pi`, npm `@mariozechner/pi-coding-agent`,
docs at pi.dev) discovers and distributes extensions/skills — and how to add a
new one in this repo.

## 1. How it works

Pi has **no marketplace/catalog concept** like Claude Code or Codex. Instead:

- **Packages** bundle extensions, skills, prompt templates, and themes, declared
  via a `"pi"` key in `package.json` (or auto-discovered from conventional
  directories if no `"pi"` key is present).
- **Skills** use the exact same `skills/<name>/SKILL.md` convention as Claude
  Code and Codex — Pi's `skills` package field just points at a directory and
  recursively loads any `SKILL.md` it finds. This means a single `skills/`
  folder can be shared verbatim across all three agents; no Pi-specific code or
  content duplication is needed for skill-only plugins.
- **Extensions** are plain TypeScript/JavaScript modules (`.ts`/`.js`), needed
  only for packages that register custom tools, commands, or hooks — not
  required for packaging a skill.
- **Distribution** is package-based: `npm:@scope/pkg@1.0.0`, `git:host/user/repo@ref`,
  or a local path, installed via `pi install` (writes to `settings.json`'s
  `"packages"` array).

## 2. Package manifest: `package.json` `"pi"` key

```json
{
  "name": "my-pi-plugin",
  "version": "1.0.0",
  "keywords": ["pi-package"],
  "pi": {
    "skills": ["./skills"],
    "extensions": ["./extensions"],
    "prompts": ["./prompts"],
    "themes": ["./themes"]
  }
}
```

- Paths are relative to the package root (the directory containing this
  `package.json`), and each array supports globs and `!exclusions`.
- Include the `"pi-package"` keyword so the package shows up in the
  [package gallery](https://pi.dev/packages).
- Omit the `"pi"` key entirely and Pi auto-discovers from conventional
  directories instead: `extensions/`, `skills/` (recursively finds `SKILL.md`),
  `prompts/`, `themes/`.

## 3. Monorepo / shared-skill layout used in this repo

Since a plugin's `package.json` can live in any subdirectory and is only
resolved relative to itself, a plugin folder can be a normal npm package rooted
at `<plugin-name>/` inside this repo, independent of whatever else is at the
repo root:

```
<plugin-name>/
  skills/<plugin-name>/SKILL.md   # same file Claude Code and Codex use
  package.json                    # "pi": { "skills": ["./skills"] }
```

This `package.json` is published to npm directly from that subdirectory (e.g.
`npm publish` run inside `<plugin-name>/`) — there is no repo-wide Pi catalog
to wire up, unlike Claude Code/Codex.

## 4. Command reference

```bash
pi install npm:@scope/pkg@1.0.0
pi install git:host/user/repo@ref
pi install ./relative/path/to/package
pi remove npm:@scope/pkg
pi list                     # show installed packages
pi update --extensions      # update packages, reconcile pinned git refs
pi config                   # enable/disable individual skills/extensions/prompts/themes
```

## 5. Updating

- **npm-sourced packages**: `pi install npm:@scope/pkg@<new-version>` (versioned
  specs are pinned and skipped by `pi update`, so bumping the version is
  manual).
- **git-sourced packages**: refs are pinned tags/commits; `pi update --extensions`
  reconciles the local clone to the configured ref but does not move to a newer
  ref automatically — use `pi install git:host/user/repo@<new-ref>` to repoint.
- **Local-path packages**: update automatically whenever the files on disk
  change — no install/update step involved.

## 6. Adding a new skill to this repo

**If the skill is also shipped for Claude Code / Codex** (the common case in
this repo): reuse the same `<plugin-name>/skills/<plugin-name>/SKILL.md` those
plugins already have, and just add a `package.json` alongside it:

1. Create `<plugin-name>/package.json`:
   ```json
   {
     "name": "<npm-package-name>",
     "version": "1.0.0",
     "keywords": ["pi-package"],
     "pi": { "skills": ["./skills"] }
   }
   ```
2. Publish it: `cd <plugin-name> && npm publish`.
3. Consumers install with `pi install npm:<npm-package-name>`.

**Pi-only skill, no package needed for personal use:** drop
`.pi/extensions/<name>/` or a skill folder directly under a location `pi`
scans locally, per the [extensions docs](https://pi.dev/docs/latest/extensions) —
no manifest or publish step required.

## Sources

- https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md
- https://pi.dev/docs/latest/extensions
- https://pi.dev/docs/latest/packages
- https://github.com/earendil-works/pi
