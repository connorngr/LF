---
name: map-features
description: Map a list of raw feature ideas (one per line) onto the LifeFrame Linear board (team Lifeframecn / LIF), dedupe against existing issues, then sync documentations/progress.md and documentations/today_scope.md and recommend an order. Use when the user pastes a list of features, ideas, todos or "things to map to the board".
---

# Map features to Linear

Input: a list where **each line is one feature**. Ignore blank lines.

## 1. Understand each line (cheap first)

For each line, before asking anything:
- Grep the codebase for the obvious anchor (route, component, env, model) so the ticket can name real files.
- Decide: **clear**, **clear with assumption**, or **unclear**.

Then ask **one** `AskUserQuestion` round covering only the unclear lines (max 4 questions; merge or assume the rest). Each option is a concrete interpretation the user can pick; put the most likely one first. Lines that are clear-with-assumption are not asked about — state the assumption in the ticket and in the final summary so the user can correct it.

Never ask about something the code or existing tickets already answer.

## 2. Dedupe against Linear

`list_issues` for team `Lifeframecn` (limit 100+, fields id/title/status/priority). Match each feature against **all** statuses:
- Open match (Backlog/Todo/In Progress) → update that issue (append the new context via `patch`, adjust priority/status) instead of creating.
- Done match → new issue only if it's a follow-up/regression; link with `relatedTo`.
- Canceled match → mention it; create a new issue `relatedTo` the old one only if the user still wants it.

## 3. Write to Linear

New issues: team `Lifeframecn`, title `LF-0NN: <Title>` (next number after the highest `LF-` in progress.md / Linear), status `Backlog` unless chosen as next focus (`Todo`). Description template:

```
## Why
<user's line verbatim> — <one-line intent>

## Scope
- [ ] ...

## Assumptions
- ...  (omit if none)

## Pointers
- `path/to/file.tsx` — why relevant
```

Gotcha: Linear rewrites `LIF-N` mentions in descriptions into `<issue …>` tags, so later `patch` anchors must not span an issue mention.

Priority: 1 Urgent (broken/security), 2 High (user-visible bug or next focus), 3 Medium (feature), 4 Low (nice-to-have/content).

## 4. Sync docs

`documentations/progress.md`:
- Add new/updated tickets to the right table (Next Up / Deferred / Still backlog), with Linear links `https://linear.app/lifeframecn/issue/LIF-N`.
- Add rows to **Random thoughts (mapped to Linear)** for each input line.
- Append a dated line under **Linear Sync** listing what was created/updated.
- Bump `Last updated`.

`documentations/today_scope.md`: only change if the recommended "go first" item differs from today's focus or is a bug/security item; otherwise just update the **Next / defer** table. Keep the existing structure and tone. Use today's date.

## 5. Report

End with a short table: input line → ticket (new/updated/existing) → priority. Then:
- **Go first:** 1–3 items with a one-line reason each (bugs and security before features; cheap wins before big builds).
- **Needs your judgement:** items where scope/priority is a product call.
- **Assumptions made:** so the user can correct them.
