import Phaser from "phaser";
import { BaseScene } from "../core/BaseScene";
import { GameEvent } from "../core/GameEvents";
import { InputManager } from "../core/InputManager";
import { SCENE_KEYS } from "../core/SceneRegistry";
import { Target } from "../entities/Target";
import { MetricsSystem } from "../systems/MetricsSystem";
import { TimerSystem } from "../systems/TimerSystem";
import { ReactionOverlay } from "../ui/overlay";
import {
  REACTION_MAX_DELAY_MS,
  REACTION_MIN_DELAY_MS,
  REACTION_TOTAL_ROUNDS,
  TARGET_RADIUS,
  TARGET_SAFE_MARGIN,
} from "../utils/constants";

// ─── State Machine ─────────────────────────────────────────────────────────

/**
 * ReactionState — every state the trainer can occupy.
 * Transitions are explicit — no direct mutation from arbitrary code.
 */
export enum ReactionState {
  IDLE          = "idle",
  STARTING      = "starting",
  WAITING       = "waiting",
  TARGET_VISIBLE = "targetVisible",
  CLICKED       = "clicked",
  ROUND_COMPLETE = "roundComplete",
  FINISHED      = "finished",
}

// ─── Scene ─────────────────────────────────────────────────────────────────

/**
 * ReactionScene — the complete Reaction Time Trainer gameplay loop.
 *
 * State machine transitions:
 *
 *   IDLE ──[startSession()]──► STARTING ──[auto]──► WAITING
 *                                                       │
 *                                              [timer fires]──► TARGET_VISIBLE
 *                                                       │              │
 *                                             [click]──► FALSE_START  │
 *                                             (restarts WAITING)      │
 *                                                              [click on target]──► CLICKED
 *                                                              [click off target]──► ROUND_COMPLETE (miss)
 *                                                                                         │
 *                                                              round < TOTAL ──► WAITING  │
 *                                                              round = TOTAL ──► FINISHED ┘
 *
 * All click routing goes through InputManager → GameEventBus → handlers here.
 * No direct this.input.on() calls in this file.
 */
export class ReactionScene extends BaseScene {
  /** Scene identifier (matches SceneRegistry). */
  static readonly KEY = SCENE_KEYS.REACTION;

  constructor() {
    super({ key: SCENE_KEYS.REACTION });
  }

  // ─── Systems ───────────────────────────────────────────────────────────────

  private timerSystem!: TimerSystem;
  private metricsSystem!: MetricsSystem;
  private inputManager!: InputManager;

  // ─── UI ────────────────────────────────────────────────────────────────────

  private overlay!: ReactionOverlay;

  /** DOM container injected from React via scene data. */
  private overlayContainer!: HTMLElement;

  // ─── Runtime state ─────────────────────────────────────────────────────────

  private currentState: ReactionState = ReactionState.IDLE;
  private currentTarget: Target | null = null;
  private targetAppearTime: number = 0;
  private streak: number = 0;
  private bgGfx!: Phaser.GameObjects.Graphics;

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  init(_data: unknown): void {
    // overlayContainer is injected via game.registry in preBoot (see config.ts).
    // We cannot read it here because game.registry isn't stable yet at init time
    // in all Phaser versions. We read it in create() instead.
  }

  create(): void {
    super.create(); // boots ResizeSystem + bus

    // Read overlayContainer from registry — set by buildReactionConfig's preBoot callback.
    // Must be done in create(), not init(), because preBoot runs before scenes start.
    this.overlayContainer =
      (this.game.registry.get("overlayContainer") as HTMLElement | undefined) ??
      document.body;
    this.bgGfx = this.add.graphics();
    this.drawAmbientGrid(this.bgGfx);

    // Redraw on resize
    this.resizeSystem.subscribe(({ width: w, height: h }) => {
      this.bgGfx.clear();
      const spacing = 40;
      this.bgGfx.fillStyle(0x070710, 1);
      this.bgGfx.fillRect(0, 0, w, h);
      this.bgGfx.fillStyle(0x00c8ff, 0.04);
      for (let x = 0; x <= w; x += spacing)
        for (let y = 0; y <= h; y += spacing)
          this.bgGfx.fillCircle(x, y, 1);
    });

    // 2. Systems
    this.timerSystem  = new TimerSystem(this.time);
    this.metricsSystem = new MetricsSystem();

    this.inputManager = new InputManager({
      inputPlugin: this.input,
      bus: this.bus,
      hitTest: (x, y) => this.currentTarget?.isHit(x, y) ?? false,
      getRound: () => this.metricsSystem.getRound(),
    });

    // 3. HTML overlay
    this.overlay = new ReactionOverlay(this.overlayContainer);
    this.overlay.updateHUD({
      round: 1,
      total: REACTION_TOTAL_ROUNDS,
      best: null,
      avg: null,
      misses: 0,
      streak: 0,
    });

    // 4. Wire event bus handlers
    this.wireEvents();

    // 5. Listen for "play again" from the modal
    this.overlayContainer.addEventListener("rt:restart", this.handleRestart, { passive: true });

    // 6. Enter IDLE — show start button.
    // Call onEnterIdle() directly because transition() guards against same-state
    // transitions (prev===next===IDLE), which would skip the start button.
    this.onEnterIdle();
  }

  // update() is not needed — all logic is event-driven (timer + input events).
  // Keeping it empty intentionally; Phaser calls it each frame but we skip it.

  shutdown(): void {
    this.overlayContainer.removeEventListener("rt:restart", this.handleRestart);
    this.inputManager?.destroy();
    this.timerSystem?.destroy();
    this.currentTarget?.destroy();
    this.overlay?.destroy();
    super.shutdown(); // cleans ResizeSystem + bus
  }

  // ─── State Machine ─────────────────────────────────────────────────────────

  private transition(next: ReactionState): void {
    const prev = this.currentState;
    if (prev === next) return;

    this.bus.emit(GameEvent.STATE_CHANGE, { from: prev, to: next });
    this.currentState = next;

    switch (next) {
      case ReactionState.IDLE:
        this.onEnterIdle();
        break;
      case ReactionState.STARTING:
        this.onEnterStarting();
        break;
      case ReactionState.WAITING:
        this.onEnterWaiting();
        break;
      case ReactionState.TARGET_VISIBLE:
        this.onEnterTargetVisible();
        break;
      case ReactionState.CLICKED:
        this.onEnterClicked();
        break;
      case ReactionState.ROUND_COMPLETE:
        this.onEnterRoundComplete();
        break;
      case ReactionState.FINISHED:
        this.onEnterFinished();
        break;
    }
  }

  // ── State handlers ─────────────────────────────────────────────────────────

  private onEnterIdle(): void {
    this.inputManager.setMode("idle");
    this.overlay.showStatus("", "idle");
    this.overlay.showStartButton(() => {
      this.transition(ReactionState.STARTING);
    });
  }

  private onEnterStarting(): void {
    this.overlay.hideStartButton();
    this.overlay.showStatus("GET READY", "waiting");
    // Very brief "get ready" pause before the first round
    this.time.delayedCall(600, () => {
      this.transition(ReactionState.WAITING);
    });
  }

  private onEnterWaiting(): void {
    this.inputManager.setMode("waiting"); // clicks here → false start
    const round = this.metricsSystem.getRound();
    this.overlay.showStatus("WAITING...", "waiting");
    this.overlay.updateHUD({
      round,
      total: REACTION_TOTAL_ROUNDS,
      best: this.getBestOrNull(),
      avg: this.getAvgOrNull(),
      misses: this.metricsSystem.getMisses(),
      streak: this.streak,
    });

    // Schedule the target spawn
    this.timerSystem.scheduleDelay(
      REACTION_MIN_DELAY_MS,
      REACTION_MAX_DELAY_MS,
      () => this.transition(ReactionState.TARGET_VISIBLE),
    );
  }

  private onEnterTargetVisible(): void {
    this.inputManager.setMode("active"); // clicks here → hit test
    this.targetAppearTime = this.timerSystem.now();

    // Spawn target at a random position within safe bounds
    const { width, height } = this.scale;
    const margin = TARGET_SAFE_MARGIN + TARGET_RADIUS;
    const x = margin + Math.random() * (width  - margin * 2);
    const y = margin + Math.random() * (height - margin * 2);

    this.currentTarget = new Target(this, { x, y, radius: TARGET_RADIUS });
    this.currentTarget.spawnWithAnimation(() => {
      // Optional: could set a max-time-to-react timer here in future
    });

    this.overlay.showStatus("CLICK!", "click");
  }

  private onEnterClicked(): void {
    // Clicking logic already handled in handleTargetHit → recordHit
    // This state is a brief pause before advancing
    this.inputManager.setMode("idle");
  }

  private onEnterRoundComplete(): void {
    const round    = this.metricsSystem.getRound() - 1; // just completed
    const total    = REACTION_TOTAL_ROUNDS;

    this.overlay.updateHUD({
      round,
      total,
      best: this.getBestOrNull(),
      avg: this.getAvgOrNull(),
      misses: this.metricsSystem.getMisses(),
      streak: this.streak,
    });

    if (round >= total) {
      // Last round — go to finished after a brief pause
      this.time.delayedCall(400, () => this.transition(ReactionState.FINISHED));
    } else {
      // Next round
      this.time.delayedCall(300, () => this.transition(ReactionState.WAITING));
    }
  }

  private onEnterFinished(): void {
    this.inputManager.setMode("idle");
    this.overlay.showStatus("", "idle");
    const stats      = this.metricsSystem.getSessionStats();
    const isNewBest  = this.metricsSystem.maybeSaveHighScore();
    const highScore  = this.metricsSystem.getHighScore();
    this.overlay.showModal(stats, highScore, isNewBest);
  }

  // ─── Event Handlers ────────────────────────────────────────────────────────

  private wireEvents(): void {
    this.bus.on(GameEvent.TARGET_HIT,  this.handleTargetHit,  this);
    this.bus.on(GameEvent.FALSE_START, this.handleFalseStart, this);
    this.bus.on(GameEvent.MISS_CLICK,  this.handleMissClick,  this);
  }

  private handleTargetHit(payload: { round: number; reactionMs: number; timestamp: number }): void {
    if (this.currentState !== ReactionState.TARGET_VISIBLE) return;

    // Compute actual reaction time from the stored appear timestamp
    const reactionMs = Math.round(payload.timestamp - this.targetAppearTime);

    // Destroy target with burst effect
    this.currentTarget?.destroyWithBurst();
    this.currentTarget = null;

    // Record
    this.metricsSystem.recordHit(reactionMs);
    this.streak++;

    // Show result
    this.overlay.showStatus(`${reactionMs}ms`, "result");

    this.bus.emit(GameEvent.TARGET_HIT, { ...payload, reactionMs });

    this.transition(ReactionState.CLICKED);

    // Brief result display, then advance
    this.time.delayedCall(500, () => this.transition(ReactionState.ROUND_COMPLETE));
  }

  private handleFalseStart(payload: { round: number }): void {
    if (this.currentState !== ReactionState.WAITING) return;

    // Cancel pending delay timer
    this.timerSystem.cancel();
    this.streak = 0;

    this.metricsSystem.recordFalseStart();
    this.overlay.showStatus("TOO SOON!", "warning");

    this.bus.emit(GameEvent.FALSE_START, payload);

    // Brief warning pause, then restart the same round
    this.time.delayedCall(900, () => this.transition(ReactionState.WAITING));
  }

  private handleMissClick(_payload: { round: number }): void {
    if (this.currentState !== ReactionState.TARGET_VISIBLE) return;

    this.currentTarget?.destroy();
    this.currentTarget = null;
    this.streak = 0;

    this.metricsSystem.recordMiss();
    this.overlay.showStatus("MISS!", "warning");

    this.time.delayedCall(700, () => this.transition(ReactionState.ROUND_COMPLETE));
  }

  private handleRestart = (): void => {
    // Called from the overlay's "Play Again" button via DOM event
    this.metricsSystem.reset();
    this.streak = 0;
    this.overlay.hideModal();
    this.overlay.updateHUD({
      round: 1,
      total: REACTION_TOTAL_ROUNDS,
      best: null,
      avg: null,
      misses: 0,
      streak: 0,
    });
    // Small pause then restart
    this.time.delayedCall(350, () => this.transition(ReactionState.STARTING));
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private getBestOrNull(): number | null {
    const v = this.metricsSystem.getBest();
    return v === Infinity ? null : v;
  }

  private getAvgOrNull(): number | null {
    const v = this.metricsSystem.getAverage();
    return v === 0 ? null : v;
  }
}
