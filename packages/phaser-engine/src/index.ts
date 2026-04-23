/**
 * @repo/game-engine — Public API surface
 *
 * Only import from this file in consuming packages. Internal module paths
 * are considered private and may change between versions.
 *
 * Usage (gridshot trainer) in React:
 *
 *   import { createGridshotTrainer } from "@repo/game-engine";
 *   const handle = createGridshotTrainer(canvasDiv, overlayDiv, { targetFps: 144 });
 *   return () => { handle.destroy(); };
 *
 * Usage (tracking trainer) in React:
 *
 *   import { createTrackingTrainer } from "@repo/game-engine";
 *   const handle = createTrackingTrainer(canvasDiv, overlayDiv, { targetFps: 144 });
 *   return () => { handle.destroy(); };
 *
 * Usage (reaction trainer) in React:
 *
 *   import { createReactionTrainer } from "@repo/game-engine";
 *   const handle = createReactionTrainer(canvasDiv, overlayDiv, { targetFps: 144 });
 *   return () => { handle.destroy(); };
 */

// ── Gridshot trainer ──────────────────────────────────────────────────────────
export { createGridshotTrainer } from "./core/GridshotManager";

// ── Tracking trainer ──────────────────────────────────────────────────────────
export { createTrackingTrainer } from "./core/TrackingManager";

// ── Reaction trainer ──────────────────────────────────────────────────────────
export { createReactionTrainer } from "./core/ReactionManager";

// ── Aim trainer (crosshair sandbox — legacy) ──────────────────────────────────
export { createAimTrainer } from "./core/GameManager";

// ── Public types ──────────────────────────────────────────────────────────────
export type {
  AimTrainerHandle,
  AimTrainerOptions,
  GameMode,
  InputSnapshot,
  DebugStats,
  ReactionTrainerHandle,
  GridshotTrainerHandle,
  TrackingTrainerHandle,
} from "./types/game";

// ── Utilities (exposed for consuming packages like game-core) ─────────────────
export { clamp, lerp, distance2D, mapRange, degToRad } from "./utils/math";
export { SCENE_KEYS, MODE_SCENE_MAP } from "./core/SceneRegistry";
