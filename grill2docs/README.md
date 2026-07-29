# pi-grill2docs-skill

Grill the user relentlessly about a plan or design, recording ADRs and a glossary as you go.

This package provides a `grill2docs` skill that runs a `/grilling` session using the `/domain-modeling` skill, turning the interview into durable docs instead of just a conversation.

## What it does

When invoked, the skill will:

- Interview you about every aspect of the plan or design, one question at a time, using the same relentless approach as `/grilling`
- Capture decisions as they're made using `/domain-modeling`
- Produce ADRs and a glossary as output, rather than leaving the shared understanding only in the conversation

## Requirements

This skill is just a combination of `grilling` and `domain-modeling` — it does not work on its own. You must install both of those skills first:

`pi install npm:pi-grilling-skill npm:pi-domain-modeling-skill`

## Installation

`pi install npm:pi-grill2docs-skill`

## Usage

This skill does not auto-trigger on phrases (`disable-model-invocation: true`). Invoke it explicitly:

```
/grill2docs
```

## License

Apache-2.0
