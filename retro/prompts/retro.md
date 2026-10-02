---
description: Run a retrospective on the current work
argument-hint: "[scope]"
---

End-of-session retro: based on what actually happened in this session, propose concrete
improvements to *this project* — anything that would make future coding-agent sessions on this
project use less context, fewer tool calls, and less time on the same class of problem. This is
about the project, not about me personally — skip anything that only makes sense as my personal
preference (that belongs in memory, not here).

**Do not limit yourself to docs.** Agent-facing docs (`CLAUDE.md`, `CONTEXT.md`, `.claude/skills/*`,
`.claude/commands/*`) are one lever, but so are: codebase structure (a file too large/tangled to
read economically, missing seams that force full-file reads), dev tooling (a faster/more precise
search than grep for this codebase — ast-grep, ctags, an LSP — a missing lint/format/build script,
slow test or build loops), and dependencies (a library that would remove a class of manual/error-prone
work). If something in this session made you think "a different tool or shape of code would have
made this trivial," that's exactly the kind of finding this command wants — surface it even if it's
unconventional or outside what you'd normally suggest unprompted.

## 1. Mine this session for waste
Look back over this session's actual tool calls and turns for concrete instances of:
- **Context burn**: files re-read multiple times, large dumps that could've been a targeted
  grep/read, exploration that repeated because nothing pointed to the answer.
- **Tool-call churn**: trial-and-error that took N tries to discover something stable (a flag, an
  env var, a host quirk, an auth requirement) — the kind of thing that's cheap to document and
  expensive to rediscover.
- **Time/turns spent on detours**: wrong assumptions that cost a round-trip, clarifying questions
  that could've been pre-answered by better docs, build/test commands that were slow, unclear, or
  needed a non-obvious flag.
- **Repeated manual workflow**: any multi-step sequence done by hand more than once that could be a
  script, a project-level skill, or a project-level slash command instead.
- **Fighting the codebase's shape**: a file or module big/tangled enough that reading it cost far
  more context than the change warranted; a search that had to be broad/fuzzy because nothing
  (naming, an index, a manifest, tags) narrowed it; logic duplicated across files that made a fix
  need to happen in N places instead of one.
- **Fighting the tooling**: a plain-text search (grep/ripgrep) standing in for something structural
  (an AST-aware search/rewrite, a language server's "find references/definition") that would have
  been both fewer tool calls and more correct; a build/test/lint loop slow enough that it shaped
  how carefully you dared to iterate; a missing dependency that would have replaced hand-rolled
  logic with a maintained one.

For each instance, note the concrete root cause — not "communication could be better" but the exact
fact, file, or missing capability behind it.

## 2. Filter to what's actually project-fixable
Drop anything that:
- Is a one-off task-specific judgment call (nothing to generalize).
- Was already documented and the session just failed to look — flag that as "read it, don't
  duplicate it" rather than adding a redundant note.
- Only benefits me personally (my habits, my tool preferences) rather than any agent working this
  project — that's a memory candidate, not a project edit; mention it separately, don't fold it in.
- Is genuinely external flakiness/one-time noise with no recurring pattern.

Keep only findings where a specific, concrete change would plausibly save real context/tool
calls/time on a *future, different* task — not just this exact one.

## 3. Propose specific, minimal changes
For each surviving finding, give:
- **What + where** — a doc edit (file + section), a new project-level skill/script/command, a code
  restructuring (name the file, its rough size/shape, the proposed seam to split it on), a tooling
  change (exact install/config, e.g. "add `ast-grep`/ctags/an LSP config so X no longer needs a
  full-file read"), or a dependency addition.
- **The exact change** — real text/commands/diff sketch, not a vague suggestion like "improve
  search" or "clean up this file."
- **Why** — the concrete tool-call/context/time cost this would have avoided, tied to what actually
  happened in this session.
- **Weight** — tag as *quick win* (doc/script edit, no new dependency, low risk) or *bigger ask*
  (new dependency, non-trivial refactor, tooling install) — this project's rules require
  justification + explicit approval for new dependencies, so call that out rather than bundling it
  with the quick wins.

Rank by expected payoff. If nothing survived step 2, say so plainly — do not manufacture busywork
edits just to have output.

## 4. Get approval, then apply narrowly
Present the ranked list and ask which to apply — do not edit checked-in files, install anything, or
add dependencies unprompted. On approval, make only the approved changes, each scoped to exactly
what was proposed (no drive-by rewrites, no extra "while I'm here" cleanup). Follow this project's
own conventions (naming, doc rules, dependency-approval rules) for how the change should look.
