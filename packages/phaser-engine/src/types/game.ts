/**
 * Supported training modes. Only the type enum is defined here — implementations
 * live in packages/game-core when built out. Keeps the engine mode-agnostic.
 */
export type GameMode = "gridshot" | "tracking" | "reaction";

/**
 * Options accepted by createAimTrainer(). All fields optional so callers
 * can zero-config or gradually tune the engine.
 */
export interface AimTrainerOptions {
  /** Initial mode to load once the engine boots. Defaults to no mode (free canvas). */
  mode?: GameMode;
  /** Show the debug HUD overlay. Defaults to true in dev, false in prod. */
  debug?: boolean;
  /** Target FPS cap. Defaults to 144. */
  targetFps?: number;
  /** Custom crosshair color override (CSS hex). */
  crosshairColor?: number;
}

/**
 * A point-in-time snapshot of input state for a single frame.
 * Consumed by systems that need read-only access to cursor data.
 */
export interface InputSnapshot {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  isDown: boolean;
  clickCount: number;
  lastClickTimestamp: number;
}

/**
 * Data passed to DebugSystem.update() each frame.
 */
export interface DebugStats {
  fps: number;
  deltaMs: number;
  pointerX: number;
  pointerY: number;
  clickCount: number;
}

/**
 * The handle returned by createAimTrainer(). React components store this
 * in a useRef and call destroy() on unmount.
 */
export interface AimTrainerHandle {
  /** Tear down the Phaser game instance and remove all DOM nodes. */
  destroy(): void;
  /** Pause the active scene's update loop. */
  pause(): void;
  /** Resume a paused scene. */
  resume(): void;
  /**
   * Load a training mode scene. Not yet implemented — reserved for Phase 2.
   * @throws Error if called before implementation.
   */
  loadMode(mode: GameMode): void;
}

/**
 * Handle returned by createReactionTrainer().
 * Mirrors AimTrainerHandle but without loadMode.
 */
export interface ReactionTrainerHandle {
  destroy(): void;
  pause(): void;
  resume(): void;
}

/**
 * Handle returned by createGridshotTrainer().
 */
export interface GridshotTrainerHandle {
  destroy(): void;
  pause(): void;
  resume(): void;
}

/**
 * Handle returned by createTrackingTrainer().
 */
export interface TrackingTrainerHandle {
  destroy(): void;
  pause(): void;
  resume(): void;
}
