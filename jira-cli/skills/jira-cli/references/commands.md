# jira-cli command reference

Full surface of the `jira` CLI (ankitpokhrel/jira-cli). SKILL.md covers the essential
non-interactive workflow; this file is the lookup for less common commands and every flag.

Search this file for a command group (`issue`, `epic`, `sprint`, `board`, `project`,
`release`, `open`, `me`, `serverinfo`, `completion`) to jump to the relevant section.

## Install & version

```bash
brew install ankitpokhrel/jira-cli/jira-cli    # macOS / Linux (Homebrew)
# or: download a binary from https://github.com/ankitpokhrel/jira-cli/releases
# or: docker run ghcr.io/ankitpokhrel/jira-cli jira ...
jira version
```

## Config & auth

- Config file: `~/.config/.jira/.config.yml`. Override with `$JIRA_CONFIG_FILE` or the
  global `-c/--config <path>` flag — this is how multiple Jira instances are managed.
- `jira init` — interactive setup wizard. Choose **Cloud** or **Local** (on-prem), the
  project, and board. Requires a token in the environment before it runs.
- **Cloud auth**: create an API token, then `export JIRA_API_TOKEN=<token>`. The login
  email goes in the config.
- **On-prem auth**: pick during `jira init` — `basic`, `bearer` (Personal Access Token), or
  `mtls` (client cert). Bearer/PAT is the usual on-prem choice; the token still goes in
  `JIRA_API_TOKEN`.
- Token can also live in `.netrc` or the OS keychain instead of the env var.

## Global flags (available on most commands)

| Flag | Meaning |
|---|---|
| `-p, --project KEY` | Target project (overrides configured default) |
| `-c, --config PATH` | Use an alternate config file |
| `--plain` | Plain-text output, no interactive TUI/pager |
| `--no-input` | Never prompt; fail on missing required fields |
| `--raw` | Raw JSON output |
| `--csv` | CSV output |
| `--columns a,b,c` | Restrict displayed columns (with `--plain`/`--csv`) |
| `--no-headers` | Omit the header row |
| `--paginate S:L` | Paginate results (start:limit) |
| `--debug` | Verbose/debug logging |

Note on short flags: values attach with **no space** — `-s"To Do"`, `-yHigh`, `-ajdoe`,
`-lbug`, `-tBug`, `-PEPIC-1`.

## issue

### issue list — search & filter

```bash
jira issue list --plain
jira issue list --history                 # recently viewed
jira issue list --watching                # issues you watch
jira issue list -a$(jira me) --created -7d # assigned to me, created last 7 days
jira issue list -s"In Progress" -yHigh -lbackend -tStory --plain
jira issue list --status Done --resolution Fixed --plain
jira issue list --order-by created --reverse --plain
jira issue list -q 'sprint in openSprints() AND assignee = currentUser()' --plain
```

Filter flags: `-s/--status`, `-y/--priority`, `-a/--assignee`, `-r/--reporter`,
`-l/--label` (repeatable), `-t/--type`, `-C/--component`, `--resolution`,
`--created`/`--updated` (accept `week`, `month`, `-7d`, `2023-01-01` etc.),
`--created-after`/`--created-before`/`--updated-after`/`--updated-before`,
`-q/--jql` (raw JQL — overrides most other filters),
`--order-by`, `--reverse`, `--paginate`.

### issue view

```bash
jira issue view FOO-123 --plain
jira issue view FOO-123 --comments 10 --plain   # include N recent comments
jira issue view FOO-123 --raw                    # full JSON
```

### issue create

```bash
jira issue create -tBug -s"Summary" -yHigh -lregression -b"Body text" --no-input
jira issue create -tStory -s"Story summary" -PEPIC-42 --no-input   # attach to epic
echo "Body from stdin" | jira issue create -tTask -s"Summary" --no-input
jira issue create -tTask -s"Summary" --template /path/body.tmpl --no-input
jira issue create ... --custom story-points=5 --no-input           # custom field
```

Flags: `-t/--type`, `-s/--summary`, `-b/--body`, `-y/--priority`, `-l/--label`,
`-C/--component`, `-a/--assignee`, `-P/--parent` (epic/parent key), `--custom name=value`,
`--template FILE`, `--web` (open in browser after), `--no-input`.

### issue edit

```bash
jira issue edit FOO-123 -s"New summary" -yMedium -b"New body" --no-input
jira issue edit FOO-123 --label add-me --label remove:old --no-input
```

Same field flags as create. Labels/components support `remove:<value>` to detach.

### issue move (transition)

```bash
jira issue move FOO-123 "In Progress" --no-input
jira issue move FOO-123 Done -RFixed --no-input            # -R sets resolution
jira issue move FOO-123 Done -a$(jira me) --comment "done" --no-input
```

State name must match a valid transition from the issue's current status.

### issue assign

```bash
jira issue assign FOO-123 "Jane Doe" --no-input
jira issue assign FOO-123 $(jira me) --no-input
jira issue assign FOO-123 x --no-input        # 'x' / 'default' unassigns
```

### issue comment add

```bash
jira issue comment add FOO-123 "My comment (Markdown supported)" --no-input
echo "Comment body" | jira issue comment add FOO-123 --no-input
jira issue comment add FOO-123 --template /path/comment.tmpl --no-input
```

### issue link / unlink

```bash
jira issue link FOO-123 FOO-456 "blocks" --no-input       # link type is required
jira issue unlink FOO-123 FOO-456
jira issue link --help    # list valid link types for your instance
```

### issue worklog add

```bash
jira issue worklog add FOO-123 "2h" --comment "Investigation" --no-input
jira issue worklog add FOO-123 "1d 3h 30m" --started "2024-01-15 09:00:00" --no-input
```

### issue clone / delete

```bash
jira issue clone FOO-123 -s"New summary override" --no-input
jira issue clone FOO-123 --replace "old text:new text" --no-input
jira issue delete FOO-123               # DESTRUCTIVE — confirm with the user first
jira issue delete FOO-123 --cascade     # also deletes subtasks — extra caution
```

## epic

```bash
jira epic list --plain              # list epics (explorer view without --plain)
jira epic list --table --plain      # flat table of epics
jira epic list EPIC-1 --plain       # issues under an epic
jira epic create -n"Epic name" -s"Summary" -yHigh --no-input   # -n is the epic name
jira epic add EPIC-1 FOO-1 FOO-2 FOO-3 --no-input              # up to 50 issues
jira epic remove FOO-1 FOO-2 --no-input
```

## sprint

```bash
jira sprint list --plain
jira sprint list --current --plain            # active sprint's issues
jira sprint list --prev --plain               # previous sprint
jira sprint list --next --plain               # next/future sprint
jira sprint list --table --plain              # list sprints instead of their issues
jira sprint list SPRINT_ID --plain            # issues in a specific sprint
jira sprint add SPRINT_ID FOO-1 FOO-2 --no-input   # add up to 50 issues
```

Sprint list accepts the same issue filter flags as `issue list`.

## board / project / release

```bash
jira board list --plain
jira project list --plain
jira release list --plain           # project versions/releases
```

## open / me / misc

```bash
jira open              # open the configured project's board in a browser
jira open FOO-123      # open a specific issue in a browser
jira me                # current user's account id/email — also a preflight check
jira serverinfo        # Jira instance/server info
jira completion zsh    # shell completion script (bash|zsh|fish|powershell)
```

## JQL tips

`-q/--jql` takes raw JQL and is the most reliable way to express complex filters:

```bash
jira issue list -q 'project = FOO AND status != Done AND assignee = currentUser() ORDER BY updated DESC' --plain
jira issue list -q 'labels in (a, b) AND created >= -14d' --plain
jira issue list -q 'sprint in openSprints() AND type = Bug' --plain
```

Useful JQL functions: `currentUser()`, `openSprints()`, `startOfWeek()`, `endOfMonth()`,
`membersOf("group")`. Combine with `--columns` and `--csv`/`--raw` for machine-readable output.
