# Stage 1: Setup & Worktree Creation

## Preconditions

- [x] Test_Worktrees_2 is a clean git repo on `main`
- [x] GitHub repo created: https://github.com/Krabbcakes/Test_Worktrees_2
- [x] Initial skeleton committed and pushed (index.html, config.js, stubs)
- [x] CC Watcher worktree mode ENABLED with `after-merge` cleanup
- [ ] No active worktrees (only main)

## Steps

### 1.1 — Verify Clean State

```bash
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
# Expected: only main

git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 branch
# Expected: only * main

curl -s http://localhost:3456/api/config | python3 -c "import sys,json; c=json.load(sys.stdin); tw2=c.get('projectSettings',{}).get('/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2',{}); print(json.dumps(tw2, indent=2))"
# Expected: worktreeEnabled=true, worktreeCleanup=after-merge
```

### 1.2 — Create 3 Worktrees via CC Watcher

Using the dashboard UI (Monitor or Sessions tab):

1. Select Test_Worktrees_2 in sidebar
2. Verify worktree toggle shows default ON (green, project enabled)
3. Launch **3 Codex sessions** — each will automatically create a worktree
4. Wait for all 3 sessions to appear

**Verification:**
```bash
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list
# Expected: main + 3 linked worktrees with wt/* branches
```

### 1.3 — Rename Worktrees

On the Worktrees tab, rename each worktree card:
- Worktree 1 → "Game Engine"
- Worktree 2 → "Physics"
- Worktree 3 → "UI + Levels"

**Verification:**
- Each card shows display name as title + branch ID below
- Canvas nodes show display names
- Session cards show green WT badges with display names

### 1.4 — Verify Dashboard State

Take screenshots of:
- [ ] Worktrees tab (cards + canvas tree)
- [ ] Sessions tab (WT badges visible)
- [ ] Monitor tab (WT badges visible)

**Expected:**
- 3 worktree cards with display names
- Canvas shows main → 3 branches
- All sessions linked to their worktrees

---

## Pass/Fail

- **PASS**: 3 worktrees created, renamed, visible across all views
- **FAIL**: Worktree creation fails, display names don't propagate, or sessions aren't linked
