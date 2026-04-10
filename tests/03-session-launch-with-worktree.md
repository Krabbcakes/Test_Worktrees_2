# Test 03: Session Launch WITH Worktree

## Purpose

Verify that launching a session with the worktree toggle ON actually creates a git worktree, and that the session runs in the isolated worktree directory.

## Preconditions

- Test_Worktrees_2 project selected
- Worktree mode ENABLED for the project (Settings > Git > Worktree Mode ON)
- Toggle at default (green, showing project default ON)
- No active sessions for this project
- Git repo is clean with at least one commit

## Pre-test Verification

**Action:** Check the current state of worktrees for this project.

```bash
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
```

**Expected:** Only the main worktree listed.

---

## Test Steps

### 3.1 — Launch Session with Default-ON Toggle

**Action:**
1. Ensure toggle is at default ON (green, no orange dot)
2. Click "New Claude session" button
3. Wait for the session to appear in the Monitor

**Expected:**
- [ ] Session launches successfully
- [ ] A new worktree is created (verify with `git worktree list`)
- [ ] Worktree branch name follows `wt/` prefix pattern
- [ ] Session's `cwd` in the dashboard shows the worktree path (not the main repo path)
- [ ] Session card shows worktree badge (green "WT" badge)
- [ ] Session card shows branch badge with the base branch name

**Verification commands:**
```bash
# List worktrees — should show main + new worktree
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list

# Check worktree sidecar file exists
ls ~/.cc-watcher/events/.*.worktree

# Check .claude symlink in worktree
ls -la <worktree-path>/.claude
```

**Observations:**

---

### 3.2 — Launch Session with Override-ON Toggle

**Action:**
1. First, disable worktree mode for the project (Settings > Git > OFF)
2. Click the toggle button once to set "Override ON" (green + orange dot)
3. Click "New Claude session" button
4. Wait for session to appear

**Expected:**
- [ ] Session launches in a new worktree despite project default being OFF
- [ ] The per-request override (`useWorktree: true`) takes effect
- [ ] Worktree is created successfully
- [ ] Session shows worktree badges

**Observations:**

---

### 3.3 — Verify Worktree Isolation

**Action:** In the running worktree session (from 3.1 or 3.2):
1. Check the session's working directory
2. Verify it's on a separate branch from main
3. Verify files are present (copied from main)

**Verification:**
```bash
# From the worktree directory:
git branch   # Should show the wt/* branch as current
git log --oneline -3   # Should show the same history as main
ls            # Should contain README.md and tests/ directory
```

**Expected:**
- [ ] Working directory is the worktree path, not the main repo
- [ ] Branch is `wt/` prefixed
- [ ] Git history matches main (branched from HEAD)
- [ ] `.claude/` is a symlink pointing to main repo's `.claude/`

**Observations:**

---

### 3.4 — Second Session Also Creates Worktree

**Action:**
1. With toggle still at default ON (or override ON)
2. Launch another new session for the same project
3. Observe both sessions

**Expected:**
- [ ] Second worktree is created with a different branch name
- [ ] Both sessions appear in Monitor with separate worktree badges
- [ ] `git worktree list` shows main + 2 linked worktrees
- [ ] Both worktrees are independent — changes in one don't affect the other

**This answers the key question: is the toggle per-session or global?**
- If the toggle is global, the second session ALSO creates a worktree (same setting applies)
- If per-session, the toggle would reset after the first launch

**Observations:**

---

### 3.5 — Worktree Appears in Worktrees Tab

**Action:** Navigate to the Worktrees tab in the dashboard.

**Expected:**
- [ ] Canvas visualization shows the main worktree as root node
- [ ] New worktree(s) appear as child nodes connected to main
- [ ] Each worktree card shows: branch name, linked session, status
- [ ] Tree icon on the session card in Monitor matches the branch name shown in Worktrees tab

**Observations:**

---

## Pass/Fail Criteria

- **PASS:** Toggle ON → worktree created → session runs in worktree → visible in dashboard
- **FAIL:** No worktree created, session runs in main repo, or worktree not visible in Worktrees tab
