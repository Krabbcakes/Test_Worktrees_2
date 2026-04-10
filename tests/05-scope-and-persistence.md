# Test 05: Scope and Persistence

## Purpose

Determine the exact scope of the worktree toggle: Is it global across all projects? Does it persist across page reloads? What happens when switching projects?

This is the most critical test — it answers whether the toggle affects ALL new sessions or just one.

## Preconditions

- Test_Worktrees_2 project selected with worktree mode ENABLED
- A second project exists that does NOT have worktree mode enabled
- Toggle is at default state (`''`)

## Test Steps

### 5.1 — Persistence Across Page Reload

**Action:**
1. Set toggle to "Override ON" (click once from default)
2. Verify tooltip reads "Worktree: ON (override)"
3. Reload the Electron app (Cmd+R or window reload)
4. After reload, navigate to Monitor tab
5. Select Test_Worktrees_2 project
6. Observe the toggle button

**Expected:**
- [ ] Toggle is STILL at "Override ON" (green with orange dot)
- [ ] The override persisted through the reload via localStorage
- [ ] Tooltip still reads "Worktree: ON (override)"

**Verification:**
```javascript
// Check localStorage
JSON.parse(localStorage.getItem('cc-watcher-session-options'))
// Should show: common.useWorktree = "on"
```

**Observations:**

---

### 5.2 — Override Carries Across Project Switches

**Action:**
1. With toggle at "Override ON" on Test_Worktrees_2
2. Click a different project in the sidebar (one without worktree mode)
3. Observe the toggle button for the new project

**Expected:**
- [ ] Toggle STILL shows "Override ON" (green + orange dot)
- [ ] Tooltip reads "Worktree: ON (override)" — the override takes priority regardless of project
- [ ] This means: if the user forgets to reset the override, ALL projects will create worktrees

**This is the critical finding to document:**
The toggle is **globally scoped** — it is NOT per-project. Setting override ON for Project A means Project B (and every other project) will also create worktrees until the user resets the override.

**Observations:**

---

### 5.3 — Default State is Per-Project

**Action:**
1. Reset toggle to default (cycle to `''`)
2. On Test_Worktrees_2 (worktree ENABLED): observe toggle
3. Switch to a project WITHOUT worktree mode
4. Observe toggle

**Expected:**
- [ ] Test_Worktrees_2: toggle shows default ON (green, no dot)
- [ ] Other project: toggle shows default OFF (gray, no dot)
- [ ] The **default** state changes per-project, but **overrides** are global

**Observations:**

---

### 5.4 — Override Persists After Session Launch

**Action:**
1. Set toggle to "Override ON"
2. Launch a new session
3. Observe toggle after session appears in Monitor
4. Launch ANOTHER session without touching the toggle

**Expected:**
- [ ] Toggle stays at "Override ON" after first launch
- [ ] Second session ALSO creates a worktree (because override is still ON)
- [ ] The override is NOT consumed by the first launch — it's a persistent preference

**Observations:**

---

### 5.5 — Multiple Sessions in a Row

**Action:**
1. Set toggle to "Override OFF" (orange tint)
2. Launch 3 sessions in quick succession (without changing the toggle between each)
3. Check all 3 sessions

**Expected:**
- [ ] ALL 3 sessions launch WITHOUT worktrees
- [ ] Override OFF applies to every launch until changed
- [ ] `git worktree list` shows no new worktrees

**Observations:**

---

### 5.6 — Gear Icon Indicator Reflects Override

**Action:**
1. Set toggle to "Override ON"
2. Check whether the gear icon (session options toggle) shows the orange "has-options" dot

**Expected:**
- [ ] Gear icon DOES show the orange dot (indicating non-default options are active)
- [ ] This was fixed in the code review (`hasNonDefaultSessionOptions` now checks `useWorktree`)
- [ ] Opening the panel shows "On" is active in the Worktree row

**Observations:**

---

### 5.7 — Session Options Summary Reflects Override

**Action:** On the Sessions tab, check the options summary text below the toolbar.

**Expected:**
- [ ] When override is ON: summary includes "Worktree" text
- [ ] When override is OFF: summary includes "No WT" text
- [ ] When at default: no worktree text in summary

**Observations:**

---

## Key Finding Summary

Fill in after testing:

| Behavior | Observed |
|----------|----------|
| Toggle scope | Global / Per-project / Per-session? |
| Persists across reload? | Yes / No |
| Persists across project switch? | Yes / No |
| Resets after session launch? | Yes / No |
| Default state per-project? | Yes / No |

## Pass/Fail Criteria

- **PASS:** Toggle scope and persistence are clearly understood and behave consistently
- **FAIL:** Inconsistent behavior between scenarios, unexpected resets, or cross-project contamination that isn't indicated to the user
