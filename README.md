# Angry Birds Clone

A browser-based Angry Birds clone built as a worktree lifecycle test for CC Watcher.

## How to Play

Open `index.html` in a browser. Click and drag on the slingshot to launch birds at pig structures.

## Project Structure

```
index.html          - Game page with canvas
css/style.css       - Styling
js/config.js        - Shared constants and interfaces
js/main.js          - Entry point and game loop
js/engine.js        - Canvas rendering engine
js/sprites.js       - Bird, pig, and block sprites
js/slingshot.js     - Slingshot aiming and launch
js/physics.js       - Gravity and projectile motion
js/collision.js     - Collision detection
js/structures.js    - Destructible structures
js/ui.js            - Start screen and menus
js/levels.js        - Level definitions
js/scoring.js       - Score tracking and win/lose
```

## Development

This project was built using 3 parallel git worktrees, each developed by a Codex agent via CC Watcher.
