const Physics = (() => {
    function isFlying(bird) {
        if (!bird) {
            return false;
        }

        const vx = bird.vx || 0;
        const vy = bird.vy || 0;

        return Boolean(bird.launched) || Math.abs(vx) >= 0.5 || Math.abs(vy) >= 0.5;
    }

    function settleBird(gameState, bird) {
        bird.vx = 0;
        bird.vy = 0;
        bird.launched = false;

        if (gameState.activeBird === bird) {
            gameState.activeBird = null;
        }
    }

    function updateBird(gameState, bird) {
        const radius = bird.radius || CONFIG.BIRD_RADIUS;

        bird.radius = radius;
        bird.vx = bird.vx || 0;
        bird.vy = bird.vy || 0;

        bird.x += bird.vx;
        bird.y += bird.vy;
        bird.vy += CONFIG.GRAVITY;

        if (bird.x - radius < 0) {
            bird.x = radius;
            bird.vx = Math.abs(bird.vx) * CONFIG.BOUNCE;
        } else if (bird.x + radius > CONFIG.CANVAS_WIDTH) {
            bird.x = CONFIG.CANVAS_WIDTH - radius;
            bird.vx = -Math.abs(bird.vx) * CONFIG.BOUNCE;
        }

        if (bird.y + radius > CONFIG.GROUND_Y) {
            bird.y = CONFIG.GROUND_Y - radius;
            bird.vy = -Math.abs(bird.vy) * CONFIG.BOUNCE;
            bird.vx *= CONFIG.FRICTION;

            if (Math.abs(bird.vx) < 0.5) {
                bird.vx = 0;
            }

            if (Math.abs(bird.vy) < 0.5) {
                bird.vy = 0;
            }

            if (bird.vx === 0 && bird.vy === 0) {
                settleBird(gameState, bird);
            }
        }
    }

    function update(gameState) {
        if (!gameState || !Array.isArray(gameState.birds)) {
            return;
        }

        gameState.birds.forEach((bird) => {
            if (!isFlying(bird)) {
                return;
            }

            updateBird(gameState, bird);
        });
    }

    return {
        update,
    };
})();

globalThis.Physics = Physics;
