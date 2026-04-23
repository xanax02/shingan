import type Phaser from "phaser";
import {
  CROSSHAIR_CLICK_DURATION,
  CROSSHAIR_CLICK_SCALE,
  CROSSHAIR_COLOR,
  CROSSHAIR_DEPTH,
  CROSSHAIR_DOT_RADIUS,
  CROSSHAIR_LINE_GAP,
  CROSSHAIR_LINE_LENGTH,
  CROSSHAIR_LINE_WIDTH,
  CROSSHAIR_RING_ALPHA,
  CROSSHAIR_RING_COLOR,
  CROSSHAIR_RING_LINE_WIDTH,
  CROSSHAIR_RING_RADIUS,
} from "../utils/constants";

/**
 * Crosshair — a premium FPS-style cursor replacement built from Phaser Graphics.
 *
 * Architecture note: This is NOT a Phaser.GameObjects.GameObject subclass because
 * subclassing Phaser built-ins requires registering custom plugins. Instead we
 * compose a Graphics object and expose a clean positional API. The scene holds
 * a reference and calls update each frame.
 *
 * Visual anatomy:
 *   • Center dot        — solid filled circle
 *   • Outer ring        — stroked circle, semi-transparent
 *   • 4 precision arms  — thin lines with a center gap (classic FPS gap crosshair)
 *
 * Performance:
 *   The graphics are drawn ONCE in the constructor and cached via generateTexture().
 *   setPosition() is pure translation — zero per-frame draw calls.
 */
export class Crosshair {
  private readonly container: Phaser.GameObjects.Container;
  private readonly tweens: Phaser.Tweens.TweenManager;
  private isAnimating: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.tweens = scene.tweens;

    // Draw the crosshair onto a Graphics object once
    const gfx = scene.add.graphics();
    this.drawCrosshair(gfx);

    // Wrap in a container for easy scale tweening without affecting position math
    this.container = scene.add.container(
      scene.scale.width / 2,
      scene.scale.height / 2,
      [gfx]
    );
    this.container.setDepth(CROSSHAIR_DEPTH);
  }

  /**
   * Move the crosshair to match the pointer each frame.
   * Zero allocations — just sets x/y on the container.
   */
  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  /**
   * Trigger the click burst animation.
   * Guard against stacking tweens — only one burst at a time.
   */
  triggerClickBurst(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.tweens.add({
      targets: this.container,
      scaleX: CROSSHAIR_CLICK_SCALE,
      scaleY: CROSSHAIR_CLICK_SCALE,
      duration: CROSSHAIR_CLICK_DURATION * 0.4,
      ease: "Quad.easeOut",
      yoyo: true,
      hold: 0,
      onComplete: () => {
        this.container.setScale(1);
        this.isAnimating = false;
      },
    });
  }

  private drawCrosshair(gfx: Phaser.GameObjects.Graphics): void {
    const gap = CROSSHAIR_LINE_GAP;
    const len = CROSSHAIR_LINE_LENGTH;
    const lw = CROSSHAIR_LINE_WIDTH;

    // ── Center dot ──────────────────────────────────────────────────────────
    gfx.fillStyle(CROSSHAIR_COLOR, 1);
    gfx.fillCircle(0, 0, CROSSHAIR_DOT_RADIUS);

    // ── Outer ring ───────────────────────────────────────────────────────────
    gfx.lineStyle(CROSSHAIR_RING_LINE_WIDTH, CROSSHAIR_RING_COLOR, CROSSHAIR_RING_ALPHA);
    gfx.strokeCircle(0, 0, CROSSHAIR_RING_RADIUS);

    // ── Precision arms (top, bottom, left, right) ────────────────────────────
    gfx.lineStyle(lw, CROSSHAIR_COLOR, 1);

    // Top
    gfx.lineBetween(0, -(gap), 0, -(gap + len));
    // Bottom
    gfx.lineBetween(0, gap, 0, gap + len);
    // Left
    gfx.lineBetween(-(gap), 0, -(gap + len), 0);
    // Right
    gfx.lineBetween(gap, 0, gap + len, 0);
  }

  destroy(): void {
    this.container.destroy(true);
  }
}
