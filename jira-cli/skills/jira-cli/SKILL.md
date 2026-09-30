---
name: jira-cli
description: >-
  This skill should be used when interacting with Jira from the command line via the `jira`
  CLI (ankitpokhrel/jira-cli) — listing, viewing, searching, creating, editing, transitioning,
  assigning, commenting on, or linking issues, and working with epics, sprints, boards, and
  projects. Triggers when the user asks to do Jira work in a terminal, mentions "jira-cli" /
  the `jira` command, or wants to script Jira operations non-interactively.
---

# jira-cli

Drive Atlassian Jira from the terminal with the `jira` CLI. This skill covers the
non-obvious parts of using it *as an agent*: staying non-interactive, producing
machine-readable output, and composing the common issue/epic/sprint workflows.

## The one rule that matters most

`jira` is built for humans and defaults to an **interactive TUI and prompts**. Running a
bare command like `jira issue list` or `jira issue create` will open a full-screen pager or
block on prompts, which hangs a non-interactive shell. **Always force non-interactive,
scriptable output:**

- `--plain` — render lists/views as plain text instead of the TUI pager. Use on every
  `list` and `view`.
- `--no-input` — never prompt; fail instead if a required field is missing. Use on every
  `create`, `edit`, `move`, `assign`, `comment add`.
- `--raw` — emit raw JSON (best when the output will be parsed).
- `--csv` — CSV output, handy for lists that feed a table.
- `--columns key,summary,status,assignee` — restrict `--plain` list columns.
- `--no-headers` — drop the header row when parsing plain/CSV output.

If a command still needs a field the user hasn't supplied and `--no-input` makes it fail,
ask the user for that value rather than dropping into interactive mode.

## Preflight: confirm it is installed and configured

Before running real commands, verify the environment in one cheap call:

```bash
jira me          # prints the current user's account; non-zero / error if unconfigured
```

- **Not installed** (`command not found`): point the user at the install docs
  (`brew install ankitpokhrel/jira-cli/jira-cli`, or see references/commands.md). Do not
  attempt to install it unprompted.
- **Not configured**: the config file lives at `~/.config/.jira/.config.yml` (override with
  `$JIRA_CONFIG_FILE` or `-c`). Setup runs through `jira init`, which is **interactive** and
  needs a `JIRA_API_TOKEN` (Cloud) or PAT/mTLS (on-prem). Do not try to run `jira init`
  yourself in a scripted shell — instead tell the user to run `jira init` themselves (they
  can use the `! jira init` prompt in this session) and to export their token first.

`jira me` also doubles as the current-user reference in filters, e.g. `-a$(jira me)`.

## Core workflows

Read `references/commands.md` for the full command surface, every flag, and JQL tips. The
high-frequency patterns:

```bash
# List — always --plain. Short flags take values with NO space: -s"To Do", -yHigh, -aName.
jira issue list --plain
jira issue list -s"In Progress" -a$(jira me) --created month --plain
jira issue list -q 'project = FOO AND labels = backend ORDER BY created DESC' --plain

# View a single issue
jira issue view FOO-123 --plain
jira issue view FOO-123 --comments 5 --plain

# Create (supply every field so --no-input succeeds; description can come via stdin/-b)
jira issue create -tBug -s"Login fails on Safari" -yHigh -lregression \
  -b"Steps: ..." --no-input
echo "Longer description body" | jira issue create -tTask -s"Summary" --no-input

# Edit / transition / assign / comment
jira issue edit FOO-123 -s"New summary" -yMedium --no-input
jira issue move FOO-123 "In Progress" --no-input
jira issue move FOO-123 Done -RFixed -a$(jira me) --no-input
jira issue assign FOO-123 "Jane Doe" --no-input
jira issue comment add FOO-123 "Deployed to staging" --no-input

# Relationships
jira issue link FOO-123 FOO-456 "blocks" --no-input
```

Epics, sprints, boards, projects, worklogs, and `jira open` are documented in
references/commands.md — the same non-interactive flags apply.

## Guardrails

- **Confirm destructive actions first.** `jira issue delete` (especially with `--cascade`)
  and bulk transitions are outward-facing and hard to reverse — describe what will happen
  and get an explicit go-ahead before running them.
- **`create`, `edit`, `move`, `comment` write to a live Jira.** Treat them like publishing:
  don't run them speculatively, and echo the resulting issue key/URL back to the user.
- Prefer one precise `-q` JQL query over fetching everything and filtering locally.
- When a project key is ambiguous, pass `-p KEY` rather than relying on the configured default.
