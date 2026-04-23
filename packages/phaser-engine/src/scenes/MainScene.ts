import Phaser from "phaser";
import { SCENE_KEYS } from "../core/SceneRegistry";
import { Crosshair } from "../entities/Crosshair";
import { DebugSystem } from "../systems/DebugSystem";
import { InputSystem } from "../systems/InputSystem";
import { ResizeSystem } from "../systems/ResizeSystem";

/**
 * MainScene — the primary gameplay surface.
 *
 * Responsibility map:
 *   create()  → boot all systems, hide cursor, build crosshair
 *   update()  → sync input → move crosshair → fire click burst → refresh HUD
 *   shutdown/destroy → teardown all systems (called automatically by Phaser)
 *
 * Design decisions:
 *   - Systems are instantiated HERE, not in GameManager. Scenes own their
 *     systems so they can be safely destroyed when the scene is stopped.
 *   - All per-frame logic is deterministic and delta-time-aware.
 *   - Zero React imports. Zero state mutations.
 */
export class MainScene extends Phaser.Scene {
  private inputSystem!: InputSystem;
  private resizeSystem!: ResizeSystem;
  private debugSystem!: DebugSystem;
  private crosshair!: Crosshair;

  /** Whether the debug HUD is visible. Toggled via GameManager in future. */
  private showDebug: boolean = true;

  constructor() {
    super({ key: SCENE_KEYS.MAIN });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  create(): void {
    // 1. Hide the OS cursor over the canvas
    this.input.setDefaultCursor("none");

    // 2. Boot systems
    this.inputSystem = new InputSystem(this.input);
    this.resizeSystem = new ResizeSystem(this.scale);
    this.debugSystem = new DebugSystem(this);

    // 3. Subscribe to resize — crosshair doesn't need to reposition since it
    //    tracks the pointer every frame, but we can hook it here for future use.
    this.resizeSystem.subscribe(({ width, height }) => {
      // Future: reposition anchored HUD elements, minimap, etc.
      void width; void height;
    });

    // 4. Crosshair — starts at screen center
    this.crosshair = new Crosshair(this);

    // 5. Subtle ambient background grid (visual depth, zero perf cost)
    this.drawAmbientGrid();
  }

  /**
   * Core game loop.
   *
   * Execution order matters:
   *   tick input first  → all downstream reads are consistent within this frame
   *   move crosshair    → position is fresh
   *   click feedback    → animation fires before HUD reads click count
   *   update HUD        → displays fully updated state
   *   end frame         → clear wasClickedThisFrame flag LAST
   */
  update(_time: number, delta: number): void {
    const pointer = this.input.activePointer;

    // 1. Sync input state for this frame
    this.inputSystem.tick(pointer);

    // 2. Move crosshair to current pointer position (zero allocation — primitives only)
    this.crosshair.setPosition(this.inputSystem.getX(), this.inputSystem.getY());

    // 3. Click feedback
    if (this.inputSystem.wasClickedThisFrame()) {
      this.crosshair.triggerClickBurst();
    }

    // 4. Debug HUD — use game loop's own FPS counter for accuracy
    if (this.showDebug) {
      this.debugSystem.update({
        fps: this.game.loop.actualFps,
        deltaMs: delta,
        pointerX: this.inputSystem.getX(),
        pointerY: this.inputSystem.getY(),
        clickCount: this.inputSystem.getClickCount(),
      });
    }

    // 5. End-of-frame cleanup (resets wasClickedThisFrame)
    this.inputSystem.endFrame();
  }

  // ─── Visuals ───────────────────────────────────────────────────────────────

  /**
   * Draws a subtle dot-grid background for visual depth.
   * Rendered once — static, zero update cost.
   */
  private drawAmbientGrid(): void {
    const gfx = this.add.graphics();
    const { width, height } = this.scale;
    const spacing = 40;

    gfx.fillStyle(0x1a1a2e, 1);
    gfx.fillRect(0, 0, width, height);

    gfx.fillStyle(0x00c8ff, 0.06);
    for (let x = 0; x <= width; x += spacing) {
      for (let y = 0; y <= height; y += spacing) {
        gfx.fillCircle(x, y, 1);
      }
    }

    gfx.setDepth(0);
    gfx.setScrollFactor(0);

    // Redraw grid on resize
    this.resizeSystem.subscribe(({ width: w, height: h }) => {
      gfx.clear();
      gfx.fillStyle(0x1a1a2e, 1);
      gfx.fillRect(0, 0, w, h);
      gfx.fillStyle(0x00c8ff, 0.06);
      for (let x = 0; x <= w; x += spacing) {
        for (let y = 0; y <= h; y += spacing) {
          gfx.fillCircle(x, y, 1);
        }
      }
    });
  }

  // ─── Teardown ──────────────────────────────────────────────────────────────

  shutdown(): void {
    this.inputSystem?.destroy();
    this.resizeSystem?.destroy();
    this.debugSystem?.destroy();
    this.crosshair?.destroy();
  }
}
