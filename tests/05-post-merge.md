# Stage 5: Post-Merge Assessment

## Preconditions

- [ ] All 3 PRs merged on GitHub
- [ ] Local main pulled and up to date
- [ ] All worktree auto-cleanup has completed (or been triggered manually)

## Final State Verification

### 5.1 — Git State

```bash
cd /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2

# Only main worktree should remain
git worktree list
# Expected: 1 entry (main)

# Only main branch should remain (if cleanup deleted branches)
git branch
# Expected: * main

# Verify all code is merged
git log --oneline -10
# Should show merge commits from all 3 PRs

# Verify files exist
ls js/
# Should show: config.js engine.js sprites.js slingshot.js physics.js collision.js structures.js ui.js levels.js scoring.js main.js
```

### 5.2 — File System Cleanup

```bash
# Worktree directories should be gone
ls /Users/kevinrabb/Documents/Dev/_Experiments/.cc-watcher-worktrees/Test_Worktrees_2/ 2>/dev/null
# Expected: directory empty or doesn't exist

# Sidecar files should be cleaned up
ls ~/.cc-watcher/events/.*.worktree 2>/dev/null | grep -c "Test_Worktrees_2"
# Expected: 0 (sidecars removed with worktrees)

# Display names should be cleaned up
cat ~/.cc-watcher/worktree-names.json 2>/dev/null
# Expected: no entries for Test_Worktrees_2 worktrees
```

### 5.3 — Dashboard State

**Worktrees tab:**
- [ ] Only shows "main" card
- [ ] Canvas shows single main node (no branches)
- [ ] No stale worktree cards

**Sessions tab:**
- [ ] Worktree sessions show as "ended" (or archived)
- [ ] WT badges may still show on ended session cards (historical context)
- [ ] No active worktree sessions

**Monitor tab:**
- [ ] No worktree sessions in the grid (all ended)
- [ ] Clean state

### 5.4 — Game Functionality

Open `index.html` in a browser:
- [ ] Canvas renders with background and ground
- [ ] Start menu appears ("Click to Play" or similar)
- [ ] Slingshot is visible and interactive
- [ ] Birds can be launched with mouse drag
- [ ] Physics works: gravity, bouncing, collisions
- [ ] Pigs and blocks respond to hits
- [ ] Score updates
- [ ] Win/lose detection works
- [ ] Level progression works (3 levels)

### 5.5 — GitHub State

```bash
gh pr list --state merged --repo Krabbcakes/Test_Worktrees_2
# Should show 3 merged PRs

gh pr list --state open --repo Krabbcakes/Test_Worktrees_2
# Should show 0 open PRs
```

---

## Key Findings Summary

Fill in after testing:

| Aspect | Observed Behavior |
|--------|-------------------|
| Merge detection trigger | immediate / on pull / on cleanup cycle? |
| Cleanup timing | seconds / minutes after detection? |
| Branch deletion | auto / manual / not done? |
| Session preservation | visible / archived / lost? |
| Display name cleanup | auto / manual / not done? |
| Sidecar cleanup | auto / manual / not done? |
| Dashboard final state | clean / has stale entries? |
| Game functional? | yes / partially / no |

## Workflow Assessment

| Rating | Criteria |
|--------|----------|
| Smooth | Create → develop → PR → merge → cleanup was seamless |
| Workable | Required some manual steps but overall functional |
| Rough | Significant manual intervention needed |
| Broken | Critical steps failed or lost data |

---

## Pass/Fail

- **PASS**: Clean final state, game works, no data loss, workflow was smooth
- **FAIL**: Stale state, broken game, data loss, or workflow required too much manual intervention
