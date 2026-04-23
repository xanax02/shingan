import Phaser from "phaser";
import { BaseScene } from "../core/BaseScene";
import { SCENE_KEYS } from "../core/SceneRegistry";
import { TrackingOverlay, type TrackingSessionStats } from "../ui/TrackingOverlay";
import {
  TRACKING_DURATION_MS,
  TRACKING_TARGET_RADIUS,
  TARGET_HIGHLIGHT_COLOR,
} from "../utils/constants";

// ─── Grade thresholds (on-target %) ────────────────────────────────────────
const GRADE_THRESHOLDS = [
  { min: 80, grade: "S", color: "#ffd700" },
  { min: 65, grade: "A", color: "#00ff88" },
  { min: 50, grade: "B", color: "#7C3AED" },
  { min: 35, grade: "C", color: "#ff9900" },
  { min: 0,  grade: "D", color: "#ff4466" },
];

function calcGrade(pct: number): { grade: string; color: string } {
  for (const t of GRADE_THRESHOLDS) {
    if (pct >= t.min) return { grade: t.grade, color: t.color };
  }
  return { grade: "D", color: "#ff4466" };
}

// ─── Lissajous Path Parameters ─────────────────────────────────────────────
// Produces a smooth figure-8 / orbital pattern mimicking AimLab tracking targets.
// The target never teleports — it follows a continuous parametric curve.

interface LissajousConfig {
  ax: number;  // x-amplitude  (fraction of half-width)
  ay: number;  // y-amplitude  (fraction of half-height)
  wx: number;  // x-frequency
  wy: number;  // y-frequency
  phi: number; // phase offset (radians)
  speed: number; // full-cycle period (seconds)
}

const LISSAJOUS: LissajousConfig = {
  ax: 0.38,
  ay: 0.30,
  wx: 3,
  wy: 2,
  phi: Math.PI / 4,
  speed: 6.5, // seconds per full cycle
};

// ─── TrackingScene ──────────────────────────────────────────────────────────

/**
 * TrackingScene — AimLab-style tracking trainer.
 *
 * A single target moves along a smooth Lissajous (parametric figure-8) path.
 * The player earns score by holding the mouse pointer inside the target circle.
 * Score = milliseconds cursor was inside target / total session ms × 100%.
 *
 * Architecture:
 *   • Target is a Phaser Graphics object (same layered visual as gridshot).
 *   • Path position is computed analytically from elapsed time — zero allocations.
 *   • On-target detection is pure geometry, checked each update() frame.
 *   • HTML overlay handles all UI.
 */
export class TrackingScene extends BaseScene {
  static readonly KEY = SCENE_KEYS.TRACKING;

  // ─── State ─────────────────────────────────────────────────────────────────
  private overlay!: TrackingOverlay;
  private overlayContainer!: HTMLElement;

  private targetGfx!: Phaser.GameObjects.Graphics;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly radius: number = TRACKING_TARGET_RADIUS;

  private running: boolean = false;
  private startTime: number = 0;
  private onTargetMs: number = 0;
  private lastFrameTime: number = 0;

  private bgGfx!: Phaser.GameObjects.Graphics;

  // Track whether pointer is currently on target (to show visual feedback)
  private pointerOnTarget: boolean = false;

  constructor() {
    super({ key: SCENE_KEYS.TRACKING });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  create(): void {
    super.create();

    this.overlayContainer =
      (this.game.registry.get("overlayContainer") as HTMLElement | undefined) ??
      document.body;

    // Crosshair cursor visible for this mode
    this.input.setDefaultCursor("crosshair");

    // Background
    this.bgGfx = this.add.graphics();
    this.drawAmbientGrid(this.bgGfx);
    this.resizeSystem.subscribe(({ width: w, height: h }) => {
      this.bgGfx.clear();
      this.drawGridOnto(this.bgGfx, w, h);
    });

    // Create the moving target graphic
    this.targetGfx = this.add.graphics();
    this.targetGfx.setDepth(200);
    this.drawTrackingTarget(false);

    // HTML overlay
    this.overlay = new TrackingOverlay(this.overlayContainer);
    this.overlay.updateHUD({ onTargetPct: 0, timeLeft: TRACKING_DURATION_MS / 1000, onTargetMs: 0 });

    // Restart listener
    this.overlayContainer.addEventListener("tk:restart", this.handleRestart, { passive: true });

    // Start immediately
    this.startSession();
  }

  update(_time: number, delta: number): void {
    if (!this.running) return;

    const elapsed = this.time.now - this.startTime;
    const t = (elapsed / 1000) / LISSAJOUS.speed; // normalized 0→1 per cycle
    const angle = t * 2 * Math.PI;

    // Lissajous equations
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const halfW = width / 2;
    const halfH = height / 2;

    this.targetX = cx + LISSAJOUS.ax * halfW * Math.sin(LISSAJOUS.wx * angle + LISSAJOUS.phi);
    this.targetY = cy + LISSAJOUS.ay * halfH * Math.sin(LISSAJOUS.wy * angle);

    // Move graphic
    this.targetGfx.setPosition(this.targetX, this.targetY);

    // Hit detection
    const ptr = this.input.activePointer;
    const dx = ptr.x - this.targetX;
    const dy = ptr.y - this.targetY;
    const onTarget = dx * dx + dy * dy <= this.radius * this.radius;

    // Accumulate on-target time
    if (onTarget) {
      this.onTargetMs += delta;
    }

    // Visual feedback: change target color when cursor is on it
    if (onTarget !== this.pointerOnTarget) {
      this.pointerOnTarget = onTarget;
      this.drawTrackingTarget(onTarget);
    }

    // HUD update
    const timeLeft = Math.max(0, (TRACKING_DURATION_MS - elapsed) / 1000);
    const onTargetPct = (this.onTargetMs / Math.max(1, elapsed)) * 100;
    this.overlay.updateHUD({ onTargetPct, timeLeft, onTargetMs: this.onTargetMs });

    // Store for next frame
    this.lastFrameTime = this.time.now;
  }

  shutdown(): void {
    this.overlayContainer?.removeEventListener("tk:restart", this.handleRestart);
    this.overlay?.destroy();
    super.shutdown();
  }

  // ─── Session ───────────────────────────────────────────────────────────────

  private startSession(): void {
    this.running = true;
    this.startTime = this.time.now;
    this.onTargetMs = 0;
    this.lastFrameTime = this.time.now;
    this.pointerOnTarget = false;

    this.targetGfx.setVisible(true);
    this.drawTrackingTarget(false);

    this.time.delayedCall(TRACKING_DURATION_MS, this.endSession, [], this);
  }

  private endSession = (): void => {
    this.running = false;
    this.targetGfx.setVisible(false);

    const totalMs = TRACKING_DURATION_MS;
    const pct = (this.onTargetMs / totalMs) * 100;
    const { grade, color } = calcGrade(pct);

    const stats: TrackingSessionStats = {
      onTargetPct: pct,
      onTargetMs: this.onTargetMs,
      totalMs,
      grade,
      gradeColor: color,
    };

    const { personalBest, isNewBest } = this.checkPersonalBest(pct);
    this.overlay.showModal(stats, personalBest, isNewBest);
  };

  // ─── Target Drawing ────────────────────────────────────────────────────────

  /**
   * Redraws the tracking target graphic.
   * Active (on-target) variant is brighter and larger outer glow.
   */
  private drawTrackingTarget(active: boolean): void {
    const r = this.radius;
    const gfx = this.targetGfx;
    gfx.clear();

    const baseColor = 0x7c3aed; // purple for tracking mode
    const glowAlpha = active ? 0.18 : 0.1;
    const midAlpha  = active ? 0.3  : 0.18;

    // Outer diffuse glow
    gfx.fillStyle(baseColor, glowAlpha);
    gfx.fillCircle(0, 0, r * 2.6);

    // Mid glow
    gfx.fillStyle(baseColor, midAlpha);
    gfx.fillCircle(0, 0, r * 1.55);

    // Main body
    gfx.fillStyle(baseColor, active ? 1 : 0.85);
    gfx.fillCircle(0, 0, r);

    // Stroke ring
    gfx.lineStyle(2, baseColor, 0.6);
    gfx.strokeCircle(0, 0, r);

    // Inner highlight dot
    gfx.fillStyle(TARGET_HIGHLIGHT_COLOR, 0.5);
    gfx.fillCircle(-r * 0.25, -r * 0.28, r * 0.22);

    // Active ring flash
    if (active) {
      gfx.lineStyle(2, 0xc026d3, 0.6);
      gfx.strokeCircle(0, 0, r * 1.2);
    }
  }

  // ─── Background ────────────────────────────────────────────────────────────

  private drawGridOnto(gfx: Phaser.GameObjects.Graphics, w: number, h: number): void {
    const spacing = 40;
    gfx.fillStyle(0x070710, 1);
    gfx.fillRect(0, 0, w, h);
    gfx.fillStyle(0x7c3aed, 0.035);
    for (let x = 0; x <= w; x += spacing)
      for (let y = 0; y <= h; y += spacing)
        gfx.fillCircle(x, y, 1);
    gfx.setDepth(0);
    gfx.setScrollFactor(0);
  }

  // ─── Restart ───────────────────────────────────────────────────────────────

  private handleRestart = (): void => {
    this.overlay.hideModal();
    this.time.delayedCall(350, this.startSession, [], this);
  };

  // ─── Personal Best ─────────────────────────────────────────────────────────

  private checkPersonalBest(pct: number): { personalBest: number | null; isNewBest: boolean } {
    const KEY = "aim_tracking_best_pct";
    let personalBest: number | null = null;
    let isNewBest = false;

    try {
      const stored = localStorage.getItem(KEY);
      personalBest = stored ? Number(stored) : null;
    } catch { /* ignore */ }

    if (personalBest === null || pct > personalBest) {
      isNewBest = true;
      personalBest = pct;
      try { localStorage.setItem(KEY, String(pct)); } catch { /* ignore */ }
    }

    return { personalBest, isNewBest };
  }
}
