# pi-retro-skill

A reusable Pi skill for finding project-level improvements from wasted context,
tool calls, and time in the current session. Invoke it at the end of a long
coding-agent session, while the session's tool calls and detours are still
available as evidence.

## Installation

```bash
pi install npm:pi-retro-skill
```

For local development:

```bash
pi install ./retro
```

## Usage

Invoke the `retro` skill explicitly:

```text
/skill:retro
```

The skill mines the current session for avoidable work, filters for changes
that benefit future agents on the project, ranks concrete proposals, and asks
for approval before making any edits. It is not automatically model-invoked.

## Development

The skill is defined by [`skills/retro/SKILL.md`](skills/retro/SKILL.md). Edit
that file and run `/reload` in an active Pi session to pick up changes.

## License

Apache-2.0
