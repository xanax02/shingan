import type { GameMode } from "../types/game.js";

/**
 * Scene keys — single source of truth for all Phaser scene identifiers.
 * Import from here rather than using raw strings anywhere.
 */
export const SCENE_KEYS = {
  BOOT: "BootScene",
  MAIN: "MainScene",
} as const;

export type SceneKey = (typeof SCENE_KEYS)[keyof typeof SCENE_KEYS];

/**
 * Mode-to-scene-key registry.
 * When loadMode() is implemented in Phase 2, GameManager will look up
 * the scene key here and start the appropriate scene.
 *
 * Pattern: add the scene class to the Phaser game config AND add an entry
 * here so loadMode("gridshot") → starts the right scene automatically.
 */
export const MODE_SCENE_MAP: Record<GameMode, string> = {
  gridshot: "GridShotScene",
  tracking: "TrackingScene",
  reaction: "ReactionScene",
};
