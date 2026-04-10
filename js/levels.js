const Levels = window.Levels = (() => {
    const TYPE_HEALTH = {
        wood: 2,
        stone: 4,
        glass: 1,
    };

    const LEVEL_DEFINITIONS = [
        {
            birds: 3,
            pigs: [
                { x: 755, y: 415 },
                { x: 765, y: 275 },
            ],
            blocks: [
                { x: 700, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 780, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 690, y: 320, w: 130, h: 30, type: 'wood' },
                { x: 730, y: 290, w: 70, h: 20, type: 'wood' },
            ],
        },
        {
            birds: 4,
            pigs: [
                { x: 690, y: 415 },
                { x: 820, y: 415 },
                { x: 755, y: 290 },
            ],
            blocks: [
                { x: 660, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 820, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 700, y: 350, w: 30, h: 80, type: 'glass' },
                { x: 780, y: 350, w: 30, h: 80, type: 'glass' },
                { x: 650, y: 320, w: 210, h: 24, type: 'wood' },
                { x: 710, y: 260, w: 30, h: 60, type: 'glass' },
                { x: 770, y: 260, w: 30, h: 60, type: 'glass' },
                { x: 690, y: 230, w: 130, h: 24, type: 'wood' },
            ],
        },
        {
            birds: 5,
            pigs: [
                { x: 700, y: 415 },
                { x: 820, y: 415 },
                { x: 760, y: 315 },
                { x: 760, y: 215 },
            ],
            blocks: [
                { x: 640, y: 350, w: 30, h: 80, type: 'stone' },
                { x: 730, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 790, y: 350, w: 30, h: 80, type: 'wood' },
                { x: 850, y: 350, w: 30, h: 80, type: 'stone' },
                { x: 670, y: 350, w: 40, h: 80, type: 'glass' },
                { x: 810, y: 350, w: 40, h: 80, type: 'glass' },
                { x: 635, y: 320, w: 250, h: 26, type: 'stone' },
                { x: 700, y: 260, w: 30, h: 60, type: 'glass' },
                { x: 790, y: 260, w: 30, h: 60, type: 'glass' },
                { x: 720, y: 230, w: 80, h: 24, type: 'wood' },
                { x: 740, y: 170, w: 30, h: 60, type: 'stone' },
                { x: 700, y: 140, w: 110, h: 22, type: 'glass' },
            ],
        },
    ];

    function load(levelIndex, gameState) {
        const safeIndex = normalizeIndex(levelIndex);
        const level = LEVEL_DEFINITIONS[safeIndex];
        const preserveMenu = gameState.phase === 'menu';

        gameState.currentLevel = safeIndex;
        gameState.score = 0;
        gameState.pigs = level.pigs.map(createPig);
        gameState.blocks = level.blocks.map(createBlock);
        gameState.birds = createBirds(level.birds);
        gameState.birdsRemaining = gameState.birds.length;
        gameState.activeBird = gameState.birds[0] || null;
        gameState.phase = preserveMenu ? 'menu' : 'aiming';
        gameState.totalLevels = LEVEL_DEFINITIONS.length;
        gameState._scoreResetPending = true;
    }

    function count() {
        return LEVEL_DEFINITIONS.length;
    }

    function normalizeIndex(levelIndex) {
        const totalLevels = LEVEL_DEFINITIONS.length;
        const numericIndex = Number(levelIndex);

        if (!Number.isFinite(numericIndex)) {
            return 0;
        }

        return ((numericIndex % totalLevels) + totalLevels) % totalLevels;
    }

    function createPig(pig) {
        return {
            x: pig.x,
            y: pig.y,
            radius: CONFIG.PIG_RADIUS,
            health: pig.health || 1,
        };
    }

    function createBirds(count) {
        return Array.from({ length: Math.min(count, CONFIG.MAX_BIRDS_PER_LEVEL) }, (_, index) => ({
            x: index === 0 ? CONFIG.SLINGSHOT_X : CONFIG.SLINGSHOT_X - 55 - ((index - 1) * 34),
            y: index === 0 ? CONFIG.SLINGSHOT_Y : CONFIG.GROUND_Y - CONFIG.BIRD_RADIUS,
            radius: CONFIG.BIRD_RADIUS,
            vx: 0,
            vy: 0,
            launched: false,
        }));
    }

    function createBlock(block) {
        const blockFromStructures = (
            typeof Structures !== 'undefined' &&
            Structures &&
            typeof Structures.create === 'function'
        ) ? Structures.create(block.type, block.x, block.y) : null;

        return {
            x: block.x,
            y: block.y,
            w: block.w || CONFIG.BLOCK_SIZE,
            h: block.h || CONFIG.BLOCK_SIZE,
            type: block.type,
            health: (
                blockFromStructures &&
                typeof blockFromStructures.health === 'number'
            ) ? blockFromStructures.health : TYPE_HEALTH[block.type] || 2,
        };
    }

    return {
        load,
        count,
    };
})();
