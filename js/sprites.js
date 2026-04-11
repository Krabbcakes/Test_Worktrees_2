const Sprites = {
    drawBird(ctx, bird) {
        if (!bird) {
            return;
        }

        const radius = bird.radius || CONFIG.BIRD_RADIUS;
        const facing = (bird.vx || 0) < -0.1 ? -1 : 1;

        ctx.save();

        Engine.drawCircle(ctx, bird.x, bird.y, radius, '#d93636');
        Engine.drawCircle(ctx, bird.x - radius * 0.2, bird.y - radius * 0.15, radius * 0.78, '#ef5656');

        ctx.fillStyle = '#f2c14f';
        ctx.beginPath();
        ctx.moveTo(bird.x + radius * 0.35 * facing, bird.y);
        ctx.lineTo(bird.x + radius * 0.9 * facing, bird.y - radius * 0.14);
        ctx.lineTo(bird.x + radius * 0.9 * facing, bird.y + radius * 0.14);
        ctx.closePath();
        ctx.fill();

        Engine.drawCircle(ctx, bird.x - radius * 0.24 * facing, bird.y - radius * 0.18, radius * 0.25, '#ffffff');
        Engine.drawCircle(ctx, bird.x + radius * 0.06 * facing, bird.y - radius * 0.12, radius * 0.23, '#ffffff');
        Engine.drawCircle(ctx, bird.x - radius * 0.18 * facing, bird.y - radius * 0.16, radius * 0.1, '#111111');
        Engine.drawCircle(ctx, bird.x + radius * 0.1 * facing, bird.y - radius * 0.11, radius * 0.09, '#111111');

        ctx.strokeStyle = '#4a1a1a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bird.x - radius * 0.5 * facing, bird.y - radius * 0.5);
        ctx.lineTo(bird.x - radius * 0.02 * facing, bird.y - radius * 0.35);
        ctx.moveTo(bird.x - radius * 0.08 * facing, bird.y - radius * 0.48);
        ctx.lineTo(bird.x + radius * 0.38 * facing, bird.y - radius * 0.3);
        ctx.stroke();

        ctx.restore();
    },

    drawPig(ctx, pig) {
        if (!pig) {
            return;
        }

        const radius = pig.radius || CONFIG.PIG_RADIUS;

        ctx.save();

        Engine.drawCircle(ctx, pig.x, pig.y, radius, '#7bcf57');
        Engine.drawCircle(ctx, pig.x - radius * 0.2, pig.y - radius * 0.2, radius * 0.78, '#96e06c');

        ctx.fillStyle = '#7bcf57';
        ctx.beginPath();
        ctx.arc(pig.x - radius * 0.45, pig.y - radius * 0.68, radius * 0.24, 0, Math.PI * 2);
        ctx.arc(pig.x + radius * 0.45, pig.y - radius * 0.68, radius * 0.24, 0, Math.PI * 2);
        ctx.fill();

        Engine.drawCircle(ctx, pig.x - radius * 0.28, pig.y - radius * 0.18, radius * 0.18, '#ffffff');
        Engine.drawCircle(ctx, pig.x + radius * 0.22, pig.y - radius * 0.18, radius * 0.18, '#ffffff');
        Engine.drawCircle(ctx, pig.x - radius * 0.26, pig.y - radius * 0.16, radius * 0.08, '#111111');
        Engine.drawCircle(ctx, pig.x + radius * 0.24, pig.y - radius * 0.16, radius * 0.08, '#111111');

        Engine.drawCircle(ctx, pig.x, pig.y + radius * 0.2, radius * 0.34, '#9be875');
        Engine.drawCircle(ctx, pig.x - radius * 0.12, pig.y + radius * 0.2, radius * 0.07, '#4a8931');
        Engine.drawCircle(ctx, pig.x + radius * 0.12, pig.y + radius * 0.2, radius * 0.07, '#4a8931');

        ctx.restore();
    },

    drawBlock(ctx, block) {
        if (!block) {
            return;
        }

        const width = block.w || CONFIG.BLOCK_SIZE;
        const height = block.h || CONFIG.BLOCK_SIZE;
        const colors = {
            wood: '#9b6a3b',
            stone: '#8a8f98',
            glass: '#9fd8ea'
        };
        const fill = colors[block.type] || '#9b6a3b';

        ctx.save();

        Engine.drawRect(ctx, block.x, block.y, width, height, fill);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, width, height);

        if (block.type === 'wood') {
            ctx.strokeStyle = 'rgba(80, 45, 20, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(block.x + width * 0.22, block.y + 2);
            ctx.lineTo(block.x + width * 0.22, block.y + height - 2);
            ctx.moveTo(block.x + width * 0.68, block.y + 2);
            ctx.lineTo(block.x + width * 0.68, block.y + height - 2);
            ctx.stroke();
        } else if (block.type === 'glass') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(block.x + width * 0.2, block.y + height * 0.2);
            ctx.lineTo(block.x + width * 0.8, block.y + height * 0.8);
            ctx.moveTo(block.x + width * 0.72, block.y + height * 0.18);
            ctx.lineTo(block.x + width * 0.84, block.y + height * 0.3);
            ctx.stroke();
        }

        ctx.restore();
    },

    drawAll(ctx, gameState) {
        if (!gameState) {
            return;
        }

        const blocks = Array.isArray(gameState.blocks) ? gameState.blocks : [];
        const pigs = Array.isArray(gameState.pigs) ? gameState.pigs : [];
        const birds = Array.isArray(gameState.birds) ? gameState.birds : [];

        blocks
            .filter((block) => block && (typeof block.health !== 'number' || block.health > 0))
            .forEach((block) => this.drawBlock(ctx, block));

        pigs
            .filter((pig) => pig && (typeof pig.health !== 'number' || pig.health > 0))
            .forEach((pig) => this.drawPig(ctx, pig));

        birds.forEach((bird) => this.drawBird(ctx, bird));

        if (gameState.activeBird && !birds.includes(gameState.activeBird)) {
            this.drawBird(ctx, gameState.activeBird);
        }
    }
};
