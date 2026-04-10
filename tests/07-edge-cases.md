# Test 07: Edge Cases

## Purpose

Test unusual scenarios and boundary conditions that might break the worktree toggle or reveal unexpected behavior.

## Preconditions

- Test_Worktrees_2 project with git repo initialized
- Dashboard running and connected

## Test Steps

### 7.1 — Rapid Toggle Cycling

**Action:** Click the toggle button 10 times in rapid succession.

**Expected:**
- [ ] Final state is consistent (10 clicks = 10 mod 3 = 1 → should be "Override ON")
- [ ] No visual glitches, stuck states, or console errors
- [ ] All cells show the same final state
- [ ] Seg-btn panel (if open) shows the correct final state

**Observations:**

---

### 7.2 — Toggle While Session is Launching

**Action:**
1. Set toggle to "Override ON"
2. Click "New session" to launch
3. Immediately click the toggle to change it to "Override OFF"
4. Wait for the session to appear

**Expected:**
- [ ] The session that was launching uses the state at the time of the click (ON)
- [ ] The toggle change after launch does not retroactively affect the pending session
- [ ] The request body sent to the server had `useWorktree: true` (captured at click time)

**Observations:**

---

### 7.3 — Non-Git Project

**Action:**
1. Create a temporary directory without git: `mkdir /tmp/no-git-project`
2. If it appears as a project in the dashboard, select it
3. Observe the toggle button

**Expected:**
- [ ] Toggle button is still rendered (it doesn't know about git status at render time)
- [ ] If toggle is ON and user launches a session, the server-side `shouldCreateWorktree()` returns false (because `isGitRepo()` fails)
- [ ] Session launches normally on the directory (no worktree, no error)
- [ ] No crash or error in the dashboard

**Observations:**

---

### 7.4 — Worktree Limit (16 max)

**Action:** If feasible, create worktrees up to or near the 16 limit.

**Expected:**
- [ ] At the limit, `createSessionWorktree` fails gracefully
- [ ] Session still launches (falls back to the original directory)
- [ ] User sees the session appear without worktree badges
- [ ] Server logs a warning about the limit

**Note:** This is a destructive test that creates many worktrees. Skip if cleanup would be burdensome.

**Observations:**

---

### 7.5 — Formation Launch with Toggle

**Action:**
1. Set toggle to a specific override state
2. Open the Formation panel in Monitor
3. Launch a formation (multi-session)
4. Check whether all formation sessions respect the toggle

**Expected:**
- [ ] All sessions in the formation use the same `useWorktree` value
- [ ] The formation panel has its own worktree seg-btn row — does it sync with the toolbar toggle?
- [ ] Formation creates N worktrees (one per session) if toggle is ON

**Observations:**

---

### 7.6 — Settings Change While Toggle is Active

**Action:**
1. Set toggle to "Override ON" (green + orange dot)
2. Open Settings > Git
3. Change the cleanup mode from "Manual" to "On Session End"
4. Close settings
5. Launch a session

**Expected:**
- [ ] The cleanup mode change is independent of the toggle
- [ ] Session still creates a worktree (toggle override unaffected)
- [ ] The new cleanup mode applies to the newly created worktree

**Observations:**

---

### 7.7 — Codex Provider with Toggle

**Action:**
1. Switch provider from Claude to Codex (if available)
2. Set toggle to "Override ON"
3. Launch a Codex session

**Expected:**
- [ ] Worktree toggle works the same for Codex as for Claude
- [ ] The `useWorktree` parameter is included in the Codex launch request
- [ ] Codex session runs in the worktree directory

**Note:** Requires Codex to be installed and authenticated.

**Observations:**

---

### 7.8 — Browser vs Electron Behavior

**Action:** If accessible, open the dashboard in a regular browser (http://localhost:3456) alongside the Electron app.

**Expected:**
- [ ] Toggle appears in both browser and Electron
- [ ] Toggle state is synced via localStorage (same browser storage)
- [ ] Launching from browser creates worktree just like Electron
- [ ] Terminal tab toggle is only available in Electron (Terminal tab hidden in browser)

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** All edge cases handled gracefully — no crashes, no stuck states, no data loss
- **FAIL:** Any scenario causes a crash, stuck UI, lost state, or unexpected worktree creation/suppression
