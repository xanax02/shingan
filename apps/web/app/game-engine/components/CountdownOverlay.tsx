"use client";

import { useGameStore } from "../../store/gameStore";
import { useEffect, useState } from "react";

export default function CountdownOverlay() {
  const phase = useGameStore((s) => s.phase);
  const countdownValue = useGameStore((s) => s.countdownValue);

  // Trigger a re-animate pulse each time the number changes
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [countdownValue]);

  if (phase !== "countdown") return null;

  return (
    <>
      <style>{`
        .countdown-backdrop {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(5, 7, 13, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .countdown-number {
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: clamp(100px, 20vw, 200px);
          font-weight: 800;
          color: #fff;
          text-shadow:
            0 0 40px rgba(0, 200, 255, 0.6),
            0 0 80px rgba(0, 200, 255, 0.3),
            0 0 120px rgba(124, 58, 237, 0.2);
          animation: countdown-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          user-select: none;
          pointer-events: none;
        }

        @keyframes countdown-pop {
          0% {
            transform: scale(2.5);
            opacity: 0;
            filter: blur(8px);
          }
          40% {
            transform: scale(0.95);
            opacity: 1;
            filter: blur(0);
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          80% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.9);
            opacity: 0.3;
            filter: blur(2px);
          }
        }

        .countdown-label {
          position: absolute;
          bottom: 30%;
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: 14px;
          font-weight: 600;
          color: rgba(0, 200, 255, 0.6);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: countdown-label-fade 0.5s ease-out forwards;
        }

        @keyframes countdown-label-fade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .countdown-ring {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 2px solid rgba(0, 200, 255, 0.15);
          animation: countdown-ring-pulse 1s ease-out infinite;
        }

        @keyframes countdown-ring-pulse {
          0% { transform: scale(0.8); opacity: 0.4; border-color: rgba(0, 200, 255, 0.3); }
          100% { transform: scale(1.6); opacity: 0; border-color: rgba(0, 200, 255, 0); }
        }
      `}</style>

      <div className="countdown-backdrop">
        <div className="countdown-ring" />
        <span className="countdown-number" key={animKey}>
          {countdownValue}
        </span>
        <span className="countdown-label">Get Ready</span>
      </div>
    </>
  );
}
