import { Scene, Vector3, Camera } from "three";
import { createTarget } from "../entities/Targets";
import * as THREE from "three";

//TODO: separate target from each other(sometime target forms one above another)
export class TargetManager {
  private scene: Scene;
  private camera: Camera;

  private targets: Set<THREE.Mesh> = new Set();
  private lastPosition = new Vector3(0, 0, -20);

  private MIN_R = 4;
  private MAX_R = 12;

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
    const pos = this.getNextPosition();

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

  private getNextPosition(): Vector3 {
    const dir = this.randomDirection();

    // bias toward shorter flicks
    const dist =
      this.MIN_R +
      (this.MAX_R - this.MIN_R) * Math.pow(Math.random(), 2);

    let candidate = this.lastPosition.clone().add(dir.multiplyScalar(dist));

    candidate = this.applyCenterBias(candidate);
    candidate = this.clamp(candidate);

    this.lastPosition.copy(candidate);
    return candidate;
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