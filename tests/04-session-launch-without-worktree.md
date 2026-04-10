# Test 04: Session Launch WITHOUT Worktree

## Purpose

Verify that launching a session with the worktree toggle OFF does NOT create a worktree, and the session runs directly on the current branch.

## Preconditions

- Test_Worktrees_2 project selected
- Worktree mode ENABLED for the project (so the default would create a worktree)
- At least one worktree session exists from Test 03 (for comparison)
- Record current worktree count: `git worktree list | wc -l`

## Test Steps

### 4.1 — Launch Session with Override-OFF Toggle

**Action:**
1. Click the toggle button twice: default ON → override ON → **override OFF** (orange-tinted icon)
2. Verify tooltip reads "Worktree: OFF (override) — Session will run on the current branch"
3. Click "New Claude session"
4. Wait for the session to appear

**Expected:**
- [ ] Session launches successfully
- [ ] **NO new worktree is created** — `git worktree list` count stays the same
- [ ] Session's `cwd` is the main repo path (`/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2`)
- [ ] Session card does NOT show a worktree badge
- [ ] Session card does NOT show a "WT" branch badge
- [ ] Session appears under the correct project in Monitor

**Verification:**
```bash
# Worktree count should NOT have increased
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
```

**Observations:**

---

### 4.2 — Comparison: Worktree Session vs Non-Worktree Session

**Action:** In the Monitor view, compare the session from 4.1 (no worktree) with a session from Test 03 (has worktree).

**Expected differences:**
- [ ] Worktree session shows green "WT: branch-name" badge — non-worktree does NOT
- [ ] Worktree session shows blue base-branch badge — non-worktree shows only its branch badge (if any)
- [ ] Both sessions appear under the same project in the sidebar
- [ ] Both sessions are filterable by the same project

**Observations:**

---

### 4.3 — Toggle Reset After Launch

**Action:**
1. After launching the session in 4.1, observe the toggle button
2. Is the toggle still at "Override OFF"? Or did it reset to default?

**Expected (current design — global override):**
- [ ] Toggle remains at "Override OFF" (orange tinted, orange dot)
- [ ] The override persists — it does NOT auto-reset after a session launch
- [ ] A subsequent "New session" click would ALSO launch without a worktree

**This is a key behavior to document:**
The toggle is a **persistent preference**, not a one-shot override. It stays in whatever state the user set it to until they change it again.

**Observations:**

---

### 4.4 — Disable Project Worktree Mode, Launch Session

**Action:**
1. Reset the toggle to default (`''`) by cycling through all 3 states
2. Go to Settings > Git > disable Worktree Mode for Test_Worktrees_2
3. Verify toggle shows default OFF (gray)
4. Launch a new session

**Expected:**
- [ ] No worktree created (project default is OFF, no override)
- [ ] Session runs in main repo directory
- [ ] This confirms the project setting is respected when no override is active

**Observations:**

---

### 4.5 — Server-side Verification

**Action:** Check the server logs for the session creation to verify the override was passed correctly.

```bash
# Check recent server logs for worktree decision
grep -i "worktree\|shouldCreate" ~/.cc-watcher/server.stdout.log | tail -10
```

Also check via API:
```bash
# Get session details to verify cwd
curl -s http://localhost:3456/api/sessions | jq '.[] | select(.cwd | contains("Test_Worktrees_2")) | {sessionId: .sessionId, cwd: .cwd, worktreePath: .worktreePath, worktreeBranch: .worktreeBranch}'
```

**Expected:**
- [ ] Sessions created with override OFF show `worktreePath: null`
- [ ] Sessions created with override ON show `worktreePath: "/path/to/worktree"`
- [ ] The `useWorktree` parameter is visible in the launch request

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** Override OFF prevents worktree creation even when project default is ON; toggle persists after launch
- **FAIL:** Worktree is created despite override OFF, or toggle resets unexpectedly
