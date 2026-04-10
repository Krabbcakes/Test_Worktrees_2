const UI = window.UI = (() => {
    const DISPLAY_FONT = "'Arial Black', Arial, sans-serif";
    const BODY_FONT = "Arial, sans-serif";
    const PANEL_WIDTH = 420;
    const PANEL_HEIGHT = 210;

    let overlay = null;
    let modal = null;
    let modalHint = null;
    let actionButton = null;

    function init(canvas, gameState) {
        overlay = document.getElementById('ui-overlay');

        if (overlay) {
            overlay.innerHTML = '';
            overlay.classList.add('ui-overlay');

            modal = document.createElement('div');
            modal.className = 'ui-modal';
            modal.setAttribute('aria-live', 'polite');

            modalHint = document.createElement('p');
            modalHint.className = 'ui-modal__hint';
            modal.appendChild(modalHint);

            actionButton = document.createElement('button');
            actionButton.type = 'button';
            actionButton.className = 'ui-action';
            actionButton.addEventListener('click', () => {
                handlePrimaryAction(gameState);
            });
            modal.appendChild(actionButton);

            overlay.appendChild(modal);
        }

        updateOverlay(gameState);
    }

    function draw(ctx, gameState) {
        updateOverlay(gameState);

        if (gameState.phase !== 'menu') {
            drawHud(ctx, gameState);
        }

        if (gameState.phase === 'menu') {
            drawMenu(ctx, gameState);
            return;
        }

        if (gameState.phase === 'win') {
            drawResultScreen(
                ctx,
                'Level Complete!',
                `Score: ${formatScore(gameState.score)}`,
                `Level ${gameState.currentLevel + 1} cleared`
            );
            return;
        }

        if (gameState.phase === 'lose') {
            const pigsLeft = countAlive(gameState.pigs);
            drawResultScreen(
                ctx,
                'Try Again',
                `${pigsLeft} pig${pigsLeft === 1 ? '' : 's'} still standing`,
                'Reset the level and line up a better shot'
            );
        }
    }

    function handlePrimaryAction(gameState) {
        if (gameState.phase === 'menu') {
            gameState.phase = 'aiming';
            updateOverlay(gameState);
            return;
        }

        if (gameState.phase === 'win') {
            if (typeof Levels !== 'undefined' && Levels.load) {
                const nextLevel = (gameState.currentLevel + 1) % Levels.count();
                Levels.load(nextLevel, gameState);
            } else {
                gameState.phase = 'aiming';
            }

            updateOverlay(gameState);
            return;
        }

        if (gameState.phase === 'lose') {
            if (typeof Levels !== 'undefined' && Levels.load) {
                Levels.load(gameState.currentLevel, gameState);
            } else {
                gameState.phase = 'aiming';
            }

            updateOverlay(gameState);
        }
    }

    function updateOverlay(gameState) {
        if (!overlay || !modal || !actionButton || !modalHint) {
            return;
        }

        const phase = gameState.phase;
        const isModalPhase = phase === 'menu' || phase === 'win' || phase === 'lose';

        overlay.classList.toggle('active', isModalPhase);
        modal.classList.toggle('is-visible', isModalPhase);

        if (!isModalPhase) {
            actionButton.textContent = '';
            modalHint.textContent = '';
            return;
        }

        if (phase === 'menu') {
            actionButton.textContent = 'Click to Play';
            modalHint.textContent = `Level ${gameState.currentLevel + 1} is loaded`;
            return;
        }

        if (phase === 'win') {
            actionButton.textContent = 'Next Level';
            modalHint.textContent = `Current score: ${formatScore(gameState.score)}`;
            return;
        }

        actionButton.textContent = 'Restart';
        modalHint.textContent = `Take another shot at level ${gameState.currentLevel + 1}`;
    }

    function drawMenu(ctx, gameState) {
        drawBackdrop(ctx);
        drawPanel(ctx);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fef4ca';
        ctx.font = `700 20px ${BODY_FONT}`;
        ctx.fillText(`Level ${gameState.currentLevel + 1}`, CONFIG.CANVAS_WIDTH / 2, 190);

        ctx.fillStyle = '#ffffff';
        ctx.font = `900 64px ${DISPLAY_FONT}`;
        ctx.fillText('ANGRY BIRDS', CONFIG.CANVAS_WIDTH / 2, 255);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
        ctx.font = `600 22px ${BODY_FONT}`;
        ctx.fillText('Pull back. Let go. Bring the structure down.', CONFIG.CANVAS_WIDTH / 2, 305);
        ctx.restore();
    }

    function drawResultScreen(ctx, title, subtitle, detail) {
        drawBackdrop(ctx);
        drawPanel(ctx);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 54px ${DISPLAY_FONT}`;
        ctx.fillText(title, CONFIG.CANVAS_WIDTH / 2, 240);

        ctx.fillStyle = '#f7d774';
        ctx.font = `700 24px ${BODY_FONT}`;
        ctx.fillText(subtitle, CONFIG.CANVAS_WIDTH / 2, 285);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        ctx.font = `600 18px ${BODY_FONT}`;
        ctx.fillText(detail, CONFIG.CANVAS_WIDTH / 2, 320);
        ctx.restore();
    }

    function drawHud(ctx, gameState) {
        const birdsRemaining = Math.max(0, gameState.birdsRemaining || 0);

        drawHudChip(ctx, 24, 24, 190, 62, 'SCORE', formatScore(gameState.score), 'left');
        drawHudChip(
            ctx,
            CONFIG.CANVAS_WIDTH - 214,
            24,
            190,
            62,
            'BIRDS',
            String(birdsRemaining),
            'right'
        );
    }

    function drawHudChip(ctx, x, y, width, height, label, value, align) {
        ctx.save();
        ctx.fillStyle = 'rgba(16, 23, 38, 0.78)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 2;
        roundedRect(ctx, x, y, width, height, 16);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = align;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        ctx.font = `700 14px ${BODY_FONT}`;
        ctx.fillText(label, align === 'left' ? x + 18 : x + width - 18, y + 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = `900 24px ${BODY_FONT}`;
        ctx.fillText(value, align === 'left' ? x + 18 : x + width - 18, y + 48);
        ctx.restore();
    }

    function drawBackdrop(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(10, 16, 29, 0.56)';
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        ctx.restore();
    }

    function drawPanel(ctx) {
        const x = (CONFIG.CANVAS_WIDTH - PANEL_WIDTH) / 2;
        const y = (CONFIG.CANVAS_HEIGHT - PANEL_HEIGHT) / 2 - 20;

        ctx.save();
        ctx.fillStyle = 'rgba(20, 30, 49, 0.9)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = 2;
        roundedRect(ctx, x, y, PANEL_WIDTH, PANEL_HEIGHT, 24);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function roundedRect(ctx, x, y, width, height, radius) {
        const safeRadius = Math.min(radius, width / 2, height / 2);

        ctx.beginPath();
        ctx.moveTo(x + safeRadius, y);
        ctx.lineTo(x + width - safeRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
        ctx.lineTo(x + width, y + height - safeRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
        ctx.lineTo(x + safeRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
        ctx.lineTo(x, y + safeRadius);
        ctx.quadraticCurveTo(x, y, x + safeRadius, y);
        ctx.closePath();
    }

    function countAlive(entities) {
        return (entities || []).filter((entity) => entity.health === undefined || entity.health > 0).length;
    }

    function formatScore(score) {
        return Number(score || 0).toLocaleString('en-US');
    }

    return {
        init,
        draw,
    };
})();
