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
