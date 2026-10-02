# Agenteer

Practical skills for coding agents. Pick the agent you use, add Agenteer, then
install the skills that fit your workflow.

## Choose your coding agent

| I use… | Start here | How packages are delivered |
|---|---|---|
| **Claude Code** | [Set up Claude Code](#claude-code) | Agenteer marketplace |
| **Codex CLI** | [Set up Codex CLI](#codex-cli) | Agenteer marketplace |
| **GitHub Copilot CLI** | [Set up GitHub Copilot CLI](#github-copilot-cli) | Agenteer marketplace |
| **Pi coding agent** | [Set up Pi](#pi-coding-agent) | Individual npm packages |

## Plugins at a glance

| Plugin | Add it when you want to… |
|---|---|
| [`grilling`](#grilling) | pressure-test a plan, decision, or idea before acting |
| [`domain-modeling`](#domain-modeling) | define a ubiquitous language and capture important architectural decisions |
| [`grill2docs`](#grill2docs) | turn a design interview into a glossary and ADRs |
| [`handoff`](#handoff) | leave a safe, useful handoff for the next session or agent |
| [`jira-cli`](#jira-cli) | work with Jira from the terminal without its interactive UI |
| [`retro`](#retro) | identify project improvements from session waste before ending work |

---

## Claude Code

**One-time setup** — add the marketplace:

```bash
claude plugin marketplace add husanu/agenteer
```

**Install the skills you use.** Add `--scope local`, `--scope project`, or
`--scope user` to any command when you need a specific installation scope.

| Plugin | Install | Use it to… |
|---|---|---|
| [`grilling`](#grilling) | `claude plugin install grilling@agenteer` | Stress-test a plan or idea |
| [`domain-modeling`](#domain-modeling) | `claude plugin install domain-modeling@agenteer` | Model a domain and write ADRs |
| [`grill2docs`](#grill2docs) | `claude plugin install grill2docs@agenteer`* | Grill a design and document it |
| [`handoff`](#handoff) | `claude plugin install handoff@agenteer` | Hand work to another session |
| [`jira-cli`](#jira-cli) | `claude plugin install jira-cli@agenteer`† | Work with Jira |
| [`retro`](#retro) | `claude plugin install retro@agenteer` | Identify project improvements from session waste |

\* `grill2docs` requires both `grilling` and `domain-modeling`; install those first.

† Requires the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) to be installed and configured with `jira init`.

**Keep it current:**

```bash
claude plugin marketplace update agenteer
claude plugin update <plugin-name>@agenteer
```

Need marketplace or scope details? See the [Claude Code setup reference](docs/claude-code-marketplace.md).

---

## Codex CLI

**One-time setup** — add the marketplace:

```bash
codex plugin marketplace add husanu/agenteer --ref main
```

**Install the skills you use:**

| Plugin | Install | Use it to… |
|---|---|---|
| [`grilling`](#grilling) | `codex plugin add grilling@agenteer` | Stress-test a plan or idea |
| [`domain-modeling`](#domain-modeling) | `codex plugin add domain-modeling@agenteer` | Model a domain and write ADRs |
| [`grill2docs`](#grill2docs) | `codex plugin add grill2docs@agenteer`* | Grill a design and document it |
| [`handoff`](#handoff) | `codex plugin add handoff@agenteer` | Hand work to another session |
| [`jira-cli`](#jira-cli) | `codex plugin add jira-cli@agenteer`† | Work with Jira |
| [`retro`](#retro) | `codex plugin add retro@agenteer` | Identify project improvements from session waste |

\* `grill2docs` requires both `grilling` and `domain-modeling`; install those first.

† Requires the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) to be installed and configured with `jira init`.

**Keep it current:**

```bash
codex plugin marketplace upgrade agenteer
```

See the [Codex CLI setup reference](docs/codex-marketplace.md) for marketplace and plugin details.

---

## GitHub Copilot CLI

**One-time setup** — add the marketplace:

```bash
copilot plugin marketplace add husanu/agenteer
```

**Install the skills you use:**

| Plugin | Install | Use it to… |
|---|---|---|
| [`grilling`](#grilling) | `copilot plugin install grilling@agenteer` | Stress-test a plan or idea |
| [`domain-modeling`](#domain-modeling) | `copilot plugin install domain-modeling@agenteer` | Model a domain and write ADRs |
| [`grill2docs`](#grill2docs) | `copilot plugin install grill2docs@agenteer`* | Grill a design and document it |
| [`handoff`](#handoff) | `copilot plugin install handoff@agenteer` | Hand work to another session |
| [`jira-cli`](#jira-cli) | `copilot plugin install jira-cli@agenteer`† | Work with Jira |
| [`retro`](#retro) | `copilot plugin install retro@agenteer` | Identify project improvements from session waste |

\* `grill2docs` requires both `grilling` and `domain-modeling`; install those first.

† Requires the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) to be installed and configured with `jira init`.

**Keep it current:**

```bash
copilot plugin marketplace update agenteer
copilot plugin update <plugin-name>
```

See the [GitHub Copilot CLI setup reference](docs/copilot-cli-marketplace.md) for marketplace and plugin details.

---

## Pi coding agent

Pi does not use a marketplace. Install each package directly from npm; add
`--local` when it should be available only in the current project.

| Plugin | Install | Use it to… |
|---|---|---|
| [`grilling`](#grilling) | `pi install npm:pi-grilling-skill` | Stress-test a plan or idea |
| [`domain-modeling`](#domain-modeling) | `pi install npm:pi-domain-modeling-skill` | Model a domain and write ADRs |
| [`grill2docs`](#grill2docs) | `pi install npm:pi-grill2docs-skill`* | Grill a design and document it |
| [`handoff`](#handoff) | `pi install npm:pi-handoff-skill` | Hand work to another session |
| [`jira-cli`](#jira-cli) | `pi install npm:pi-jira-cli-skill`† | Work with Jira |
| [`retro`](#retro) | `pi install npm:pi-retro-prompt` | Identify project improvements from session waste |

\* `grill2docs` requires both `grilling` and `domain-modeling`; install those first.

† Requires the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli) to be installed and configured with `jira init`.

**Manage installed skills:**

```bash
pi list
pi config
```

See the [Pi package reference](docs/pi-marketplace.md) for installation sources and update behavior.

---

## What each plugin does

### [grilling](grilling/README.md)

Interviews you one question at a time to uncover assumptions, dependencies, and
trade-offs in a plan or decision. It will not act until you confirm a shared
understanding. Say “grill me” or “grill this”.

### [domain-modeling](domain-modeling/README.md)

Challenges fuzzy domain terms, tests relationships with edge cases, and records
the resulting glossary in `CONTEXT.md` and decisions in `docs/adr/`.

### [grill2docs](grill2docs/README.md)

Combines `grilling` and `domain-modeling` so a design interview leaves behind a
glossary and ADRs. Install its two dependencies first, then invoke
`/grill2docs`.

### [handoff](handoff/README.md)

Compacts the current conversation into a redacted handoff document in your OS
temp directory, with relevant artifacts and suggested skills for the next
agent.

### [jira-cli](jira-cli/README.md)

Teaches your agent to use the [`jira` CLI](https://github.com/ankitpokhrel/jira-cli)
safely and non-interactively for searching, creating, editing, transitioning,
assigning, commenting on, and linking issues.

### [retro](retro/README.md)

Reviews the current session for avoidable context burn, tool-call churn, and
time-consuming detours; then ranks concrete project improvements and waits for
approval before applying any.

## Contributing

Want to add or publish a skill? Read [CONTRIBUTING.md](CONTRIBUTING.md).
