import Phaser from "phaser";
import { buildGridshotConfig } from "../config";
import { SCENE_KEYS } from "./SceneRegistry";
import type { AimTrainerOptions, GridshotTrainerHandle } from "../types/game";

/**
 * GridshotManager — owns the Phaser.Game instance for the Gridshot Trainer.
 */
export class GridshotManager {
  private game: Phaser.Game | null = null;

  init(
    container: HTMLElement,
    overlayContainer: HTMLElement,
    options: AimTrainerOptions = {},
  ): void {
    if (this.game) {
      console.warn("[GridshotManager] Already initialized. Call destroy() first.");
      return;
    }
    const config = buildGridshotConfig(container, overlayContainer, options);
    this.game = new Phaser.Game(config);
  }

  destroy(): void {
    if (!this.game) return;
    this.game.destroy(true, false);
    this.game = null;
  }

  pause(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.GRIDSHOT);
    if (scene?.sys.isActive()) scene.scene.pause();
  }

  resume(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.GRIDSHOT);
    if (scene?.sys.isPaused()) scene.scene.resume();
  }
}

/**
 * createGridshotTrainer — public factory for the Gridshot 3-ball Trainer.
 */
export function createGridshotTrainer(
  container: HTMLElement,
  overlayContainer: HTMLElement,
  options?: AimTrainerOptions,
): GridshotTrainerHandle {
  const manager = new GridshotManager();
  manager.init(container, overlayContainer, options);
  return {
    destroy: () => manager.destroy(),
    pause:   () => manager.pause(),
    resume:  () => manager.resume(),
  };
}
