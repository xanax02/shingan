import { Scene, Vector3, Camera } from "three";
import { createTarget } from "../entities/Targets";
import * as THREE from "three";

// Target overlap is prevented via findValidPosition — retries up to MAX_PLACEMENT_ATTEMPTS.
export class TargetManager {
  private scene: Scene;
  private camera: Camera;

  private targets: Set<THREE.Mesh> = new Set();
  private lastPosition = new Vector3(0, 0, -20);

  private MIN_R = 4;
  private MAX_R = 12;

  /** Minimum centre-to-centre distance between any two targets (units). */
  private MIN_SEPARATION = 2.5; // targets have radius 1, so 0.5 gap between surfaces
  /** How many random candidates to try before giving up and using a fallback. */
  private MAX_PLACEMENT_ATTEMPTS = 30;

  constructor(scene: Scene, camera: Camera) {
    this.scene = scene;
    this.camera = camera;
  }

  spawnInitial(count = 3) {
    for (let i = 0; i < count; i++) {
      this.spawnNext();
    }
  }

  spawnNext() {
    const pos = this.findValidPosition();

    const target = createTarget();
    target.position.copy(pos);

    this.scene.add(target);
    this.targets.add(target);
  }

  destroy(target: THREE.Mesh) {
    this.scene.remove(target);
    this.targets.delete(target);

    this.spawnNext(); // instant respawn
  }

  destroyAll() {
    for (const target of this.targets) {
      this.scene.remove(target);
    }
    this.targets.clear();
  }

  /** Build one flick-style candidate position relative to lastPosition. */
  private getNextPosition(): Vector3 {
    const dir = this.randomDirection();

    // bias toward shorter flicks
    const dist =
      this.MIN_R +
      (this.MAX_R - this.MIN_R) * Math.pow(Math.random(), 2);

    let candidate = this.lastPosition.clone().add(dir.multiplyScalar(dist));

    candidate = this.applyCenterBias(candidate);
    candidate = this.clamp(candidate);

    return candidate;
  }

  /** Generate a random position anywhere inside the clamped play area. */
  private getRandomPosition(): Vector3 {
    return new Vector3(
      (Math.random() * 2 - 1) * 20,
      (Math.random() * 2 - 1) * 5,
      -5
    );
  }

  /** Returns true when `candidate` is far enough from every live target. */
  private isClearOfTargets(candidate: Vector3): boolean {
    for (const t of this.targets) {
      if (t.position.distanceTo(candidate) < this.MIN_SEPARATION) {
        return false;
      }
    }
    return true;
  }

  /**
   * Tries up to MAX_PLACEMENT_ATTEMPTS flick-style positions.
   * Falls back to random positions if none of them satisfy the separation
   * constraint, so spawning never deadlocks even when the arena is crowded.
   */
  private findValidPosition(): Vector3 {
    // --- Phase 1: flick-style candidates ---
    for (let i = 0; i < this.MAX_PLACEMENT_ATTEMPTS; i++) {
      const candidate = this.getNextPosition();
      if (this.isClearOfTargets(candidate)) {
        this.lastPosition.copy(candidate);
        return candidate;
      }
    }

    // --- Phase 2: fully random fallback ---
    for (let i = 0; i < this.MAX_PLACEMENT_ATTEMPTS; i++) {
      const candidate = this.getRandomPosition();
      if (this.isClearOfTargets(candidate)) {
        this.lastPosition.copy(candidate);
        return candidate;
      }
    }

    // Last resort: return a random position even if it overlaps
    // (only happens when MIN_SEPARATION is too large for the arena size).
    const fallback = this.getRandomPosition();
    this.lastPosition.copy(fallback);
    return fallback;
  }

  private randomDirection(): Vector3 {
    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    return new Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      -8
    );
  }

  private applyCenterBias(pos: Vector3): Vector3 {
    const center = new Vector3(0, 0, -8);
    return pos.lerp(center, 0.2);
  }

  private clamp(pos: Vector3): Vector3 {
    return new Vector3(
      Math.max(-20, Math.min(20, pos.x)),
      Math.max(-5, Math.min(5, pos.y)),
      -5
    );
  }

  getTargets() {
    return this.targets;
  }
}