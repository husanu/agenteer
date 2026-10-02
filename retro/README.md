# pi-retro-prompt

A reusable Pi prompt template that adds the `/retro` command for facilitating a
concise retrospective of the current work.

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
/retro "the authentication migration"
```

The optional argument narrows the retrospective's scope.

## Development

The command is defined by [`prompts/retro.md`](prompts/retro.md). Its filename
is the command name; edit that file and run `/reload` in an active Pi session
to pick up changes.

## License

Apache-2.0
