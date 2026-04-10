# Stage 2: Codex Agent Development

## Preconditions

- [ ] 3 worktrees created and renamed (Stage 1 complete)
- [ ] Each worktree has a linked Codex session
- [ ] All sessions are active/idle

## Agent Assignments

### Branch 1: Game Engine

**Prompt for Codex agent:**
> Implement the game engine for an Angry Birds clone. You have access to `js/config.js` which defines `CONFIG` (canvas dimensions, slingshot position, sprite sizes) and `GameState` (mutable game state). Implement these 3 files:
>
> **js/engine.js** — Canvas rendering engine:
> - `Engine.clear(ctx)` — clear canvas and draw background (sky gradient, ground)
> - `Engine.drawCircle(ctx, x, y, radius, color)` — utility for circles
> - `Engine.drawRect(ctx, x, y, w, h, color)` — utility for rectangles
>
> **js/sprites.js** — Game entity drawing:
> - `Sprites.drawBird(ctx, bird)` — draw a red circle bird with eyes
> - `Sprites.drawPig(ctx, pig)` — draw a green circle pig with snout
> - `Sprites.drawBlock(ctx, block)` — draw a brown/gray rectangle block
> - `Sprites.drawAll(ctx, gameState)` — draw all entities from GameState
>
> **js/slingshot.js** — Slingshot mechanic:
> - `Slingshot.init(canvas, gameState)` — set up mouse/touch event listeners
> - `Slingshot.draw(ctx, gameState)` — draw the slingshot and aiming line
> - Mouse drag from slingshot position aims the bird; release launches it
> - Use CONFIG.SLINGSHOT_X/Y, CONFIG.MAX_PULL_DISTANCE, CONFIG.LAUNCH_POWER
>
> Commit your changes when done. Do NOT modify config.js or main.js.

### Branch 2: Physics

**Prompt for Codex agent:**
> Implement the physics engine for an Angry Birds clone. You have `js/config.js` with `CONFIG` (gravity, friction, bounce, ground level) and `GameState`. Implement these 3 files:
>
> **js/physics.js** — Core physics:
> - `Physics.update(gameState)` — apply gravity and velocity to all flying birds
> - Update bird position: `x += vx`, `y += vy`, `vy += CONFIG.GRAVITY`
> - Ground collision: if `y + radius > CONFIG.GROUND_Y`, bounce with CONFIG.BOUNCE factor
> - Wall collision: bounce off left/right canvas edges
> - Stop bird when velocity is very small (< 0.5)
>
> **js/collision.js** — Collision detection:
> - `Collision.check(gameState)` — check bird-pig and bird-block collisions
> - Circle-circle collision (bird-pig): distance < sum of radii
> - Circle-rect collision (bird-block): nearest point on rect to circle center
> - On collision: reduce pig/block health, apply knockback force
> - Remove entities with health <= 0
>
> **js/structures.js** — Destructible structures:
> - `Structures.create(type, x, y)` — create a block with type ('wood', 'stone', 'glass')
> - Different types have different health values (wood=2, stone=4, glass=1)
> - `Structures.applyDamage(block, force)` — reduce health based on impact force
>
> Commit your changes when done. Do NOT modify config.js or main.js.

### Branch 3: UI + Levels

**Prompt for Codex agent:**
> Implement the UI and level system for an Angry Birds clone. You have `js/config.js` with `CONFIG` and `GameState`. Implement these 3 files:
>
> **js/ui.js** — User interface:
> - `UI.init(canvas, gameState)` — set up click handlers for menus
> - `UI.draw(ctx, gameState)` — draw UI overlay based on GameState.phase
> - Menu phase: "ANGRY BIRDS" title + "Click to Play" button
> - Playing phases: show score in top-left, birds remaining in top-right
> - Win phase: "Level Complete!" + score + "Next Level" button
> - Lose phase: "Try Again" + "Restart" button
>
> **js/levels.js** — Level definitions:
> - `Levels.load(levelIndex, gameState)` — populate GameState with level data
> - Define 3 levels with increasing difficulty:
>   - Level 1: 3 birds, 2 pigs, simple wood structure
>   - Level 2: 4 birds, 3 pigs, mixed wood/glass structure
>   - Level 3: 5 birds, 4 pigs, complex wood/stone/glass fortress
> - Each level defines pig positions and block positions/types
>
> **js/scoring.js** — Score tracking:
> - `Scoring.update(gameState)` — check win/lose conditions
> - Win: all pigs destroyed → set phase to 'win'
> - Lose: no birds remaining and pigs still alive → set phase to 'lose'
> - Track score: CONFIG.SCORE_PIG_HIT per pig, CONFIG.SCORE_BLOCK_DESTROYED per block
>
> Also update `css/style.css` with any additional styling for UI overlays.
>
> Commit your changes when done. Do NOT modify config.js or main.js.

## Monitoring Development

While agents are working:
- [ ] Check CC Watcher Monitor tab — all 3 sessions show as "running"
- [ ] Check Worktrees tab — worktree cards show session activity
- [ ] Canvas shows branch tree with active status indicators

## Completion Check

After all 3 agents finish:
```bash
# Check each worktree has commits ahead of main
for wt in $(git -C /Users/kevinrabb/Documents/Dev/_Experiments/Test_Worktrees_2 worktree list --porcelain | grep worktree | awk '{print $2}'); do
  branch=$(git -C "$wt" branch --show-current)
  ahead=$(git -C "$wt" rev-list --count main.."$branch" 2>/dev/null || echo "?")
  echo "$branch: $ahead commits ahead"
done
```

---

## Pass/Fail

- **PASS**: All 3 agents complete their assignments with committed code
- **FAIL**: Agent fails to start, crashes, or produces no commits
