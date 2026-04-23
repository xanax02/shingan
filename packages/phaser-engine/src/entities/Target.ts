import Phaser from "phaser";
import {
  TARGET_COLOR,
  TARGET_DEPTH,
  TARGET_HIGHLIGHT_COLOR,
  TARGET_PARTICLE_DEPTH,
  TARGET_SPAWN_DURATION,
} from "../utils/constants";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface TargetConfig {
  x: number;
  y: number;
  radius: number;
  color?: number;
  glowColor?: number;
}

// ─── Target ────────────────────────────────────────────────────────────────

/**
 * Target — a reusable reaction-trainer target.
 *
 * Visual layers (bottom-to-top inside the Container):
 *   1. Outer soft-glow ring   — large radius, low alpha, cyan
 *   2. Mid glow ring          — medium radius, medium alpha, cyan
 *   3. Main filled circle     — solid cyan with subtle radial gradient via inner dot
 *   4. Inner highlight dot    — small white/cyan dot for premium sheen
 *
 * Spawns with a scale-in animation (0 → 1.05 → 1.0) for a snappy feel.
 * Destroyed on hit with a particle burst.
 *
 * Hit detection is pure geometry (distance²) — no Phaser Zone/physics needed.
 *
 * Design notes:
 *   • Container owns all child Graphics so .destroy(true) cleans everything.
 *   • No textures or atlases — pure Graphics to keep the package self-contained.
 *   • Pulse tween runs once alive; killed on destroy() to prevent orphan tweens.
 */
export class Target {
  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly radius: number;
  private pulseTween: Phaser.Tweens.Tween | null = null;
  private spawnTween: Phaser.Tweens.Tween | null = null;
  private destroyed: boolean = false;

  // Cached for hit-testing without allocation
  private readonly cx: number;
  private readonly cy: number;

  constructor(scene: Phaser.Scene, config: TargetConfig) {
    this.scene = scene;
    this.radius = config.radius;
    this.cx = config.x;
    this.cy = config.y;

    const color = config.color ?? TARGET_COLOR;

    // Build graphics layers
    const gfx = scene.add.graphics();
    this.drawTarget(gfx, config.radius, color);

    this.container = scene.add.container(config.x, config.y, [gfx]);
    this.container.setDepth(TARGET_DEPTH);
    this.container.setScale(0); // start invisible for spawn animation
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Animate the target into view. Fires the optional callback when done.
   */
  spawnWithAnimation(onComplete?: () => void): void {
    if (this.destroyed) return;

    // Kill any previous spawn tween
    this.spawnTween?.remove();

    this.spawnTween = this.scene.tweens.add({
      targets: this.container,
      scaleX: { from: 0, to: 1 },
      scaleY: { from: 0, to: 1 },
      duration: TARGET_SPAWN_DURATION,
      ease: "Back.easeOut",
      onComplete: () => {
        this.spawnTween = null;
        this.startPulse();
        onComplete?.();
      },
    });
  }

  /**
   * Point-in-circle hit detection.
   * @returns true if the pointer position is within the target's radius.
   */
  isHit(px: number, py: number): boolean {
    if (this.destroyed) return false;
    const dx = px - this.cx;
    const dy = py - this.cy;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  /**
   * Spawn a particle burst at the target location, then destroy.
   */
  destroyWithBurst(): void {
    if (this.destroyed) return;
    this.emitBurst();
    this.destroy();
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.pulseTween?.remove();
    this.spawnTween?.remove();
    this.pulseTween = null;
    this.spawnTween = null;
    this.container.destroy(true);
  }

  isAlive(): boolean {
    return !this.destroyed;
  }

  getX(): number { return this.cx; }
  getY(): number { return this.cy; }

  // ─── Private ───────────────────────────────────────────────────────────────

  private drawTarget(
    gfx: Phaser.GameObjects.Graphics,
    r: number,
    color: number,
  ): void {
    // Layer 4: outer diffuse glow (large, very transparent)
    gfx.fillStyle(color, 0.06);
    gfx.fillCircle(0, 0, r * 2.6);

    // Layer 3: mid glow ring
    gfx.fillStyle(color, 0.14);
    gfx.fillCircle(0, 0, r * 1.55);

    // Layer 2: main body fill
    gfx.fillStyle(color, 1);
    gfx.fillCircle(0, 0, r);

    // Layer 1: stroke ring (slightly darker, creates depth)
    gfx.lineStyle(2, color, 0.6);
    gfx.strokeCircle(0, 0, r);

    // Layer 0: inner highlight — small bright dot off-center
    gfx.fillStyle(TARGET_HIGHLIGHT_COLOR, 0.75);
    gfx.fillCircle(-r * 0.25, -r * 0.28, r * 0.22);
  }

  /** Continuous gentle pulse while the target is alive. */
  private startPulse(): void {
    if (this.destroyed) return;
    this.pulseTween = this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  /** Cheap particle burst using a temporary Graphics + fade-out tweens. */
  private emitBurst(): void {
    const scene = this.scene;
    const cx = this.cx;
    const cy = this.cy;
    const r = this.radius;
    const particleCount = 10;
    const particles: Phaser.GameObjects.Graphics[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = r * 0.9 + Math.random() * r * 0.7;
      const tx = cx + Math.cos(angle) * speed;
      const ty = cy + Math.sin(angle) * speed;
      const size = 3 + Math.random() * 4;

      const p = scene.add.graphics();
      p.fillStyle(TARGET_COLOR, 1);
      p.fillCircle(0, 0, size);
      p.setPosition(cx, cy);
      p.setDepth(TARGET_PARTICLE_DEPTH);

      particles.push(p);

      scene.tweens.add({
        targets: p,
        x: tx,
        y: ty,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 380 + Math.random() * 200,
        ease: "Quad.easeOut",
        onComplete: () => p.destroy(),
      });
    }

    // Extra central flash ring
    const flash = scene.add.graphics();
    flash.lineStyle(3, TARGET_COLOR, 0.9);
    flash.strokeCircle(0, 0, r * 0.6);
    flash.setPosition(cx, cy);
    flash.setDepth(TARGET_PARTICLE_DEPTH);

    scene.tweens.add({
      targets: flash,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 280,
      ease: "Quad.easeOut",
      onComplete: () => flash.destroy(),
    });
  }
}
