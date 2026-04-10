# Worktree Toggle — Comprehensive Test Plan

## Purpose

Validate the worktree toggle button behavior across all session creation surfaces. The toggle controls whether new Claude Code sessions are created in isolated git worktrees or on the current branch.

## Key Questions to Answer

1. Does the toggle correctly control whether a worktree is created?
2. Is the toggle state **global** (affects all new sessions) or **per-session** (only the next session)?
3. Does the toggle state persist across page reloads?
4. Does switching projects reset the override or carry it across?
5. Does the toggle correctly reflect the project-level default?
6. Do all session creation surfaces (Monitor, Sessions, Terminal) behave identically?

## Test Project

- **Path:** `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2`
- **Git:** Initialized with a single commit on `main`
- **Worktree mode:** Will be toggled on/off during tests

## Architecture Reference

The toggle modifies `state.sessionCommonOptions.useWorktree`:
- `''` (empty) = use project default
- `'on'` = force worktree creation
- `'off'` = suppress worktree creation

Server-side priority chain (`shouldCreateWorktree()`):
1. Per-request override (`req.body.useWorktree` = true/false) — **highest**
2. Per-project setting (`config.projectSettings[dir].worktreeEnabled`) — **medium**
3. Global default (`false` — worktrees are opt-in) — **lowest**

## Test Documents

| Document | Focus Area | Duration |
|----------|-----------|----------|
| [01-toggle-visual-states.md](01-toggle-visual-states.md) | Visual state cycling, CSS, tooltips | ~5 min |
| [02-project-default-behavior.md](02-project-default-behavior.md) | Toggle reflects project settings | ~5 min |
| [03-session-launch-with-worktree.md](03-session-launch-with-worktree.md) | Launch session with toggle ON, verify worktree created | ~10 min |
| [04-session-launch-without-worktree.md](04-session-launch-without-worktree.md) | Launch session with toggle OFF, verify no worktree | ~10 min |
| [05-scope-and-persistence.md](05-scope-and-persistence.md) | Global vs per-session, persistence, project switching | ~10 min |
| [06-cross-view-consistency.md](06-cross-view-consistency.md) | Monitor, Sessions, Terminal tab consistency | ~5 min |
| [07-edge-cases.md](07-edge-cases.md) | Rapid cycling, concurrent sessions, non-git projects | ~5 min |

## How to Execute

Each test document is self-contained with:
- **Preconditions** — required state before starting
- **Steps** — numbered actions to perform
- **Expected Results** — what should happen at each step
- **Pass/Fail Criteria** — clear success/failure definitions
- **Observations** — space to record actual results

Execute tests in order (01 through 07). Each test should start from a clean state as described in its preconditions.
