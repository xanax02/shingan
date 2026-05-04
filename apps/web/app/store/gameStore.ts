import { create } from 'zustand';

export type GamePhase = 'idle' | 'countdown' | 'playing' | 'finished';

export type GameState = {
  phase: GamePhase;
  countdownValue: number;
  timeRemaining: number;
  score: number;
  hits: number;
  misses: number;
  accuracy: number;

  // Actions
  startCountdown: () => void;
  startPlaying: () => void;
  registerHit: () => void;
  registerMiss: () => void;
  tick: () => void;
  reset: () => void;
};

// Timer IDs stored outside Zustand to avoid serialization issues
let countdownTimer: ReturnType<typeof setInterval> | null = null;
let gameTimer: ReturnType<typeof setInterval> | null = null;

function clearAllTimers() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  if (gameTimer) { clearInterval(gameTimer); gameTimer = null; }
}

function calcAccuracy(hits: number, misses: number): number {
  const total = hits + misses;
  if (total === 0) return 100;
  return Math.round((hits / total) * 100);
}

/**
 * Scoring:
 * - Base points per hit: 100
 * - Accuracy multiplier: (1 + accuracy / 100)
 *   e.g. 80% accuracy → 1.8× → 180 points per hit
 */
function calcScore(hits: number, accuracy: number): number {
  const basePerHit = 100;
  const multiplier = 1 + accuracy / 100;
  return Math.round(hits * basePerHit * multiplier);
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'idle',
  countdownValue: 3,
  timeRemaining: 60,
  score: 0,
  hits: 0,
  misses: 0,
  accuracy: 100,

  startCountdown: () => {
    clearAllTimers();
    set({ phase: 'countdown', countdownValue: 3 });

    countdownTimer = setInterval(() => {
      const { countdownValue } = get();
      if (countdownValue <= 1) {
        clearInterval(countdownTimer!);
        countdownTimer = null;
        get().startPlaying();
      } else {
        set({ countdownValue: countdownValue - 1 });
      }
    }, 1000);
  },

  startPlaying: () => {
    set({ phase: 'playing', timeRemaining: 60, countdownValue: 0 });

    gameTimer = setInterval(() => {
      get().tick();
    }, 1000);
  },

  tick: () => {
    const { timeRemaining } = get();
    if (timeRemaining <= 1) {
      clearInterval(gameTimer!);
      gameTimer = null;
      set({ timeRemaining: 0, phase: 'finished' });
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  registerHit: () => {
    const { hits, misses } = get();
    const newHits = hits + 1;
    const newAccuracy = calcAccuracy(newHits, misses);
    const newScore = calcScore(newHits, newAccuracy);
    set({ hits: newHits, accuracy: newAccuracy, score: newScore });
  },

  registerMiss: () => {
    const { hits, misses } = get();
    const newMisses = misses + 1;
    const newAccuracy = calcAccuracy(hits, newMisses);
    const newScore = calcScore(hits, newAccuracy);
    set({ misses: newMisses, accuracy: newAccuracy, score: newScore });
  },

  reset: () => {
    clearAllTimers();
    set({
      phase: 'idle',
      countdownValue: 3,
      timeRemaining: 60,
      score: 0,
      hits: 0,
      misses: 0,
      accuracy: 100,
    });
  },
}));
