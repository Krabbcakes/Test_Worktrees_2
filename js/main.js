// ─── Main Entry Point ───────────────────────────────────────────────────────
// Initializes the game and runs the game loop.
// Each module (engine, physics, ui, etc.) registers itself when loaded.

(function() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');

    // Game loop
    function gameLoop() {
        // Update phase
        if (typeof Physics !== 'undefined' && Physics.update) {
            Physics.update(GameState);
        }
        if (typeof Collision !== 'undefined' && Collision.check) {
            Collision.check(GameState);
        }
        if (typeof Scoring !== 'undefined' && Scoring.update) {
            Scoring.update(GameState);
        }

        // Render phase
        if (typeof Engine !== 'undefined' && Engine.clear) {
            Engine.clear(ctx);
        }
        if (typeof Sprites !== 'undefined' && Sprites.drawAll) {
            Sprites.drawAll(ctx, GameState);
        }
        if (typeof Slingshot !== 'undefined' && Slingshot.draw) {
            Slingshot.draw(ctx, GameState);
        }
        if (typeof UI !== 'undefined' && UI.draw) {
            UI.draw(ctx, GameState);
        }

        requestAnimationFrame(gameLoop);
    }

    // Initialize
    if (typeof UI !== 'undefined' && UI.init) {
        UI.init(canvas, GameState);
    }
    if (typeof Slingshot !== 'undefined' && Slingshot.init) {
        Slingshot.init(canvas, GameState);
    }
    if (typeof Levels !== 'undefined' && Levels.load) {
        Levels.load(0, GameState);
    }

    console.log('[AngryBirds] Game initialized. Modules loaded:',
        typeof Engine !== 'undefined' ? 'Engine' : '',
        typeof Physics !== 'undefined' ? 'Physics' : '',
        typeof UI !== 'undefined' ? 'UI' : ''
    );

    gameLoop();
})();
