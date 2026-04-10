# Test Orchestration Guide

## Overview

This document guides the orchestrating agent through executing the 7 worktree toggle test documents. Each test is run by a subagent using Electron MCP tools to interact with the CC Watcher dashboard. The orchestrator manages sequencing, captures results, and tracks progress.

## Environment

| Item | Value |
|------|-------|
| **Test project** | `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2` |
| **Dashboard server** | `http://localhost:3456` |
| **Server code** | `/Users/kevinrabb/Documents/Dev/Exordium/vigil/.cc-watcher-worktrees/core/wt-1c0cdb19-tda1k1-5xpy` |
| **Electron MCP tools** | `mcp__cc-watcher-devtools__electron_*` (NOT chrome tools) |
| **Test docs** | `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2/tests/` |

## Pre-flight Checklist

Before starting any test execution:

- [ ] Server is running on port 3456 (`curl -s http://localhost:3456/api/health`)
- [ ] Electron app is open and connected
- [ ] Test_Worktrees_2 is a git repo with at least one commit
- [ ] Test_Worktrees_2 appears as a project in the dashboard sidebar
- [ ] No active sessions running for Test_Worktrees_2
- [ ] `useWorktree` session option is at default (`''`) — verify via: `electron_exec` → `JSON.parse(localStorage.getItem('cc-watcher-session-options'))?.common?.useWorktree`
- [ ] Worktree mode is DISABLED for Test_Worktrees_2 initially (tests will enable/disable it as needed)

## Execution Order

Tests MUST run in order. Each test may depend on state established by prior tests.

| Phase | Tests | Strategy | Notes |
|-------|-------|----------|-------|
| **Phase 1: Visual** | 01, 02 | Sequential subagents | Pure UI verification, no session launches |
| **Phase 2: Launch** | 03, 04 | Sequential subagents | Actually creates sessions + worktrees. Destructive. |
| **Phase 3: Behavior** | 05, 06 | Sequential subagents | Tests scope, persistence, cross-view sync |
| **Phase 4: Edge** | 07 | Single subagent | Stress tests and unusual scenarios |

## How to Run Each Test

### Subagent Setup

For each test, spawn an Opus 4.6 subagent with `subagent_type: "Explore"` (read-only tests) or no subagent_type (tests that need to click/interact). Include in the prompt:

1. **The test document** — Read it from `tests/0N-*.md`
2. **The MCP tools available** — `electron_agent_mode`, `electron_screenshot`, `electron_navigate`, `electron_click`, `electron_dom_query`, `electron_exec`, `electron_window`, `electron_check_errors`
3. **The project path** — `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2`
4. **The current state** — What worktree mode is set to, what the toggle override is, how many sessions exist

### Subagent Prompt Template

```
You are executing a test plan for the CC Watcher worktree toggle feature.

**Test document:** Read `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2/tests/0N-<name>.md`

**Current state:**
- Project: Test_Worktrees_2 at /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2
- Worktree mode: [ENABLED/DISABLED] for this project
- Toggle override: [default/on/off]
- Active sessions: [count]
- Existing worktrees: [count]

**Instructions:**
1. Activate agent indicator (`electron_agent_mode active: true`)
2. Navigate to the appropriate tab
3. Execute each numbered test step
4. For each step, verify ALL expected results using DOM queries, screenshots, exec, and bash commands
5. Record PASS/FAIL for each checkbox item
6. Take screenshots at key moments (state changes, visual verification)
7. Deactivate agent indicator when done

**Report format:**
For each test step (e.g., 1.1, 1.2), report:
- Status: PASS / FAIL / SKIP
- Evidence: DOM query results, screenshot paths, command outputs
- Issues: Any unexpected behavior or deviations from expected results
- Notes: Observations about UX, timing, visual quality

At the end, provide a summary table of all steps with pass/fail status.
```

### Between Tests: State Reset

After each test completes, the orchestrator should:

1. **Record results** — Update the results tracker (below)
2. **Reset state if needed** — The next test's preconditions may require:
   - Resetting toggle to default: `electron_exec` → set localStorage, reload
   - Enabling/disabling worktree mode: API call to `PUT /api/config`
   - Cleaning up sessions: wait for them to end or use `electron_exec`
   - Cleaning up worktrees: `git worktree remove` commands
3. **Verify preconditions** — Before spawning the next subagent, verify the preconditions listed in the next test document

### API Helpers for State Management

```bash
# Check current worktree mode for the project
curl -s http://localhost:3456/api/config | jq '.projectSettings["/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2"].worktreeEnabled'

# Enable worktree mode
curl -s -X PUT http://localhost:3456/api/config \
  -H 'Content-Type: application/json' \
  -d '{"projectSettings": {"/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2": {"worktreeEnabled": true}}}'

# Disable worktree mode
curl -s -X PUT http://localhost:3456/api/config \
  -H 'Content-Type: application/json' \
  -d '{"projectSettings": {"/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2": {"worktreeEnabled": false}}}'

# List worktrees
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list

# Remove a worktree
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree remove <path>

# Check toggle state in localStorage
# (via electron_exec):
# JSON.parse(localStorage.getItem('cc-watcher-session-options'))?.common?.useWorktree

# Reset toggle to default
# (via electron_exec):
# const opts = JSON.parse(localStorage.getItem('cc-watcher-session-options') || '{}');
# if (opts.common) opts.common.useWorktree = '';
# localStorage.setItem('cc-watcher-session-options', JSON.stringify(opts));
# Then reload the page.
```

## Results Tracker

Update this table as tests are executed:

| Test | Status | Pass | Fail | Skip | Critical Findings |
|------|--------|------|------|------|-------------------|
| 01 — Visual States | Not started | — | — | — | |
| 02 — Project Defaults | Not started | — | — | — | |
| 03 — Launch WITH WT | Not started | — | — | — | |
| 04 — Launch WITHOUT WT | Not started | — | — | — | |
| 05 — Scope & Persistence | Not started | — | — | — | |
| 06 — Cross-View | Not started | — | — | — | |
| 07 — Edge Cases | Not started | — | — | — | |

## Cleanup After All Tests

Once all tests are complete:

1. Remove all worktrees created during testing:
   ```bash
   git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
   # For each non-main worktree:
   git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree remove <path> --force
   git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree prune
   ```

2. Reset toggle to default via electron_exec

3. Optionally disable worktree mode for Test_Worktrees_2

4. Write final test report to `tests/RESULTS.md`

## Resuming After Disconnect

If the orchestrating session is interrupted:

1. Read this file (`ORCHESTRATION.md`) — it has all context
2. Check the Results Tracker table above to see which tests completed
3. Check current state:
   - `curl -s http://localhost:3456/api/health` — server running?
   - `electron_dom_query` — Electron app responsive?
   - `git -C <project> worktree list` — how many worktrees exist?
   - `electron_exec` to check localStorage toggle state
4. Resume from the first incomplete test, verifying its preconditions first
5. If state is unclear, do a full reset:
   - Remove all worktrees
   - Reset toggle to default
   - Disable worktree mode
   - Start from Test 01
