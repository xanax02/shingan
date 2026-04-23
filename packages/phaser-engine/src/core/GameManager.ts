import Phaser from "phaser";
import { buildPhaserConfig } from "../config";
import { SCENE_KEYS } from "./SceneRegistry";
import type { AimTrainerOptions, AimTrainerHandle, GameMode } from "../types/game";

/**
 * GameManager — owns the Phaser.Game instance and provides the public
 * lifecycle API consumed by the React layer.
 *
 * One instance per mounted React component. The handle returned by
 * createAimTrainer() delegates to this class.
 *
 * Design decisions:
 *   - Not a singleton. Multiple instances can coexist on the page
 *     (though the /train route only mounts one at a time).
 *   - Phaser is initialized lazily on init() so tree-shaking still works
 *     for pages that don't use the engine.
 *   - destroy() calls game.destroy(true, false) — removes canvas from DOM
 *     and stops the loop, but does NOT remove the parent container element.
 */
export class GameManager {
  private game: Phaser.Game | null = null;

  init(container: HTMLElement, options: AimTrainerOptions = {}): void {
    if (this.game) {
      console.warn("[GameManager] Already initialized. Call destroy() first.");
      return;
    }

    const config = buildPhaserConfig(container, options);
    this.game = new Phaser.Game(config);
  }

  /**
   * Tear down the Phaser runtime completely.
   * Safe to call multiple times — idempotent after first call.
   */
  destroy(): void {
    if (!this.game) return;
    // true  = remove canvas from DOM
    // false = do NOT destroy the parent container element
    this.game.destroy(true, false);
    this.game = null;
  }

  /**
   * Pause the currently running main scene's update loop.
   * Audio (when added) continues unless explicitly paused.
   */
  pause(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.MAIN);
    if (scene?.sys.isActive()) {
      scene.scene.pause();
    }
  }

  /**
   * Resume a paused main scene.
   */
  resume(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.MAIN);
    if (scene?.sys.isPaused()) {
      scene.scene.resume();
    }
  }

  /**
   * Load a training mode. Not implemented at foundation stage.
   * Phase 2: start the mode's scene via MODE_SCENE_MAP.
   */
  loadMode(_mode: GameMode): void {
    throw new Error(
      "[GameManager] loadMode() is not yet implemented. Phase 2 feature."
    );
  }
}

/**
 * createAimTrainer — the package's single public entry point.
 *
 * Returns an AimTrainerHandle (plain object) so React can store it in
 * useRef without needing to manage a class instance directly.
 *
 * @param container  The DOM element to mount the Phaser canvas into.
 * @param options    Optional engine configuration.
 */
export function createAimTrainer(
  container: HTMLElement,
  options?: AimTrainerOptions
): AimTrainerHandle {
  const manager = new GameManager();
  manager.init(container, options);

  return {
    destroy: () => manager.destroy(),
    pause: () => manager.pause(),
    resume: () => manager.resume(),
    loadMode: (mode: GameMode) => manager.loadMode(mode),
  };
}
