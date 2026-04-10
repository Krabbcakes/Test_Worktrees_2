# Worktree End-to-End Lifecycle Test: Angry Birds Clone

## Goal

Test the complete worktree lifecycle: **create → develop → PR → merge → auto-cleanup**. Build a browser-based Angry Birds clone split across 3 worktree branches, each developed by a Codex agent.

## Repo

- **GitHub**: https://github.com/Krabbcakes/Test_Worktrees_2
- **Local**: `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2`
- **Cleanup mode**: `after-merge` — worktrees auto-removed once branch is merged into main

## Branches

| # | Display Name | Feature | Files |
|---|-------------|---------|-------|
| 1 | Game Engine | Canvas rendering, game loop, sprite drawing, slingshot mechanic | `js/engine.js`, `js/sprites.js`, `js/slingshot.js` |
| 2 | Physics | Gravity, projectile motion, collision detection, structure destruction | `js/physics.js`, `js/collision.js`, `js/structures.js` |
| 3 | UI + Levels | Start screen, level selection, scoring, win/lose conditions, 3 levels | `js/ui.js`, `js/levels.js`, `js/scoring.js`, CSS updates |

## Shared Contract

`js/config.js` defines the `CONFIG` constants and `GameState` object that all modules use. **No worktree branch modifies this file** — it's the shared API surface.

`js/main.js` is the entry point that calls each module's functions if they exist. Also shared — not modified by branches.

## Stages

| Stage | Doc | Description |
|-------|-----|-------------|
| 1 | [01-setup-and-creation.md](01-setup-and-creation.md) | Create 3 worktrees via CC Watcher dashboard |
| 2 | [02-development.md](02-development.md) | Launch Codex agents, develop features |
| 3 | [03-review-and-pr.md](03-review-and-pr.md) | Review diffs, create PRs |
| 4 | [04-merge-and-cleanup.md](04-merge-and-cleanup.md) | User merges PRs, observe auto-cleanup |
| 5 | [05-post-merge.md](05-post-merge.md) | Verify final state, game works |

## Success Criteria

- [ ] All 3 worktrees created and visible in CC Watcher
- [ ] Codex agents successfully develop features in isolated worktrees
- [ ] PRs created and merged successfully
- [ ] CC Watcher auto-detects merged branches
- [ ] Worktrees auto-cleaned after merge
- [ ] Session history preserved after cleanup
- [ ] Game is playable after all merges
- [ ] Dashboard shows clean state (only main worktree)
