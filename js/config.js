// ─── Shared Game Configuration ──────────────────────────────────────────────
// This file defines constants and interfaces shared across all modules.
// Worktree branches should NOT modify this file — it's the shared contract.

const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 960,
    CANVAS_HEIGHT: 540,
    FPS: 60,

    // Physics
    GRAVITY: 0.5,
    FRICTION: 0.8,
    BOUNCE: 0.4,
    GROUND_Y: 440,  // ground level in canvas coords

    // Slingshot
    SLINGSHOT_X: 150,
    SLINGSHOT_Y: 380,
    MAX_PULL_DISTANCE: 100,
    LAUNCH_POWER: 8,

    // Sprites
    BIRD_RADIUS: 15,
    PIG_RADIUS: 15,
    BLOCK_SIZE: 30,

    // Game
    MAX_BIRDS_PER_LEVEL: 5,
    SCORE_PIG_HIT: 1000,
    SCORE_BLOCK_DESTROYED: 100,
};

// ─── Game State (mutable, shared across modules) ────────────────────────────
const GameState = {
    currentLevel: 0,
    score: 0,
    birdsRemaining: 0,
    pigs: [],           // { x, y, radius, health }
    blocks: [],         // { x, y, w, h, health, type }
    birds: [],          // { x, y, radius, vx, vy, launched }
    activeBird: null,   // the bird currently being aimed/flying
    phase: 'menu',      // 'menu' | 'aiming' | 'flying' | 'settling' | 'win' | 'lose'
};
