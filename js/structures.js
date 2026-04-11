const Structures = (() => {
    const HEALTH_BY_TYPE = {
        wood: 2,
        stone: 4,
        glass: 1,
    };

    function getType(type) {
        return Object.prototype.hasOwnProperty.call(HEALTH_BY_TYPE, type) ? type : 'wood';
    }

    function create(type, x, y) {
        const blockType = getType(type);

        return {
            x,
            y,
            w: CONFIG.BLOCK_SIZE,
            h: CONFIG.BLOCK_SIZE,
            health: HEALTH_BY_TYPE[blockType],
            type: blockType,
        };
    }

    function applyDamage(block, force) {
        if (!block) {
            return 0;
        }

        if (typeof block.health !== 'number') {
            block.health = HEALTH_BY_TYPE[getType(block.type)];
        }

        const damage = Math.max(1, Math.floor(Math.max(0, force) / 6));
        block.health -= damage;

        return damage;
    }

    return {
        create,
        applyDamage,
    };
})();

globalThis.Structures = Structures;
