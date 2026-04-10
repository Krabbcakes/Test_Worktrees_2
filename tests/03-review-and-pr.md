# Stage 3: Review & PR Creation

## Preconditions

- [ ] All 3 Codex agents have completed development (Stage 2 complete)
- [ ] Each worktree branch has commits ahead of main
- [ ] Sessions are ended or idle

## PR Order

Create PRs in this order to minimize merge conflicts:
1. **Game Engine** (branch 1) — no dependencies, pure rendering
2. **Physics** (branch 2) — may reference engine constants but no code conflicts
3. **UI + Levels** (branch 3) — may update CSS, references config constants

## Steps

### 3.1 — Review Game Engine Branch

```bash
# Get the branch name for the "Game Engine" worktree
# (check worktree list or CC Watcher dashboard)

git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 diff main..<BRANCH_1> --stat
git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 diff main..<BRANCH_1>
```

**Review checklist:**
- [ ] `engine.js` implements clear/draw functions
- [ ] `sprites.js` draws birds, pigs, blocks
- [ ] `slingshot.js` handles mouse input and draws aiming
- [ ] No modifications to `config.js` or `main.js`
- [ ] Code runs without errors

### 3.2 — Push & Create PR for Game Engine

**IMPORTANT: Notify the user before creating PR.**

```bash
cd /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2

# Push the branch to GitHub
git push origin <BRANCH_1>

# Create PR
gh pr create --base main --head <BRANCH_1> \
  --title "Add game engine: canvas rendering, sprites, slingshot" \
  --body "## Game Engine

Implements the core rendering and input layer:
- **engine.js**: Canvas clear, background, shape drawing utilities
- **sprites.js**: Bird, pig, and block sprite rendering
- **slingshot.js**: Mouse-controlled aiming and launch mechanic

Developed by Codex agent in worktree branch."
```

**Verify:** PR appears at https://github.com/Krabbcakes/Test_Worktrees_2/pulls

### 3.3 — Review Physics Branch

Same process as 3.1 for branch 2.

**Review checklist:**
- [ ] `physics.js` applies gravity and velocity
- [ ] `collision.js` detects circle-circle and circle-rect collisions
- [ ] `structures.js` creates blocks with health values
- [ ] No modifications to `config.js` or `main.js`

### 3.4 — Push & Create PR for Physics

**IMPORTANT: Notify the user before creating PR.**

```bash
git push origin <BRANCH_2>

gh pr create --base main --head <BRANCH_2> \
  --title "Add physics: gravity, collision detection, structures" \
  --body "## Physics Engine

Implements the physics simulation:
- **physics.js**: Gravity, velocity, ground/wall bouncing
- **collision.js**: Bird-pig and bird-block collision detection
- **structures.js**: Destructible blocks (wood, stone, glass)

Developed by Codex agent in worktree branch."
```

### 3.5 — Review UI + Levels Branch

Same process for branch 3.

**Review checklist:**
- [ ] `ui.js` draws menu, HUD, win/lose screens
- [ ] `levels.js` defines 3 levels with pigs and blocks
- [ ] `scoring.js` tracks score and win/lose conditions
- [ ] CSS changes are reasonable

### 3.6 — Push & Create PR for UI + Levels

**IMPORTANT: Notify the user before creating PR.**

```bash
git push origin <BRANCH_3>

gh pr create --base main --head <BRANCH_3> \
  --title "Add UI, levels, and scoring" \
  --body "## UI + Levels

Implements the game interface and content:
- **ui.js**: Start screen, HUD, win/lose overlays
- **levels.js**: 3 levels with increasing difficulty
- **scoring.js**: Score tracking and win/lose detection

Developed by Codex agent in worktree branch."
```

---

## Dashboard Observations

After all 3 PRs are created:
- [ ] Worktree cards show "ahead" indicators
- [ ] Session cards still show WT badges
- [ ] Canvas tree shows all 3 branches

---

## Pass/Fail

- **PASS**: All 3 PRs created successfully, code passes basic review
- **FAIL**: Branch push fails, PR creation fails, or code has critical issues
