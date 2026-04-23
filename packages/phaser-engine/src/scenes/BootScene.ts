import Phaser from "phaser";
import { SCENE_KEYS } from "../core/SceneRegistry";

/**
 * BootScene — minimal first scene.
 *
 * Responsibilities:
 *   1. Perform any synchronous engine initialization.
 *   2. Preload lightweight global assets (none at foundation stage).
 *   3. Immediately transition to MainScene.
 *
 * Kept deliberately thin. Asset preloading for game modes will happen
 * in mode-specific loader scenes loaded by GameManager.loadMode().
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.BOOT });
  }

  preload(): void {
    // Reserved for future global asset loading (fonts, audio sprites, atlas).
    // At foundation stage nothing is needed.
  }

  create(): void {
    // Hand off immediately — no splash screen at this stage.
    this.scene.start(SCENE_KEYS.MAIN);
  }
}
