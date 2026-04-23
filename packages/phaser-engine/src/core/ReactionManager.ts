import Phaser from "phaser";
import { buildReactionConfig } from "../config";
import { SCENE_KEYS } from "./SceneRegistry";
import type { AimTrainerOptions, ReactionTrainerHandle } from "../types/game";

/**
 * ReactionManager — owns the Phaser.Game instance for the Reaction Trainer.
 *
 * Mirrors GameManager but for the reaction mode. Kept separate to avoid
 * coupling the two trainer flows and to allow independent configuration.
 *
 * The overlayContainer is a sibling div of the canvas container, managed
 * by React. ReactionScene receives it via Phaser's postBoot callback and
 * mounts all HTML UI inside it.
 */
export class ReactionManager {
  private game: Phaser.Game | null = null;

  init(
    container: HTMLElement,
    overlayContainer: HTMLElement,
    options: AimTrainerOptions = {},
  ): void {
    if (this.game) {
      console.warn("[ReactionManager] Already initialized. Call destroy() first.");
      return;
    }

    const config = buildReactionConfig(container, overlayContainer, options);
    this.game = new Phaser.Game(config);
  }

  /**
   * Tear down Phaser and remove the canvas. Idempotent.
   */
  destroy(): void {
    if (!this.game) return;
    this.game.destroy(true, false);
    this.game = null;
  }

  pause(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.REACTION);
    if (scene?.sys.isActive()) scene.scene.pause();
  }

  resume(): void {
    if (!this.game) return;
    const scene = this.game.scene.getScene(SCENE_KEYS.REACTION);
    if (scene?.sys.isPaused()) scene.scene.resume();
  }
}

/**
 * createReactionTrainer — public factory for the Reaction Time Trainer.
 *
 * @param container        HTMLElement that Phaser renders the canvas into.
 * @param overlayContainer HTMLElement (sibling div) where HTML HUD/modal are mounted.
 * @param options          Optional engine configuration.
 */
export function createReactionTrainer(
  container: HTMLElement,
  overlayContainer: HTMLElement,
  options?: AimTrainerOptions,
): ReactionTrainerHandle {
  const manager = new ReactionManager();
  manager.init(container, overlayContainer, options);

  return {
    destroy: () => manager.destroy(),
    pause:   () => manager.pause(),
    resume:  () => manager.resume(),
  };
}
