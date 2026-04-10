const Collision = (() => {
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function getRadius(entity, fallback) {
        return entity.radius || fallback;
    }

    function getImpactForce(bird) {
        return Math.max(0, Math.hypot(bird.vx || 0, bird.vy || 0));
    }

    function getImpactDirection(bird, fallbackX, fallbackY) {
        const force = getImpactForce(bird);

        if (force === 0) {
            return { x: fallbackX, y: fallbackY };
        }

        return {
            x: (bird.vx || 0) / force,
            y: (bird.vy || 0) / force,
        };
    }

    function resolveBirdImpact(bird, normalX, normalY, overlap) {
        bird.x += normalX * overlap;
        bird.y += normalY * overlap;

        const dot = (bird.vx || 0) * normalX + (bird.vy || 0) * normalY;

        if (dot < 0) {
            bird.vx -= (1 + CONFIG.BOUNCE) * dot * normalX;
            bird.vy -= (1 + CONFIG.BOUNCE) * dot * normalY;
        }
    }

    function applyKnockback(entity, directionX, directionY, force) {
        const knockback = Math.max(2, force * 0.35);

        entity.x += directionX * knockback;
        entity.y += directionY * knockback;
    }

    function getCircleRectCollision(circle, rect) {
        const radius = getRadius(circle, CONFIG.BIRD_RADIUS);
        const width = rect.w || CONFIG.BLOCK_SIZE;
        const height = rect.h || CONFIG.BLOCK_SIZE;
        const nearestX = clamp(circle.x, rect.x, rect.x + width);
        const nearestY = clamp(circle.y, rect.y, rect.y + height);
        const dx = circle.x - nearestX;
        const dy = circle.y - nearestY;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq >= radius * radius) {
            return null;
        }

        if (distanceSq > 0) {
            const distance = Math.sqrt(distanceSq);

            return {
                normalX: dx / distance,
                normalY: dy / distance,
                overlap: radius - distance,
            };
        }

        const leftDistance = Math.abs(circle.x - rect.x);
        const rightDistance = Math.abs((rect.x + width) - circle.x);
        const topDistance = Math.abs(circle.y - rect.y);
        const bottomDistance = Math.abs((rect.y + height) - circle.y);
        const minDistance = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);

        if (minDistance === leftDistance) {
            return { normalX: -1, normalY: 0, overlap: radius + leftDistance };
        }

        if (minDistance === rightDistance) {
            return { normalX: 1, normalY: 0, overlap: radius + rightDistance };
        }

        if (minDistance === topDistance) {
            return { normalX: 0, normalY: -1, overlap: radius + topDistance };
        }

        return { normalX: 0, normalY: 1, overlap: radius + bottomDistance };
    }

    function damagePig(pig, force) {
        if (typeof pig.health !== 'number') {
            pig.health = 1;
        }

        pig.health -= Math.max(1, Math.floor(force / 4));
    }

    function damageBlock(block, force) {
        if (typeof Structures !== 'undefined' && Structures.applyDamage) {
            Structures.applyDamage(block, force);
            return;
        }

        if (typeof block.health !== 'number') {
            block.health = 1;
        }

        block.health -= Math.max(1, Math.floor(force / 6));
    }

    function checkBirdPigCollisions(gameState, bird) {
        const birdRadius = getRadius(bird, CONFIG.BIRD_RADIUS);

        gameState.pigs.forEach((pig) => {
            const pigRadius = getRadius(pig, CONFIG.PIG_RADIUS);
            const dx = bird.x - pig.x;
            const dy = bird.y - pig.y;
            const distance = Math.hypot(dx, dy);
            const minDistance = birdRadius + pigRadius;

            if (distance >= minDistance) {
                return;
            }

            const force = getImpactForce(bird);
            const impactDirection = getImpactDirection(bird, 1, 0);
            const normalX = distance === 0 ? -impactDirection.x : dx / distance;
            const normalY = distance === 0 ? -impactDirection.y : dy / distance;
            const overlap = distance === 0 ? minDistance : minDistance - distance;

            damagePig(pig, force);
            applyKnockback(pig, impactDirection.x, impactDirection.y, force);
            resolveBirdImpact(bird, normalX, normalY, overlap);
        });
    }

    function checkBirdBlockCollisions(gameState, bird) {
        gameState.blocks.forEach((block) => {
            const collision = getCircleRectCollision(bird, block);

            if (!collision) {
                return;
            }

            const force = getImpactForce(bird);
            const impactDirection = getImpactDirection(bird, -collision.normalX, -collision.normalY);

            damageBlock(block, force);
            applyKnockback(block, impactDirection.x, impactDirection.y, force);
            resolveBirdImpact(bird, collision.normalX, collision.normalY, collision.overlap);
        });
    }

    function check(gameState) {
        if (!gameState || !Array.isArray(gameState.birds)) {
            return;
        }

        gameState.birds.forEach((bird) => {
            if (!bird || (!bird.launched && getImpactForce(bird) < 0.5)) {
                return;
            }

            if (Array.isArray(gameState.pigs)) {
                checkBirdPigCollisions(gameState, bird);
            }

            if (Array.isArray(gameState.blocks)) {
                checkBirdBlockCollisions(gameState, bird);
            }
        });

        if (Array.isArray(gameState.pigs)) {
            gameState.pigs = gameState.pigs.filter((pig) => typeof pig.health !== 'number' || pig.health > 0);
        }

        if (Array.isArray(gameState.blocks)) {
            gameState.blocks = gameState.blocks.filter((block) => typeof block.health !== 'number' || block.health > 0);
        }
    }

    return {
        check,
    };
})();

globalThis.Collision = Collision;
