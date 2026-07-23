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
claude plugin install <plugin-name>@agenteer
```

Keep it updated with `claude plugin marketplace update agenteer` followed by
`claude plugin update <plugin-name>@agenteer`.
</details>

<details>
<summary><strong>Codex CLI</strong></summary>

```bash
codex plugin marketplace add husanu/agenteer --ref main
codex plugin install <plugin-name>
```

Keep it updated with `codex plugin marketplace upgrade agenteer`.
</details>

<details>
<summary><strong>Pi coding agent</strong></summary>

Pi has no marketplace concept — each plugin below is published as its own
npm package:

```bash
pi install npm:<npm-package-name>
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
| Codex CLI | `codex plugin install grilling` |
| Pi | `pi install npm:pi-grilling-skill` |

## Contributing

Want to add or publish a plugin? See [CONTRIBUTING.md](CONTRIBUTING.md).
