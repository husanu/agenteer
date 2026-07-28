# pi-handoff-skill

Compact the current conversation into a handoff document for another agent to pick up.

## What it does

When invoked, the skill will:

- Summarise the current conversation into a handoff document saved to your OS's temp directory
- Suggest skills the next agent should invoke
- Reference existing artifacts (specs, plans, ADRs, issues, commits, diffs) by path or URL instead of duplicating their content
- Redact sensitive information such as API keys, passwords, or personally identifiable information
- Tailor the document to any focus you describe for the next session

## Installation

`pi install npm:pi-handoff-skill`

## Usage

Trigger the skill, optionally describing what the next session will focus on:

```
/handoff Continue implementing the auth refactor
```

## License

Apache-2.0
