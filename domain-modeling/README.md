# pi-domain-modeling-skill

Build and sharpen a project's domain model, recording a glossary and ADRs as you go.

This package provides a `domain-modeling` skill that actively maintains a project's domain model: challenging terms, inventing edge-case scenarios, and writing the glossary (`CONTEXT.md`) and architectural decisions (`docs/adr/`) down the moment they crystallise.

## What it does

When invoked, the skill will:

- Challenge domain terms that conflict with the existing glossary
- Sharpen fuzzy or overloaded language into precise, canonical terms
- Stress-test domain relationships with concrete edge-case scenarios
- Cross-reference stated behavior with the actual code
- Update `CONTEXT.md` (or a per-context `CONTEXT.md` under a `CONTEXT-MAP.md`) inline as terms are resolved
- Offer to record an ADR when a decision is hard to reverse, surprising without context, and the result of a real trade-off

## Installation

`pi install npm:pi-domain-modeling-skill`

## Usage

Invoke the skill when pinning down domain terminology or a ubiquitous language, or recording an architectural decision:

```
/domain-modeling
```

Other skills (like `grill2docs`) depend on this skill to maintain the domain model during their sessions.

## License

Apache-2.0
