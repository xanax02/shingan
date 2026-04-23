import type Phaser from "phaser";
import type { DebugStats } from "../types/game";
import {
  DEBUG_BG_ALPHA,
  DEBUG_BG_COLOR,
  DEBUG_DEPTH,
  DEBUG_FONT_FAMILY,
  DEBUG_FONT_SIZE,
  DEBUG_PADDING,
  DEBUG_TEXT_COLOR,
} from "../utils/constants";

/**
 * DebugSystem — renders a live HUD panel in the top-left corner.
 *
 * Uses a Phaser Text object + a Graphics background rect.
 * update() is called each frame — string templates are kept simple to
 * avoid per-frame allocations (padStart is allocation-light).
 */
export class DebugSystem {
  private readonly bg: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;

  /** Cached panel width so we only redraw bg when it changes. */
  private panelWidth: number = 0;
  private panelHeight: number = 0;

  constructor(private readonly scene: Phaser.Scene) {
    const p = DEBUG_PADDING;

    // Background panel — drawn once, then redrawn if size changes
    this.bg = scene.add.graphics();
    this.bg.setScrollFactor(0);
    this.bg.setDepth(DEBUG_DEPTH - 1);

    // Text label
    this.label = scene.add.text(p, p, "", {
      fontSize: DEBUG_FONT_SIZE,
      fontFamily: DEBUG_FONT_FAMILY,
      color: DEBUG_TEXT_COLOR,
      lineSpacing: 4,
      resolution: 2, // Render at 2× for sharp text on high-DPI displays
    });
    this.label.setScrollFactor(0);
    this.label.setDepth(DEBUG_DEPTH);
  }

  /**
   * Call once per frame with the current stats snapshot.
   * Formats values and refreshes both text and background.
   */
  update(stats: DebugStats): void {
    const text = [
      `FPS      ${stats.fps.toFixed(1).padStart(6)}`,
      `Delta    ${stats.deltaMs.toFixed(2).padStart(6)} ms`,
      `Cursor   ${Math.round(stats.pointerX).toString().padStart(5)}, ${Math.round(stats.pointerY).toString().padStart(5)}`,
      `Clicks   ${stats.clickCount.toString().padStart(6)}`,
    ].join("\n");

    this.label.setText(text);

    // Only redraw background if size changed (avoids per-frame Graphics clear+redraw)
    const w = this.label.width + DEBUG_PADDING * 2;
    const h = this.label.height + DEBUG_PADDING * 2;

    if (w !== this.panelWidth || h !== this.panelHeight) {
      this.panelWidth = w;
      this.panelHeight = h;
      this.redrawBg(w, h);
    }
  }

  private redrawBg(w: number, h: number): void {
    this.bg.clear();
    this.bg.fillStyle(DEBUG_BG_COLOR, DEBUG_BG_ALPHA);
    this.bg.fillRoundedRect(0, 0, w, h, 6);
  }

  /** Show/hide the HUD without destroying it. */
  setVisible(visible: boolean): void {
    this.bg.setVisible(visible);
    this.label.setVisible(visible);
  }

  destroy(): void {
    this.label.destroy();
    this.bg.destroy();
  }
}
