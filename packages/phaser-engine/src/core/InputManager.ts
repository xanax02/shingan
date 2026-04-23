import Phaser from "phaser";
import { GameEventBus, GameEvent } from "./GameEvents";

/**
 * InputManager — pointer event handler purpose-built for the reaction trainer.
 *
 * Decouples click detection from ReactionScene's state logic. The scene tells
 * InputManager what "interactive mode" it's in, and the manager handles routing.
 *
 * Modes:
 *   "idle"    — clicks ignored
 *   "waiting" — any click fires onFalseStart()
 *   "active"  — clicks dispatched as TARGET_HIT or MISS_CLICK based on hit test
 *
 * Design decisions:
 *   • Single pointer-down handler registered once in the constructor.
 *   • No per-frame polling — purely event-driven for minimum latency.
 *   • Hit-test callback injected by the scene so InputManager stays entity-agnostic.
 */
export type InputMode = "idle" | "waiting" | "active";

export interface InputManagerConfig {
  inputPlugin: Phaser.Input.InputPlugin;
  bus: GameEventBus;
  /** Called each frame-click in "active" mode; return true if click was on target. */
  hitTest: (x: number, y: number) => boolean;
  getRound: () => number;
}

export class InputManager {
  private mode: InputMode = "idle";
  private readonly inputPlugin: Phaser.Input.InputPlugin;
  private readonly bus: GameEventBus;
  private readonly hitTest: (x: number, y: number) => boolean;
  private readonly getRound: () => number;

  constructor(config: InputManagerConfig) {
    this.inputPlugin = config.inputPlugin;
    this.bus = config.bus;
    this.hitTest = config.hitTest;
    this.getRound = config.getRound;

    // Register pointer-down once; routing logic lives in handleClick.
    this.inputPlugin.on(
      Phaser.Input.Events.POINTER_DOWN,
      this.handleClick,
      this,
    );
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  setMode(mode: InputMode): void {
    this.mode = mode;
  }

  getMode(): InputMode {
    return this.mode;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private handleClick(pointer: Phaser.Input.Pointer): void {
    const round = this.getRound();

    switch (this.mode) {
      case "idle":
        // Ignore all clicks — scene hasn't started yet
        break;

      case "waiting":
        // Clicked before the target appeared — false start
        this.bus.emit(GameEvent.FALSE_START, { round });
        break;

      case "active": {
        // Determine whether the click landed on the target
        const hit = this.hitTest(pointer.x, pointer.y);
        if (hit) {
          this.bus.emit(GameEvent.TARGET_HIT, {
            round,
            reactionMs: 0,          // Actual value computed by ReactionScene
            timestamp: pointer.downTime,
          });
        } else {
          this.bus.emit(GameEvent.MISS_CLICK, { round });
        }
        break;
      }
    }
  }

  destroy(): void {
    this.inputPlugin.off(
      Phaser.Input.Events.POINTER_DOWN,
      this.handleClick,
      this,
    );
  }
}
