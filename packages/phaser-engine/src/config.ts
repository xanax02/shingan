import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MainScene } from "./scenes/MainScene";
import { CANVAS_BG_COLOR, TARGET_FPS } from "./utils/constants";
import type { AimTrainerOptions } from "./types/game";

/**
 * buildPhaserConfig — pure function that returns a Phaser.Types.Core.GameConfig.
 *
 * Config design decisions:
 *
 *   AUTO renderer
 *     Lets Phaser pick WebGL if available (GPU-accelerated, better for future
 *     particle effects and shaders), with a Canvas fallback.
 *
 *   Scale.RESIZE
 *     Makes the Phaser canvas always match the container's pixel size exactly.
 *     Critical for click accuracy — SCALE.FIT uses CSS transforms that create
 *     coordinate mismatches between DOM pointer events and Phaser canvas space.
 *
 *   Scale.CENTER_BOTH
 *     Centers the canvas inside the container during resize transitions.
 *
 *   antialias: true
 *     Smooth crosshair arcs and future target circles. The perf cost is
 *     negligible vs. the visual quality gain.
 *
 *   roundPixels: false
 *     Sub-pixel accuracy for crosshair motion. Rounding would introduce
 *     1px jitter at the edges of pixel boundaries.
 *
 *   fps.target: 144 / smoothStep: true
 *     Phaser will try to match the display refresh rate up to 144 Hz.
 *     smoothStep applies frame-time smoothing to reduce delta variance and
 *     eliminate micro-stutter caused by browser scheduler jitter.
 *
 *   disableContextMenu: true
 *     Prevents right-click context menu from interrupting gameplay.
 *
 *   backgroundColor
 *     Matches the CSS background on the container so there is no visible
 *     flash between React render and Phaser canvas init.
 */
export function buildPhaserConfig(
  container: HTMLElement,
  options: AimTrainerOptions = {}
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: container,

    backgroundColor: CANVAS_BG_COLOR,

    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
    },

    render: {
      antialias: true,
      antialiasGL: true,
      roundPixels: false,
      // Transparent canvas so CSS background shows through on load
      transparent: false,
      // Disable power-preference throttling in background tabs
      powerPreference: "high-performance",
    },

    fps: {
      target: options.targetFps ?? TARGET_FPS,
      smoothStep: true,
      // forceSetTimeOut: false — keep requestAnimationFrame for lowest latency
    },

    input: {
      mouse: {
        // Disable context menu globally for the canvas
        preventDefaultDown: true,
        preventDefaultUp: true,
        preventDefaultMove: true,
        preventDefaultWheel: false,
      },
    },

    disableContextMenu: true,

    // Scenes listed in boot order
    scene: [BootScene, MainScene],
  };
}
