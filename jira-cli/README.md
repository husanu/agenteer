# pi-jira-cli-skill

Drive Atlassian Jira from the terminal with the
[`jira` CLI](https://github.com/ankitpokhrel/jira-cli).

## What it does

Teaches the agent to use `jira` effectively and safely:

- Runs everything **non-interactively** (`--plain`, `--no-input`, `--raw`, `--csv`) so the
  CLI never drops into its TUI or blocks on prompts
- Preflights that `jira` is installed and configured before running real commands
- Covers the common workflows — list/search (incl. raw JQL), view, create, edit, transition,
  assign, comment, link — plus epics, sprints, boards, projects, and worklogs
- Guards destructive operations (`delete`, `--cascade`) and live writes behind explicit
  confirmation
- Ships a full command/flag reference in `references/commands.md`

It does **not** install or configure `jira` for you — `jira init` is interactive and needs
your API token / PAT, so run it yourself first.

## Installation

`pi install npm:pi-jira-cli-skill`

## Usage

Just ask for Jira work in a terminal context, e.g.:

```
List my in-progress bugs in the FOO project
Create a bug in FOO titled "Login fails on Safari" and assign it to me
Move FOO-123 to Done and add a comment
```

## License

Apache-2.0
