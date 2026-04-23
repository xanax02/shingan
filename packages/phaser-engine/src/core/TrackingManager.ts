import Phaser from "phaser";
import { buildTrackingConfig } from "../config";
import { SCENE_KEYS } from "./SceneRegistry";
import type { AimTrainerOptions, TrackingTrainerHandle } from "../types/game";

/**
 * TrackingManager — owns the Phaser.Game instance for the Tracking Trainer.
 */
export class TrackingManager {
  private game: Phaser.Game | null = null;

  init(
    container: HTMLElement,
    overlayContainer: HTMLElement,
    options: AimTrainerOptions = {},
  ): void {
    if (this.game) {
      console.warn("[TrackingManager] Already initialized. Call destroy() first.");
      return;
    }
    const config = buildTrackingConfig(container, overlayContainer, options);
    this.game = new Phaser.Game(config);
  }

  destroy(): void {
    if (!this.game) return;
    this.game.destroy(true, false);
    this.game = null;
  }

  pause(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.TRACKING);
    if (scene?.sys.isActive()) scene.scene.pause();
  }

  resume(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.TRACKING);
    if (scene?.sys.isPaused()) scene.scene.resume();
  }
}

/**
 * createTrackingTrainer — public factory for the Tracking Trainer.
 */
export function createTrackingTrainer(
  container: HTMLElement,
  overlayContainer: HTMLElement,
  options?: AimTrainerOptions,
): TrackingTrainerHandle {
  const manager = new TrackingManager();
  manager.init(container, overlayContainer, options);
  return {
    destroy: () => manager.destroy(),
    pause:   () => manager.pause(),
    resume:  () => manager.resume(),
  };
}
