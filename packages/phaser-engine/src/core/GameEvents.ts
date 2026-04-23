import Phaser from "phaser";

/**
 * GameEvent — typed enum of every event that crosses a system boundary.
 *
 * Rules:
 *   • One source emits, any number of listeners may subscribe.
 *   • Payloads are typed via GameEventPayloadMap below.
 *   • Never use raw strings — always import from here.
 */
export enum GameEvent {
  ROUND_START     = "round:start",
  TARGET_SPAWN    = "target:spawn",
  TARGET_HIT      = "target:hit",
  FALSE_START     = "false:start",
  MISS_CLICK      = "miss:click",
  ROUND_COMPLETE  = "round:complete",
  SESSION_COMPLETE = "session:complete",
  STATE_CHANGE    = "state:change",
}

/** Per-event payload shapes. Keep payloads flat and serialisable. */
export interface GameEventPayloadMap {
  [GameEvent.ROUND_START]:      { round: number };
  [GameEvent.TARGET_SPAWN]:     { x: number; y: number; timestamp: number };
  [GameEvent.TARGET_HIT]:       { round: number; reactionMs: number; timestamp: number };
  [GameEvent.FALSE_START]:      { round: number };
  [GameEvent.MISS_CLICK]:       { round: number };
  [GameEvent.ROUND_COMPLETE]:   { round: number; reactionMs: number };
  [GameEvent.SESSION_COMPLETE]: { averageMs: number; bestMs: number; worstMs: number };
  [GameEvent.STATE_CHANGE]:     { from: string; to: string };
}

/**
 * GameEventBus — thin typed wrapper around Phaser.Events.EventEmitter.
 *
 * Using Phaser's emitter (vs. a custom one) means Phaser's scene lifecycle
 * automatically handles memory if the emitter is owned by a scene. Callers
 * who create a standalone bus must call destroy() themselves.
 */
export class GameEventBus {
  private readonly emitter: Phaser.Events.EventEmitter;

  constructor() {
    this.emitter = new Phaser.Events.EventEmitter();
  }

  /**
   * Emit a typed game event.
   */
  emit<E extends GameEvent>(event: E, payload: GameEventPayloadMap[E]): void {
    this.emitter.emit(event, payload);
  }

  /**
   * Subscribe to a typed game event.
   * Returns a cleanup function — call it to unsubscribe.
   */
  on<E extends GameEvent>(
    event: E,
    listener: (payload: GameEventPayloadMap[E]) => void,
    context?: unknown,
  ): () => void {
    this.emitter.on(event, listener, context);
    return () => this.emitter.off(event, listener, context);
  }

  /**
   * Subscribe once — auto-unsubscribes after first fire.
   */
  once<E extends GameEvent>(
    event: E,
    listener: (payload: GameEventPayloadMap[E]) => void,
    context?: unknown,
  ): void {
    this.emitter.once(event, listener, context);
  }

  /**
   * Remove a specific listener.
   */
  off<E extends GameEvent>(
    event: E,
    listener: (payload: GameEventPayloadMap[E]) => void,
    context?: unknown,
  ): void {
    this.emitter.off(event, listener, context);
  }

  /**
   * Tear down all listeners. Call when the owning scene shuts down.
   */
  destroy(): void {
    this.emitter.removeAllListeners();
    this.emitter.destroy();
  }
}
