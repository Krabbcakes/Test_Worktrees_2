# Stage 4: Merge & Auto-Cleanup

## Preconditions

- [ ] All 3 PRs created on GitHub (Stage 3 complete)
- [ ] CC Watcher cleanup mode is `after-merge`
- [ ] All 3 worktrees still visible in dashboard

## Critical Test: The After-Merge Lifecycle

This is the most important stage. We're testing what happens when the user merges a PR on GitHub and CC Watcher detects the merge.

### Merge Workflow

For **each PR** (in order: Engine → Physics → UI):

#### Step A: User merges PR on GitHub

The user (Kevin) merges the PR via the GitHub web UI. This happens outside of CC Watcher.

#### Step B: Pull main locally

After the user confirms the merge:
```bash
cd /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2
git fetch origin
git pull origin main
```

This updates the local `main` branch with the merged commits.

#### Step C: Verify merge detection

```bash
# Check if CC Watcher detects the branch is merged
# The branch should have 0 unmerged commits now
git rev-list --count main..<BRANCH_NAME>
# Expected: 0 (all commits are now in main)
```

#### Step D: Observe CC Watcher behavior

After pulling main, observe the dashboard:

1. **Worktrees tab:**
   - [ ] Does the worktree card change appearance? (should show "merged" status)
   - [ ] Does auto-cleanup trigger?
   - [ ] How long until the worktree is removed?

2. **Session behavior:**
   - [ ] What happens to the linked session?
   - [ ] Is the session ended? Still showing?
   - [ ] Does the WT badge disappear?

3. **Cleanup verification:**
   ```bash
   git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
   # Should show one fewer worktree after cleanup
   
   git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 branch
   # Is the branch also deleted?
   ```

4. **File system:**
   ```bash
   ls /Users/kevinrabb/Documents/Dev/_Experiments/.cc-watcher-worktrees/Test_Worktrees_2/
   # Should have one fewer directory
   ```

#### Step E: Record timeline

| Event | Time | Observation |
|-------|------|-------------|
| PR merged on GitHub | | |
| `git pull origin main` | | |
| CC Watcher detects merge | | |
| Worktree card changes | | |
| Worktree auto-removed | | |
| Session card updated | | |
| Branch deleted | | |

---

## Repeat for Each PR

### 4.1 — Merge PR 1: Game Engine

Follow Steps A-E above.

**After merge, test the game:**
```bash
# Open index.html in browser
# Should see: canvas with background, slingshot visible
# No physics or UI yet (those branches not merged)
```

### 4.2 — Merge PR 2: Physics

Follow Steps A-E above.

**After merge, test the game:**
```bash
# Should see: slingshot launches birds, gravity works, birds bounce
# No levels or scoring yet
```

### 4.3 — Merge PR 3: UI + Levels

Follow Steps A-E above.

**After merge, test the game:**
```bash
# Full game should work: menu → click to play → launch birds → score
```

---

## Key Questions to Answer

After all 3 PRs merged:

1. **Timing**: How quickly does CC Watcher detect a merge? Is it on the next cleanup cycle, or immediate?
2. **Trigger**: Does `git pull` trigger detection, or does the cleanup timer need to run?
3. **Branch deletion**: Are worktree branches auto-deleted, or just the worktree directory?
4. **Session preservation**: Are ended sessions still visible in the Sessions tab or archives?
5. **Display name cleanup**: Are worktree display names cleaned up from `worktree-names.json`?
6. **Sidecar files**: Are `.worktree` sidecar files removed?
7. **Dashboard state**: Is the Worktrees tab empty (showing only main)?

---

## Potential Issues to Watch

- **Cleanup only runs when session is `ended`**: If Codex sessions are still "active" (not cleanly exited), auto-cleanup won't trigger. May need to wait for sessions to timeout/stale → end.
- **Local main must be updated**: CC Watcher checks merge status against the LOCAL `main` branch, not GitHub's. If `git pull` isn't done, it won't detect the merge.
- **Force option**: If unmerged commits somehow remain (squash merge changes commit hashes), cleanup might not trigger. The `after-merge` mode specifically checks `hasUnmergedCommits()`.

---

## Pass/Fail

- **PASS**: All 3 worktrees auto-cleaned after merge, session history preserved, dashboard clean
- **FAIL**: Worktrees not cleaned up, cleanup requires manual intervention, or data loss occurs
