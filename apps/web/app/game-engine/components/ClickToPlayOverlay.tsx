"use client";
import { useGameStore } from "../../store/gameStore";


export default function ClickToPlayOverlay({ onClick }: { onClick: () => void }) {
  const phase = useGameStore((s) => s.phase);
  const startCountdown = useGameStore((s) => s.startCountdown);

  if (phase !== "idle") return null;

  const handleClick = () => {
    onClick();
    startCountdown();
  };

  return (
    <>
      <style>{`
        .ctp-backdrop {
          position: absolute;
          inset: 0;
          z-index: 60;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(5, 7, 13, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          user-select: none;
        }

        .ctp-title {
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          text-shadow:
            0 0 40px rgba(0, 200, 255, 0.5),
            0 0 80px rgba(124, 58, 237, 0.3);
          animation: ctp-fade-in 0.6s ease-out forwards;
        }

        .ctp-subtitle {
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(0, 200, 255, 0.5);
          margin-bottom: 48px;
          animation: ctp-fade-in 0.6s 0.1s ease-out both;
        }

        .ctp-btn {
          position: relative;
          padding: 16px 48px;
          border-radius: 6px;
          border: 1px solid rgba(0, 200, 255, 0.4);
          background: rgba(0, 200, 255, 0.08);
          color: #fff;
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          animation: ctp-fade-in 0.6s 0.2s ease-out both;
        }

        .ctp-btn:hover {
          background: rgba(0, 200, 255, 0.18);
          border-color: rgba(0, 200, 255, 0.8);
          box-shadow: 0 0 24px rgba(0, 200, 255, 0.25);
        }

        .ctp-hint {
          margin-top: 20px;
          font-family: var(--font-space, 'Space Grotesk', sans-serif);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.2);
          letter-spacing: 0.1em;
          animation: ctp-fade-in 0.6s 0.35s ease-out both;
        }

        .ctp-ring {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(0, 200, 255, 0.08);
          animation: ctp-ring-pulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        .ctp-ring:nth-child(2) { animation-delay: 1s; width: 440px; height: 440px; }
        .ctp-ring:nth-child(3) { animation-delay: 2s; width: 560px; height: 560px; }

        @keyframes ctp-ring-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.03); }
        }

        @keyframes ctp-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="ctp-backdrop" onClick={handleClick}>
        <div className="ctp-ring" />
        <div className="ctp-ring" />
        <div className="ctp-ring" />
        <p className="ctp-title">Gridshot</p>
        <p className="ctp-subtitle">60 seconds · Aim Training</p>
        <button className="ctp-btn">Click to Play</button>
        <p className="ctp-hint">Press ESC to exit · Mouse to aim</p>
      </div>
    </>
  );
}
