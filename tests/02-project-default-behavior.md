# Test 02: Project Default Behavior

## Purpose

Verify the toggle button correctly reflects the project-level worktree setting and that enabling/disabling worktree mode for a project changes the toggle's default state.

## Preconditions

- Test_Worktrees_2 project selected
- `useWorktree` session option at default (`''`)
- Worktree mode currently **disabled** for this project

## Test Steps

### 2.1 — Default State with Worktree Mode Disabled

**Action:** With worktree mode disabled for the project, observe the toggle button.

**Expected:**
- [ ] Toggle shows default-off state (gray icon, no dot)
- [ ] Tooltip reads: "Worktree: OFF — Click to create this session in a new git worktree"
- [ ] No project indicator badge (tree icon) in the sidebar project card

**Observations:**

---

### 2.2 — Enable Worktree Mode for the Project

**Action:**
1. Open Settings (gear icon in bottom-left)
2. Navigate to "Git" tab
3. Toggle "Worktree Mode" ON for the Test_Worktrees_2 project
4. Close settings
5. Observe the toggle button

**Expected:**
- [ ] Toggle now shows default-ON state (green icon, green border, green bg)
- [ ] NO orange dot (this is the project default, not an override)
- [ ] Tooltip reads: "Worktree: ON (project default) — Session will be created in a new git worktree"
- [ ] Project indicator badge (tree icon) appears in the sidebar next to project name
- [ ] Badge is green, ~60% opacity, with node circles matching the toggle icon

**Observations:**

---

### 2.3 — Override While Default is ON

**Action:** Click the toggle button once (while project default is ON).

**Expected:**
- [ ] Toggle stays green BUT gains orange dot (override indicator)
- [ ] Tooltip changes to: "Worktree: ON (override) — Session will be created in a new git worktree"
- [ ] Clicking again → override OFF (orange tinted, orange dot)
- [ ] Clicking again → back to default ON (green, no dot)

**Key distinction:** Default-ON and Override-ON look similar (both green) but differ by the orange dot.

**Observations:**

---

### 2.4 — Disable Worktree Mode While Override is Active

**Action:**
1. Set toggle to "Override ON" (green with orange dot)
2. Open Settings > Git tab
3. Disable Worktree Mode for the project
4. Close settings
5. Observe the toggle button

**Expected:**
- [ ] Toggle still shows "Override ON" (green with orange dot) — the per-session override takes priority
- [ ] Tooltip reads: "Worktree: ON (override) — ..."
- [ ] Project indicator badge disappears from sidebar
- [ ] Clicking toggle cycles: ON(override) → OFF(override) → default OFF(gray)

**Observations:**

---

### 2.5 — Switching Between Projects with Different Settings

**Action:**
1. Ensure Test_Worktrees_2 has worktree mode ENABLED
2. Reset toggle to default (`''`) — verify green default state
3. Select a different project that does NOT have worktree mode enabled (e.g., a simple test project)
4. Observe toggle state on the new project
5. Switch back to Test_Worktrees_2

**Expected:**
- [ ] On the non-worktree project: toggle shows default-off (gray)
- [ ] Switching back to Test_Worktrees_2: toggle shows default-on (green)
- [ ] **Critical question:** Does the `useWorktree` override carry across project switches or reset?
  - Current behavior: override is **global** (carries across projects)
  - If override was 'on' for Project A, it stays 'on' for Project B

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** Toggle reflects project default correctly, sidebar badge appears/disappears with setting, override takes priority over project setting
- **FAIL:** Toggle doesn't update when project setting changes, badge doesn't appear, or override is ignored
