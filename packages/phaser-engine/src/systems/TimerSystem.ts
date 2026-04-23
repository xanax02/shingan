import type Phaser from "phaser";

/**
 * TimerSystem — wraps Phaser's TimerEvent API for reaction-trainer use.
 *
 * Responsibilities:
 *   • Schedule a one-shot delay within a [min, max] ms range.
 *   • Track elapsed time since the delay was scheduled (for computing
 *     apparent reaction time even if the user clicks early).
 *   • Cancel in-flight timers cleanly on destroy or restart.
 *
 * Why Phaser TimerEvent vs. setTimeout?
 *   Phaser's timer respects scene pause/resume automatically.
 *   setTimeout fires even when the tab is hidden or the scene is paused,
 *   which would produce incorrect reaction times.
 */
export class TimerSystem {
  private readonly timePlugin: Phaser.Time.Clock;
  private timerEvent: Phaser.Time.TimerEvent | null = null;

  /** Timestamp (Phaser game time, ms) when scheduleDelay() was last called. */
  private scheduleStartTime: number = 0;

  constructor(timePlugin: Phaser.Time.Clock) {
    this.timePlugin = timePlugin;
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Schedule a one-shot callback after a random delay in [minMs, maxMs].
   * Any previously pending timer is cancelled first.
   *
   * @param minMs   Minimum delay in milliseconds.
   * @param maxMs   Maximum delay in milliseconds.
   * @param onFire  Callback invoked when the timer fires.
   */
  scheduleDelay(minMs: number, maxMs: number, onFire: () => void): void {
    this.cancel();

    const delay = minMs + Math.random() * (maxMs - minMs);
    this.scheduleStartTime = this.timePlugin.now;

    this.timerEvent = this.timePlugin.addEvent({
      delay,
      callback: () => {
        this.timerEvent = null;
        onFire();
      },
      callbackScope: this,
    });
  }

  /**
   * Cancel any pending timer. Safe to call when no timer is running.
   */
  cancel(): void {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
      this.timerEvent = null;
    }
  }

  /**
   * Returns elapsed ms since the most recent scheduleDelay() call.
   * Useful for computing false-start timing.
   */
  getElapsedMs(): number {
    return this.timePlugin.now - this.scheduleStartTime;
  }

  /**
   * Returns the current Phaser game clock time (ms).
   * Scenes use this as the reference timestamp when a target appears,
   * then subtract it from the click timestamp.
   */
  now(): number {
    return this.timePlugin.now;
  }

  destroy(): void {
    this.cancel();
  }
}
