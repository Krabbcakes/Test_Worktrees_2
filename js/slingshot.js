const Slingshot = (() => {
    let canvasRef = null;
    let gameStateRef = null;
    let isDragging = false;

    function ensureBirdDefaults(bird) {
        if (!bird) {
            return null;
        }

        if (typeof bird.radius !== 'number') {
            bird.radius = CONFIG.BIRD_RADIUS;
        }
        if (typeof bird.vx !== 'number') {
            bird.vx = 0;
        }
        if (typeof bird.vy !== 'number') {
            bird.vy = 0;
        }
        if (typeof bird.launched !== 'boolean') {
            bird.launched = false;
        }

        return bird;
    }

    function placeBirdOnSling(bird) {
        ensureBirdDefaults(bird);
        bird.x = CONFIG.SLINGSHOT_X;
        bird.y = CONFIG.SLINGSHOT_Y;
        bird.vx = 0;
        bird.vy = 0;
        bird.launched = false;
    }

    function isBirdStopped(bird) {
        return Boolean(
            bird &&
            bird.launched &&
            bird.y + (bird.radius || CONFIG.BIRD_RADIUS) >= CONFIG.GROUND_Y - 2 &&
            Math.abs(bird.vx || 0) < 0.5 &&
            Math.abs(bird.vy || 0) < 0.5
        );
    }

    function updateBirdsRemaining(gameState) {
        const birds = Array.isArray(gameState.birds) ? gameState.birds : [];
        let remaining = birds.filter((bird) => bird && !bird.spent).length;

        if (gameState.activeBird && !birds.includes(gameState.activeBird) && !gameState.activeBird.spent) {
            remaining += 1;
        }

        gameState.birdsRemaining = remaining;
    }

    function syncActiveBird(gameState) {
        if (!gameState) {
            return;
        }

        const birds = Array.isArray(gameState.birds) ? gameState.birds : [];
        birds.forEach(ensureBirdDefaults);

        if (gameState.activeBird) {
            ensureBirdDefaults(gameState.activeBird);
        }

        if (gameState.activeBird && isBirdStopped(gameState.activeBird)) {
            gameState.activeBird.spent = true;
            gameState.activeBird = null;

            if (gameState.phase === 'flying') {
                gameState.phase = 'settling';
            }
        }

        if (!gameState.activeBird) {
            const nextBird = birds.find((bird) => bird && !bird.spent && !bird.launched);

            if (nextBird) {
                placeBirdOnSling(nextBird);
                gameState.activeBird = nextBird;

                if (!['menu', 'win', 'lose'].includes(gameState.phase)) {
                    gameState.phase = 'aiming';
                }
            }
        }

        updateBirdsRemaining(gameState);
    }

    function canInteract(gameState) {
        return gameState && !['menu', 'win', 'lose'].includes(gameState.phase);
    }

    function clampPull(x, y) {
        const dx = x - CONFIG.SLINGSHOT_X;
        const dy = y - CONFIG.SLINGSHOT_Y;
        const distance = Math.hypot(dx, dy);

        if (distance <= CONFIG.MAX_PULL_DISTANCE || distance === 0) {
            return { x, y };
        }

        const scale = CONFIG.MAX_PULL_DISTANCE / distance;
        return {
            x: CONFIG.SLINGSHOT_X + dx * scale,
            y: CONFIG.SLINGSHOT_Y + dy * scale
        };
    }

    function getPointerPosition(event) {
        const rect = canvasRef.getBoundingClientRect();
        const source = event.touches && event.touches[0]
            ? event.touches[0]
            : event.changedTouches && event.changedTouches[0]
                ? event.changedTouches[0]
                : event;

        const scaleX = canvasRef.width / rect.width;
        const scaleY = canvasRef.height / rect.height;

        return {
            x: (source.clientX - rect.left) * scaleX,
            y: (source.clientY - rect.top) * scaleY
        };
    }

    function updateDragPosition(point) {
        const bird = gameStateRef && gameStateRef.activeBird;

        if (!bird) {
            return;
        }

        const clamped = clampPull(point.x, point.y);
        bird.x = clamped.x;
        bird.y = clamped.y;
        bird.vx = 0;
        bird.vy = 0;
        bird.launched = false;

        if (canInteract(gameStateRef)) {
            gameStateRef.phase = 'aiming';
        }
    }

    function startDrag(event) {
        if (!canvasRef || !gameStateRef) {
            return;
        }

        syncActiveBird(gameStateRef);

        const bird = gameStateRef.activeBird;
        if (!bird || bird.launched || !canInteract(gameStateRef)) {
            return;
        }

        const point = getPointerPosition(event);
        const grabRadius = Math.max((bird.radius || CONFIG.BIRD_RADIUS) * 1.8, 28);
        const distanceToBird = Math.hypot(point.x - bird.x, point.y - bird.y);
        const distanceToSling = Math.hypot(point.x - CONFIG.SLINGSHOT_X, point.y - CONFIG.SLINGSHOT_Y);

        if (distanceToBird > grabRadius && distanceToSling > grabRadius) {
            return;
        }

        isDragging = true;
        updateDragPosition(point);
        event.preventDefault();
    }

    function drag(event) {
        if (!isDragging) {
            return;
        }

        updateDragPosition(getPointerPosition(event));
        event.preventDefault();
    }

    function release(event) {
        if (!isDragging || !gameStateRef || !gameStateRef.activeBird) {
            isDragging = false;
            return;
        }

        isDragging = false;

        const bird = gameStateRef.activeBird;
        const pullX = CONFIG.SLINGSHOT_X - bird.x;
        const pullY = CONFIG.SLINGSHOT_Y - bird.y;
        const pullDistance = Math.hypot(pullX, pullY);

        if (pullDistance < 4) {
            placeBirdOnSling(bird);
            return;
        }

        bird.vx = (pullX / CONFIG.MAX_PULL_DISTANCE) * CONFIG.LAUNCH_POWER;
        bird.vy = (pullY / CONFIG.MAX_PULL_DISTANCE) * CONFIG.LAUNCH_POWER;
        bird.launched = true;
        gameStateRef.phase = 'flying';
        updateBirdsRemaining(gameStateRef);

        if (event && typeof event.preventDefault === 'function') {
            event.preventDefault();
        }
    }

    function addListeners(canvas) {
        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', drag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', release);

        canvas.addEventListener('touchstart', startDrag, { passive: false });
        canvas.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', release);
        window.addEventListener('touchcancel', release);
    }

    function drawSlingshotBody(ctx) {
        const baseX = CONFIG.SLINGSHOT_X;
        const baseY = CONFIG.SLINGSHOT_Y;
        const forkTopY = baseY - 70;

        ctx.save();
        ctx.strokeStyle = '#5f381d';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(baseX - 16, baseY + 48);
        ctx.lineTo(baseX - 16, forkTopY);
        ctx.moveTo(baseX + 10, baseY + 48);
        ctx.lineTo(baseX + 10, forkTopY + 4);
        ctx.stroke();

        ctx.fillStyle = '#7c4a27';
        ctx.beginPath();
        ctx.ellipse(baseX - 3, baseY + 50, 28, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    return {
        init(canvas, gameState) {
            canvasRef = canvas;
            gameStateRef = gameState;

            if (!canvasRef || !gameStateRef) {
                return;
            }

            canvasRef.style.touchAction = 'none';
            addListeners(canvasRef);
            syncActiveBird(gameStateRef);
        },

        draw(ctx, gameState) {
            if (!ctx || !gameState) {
                return;
            }

            if (gameStateRef !== gameState) {
                gameStateRef = gameState;
            }

            syncActiveBird(gameState);

            const bird = gameState.activeBird;
            const leftFork = { x: CONFIG.SLINGSHOT_X - 16, y: CONFIG.SLINGSHOT_Y - 70 };
            const rightFork = { x: CONFIG.SLINGSHOT_X + 10, y: CONFIG.SLINGSHOT_Y - 66 };

            if (bird && !bird.launched) {
                ctx.save();
                ctx.strokeStyle = '#3f2614';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(leftFork.x, leftFork.y);
                ctx.lineTo(bird.x, bird.y);
                ctx.moveTo(rightFork.x, rightFork.y);
                ctx.lineTo(bird.x, bird.y);
                ctx.stroke();

                const pullDistance = Math.hypot(CONFIG.SLINGSHOT_X - bird.x, CONFIG.SLINGSHOT_Y - bird.y);
                if (pullDistance > 2) {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([6, 6]);
                    ctx.beginPath();
                    ctx.moveTo(CONFIG.SLINGSHOT_X, CONFIG.SLINGSHOT_Y);
                    ctx.lineTo(bird.x, bird.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
                ctx.restore();
            }

            drawSlingshotBody(ctx);
        }
    };
})();
