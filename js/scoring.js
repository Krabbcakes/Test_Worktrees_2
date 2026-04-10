const Scoring = window.Scoring = (() => {
    function update(gameState) {
        const livePigs = countAlive(gameState.pigs);
        const liveBlocks = countAlive(gameState.blocks);
        const shouldResetTracking =
            gameState._scoreResetPending ||
            typeof gameState._trackedPigCount !== 'number' ||
            typeof gameState._trackedBlockCount !== 'number' ||
            gameState._trackedLevel !== gameState.currentLevel;

        if (shouldResetTracking) {
            gameState._trackedPigCount = livePigs;
            gameState._trackedBlockCount = liveBlocks;
            gameState._trackedLevel = gameState.currentLevel;
            gameState._scoreResetPending = false;
        } else {
            const pigsDestroyed = Math.max(0, gameState._trackedPigCount - livePigs);
            const blocksDestroyed = Math.max(0, gameState._trackedBlockCount - liveBlocks);

            if (pigsDestroyed > 0) {
                gameState.score += pigsDestroyed * CONFIG.SCORE_PIG_HIT;
            }

            if (blocksDestroyed > 0) {
                gameState.score += blocksDestroyed * CONFIG.SCORE_BLOCK_DESTROYED;
            }

            gameState._trackedPigCount = livePigs;
            gameState._trackedBlockCount = liveBlocks;
            gameState._trackedLevel = gameState.currentLevel;
        }

        if (livePigs === 0 && gameState.phase !== 'menu') {
            gameState.phase = 'win';
            return;
        }

        if (isLoseState(gameState, livePigs)) {
            gameState.phase = 'lose';
        }
    }

    function isLoseState(gameState, livePigs) {
        const birdsRemaining = Number(gameState.birdsRemaining || 0);
        const isPlayablePhase = gameState.phase !== 'menu' && gameState.phase !== 'win' && gameState.phase !== 'lose';

        return isPlayablePhase && birdsRemaining <= 0 && livePigs > 0;
    }

    function countAlive(entities) {
        return (entities || []).filter((entity) => entity.health === undefined || entity.health > 0).length;
    }

    return {
        update,
    };
})();
