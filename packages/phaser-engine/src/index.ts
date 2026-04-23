/**
 * @repo/game-engine — Public API surface
 *
 * Only import from this file in consuming packages. Internal module paths
 * are considered private and may change between versions.
 *
 * Usage in React:
 *
 *   import { createAimTrainer } from "@repo/game-engine";
 *
 *   const handleRef = useRef<AimTrainerHandle | null>(null);
 *
 *   useEffect(() => {
 *     if (!containerRef.current) return;
 *     handleRef.current = createAimTrainer(containerRef.current, { debug: true });
 *     return () => { handleRef.current?.destroy(); };
 *   }, []);
 */

// ── Public factory ──────────────────────────────────────────────────────────
export { createAimTrainer } from "./core/GameManager";

// ── Public types ────────────────────────────────────────────────────────────
export type {
  AimTrainerHandle,
  AimTrainerOptions,
  GameMode,
  InputSnapshot,
  DebugStats,
} from "./types/game";

// ── Utilities (exposed for consuming packages like game-core) ───────────────
export { clamp, lerp, distance2D, mapRange, degToRad } from "./utils/math";
export { SCENE_KEYS, MODE_SCENE_MAP } from "./core/SceneRegistry";
