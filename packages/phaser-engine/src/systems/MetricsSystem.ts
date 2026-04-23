import { GRADE_A_MAX, GRADE_B_MAX, GRADE_C_MAX, GRADE_S_MAX } from "../utils/constants";

// ─── Types ─────────────────────────────────────────────────────────────────

export type Grade = "S" | "A" | "B" | "C" | "D";

export interface RoundResult {
  round: number;
  /** Reaction time in ms. -1 for false starts, 0 for misses (no target clicked). */
  reactionTimeMs: number;
  wasFalseStart: boolean;
  wasMiss: boolean;
}

export interface SessionStats {
  rounds: RoundResult[];
  /** Best (lowest) successful reaction time. Infinity if no successful hits yet. */
  best: number;
  /** Worst (highest) successful reaction time. 0 if no successful hits yet. */
  worst: number;
  /** Average of successful hit reaction times. 0 if no successful hits. */
  average: number;
  falseStarts: number;
  misses: number;
  /** Percentage of rounds with a clean hit (not false start, not miss). */
  accuracy: number;
  grade: Grade;
}

// ─── MetricsSystem ─────────────────────────────────────────────────────────

/**
 * MetricsSystem — pure data tracker for one training session.
 *
 * Never touches Phaser or the DOM. Stores round results and exposes
 * computed aggregates. Designed to be constructed once per session and
 * queried frequently without allocation (all getters compute from arrays
 * held in memory).
 */
export class MetricsSystem {
  private readonly results: RoundResult[] = [];
  private currentRound: number = 1;
  private falseStartCount: number = 0;
  private missCount: number = 0;
  private highScore: number | null = null; // localStorage best average, ms

  constructor() {
    this.loadHighScore();
  }

  // ─── Mutation ──────────────────────────────────────────────────────────────

  /**
   * Record a successful target hit.
   * @param reactionMs Milliseconds between target appearance and click.
   */
  recordHit(reactionMs: number): void {
    this.results.push({
      round: this.currentRound,
      reactionTimeMs: reactionMs,
      wasFalseStart: false,
      wasMiss: false,
    });
    this.currentRound++;
  }

  /**
   * Record a false start (click before target appeared).
   * Does NOT advance the round — the scene restarts the same round.
   */
  recordFalseStart(): void {
    this.falseStartCount++;
    this.results.push({
      round: this.currentRound,
      reactionTimeMs: -1,
      wasFalseStart: true,
      wasMiss: false,
    });
    // Round does NOT increment; scene will retry
  }

  /**
   * Record a miss click (clicked outside target while it was visible).
   * Advances the round.
   */
  recordMiss(): void {
    this.missCount++;
    this.results.push({
      round: this.currentRound,
      reactionTimeMs: 0,
      wasFalseStart: false,
      wasMiss: true,
    });
    this.currentRound++;
  }

  reset(): void {
    this.results.length = 0;
    this.currentRound = 1;
    this.falseStartCount = 0;
    this.missCount = 0;
  }

  // ─── Reads ─────────────────────────────────────────────────────────────────

  /** 1-based current round number. */
  getRound(): number {
    return this.currentRound;
  }

  getFalseStarts(): number {
    return this.falseStartCount;
  }

  getMisses(): number {
    return this.missCount;
  }

  /** Successful hit results only. */
  getHits(): RoundResult[] {
    return this.results.filter((r) => !r.wasFalseStart && !r.wasMiss);
  }

  getBest(): number {
    const hits = this.getHits();
    if (hits.length === 0) return Infinity;
    return Math.min(...hits.map((r) => r.reactionTimeMs));
  }

  getWorst(): number {
    const hits = this.getHits();
    if (hits.length === 0) return 0;
    return Math.max(...hits.map((r) => r.reactionTimeMs));
  }

  getAverage(): number {
    const hits = this.getHits();
    if (hits.length === 0) return 0;
    const sum = hits.reduce((acc, r) => acc + r.reactionTimeMs, 0);
    return Math.round(sum / hits.length);
  }

  getAccuracy(): number {
    const totalRounds = this.currentRound - 1 + (this.falseStartCount > 0 ? 0 : 0);
    const hitRounds = this.getHits().length;
    if (totalRounds === 0) return 100;
    return Math.round((hitRounds / totalRounds) * 100);
  }

  getGrade(): Grade {
    const avg = this.getAverage();
    if (avg === 0) return "D";
    if (avg < GRADE_S_MAX) return "S";
    if (avg <= GRADE_A_MAX) return "A";
    if (avg <= GRADE_B_MAX) return "B";
    if (avg <= GRADE_C_MAX) return "C";
    return "D";
  }

  /**
   * Full session stats snapshot — used to build the end modal.
   */
  getSessionStats(): SessionStats {
    return {
      rounds: [...this.results],
      best: this.getBest(),
      worst: this.getWorst(),
      average: this.getAverage(),
      falseStarts: this.falseStartCount,
      misses: this.missCount,
      accuracy: this.getAccuracy(),
      grade: this.getGrade(),
    };
  }

  // ─── LocalStorage High Score ────────────────────────────────────────────────

  getHighScore(): number | null {
    return this.highScore;
  }

  /**
   * Persist average if it's a new personal best (lower = better).
   * Returns true if a new high score was set.
   */
  maybeSaveHighScore(): boolean {
    const avg = this.getAverage();
    if (avg === 0) return false;
    if (this.highScore === null || avg < this.highScore) {
      this.highScore = avg;
      try {
        localStorage.setItem("aim_reaction_best", String(avg));
      } catch {
        // Safari private mode throws — silently ignore
      }
      return true;
    }
    return false;
  }

  private loadHighScore(): void {
    try {
      const stored = localStorage.getItem("aim_reaction_best");
      this.highScore = stored ? Number(stored) : null;
    } catch {
      this.highScore = null;
    }
  }
}
