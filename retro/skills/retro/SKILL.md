---
name: retro
description: Identify project improvements from this session's wasted context, tool calls, and time.
disable-model-invocation: true
---

Review this session's conversation and tool history, then propose project-level changes that would
help future coding-agent sessions use less context, fewer tool calls, and less time. This concerns
the project, not personal preferences.

If arguments were supplied with the invocation, use them as optional context for prioritization;
do not treat them as a substitute for session evidence or as permission to ignore stronger findings.

First mine the actual session for friction, wasted effort, missed leverage, and recurring sources of
agent difficulty. Look anywhere in the project; do not restrict yourself to documentation. Inspect
the repository only as needed to validate a candidate. Do not infer problems from generic best
practices or repository state alone. Distinguish observed session evidence from inferred root
causes, and state uncertainty where the cause is not directly established. If session history is
unavailable, say so and do not invent findings.

Keep only findings that:
- are supported by concrete session evidence;
- have a project-level, fixable root cause;
- could help with a different future task; and
- have a concrete change with a plausible payoff.

Discard one-off judgments, personal preferences, and external noise. If guidance already exists
and was merely overlooked, do not duplicate it; if it was difficult to discover or apply, treat
that discoverability problem as a potential project finding. Prefer high-leverage findings;
non-obvious findings are valuable only when supported by evidence.

Return no more than five findings, preferably fewer, ranked by expected net gain: prioritize the
largest likely reduction in future context, tool calls, or time relative to implementation effort
and confidence. Number each finding so the user can identify selections unambiguously. Merge
findings with the same root cause. For each finding, explain what happened, the underlying
project problem, the proposed improvement and where it belongs, why it would help future work,
and its relative effort and confidence. Call out dependency additions or other substantial changes
explicitly. If nothing actionable survives, say so plainly.

Do not edit files, install dependencies, or make other changes before approval. Present the ranked
findings and ask which ones to apply. After approval, make only the selected changes, follow the
project's conventions, inspect the diff, run focused validation, and report the changed files and
results.
