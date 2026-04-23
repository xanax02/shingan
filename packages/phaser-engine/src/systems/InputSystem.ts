import type Phaser from "phaser";
import type { InputSnapshot } from "../types/game";

/**
 * InputSystem — wraps Phaser's built-in pointer and presents a clean,
 * polling-based API. Designed for direct read in update() loops with
 * zero latency overhead (no event queue, no React state).
 *
 * Usage:
 *   const input = new InputSystem(this.input);
 *   // inside update():
 *   input.tick(this.input.activePointer);
 *   const x = input.getX();
 */
export class InputSystem {
  private x: number = 0;
  private y: number = 0;
  private prevX: number = 0;
  private prevY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;
  private down: boolean = false;
  private clickCount: number = 0;
  private lastClickTimestamp: number = 0;

  /** Set true when a fresh click lands in this frame, cleared at end of tick. */
  private clickedThisFrame: boolean = false;

  constructor(private readonly inputPlugin: Phaser.Input.InputPlugin) {
    // Register click listener once — sets the frame flag rather than queuing.
    this.inputPlugin.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        this.clickedThisFrame = true;
        this.clickCount++;
        this.lastClickTimestamp = pointer.downTime;
      }
    );
  }

  /**
   * Called once per frame from the scene's update().
   * Syncs pointer state before any system reads the values.
   */
  tick(pointer: Phaser.Input.Pointer): void {
    this.prevX = this.x;
    this.prevY = this.y;

    this.x = pointer.x;
    this.y = pointer.y;
    this.deltaX = this.x - this.prevX;
    this.deltaY = this.y - this.prevY;
    this.down = pointer.isDown;
  }

  /**
   * Reset per-frame flags. Call at the END of each update() after all
   * systems have had a chance to read wasClickedThisFrame().
   */
  endFrame(): void {
    this.clickedThisFrame = false;
  }

  // ─── Read-only accessors ────────────────────────────────────────────────

  getX(): number { return this.x; }
  getY(): number { return this.y; }
  getDeltaX(): number { return this.deltaX; }
  getDeltaY(): number { return this.deltaY; }
  isDown(): boolean { return this.down; }
  getClickCount(): number { return this.clickCount; }
  getLastClickTimestamp(): number { return this.lastClickTimestamp; }

  /**
   * Returns true exactly once per click event per frame.
   * Callers should NOT clear this themselves — endFrame() handles it.
   */
  wasClickedThisFrame(): boolean { return this.clickedThisFrame; }

  /**
   * Full snapshot for systems that need all values at once
   * (e.g. analytics, replay recording in future).
   */
  snapshot(): InputSnapshot {
    return {
      x: this.x,
      y: this.y,
      deltaX: this.deltaX,
      deltaY: this.deltaY,
      isDown: this.down,
      clickCount: this.clickCount,
      lastClickTimestamp: this.lastClickTimestamp,
    };
  }

  /**
   * Clean up the event listener when the scene is destroyed.
   */
  destroy(): void {
    this.inputPlugin.off(Phaser.Input.Events.POINTER_DOWN);
  }
}
