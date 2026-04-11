const Engine = {
    clear(ctx) {
        const width = CONFIG.CANVAS_WIDTH;
        const height = CONFIG.CANVAS_HEIGHT;
        const groundTop = CONFIG.GROUND_Y;

        ctx.clearRect(0, 0, width, height);

        const skyGradient = ctx.createLinearGradient(0, 0, 0, groundTop);
        skyGradient.addColorStop(0, '#7ecbff');
        skyGradient.addColorStop(0.7, '#bfe7ff');
        skyGradient.addColorStop(1, '#f1fbff');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, width, groundTop);

        const grassHeight = Math.max(18, Math.round((height - groundTop) * 0.25));
        ctx.fillStyle = '#78c850';
        ctx.fillRect(0, groundTop, width, grassHeight);

        const dirtGradient = ctx.createLinearGradient(0, groundTop + grassHeight, 0, height);
        dirtGradient.addColorStop(0, '#8f5a2d');
        dirtGradient.addColorStop(1, '#5e381b');
        ctx.fillStyle = dirtGradient;
        ctx.fillRect(0, groundTop + grassHeight, width, height - groundTop - grassHeight);
    },

    drawCircle(ctx, x, y, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    },

    drawRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
};
