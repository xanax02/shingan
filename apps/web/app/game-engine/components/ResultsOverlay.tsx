"use client";

import { useGameStore } from "../../store/gameStore";
import { useRouter } from "next/navigation";

export default function ResultsOverlay() {
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);
  const hits = useGameStore((s) => s.hits);
  const misses = useGameStore((s) => s.misses);
  const accuracy = useGameStore((s) => s.accuracy);
  const reset = useGameStore((s) => s.reset);
  const startCountdown = useGameStore((s) => s.startCountdown);
  const router = useRouter();

  if (phase !== "finished") return null;

  const hitsPerSec = (hits / 60).toFixed(2);
  const total = hits + misses;

  // Grade thresholds (based on score)
  let grade = "D";
  let gradeColor = "#ff4444";
  if (score >= 10000) { grade = "S"; gradeColor = "#00ffcc"; }
  else if (score >= 7000) { grade = "A"; gradeColor = "#00ff88"; }
  else if (score >= 4500) { grade = "B"; gradeColor = "#ffc800"; }
  else if (score >= 2500) { grade = "C"; gradeColor = "#ff8800"; }

  const handlePlayAgain = () => {
    reset();
    // Small delay to let state clear before restarting
    setTimeout(() => startCountdown(), 50);
  };

  const handleBackToHub = () => {
    reset();
    router.push("/train");
  };

  return (
    <>
      <style>{`
        .results-backdrop {
          position: absolute;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 7, 13, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: results-fade-in 0.4s ease-out forwards;
        }

        @keyframes results-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .results-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(0, 200, 255, 0.15);
          border-radius: 24px;
          padding: 48px 56px;
          max-width: 480px;
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          animation: results-card-in 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          position: relative;
          overflow: hidden;
        }

        .results-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00C8FF, #7C3AED, transparent);
        }

        @keyframes results-card-in {
          0% { transform: translateY(30px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        .results-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(0, 200, 255, 0.7);
        }

        .results-grade {
          font-size: 80px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
        }

        .results-score {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #00C8FF 0%, #7C3AED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .results-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px 0;
        }

        .results-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .results-stat:not(:last-child) {
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        .results-stat-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35);
        }

        .results-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          font-variant-numeric: tabular-nums;
        }

        .results-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .results-btn {
          flex: 1;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          transition: transform 0.18s ease, opacity 0.18s ease;
          pointer-events: auto;
        }

        .results-btn:hover { transform: scale(1.03); }
        .results-btn:active { transform: scale(0.97); }

        .results-btn-primary {
          background: linear-gradient(135deg, #00C8FF, #00ff88);
          color: #070710;
        }

        .results-btn-secondary {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .results-btn-secondary:hover {
          border-color: rgba(0, 200, 255, 0.3);
          color: #fff;
        }
      `}</style>

      <div className="results-backdrop">
        <div className="results-card">
          <span className="results-eyebrow">Session Complete</span>

          <div
            className="results-grade"
            style={{ color: gradeColor, textShadow: `0 0 30px ${gradeColor}40, 0 0 60px ${gradeColor}20` }}
          >
            {grade}
          </div>

          <div className="results-score">{score.toLocaleString()}</div>

          <div className="results-stats">
            <div className="results-stat">
              <span className="results-stat-label">Accuracy</span>
              <span className="results-stat-value">{accuracy}%</span>
            </div>
            <div className="results-stat">
              <span className="results-stat-label">Hits / Total</span>
              <span className="results-stat-value">{hits}/{total}</span>
            </div>
            <div className="results-stat">
              <span className="results-stat-label">Hits/sec</span>
              <span className="results-stat-value">{hitsPerSec}</span>
            </div>
          </div>

          <div className="results-buttons">
            <button className="results-btn results-btn-secondary" onClick={handleBackToHub}>
              ← Hub
            </button>
            <button className="results-btn results-btn-primary" onClick={handlePlayAgain}>
              Play Again →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
