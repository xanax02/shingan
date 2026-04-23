// ─── Renderer ──────────────────────────────────────────────────────────────
/** Deep-space dark background matching the brand palette. */
export const CANVAS_BG_COLOR = 0x070710;

/** Default high-refresh target. Phaser will aim for this but won't exceed display rate. */
export const TARGET_FPS = 144;

// ─── Crosshair Visual Constants ────────────────────────────────────────────
/** Primary crosshair color — sharp electric cyan. */
export const CROSSHAIR_COLOR = 0x00c8ff;

/** Subtle glow/ring color — slightly desaturated cyan. */
export const CROSSHAIR_RING_COLOR = 0x0090bb;

/** Center dot radius in pixels. */
export const CROSSHAIR_DOT_RADIUS = 2.5;

/** Outer ring radius in pixels. */
export const CROSSHAIR_RING_RADIUS = 10;

/** Ring line width in pixels. */
export const CROSSHAIR_RING_LINE_WIDTH = 1.2;

/** Length of each precision line from center (gap + line). */
export const CROSSHAIR_LINE_LENGTH = 6;

/** Gap between center dot and start of precision lines. */
export const CROSSHAIR_LINE_GAP = 4;

/** Line thickness of precision arms. */
export const CROSSHAIR_LINE_WIDTH = 1.2;

/** Alpha of the outer ring (subtle, not distracting). */
export const CROSSHAIR_RING_ALPHA = 0.55;

/** Click burst scale multiplier. */
export const CROSSHAIR_CLICK_SCALE = 1.45;

/** Click burst tween duration in milliseconds. */
export const CROSSHAIR_CLICK_DURATION = 130;

// ─── Debug HUD ─────────────────────────────────────────────────────────────
/** HUD text color — neon-white that reads on any dark background. */
export const DEBUG_TEXT_COLOR = "#c0f0ff";

/** HUD background fill color (Phaser integer). */
export const DEBUG_BG_COLOR = 0x000d1a;

/** HUD background alpha. */
export const DEBUG_BG_ALPHA = 0.72;

/** HUD font size in px. */
export const DEBUG_FONT_SIZE = "12px";

/** HUD font family — monospace for aligned columns. */
export const DEBUG_FONT_FAMILY = "'Courier New', 'Consolas', monospace";

/** Padding inside HUD panel. */
export const DEBUG_PADDING = 10;

/** HUD render depth — always topmost. */
export const DEBUG_DEPTH = 1000;

// ─── Crosshair Depth ───────────────────────────────────────────────────────
/** Crosshair depth — above game objects, below debug. */
export const CROSSHAIR_DEPTH = 500;

// ─── Reaction Trainer ────────────────────────────────────────────────────────

/** Minimum random delay before target spawns (ms). */
export const REACTION_MIN_DELAY_MS = 500;

/** Maximum random delay before target spawns (ms). */
export const REACTION_MAX_DELAY_MS = 2500;

/** Total rounds per session. */
export const REACTION_TOTAL_ROUNDS = 10;

/** Target circle radius in pixels. */
export const TARGET_RADIUS = 38;

/** Primary target fill color — electric cyan. */
export const TARGET_COLOR = 0x00c8ff;

/** Target inner highlight color (slightly lighter). */
export const TARGET_HIGHLIGHT_COLOR = 0x80e8ff;

/** Target outer glow ring color. */
export const TARGET_GLOW_COLOR = 0x00c8ff;

/** Phaser depth for the target (above background, below HUD). */
export const TARGET_DEPTH = 200;

/** Particle depth — above target. */
export const TARGET_PARTICLE_DEPTH = 210;

/** Duration (ms) of the scale-in spawn animation. */
export const TARGET_SPAWN_DURATION = 160;

/** Minimum pixel margin from any canvas edge for target placement. */
export const TARGET_SAFE_MARGIN = 80;

/** Grade thresholds (average reaction ms). */
export const GRADE_S_MAX = 180;
export const GRADE_A_MAX = 210;
export const GRADE_B_MAX = 240;
export const GRADE_C_MAX = 280;

/** Z-index for HTML overlay sitting above the Phaser canvas. */
export const OVERLAY_Z_INDEX = 100;

/** Z-index for the end-session modal (above overlay). */
export const MODAL_Z_INDEX = 200;

/** Reaction scene key constant (mirrors SceneRegistry). */
export const REACTION_SCENE_KEY = 'ReactionScene';

// ─── Gridshot Trainer ──────────────────────────────────────────────────────

/** Session duration in milliseconds. */
export const GRIDSHOT_DURATION_MS = 60_000;

/** Number of targets always alive on screen. */
export const GRIDSHOT_TARGET_COUNT = 3;

// ─── Tracking Trainer ──────────────────────────────────────────────────────

/** Session duration in milliseconds. */
export const TRACKING_DURATION_MS = 30_000;

/** Tracking target radius — slightly larger so tracking is skill-tested, not hunting. */
export const TRACKING_TARGET_RADIUS = 48;

