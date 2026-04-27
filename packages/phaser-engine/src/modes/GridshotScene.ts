import Phaser from "phaser";
import { BaseScene } from "../core/BaseScene";
import { SCENE_KEYS } from "../core/SceneRegistry";
import { Crosshair } from "../entities/Crosshair";
import { Target } from "../entities/Target";
import { GridshotOverlay, type GridshotSessionStats } from "../ui/GridshotOverlay";
import {
  GRIDSHOT_DURATION_MS,
  GRIDSHOT_TARGET_COUNT,
  TARGET_RADIUS,
  TARGET_SAFE_MARGIN,
} from "../utils/constants";

// ─── Grade thresholds (hits per second) ────────────────────────────────────
const GRADE_THRESHOLDS = [
  { min: 4.5, grade: "S", color: "#ffd700" },
  { min: 3.5, grade: "A", color: "#00ff88" },
  { min: 2.5, grade: "B", color: "#00c8ff" },
  { min: 1.5, grade: "C", color: "#ff9900" },
  { min: 0,   grade: "D", color: "#ff4466" },
];

function calcGrade(hitsPerSec: number): { grade: string; color: string } {
  for (const t of GRADE_THRESHOLDS) {
    if (hitsPerSec >= t.min) return { grade: t.grade, color: t.color };
  }
  return { grade: "D", color: "#ff4466" };
}

// ─── Session state ──────────────────────────────────────────────────────────

interface SessionData {
  hits: number;
  misses: number;
  startTime: number;
  elapsed: number; // ms
}

// ─── GridshotScene ──────────────────────────────────────────────────────────

/**
 * GridshotScene — AimLab-style 3-ball gridshot trainer.
 *
 * Rules:
 *   • 3 targets are always visible on screen.
 *   • When a target is hit, it immediately spawns at a new random position.
 *   • Clicks that miss any target count as misses.
 *   • Session lasts GRIDSHOT_DURATION_MS (60 s).
 *   • Score is graded by hits-per-second.
 *
 * Architecture:
 *   • Targets array is always exactly GRIDSHOT_TARGET_COUNT elements.
 *   • Hit detection uses point-in-circle geometry (same as ReactionScene).
 *   • HTML overlay handles all UI — zero Phaser text objects needed.
 */
export class GridshotScene extends BaseScene {
  static readonly KEY = SCENE_KEYS.GRIDSHOT;

  private targets: Target[] = [];
  private crosshair!: Crosshair;
  private overlay!: GridshotOverlay;
  private overlayContainer!: HTMLElement;
  private session!: SessionData;
  private countdownTimer: Phaser.Time.TimerEvent | null = null;
  private bgGfx!: Phaser.GameObjects.Graphics;
  private running: boolean = false;

  constructor() {
    super({ key: SCENE_KEYS.GRIDSHOT });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  create(): void {
    super.create();

    // Read overlay container from registry (set by preBoot in config)
    this.overlayContainer =
      (this.game.registry.get("overlayContainer") as HTMLElement | undefined) ??
      document.body;

    // Use OS crosshair cursor — reliable across all browsers without a Phaser entity
    this.input.setDefaultCursor("crosshair");

    // Background
    this.bgGfx = this.add.graphics();
    this.drawAmbientGrid(this.bgGfx);
    this.resizeSystem.subscribe(({ width: w, height: h }) => {
      this.bgGfx.clear();
      this.drawGridOnto(this.bgGfx, w, h);
    });

    // Custom Phaser crosshair (replaces hidden OS cursor)
    this.crosshair = new Crosshair(this);

    // HTML overlay
    this.overlay = new GridshotOverlay(this.overlayContainer);
    this.overlay.updateHUD({ hits: 0, accuracy: 0, hitsPerSec: 0, timeLeft: GRIDSHOT_DURATION_MS / 1000, total: 0 });

    // Listen for restart from modal
    this.overlayContainer.addEventListener("gs:restart", this.handleRestart, { passive: true });

    // Pointer handler — route all clicks
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handleClick, this);

    // Start session immediately
    this.startSession();
  }

  shutdown(): void {
    this.overlayContainer?.removeEventListener("gs:restart", this.handleRestart);
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.handleClick, this);
    this.countdownTimer?.remove();
    this.destroyAllTargets();
    this.crosshair?.destroy();
    this.overlay?.destroy();
    super.shutdown();
  }

  // ─── Game loop ─────────────────────────────────────────────────────────────

  update(): void {
    const ptr = this.input.activePointer;
    this.crosshair.setPosition(ptr.x, ptr.y);
  }

  // ─── Session ───────────────────────────────────────────────────────────────

  private startSession(): void {
    this.session = {
      hits: 0,
      misses: 0,
      startTime: this.time.now,
      elapsed: 0,
    };
    this.running = true;

    // Spawn initial targets
    this.destroyAllTargets();
    this.targets = [];
    for (let i = 0; i < GRIDSHOT_TARGET_COUNT; i++) {
      this.targets.push(this.spawnTarget());
    }

    // Countdown timer — fires every 100ms to update the HUD timer smoothly
    this.countdownTimer = this.time.addEvent({
      delay: 100,
      repeat: (GRIDSHOT_DURATION_MS / 100) - 1,
      callback: this.onTimerTick,
      callbackScope: this,
    });

    // Session end
    this.time.delayedCall(GRIDSHOT_DURATION_MS, this.endSession, [], this);
  }

  private onTimerTick(): void {
    if (!this.running) return;
    this.session.elapsed = this.time.now - this.session.startTime;
    const timeLeft = Math.max(0, (GRIDSHOT_DURATION_MS - this.session.elapsed) / 1000);
    const total = this.session.hits + this.session.misses;
    const hitsPerSec = this.session.hits / Math.max(1, this.session.elapsed / 1000);

    this.overlay.updateHUD({
      hits: this.session.hits,
      accuracy: total === 0 ? 0 : Math.round((this.session.hits / total) * 100),
      hitsPerSec,
      timeLeft,
      total,
    });
  }

  private endSession = (): void => {
    this.running = false;
    this.destroyAllTargets();
    this.countdownTimer?.remove();
    this.countdownTimer = null;

    const elapsed = GRIDSHOT_DURATION_MS / 1000;
    const hitsPerSec = this.session.hits / elapsed;
    const total = this.session.hits + this.session.misses;
    const accuracy = total === 0 ? 0 : Math.round((this.session.hits / total) * 100);
    const { grade, color } = calcGrade(hitsPerSec);

    const stats: GridshotSessionStats = {
      hits: this.session.hits,
      misses: this.session.misses,
      accuracy,
      hitsPerSec,
      grade,
      gradeColor: color,
    };

    // Personal best (localStorage)
    const { personalBest, isNewBest } = this.checkPersonalBest(hitsPerSec);

    // Final HUD update
    this.overlay.updateHUD({ hits: this.session.hits, accuracy, hitsPerSec, timeLeft: 0, total });
    this.overlay.showModal(stats, personalBest, isNewBest);
  };

  // ─── Click handling ────────────────────────────────────────────────────────

  private handleClick = (pointer: Phaser.Input.Pointer): void => {
    if (!this.running) return;

    // Visual feedback on every click
    this.crosshair.triggerClickBurst();

    let hit = false;
    for (let i = 0; i < this.targets.length; i++) {
      const t = this.targets[i];
      if (!t) continue;
      if (t.isAlive() && t.isHit(pointer.x, pointer.y)) {
        t.destroyWithBurst();
        // Replace the destroyed target with a fresh one at a new position
        this.targets[i] = this.spawnTarget();
        this.session.hits++;
        hit = true;
        break; // only one target per click
      }
    }

    if (!hit) {
      this.session.misses++;
    }

    // Immediate HUD update on every click
    const elapsed = Math.max(1, this.time.now - this.session.startTime);
    const total = this.session.hits + this.session.misses;
    const hitsPerSec = this.session.hits / (elapsed / 1000);
    const timeLeft = Math.max(0, (GRIDSHOT_DURATION_MS - elapsed) / 1000);

    this.overlay.updateHUD({
      hits: this.session.hits,
      accuracy: total === 0 ? 0 : Math.round((this.session.hits / total) * 100),
      hitsPerSec,
      timeLeft,
      total,
    });
  };

  // ─── Target management ─────────────────────────────────────────────────────

  /**
   * Spawn a new target at a safe random position that doesn't overlap
   * any existing alive targets.
   */
  private spawnTarget(): Target {
    const { width, height } = this.scale;
    const margin = TARGET_SAFE_MARGIN + TARGET_RADIUS;
    const minDist = TARGET_RADIUS * 3;

    let x = 0;
    let y = 0;
    let tries = 0;

    do {
      x = margin + Math.random() * (width  - margin * 2);
      y = margin + Math.random() * (height - margin * 2);
      tries++;
    } while (tries < 20 && this.overlapsExisting(x, y, minDist));

    const t = new Target(this, { x, y, radius: TARGET_RADIUS });
    t.spawnWithAnimation();
    // Only push when spawning initial batch; replacement is handled by the caller assigning to targets[i]
    return t;
  }

  private overlapsExisting(x: number, y: number, minDist: number): boolean {
    for (const t of this.targets) {
      if (!t.isAlive()) continue;
      const dx = t.getX() - x;
      const dy = t.getY() - y;
      if (dx * dx + dy * dy < minDist * minDist) return true;
    }
    return false;
  }

  private destroyAllTargets(): void {
    for (const t of this.targets) {
      if (t.isAlive()) t.destroy();
    }
    this.targets = [];
  }

  // ─── Background ────────────────────────────────────────────────────────────

  private drawGridOnto(gfx: Phaser.GameObjects.Graphics, w: number, h: number): void {
    const spacing = 40;
    gfx.fillStyle(0x070710, 1);
    gfx.fillRect(0, 0, w, h);
    gfx.fillStyle(0x00c8ff, 0.04);
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

  private checkPersonalBest(hitsPerSec: number): { personalBest: number | null; isNewBest: boolean } {
    const KEY = "aim_gridshot_best_hps";
    let personalBest: number | null = null;
    let isNewBest = false;

    try {
      const stored = localStorage.getItem(KEY);
      personalBest = stored ? Number(stored) : null;
    } catch { /* ignore */ }

    if (personalBest === null || hitsPerSec > personalBest) {
      isNewBest = true;
      personalBest = hitsPerSec;
      try { localStorage.setItem(KEY, String(hitsPerSec)); } catch { /* ignore */ }
    }

    return { personalBest, isNewBest };
  }
}
