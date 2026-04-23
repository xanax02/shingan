import Phaser from "phaser";

export interface ResizePayload {
  width: number;
  height: number;
}

type ResizeCallback = (payload: ResizePayload) => void;

/**
 * ResizeSystem — listens to Phaser's Scale Manager resize event and fans
 * the new dimensions out to registered callbacks.
 *
 * This keeps resize logic out of individual scenes and provides a central
 * subscription point for future systems (minimap, HUD anchoring, etc.).
 */
export class ResizeSystem {
  private readonly callbacks: Set<ResizeCallback> = new Set();

  constructor(private readonly scaleManager: Phaser.Scale.ScaleManager) {
    this.scaleManager.on(
      Phaser.Scale.Events.RESIZE,
      (_gameSize: Phaser.Structs.Size, _baseSize: Phaser.Structs.Size, _displaySize: Phaser.Structs.Size, _resolution: number) => {
        const { width, height } = this.scaleManager.gameSize;
        this.emit({ width, height });
      }
    );
  }

  /** Subscribe to resize events. Returns an unsubscribe function. */
  subscribe(callback: ResizeCallback): () => void {
    this.callbacks.add(callback);
    return () => { this.callbacks.delete(callback); };
  }

  /** Immediately fire all callbacks with the current game size. */
  fireImmediate(): void {
    const { width, height } = this.scaleManager.gameSize;
    this.emit({ width, height });
  }

  private emit(payload: ResizePayload): void {
    for (const cb of this.callbacks) {
      cb(payload);
    }
  }

  /** Remove all listeners when scene is torn down. */
  destroy(): void {
    this.callbacks.clear();
    this.scaleManager.off(Phaser.Scale.Events.RESIZE);
  }
}
