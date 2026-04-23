/**
 * Clamp a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between a and b by t ∈ [0,1].
 * Used for smooth animations and camera lerping in future mechanics.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Euclidean distance between two 2D points.
 * Allocation-free: uses primitive arguments only.
 */
export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Map a value from one range to another.
 * Useful for normalizing scores, difficulties, etc.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Degrees to radians conversion.
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
