"use client";

import { useGameStore } from "../../store/gameStore";
import "./GridshotHUD.css";

export default function GridshotHUD() {
  const phase = useGameStore((s) => s.phase);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const score = useGameStore((s) => s.score);
  const accuracy = useGameStore((s) => s.accuracy);
  const hits = useGameStore((s) => s.hits);
  const misses = useGameStore((s) => s.misses);

  if (phase !== "playing") return null;

  // Timer ring
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progress = timeRemaining / 60; // 0..1
  const dashOffset = circumference * (1 - progress);

  // Format time
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  // Accuracy class
  let accClass = "hud-acc-great";
  if (accuracy < 50) accClass = "hud-acc-poor";
  else if (accuracy < 80) accClass = "hud-acc-good";

  // Urgent when under 10s
  const isUrgent = timeRemaining <= 10;

  return (
    <div className="hud-bar">
      {/* Timer */}
      <div className="hud-timer">
        <div className="hud-timer-ring">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle className="hud-timer-ring-bg" cx="22" cy="22" r={radius} />
            <circle
              className="hud-timer-ring-fg"
              cx="22"
              cy="22"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={isUrgent ? { stroke: "#ff4444", filter: "drop-shadow(0 0 6px rgba(255,68,68,0.5))" } : undefined}
            />
          </svg>
        </div>
        <div className="hud-timer-text">
          <span className="hud-timer-label">Time</span>
          <span className={`hud-timer-value${isUrgent ? " hud-urgent" : ""}`}>
            {timeStr}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="hud-score">
        <span className="hud-score-label">Score</span>
        <span className="hud-score-value">
          {score.toLocaleString()}
        </span>
      </div>

      {/* Accuracy */}
      <div className="hud-accuracy">
        <span className="hud-accuracy-label">Accuracy</span>
        <span className={`hud-accuracy-value ${accClass}`}>
          {accuracy}%
        </span>
        <span className="hud-accuracy-breakdown">
          {hits}H / {misses}M
        </span>
      </div>
    </div>
  );
}
