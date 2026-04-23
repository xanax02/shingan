import Phaser from "phaser";
import { GameEventBus } from "./GameEvents";
import { ResizeSystem } from "../systems/ResizeSystem";

/**
 * BaseScene — shared base class for all trainer mode scenes.
 *
 * Provides:
 *   • A shared GameEventBus instance (created here, injected into systems).
 *   • A ResizeSystem wired to Phaser's Scale manager.
 *   • safeDestroy() — null-safe game object teardown.
 *   • shutdown() hook that cleans up the bus and resize system automatically.
 *
 * Subclasses must call super.create() at the start of their own create(),
 * and super.shutdown() at the start of their own shutdown() (if overridden).
 */
export abstract class BaseScene extends Phaser.Scene {
  /** Shared typed event bus. Systems receive a reference in their constructor. */
  protected readonly bus: GameEventBus = new GameEventBus();

  /** Resize system — wired in create(), destroyed in shutdown(). */
  protected resizeSystem!: ResizeSystem;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  create(): void {
    this.resizeSystem = new ResizeSystem(this.scale);
  }

  shutdown(): void {
    this.resizeSystem?.destroy();
    this.bus.destroy();
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /**
   * Null-safe destruction for any Phaser display object or container.
   * Silently skips if already destroyed or null/undefined.
   */
  protected safeDestroy(
    obj: Phaser.GameObjects.GameObject | null | undefined,
  ): void {
    if (obj && !obj.active) return;
    obj?.destroy();
  }

  /**
   * Utility: draw the ambient dot-grid background onto a Graphics object.
   * Shared between ReactionScene and MainScene.
   */
  protected drawAmbientGrid(gfx: Phaser.GameObjects.Graphics): void {
    const { width, height } = this.scale;
    const spacing = 40;

    gfx.fillStyle(0x070710, 1);
    gfx.fillRect(0, 0, width, height);

    gfx.fillStyle(0x00c8ff, 0.04);
    for (let x = 0; x <= width; x += spacing) {
      for (let y = 0; y <= height; y += spacing) {
        gfx.fillCircle(x, y, 1);
      }
    }

    gfx.setDepth(0);
    gfx.setScrollFactor(0);
  }
}
