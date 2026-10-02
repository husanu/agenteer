# pi-retro-prompt

A reusable Pi prompt template that adds the `/retro` command for finding
project-level improvements from wasted context, tool calls, and time in the
current session.

## Installation

```bash
pi install npm:pi-retro-prompt
```

For local development:

```bash
pi install ./retro
```

## Usage

```text
/retro
```

The command mines the current session for avoidable work, filters for changes
that benefit future agents on the project, ranks concrete proposals, and asks
for approval before making any edits.

## Development

The command is defined by [`prompts/retro.md`](prompts/retro.md). Its filename
is the command name; edit that file and run `/reload` in an active Pi session
to pick up changes.

## License

Apache-2.0
