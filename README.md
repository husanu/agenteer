# Agenteer

A marketplace of skills for [Claude Code](https://claude.com/claude-code),
[Codex CLI](https://github.com/openai/codex), and the
[Pi coding agent](https://pi.dev) — pick your agent below, add the
marketplace once, then install whichever plugins you want.

## Setup

<details open>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add husanu/agenteer
claude plugin install <plugin-name>@agenteer  [--scope local|project|user]
```

Keep it updated with `claude plugin marketplace update agenteer` followed by
`claude plugin update <plugin-name>@agenteer`.
</details>

<details>
<summary><strong>Codex CLI</strong></summary>

```bash
codex plugin marketplace add husanu/agenteer --ref main
codex plugin add <plugin-name>@agenteer
```

No per project config in codex yet: [Repository-scoped marketplace and plugin configuration in project config](https://github.com/openai/codex/issues/18115)

Keep it updated with `codex plugin marketplace upgrade agenteer`.
</details>

<details>
<summary><strong>Pi coding agent</strong></summary>

Pi has no marketplace concept — each plugin below is published as its own
npm package:

```bash
pi install npm:<npm-package-name> [--local]
```
</details>

## Plugins

### grilling

Grill you relentlessly about a plan, decision, or idea — interviews you one
question at a time, walking down every branch of the decision tree, until you
reach a shared understanding. Won't act on the plan until you've confirmed it.

**Use it when** you want a design, plan, or idea stress-tested before
committing to it, or just say "grill me" / "grill this".

| Agent | Install command |
|---|---|
| Claude Code | `claude plugin install grilling@agenteer` |
| Codex CLI | `codex plugin add grilling@agenteer` |
| Pi | `pi install npm:pi-grilling-skill` |

### domain-modeling

Build and sharpen a project's domain model as you design — challenges fuzzy
terms, stress-tests domain relationships with edge-case scenarios, and writes
the glossary (`CONTEXT.md`) and architectural decisions (`docs/adr/`) down the
moment they crystallise.

**Use it when** you want to pin down domain terminology or a ubiquitous
language, or record an architectural decision.

| Agent | Install command |
|---|---|
| Claude Code | `claude plugin install domain-modeling@agenteer` |
| Codex CLI | `codex plugin add domain-modeling@agenteer` |
| Pi | `pi install npm:pi-domain-modeling-skill` |

### grill2docs

Grill you relentlessly about a plan or design, recording ADRs and a glossary
as you go — combines `grilling` and `domain-modeling` so the interview leaves
behind durable docs instead of just a conversation.

**Requires** the `grilling` and `domain-modeling` plugins to be installed
first — this skill is just the two of them combined.

**Use it when** you want a design grilled and captured as ADRs and a glossary
in the same session.

| Agent | Install command |
|---|---|
| Claude Code | `claude plugin install grill2docs@agenteer` |
| Codex CLI | `codex plugin add grill2docs@agenteer` |
| Pi | `pi install npm:pi-grill2docs-skill` |

### handoff

Compact the current conversation into a handoff document for another agent to
pick up — saved to your OS's temp directory, with a suggested-skills section
and sensitive info redacted.

**Use it when** you're wrapping up a session and want a fresh agent (or
yourself later) to pick up the work with full context.

| Agent | Install command |
|---|---|
| Claude Code | `claude plugin install handoff@agenteer` |
| Codex CLI | `codex plugin add handoff@agenteer` |
| Pi | `pi install npm:pi-handoff-skill` |

## Contributing

Want to add or publish a plugin? See [CONTRIBUTING.md](CONTRIBUTING.md).
