# Test Orchestration Guide

## Environment

| Item | Value |
|------|-------|
| **Test project** | `/Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2` |
| **GitHub repo** | `https://github.com/Krabbcakes/Test_Worktrees_2` |
| **Dashboard** | `http://localhost:3456` |
| **Cleanup mode** | `after-merge` |
| **Test docs** | `tests/` directory |

## Execution Order

### Stage 1: Setup & Creation (01-setup-and-creation.md)

1. Verify clean state (no worktrees, GitHub repo exists)
2. Create 3 worktree sessions via CC Watcher dashboard
3. Rename worktrees: "Game Engine", "Physics", "UI + Levels"
4. Verify dashboard state

### Stage 2: Development (02-development.md)

1. Send prompts to each Codex agent with their assignment
2. Monitor progress via CC Watcher
3. Wait for all 3 agents to complete
4. Verify each branch has commits

### Stage 3: Review & PR (03-review-and-pr.md)

For each branch (in order):
1. Review the diff
2. **NOTIFY USER** before creating PR
3. Push branch + create PR
4. Wait for user confirmation before next PR

### Stage 4: Merge & Cleanup (04-merge-and-cleanup.md)

For each PR:
1. Tell user which PR to merge
2. After user confirms merge: `git pull origin main`
3. Observe CC Watcher cleanup behavior
4. Record timeline and observations

### Stage 5: Post-Merge (05-post-merge.md)

1. Verify all worktrees cleaned
2. Test the game in browser
3. Document findings

## Between Stages

Before moving to the next stage:
- Verify all checklist items from current stage
- Take screenshots of dashboard state
- Note any issues or unexpected behavior

## Notes

- **PR creation**: Always notify user before creating a PR. Wait for acknowledgment.
- **Merging**: User does all merges on GitHub. Do not merge programmatically.
- **Cleanup observation**: After each merge, wait up to 5 minutes for auto-cleanup. If it doesn't happen, investigate why and document.
- **Codex agents**: Use the CC Watcher dashboard to launch Codex sessions. Each session should create a worktree automatically (toggle is ON by default since worktree mode is enabled).
