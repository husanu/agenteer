---
name: auto-recap
description: Keep an individual developer oriented after nontrivial coding-agent work. Use for every complex coding, debugging, research, or repository task so the final response is an automatic, skimmable completion recap rather than a verbose report.
---

# Completion recap

The user may return after a long period without reading the intervening tool output. When a coherent, user-requested task reaches a terminal state, make your normal final response a concise re-entry brief. Do this automatically; do not wait for a `recap` command and do not use elapsed time as the trigger.

## When to use it

Use the recap when the task was nontrivial: it involved multiple tool calls, meaningful analysis or decisions, or substantive code/configuration/documentation changes. A terminal state is successful completion, a blocker that prevents further progress, or a failure.

Do not add a recap after a trivial lookup, a single simple edit, or every intermediate tool call. Do not emit a separate verbose report and then a recap: the recap is the final response.

## Required format

Start exactly with `## Auto Recap`. Keep a normal recap to 180 words or fewer and six bullets or fewer. Include only information that helps the user decide what to do next:

- **Goal:** the original issue to solve or outcome requested, in one sentence.
- **Result:** one sentence, clearly labeled `Done`, `Blocked`, or `Failed`.
- **Work:** the important work performed and changed file paths, if any.
- **Validation:** commands/checks run and their outcome. State `Not run` with a reason when applicable.
- **Notes:** only material decisions, caveats, or remaining risk.
- **Next:** the exact next action, or `None` when no action is needed.

Use `N/A` rather than inventing a section's contents. Be factual and specific; distinguish completed work from a proposal.

For a blocked or failed task, say what you tried and why progress stopped. End with exactly one concrete, actionable question when user input is required; otherwise propose the next step.

If the user explicitly asks for a detailed report, provide the same recap first, then the requested relevant detail. Do not expose private reasoning; provide concise decision rationale instead.
