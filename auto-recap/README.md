# pi-auto-recap-skill

A reusable skill that keeps developers oriented after substantial coding-agent
work by ending with a concise, skimmable recap.

## Installation

```bash
pi install npm:pi-auto-recap-skill
```

For local development:

```bash
pi install ./auto-recap
```

## Usage

The skill directs an agent to produce a recap automatically when a nontrivial
task reaches a terminal state. It does not add recaps to trivial lookups or
intermediate progress updates.

## Development

The skill is defined by
[`skills/auto-recap/SKILL.md`](skills/auto-recap/SKILL.md).

## License

Apache-2.0
