import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Hub — AimOS",
  description: "Choose your training mode. Gridshot, Tracking, or Reaction Time — each targeting a different dimension of your aim.",
};

export default function TrainPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

        html, body {
          margin: 0;
          padding: 0;
          background: #05070D;
          overflow-x: hidden;
        }

        .hub-root {
          min-height: 100dvh;
          background: #05070D;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
        }

        .hub-bg-glow {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(0,200,255,0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(124,58,237,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,60,172,0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .hub-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .hub-content {
          position: relative;
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 56px;
        }

        .hub-header {
          text-align: center;
        }

        .hub-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,200,255,0.08);
          border: 1px solid rgba(0,200,255,0.2);
          border-radius: 100px;
          padding: 5px 16px;
          margin-bottom: 20px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(0,200,255,0.8);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hub-title {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 14px;
        }

        .hub-title span {
          background: linear-gradient(135deg, #00C8FF 0%, #7C3AED 50%, #FF3CAC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hub-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .hub-back {
          position: fixed;
          top: 20px;
          left: 20px;
          font-size: 13px;
          color: rgba(192,240,255,0.5);
          text-decoration: none;
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: 0.04em;
          transition: color 0.2s;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .hub-back:hover { color: rgba(0,200,255,0.9); }

        .hub-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 900px) {
          .hub-cards { grid-template-columns: 1fr; max-width: 480px; }
        }

        .hub-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          padding: 32px 28px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
          cursor: pointer;
        }

        .hub-card:hover {
          transform: translateY(-6px);
        }

        .hub-card-gridshot {
          border: 1px solid rgba(0,200,255,0.12);
        }
        .hub-card-gridshot:hover {
          box-shadow: 0 0 60px rgba(0,200,255,0.1), 0 20px 40px rgba(0,0,0,0.3);
          border-color: rgba(0,200,255,0.25);
        }

        .hub-card-tracking {
          border: 1px solid rgba(124,58,237,0.12);
        }
        .hub-card-tracking:hover {
          box-shadow: 0 0 60px rgba(124,58,237,0.1), 0 20px 40px rgba(0,0,0,0.3);
          border-color: rgba(124,58,237,0.25);
        }

        .hub-card-reaction {
          border: 1px solid rgba(255,60,172,0.12);
        }
        .hub-card-reaction:hover {
          box-shadow: 0 0 60px rgba(255,60,172,0.1), 0 20px 40px rgba(0,0,0,0.3);
          border-color: rgba(255,60,172,0.25);
        }

        .hub-card-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }

        .hub-card-glow {
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(40px);
          opacity: 0.08;
        }

        .hub-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .hub-card-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .hub-card-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0 0 10px;
        }

        .hub-card-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }

        .hub-card-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .hub-card-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.55);
        }

        .hub-card-features li::before {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .hub-card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
          font-family: 'Space Grotesk', sans-serif;
          transition: opacity 0.18s ease, transform 0.18s ease;
          border: none;
          cursor: pointer;
          width: 100%;
        }

        .hub-card-cta:hover { opacity: 0.9; transform: scale(1.02); }
        .hub-card-cta:active { transform: scale(0.98); }

        .hub-footer-note {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.04em;
          text-align: center;
        }
      `}</style>

      <a href="/" className="hub-back">← AimOS</a>

      <div className="hub-root">
        <div className="hub-bg-glow" />
        <div className="hub-grid" />

        <div className="hub-content">
          {/* Header */}
          <div className="hub-header">
            <div className="hub-eyebrow">🎯 Training Hub</div>
            <h1 className="hub-title">
              Pick your mode.
              <br />
              <span>Train with intent.</span>
            </h1>
            <p className="hub-subtitle">
              Three precision-engineered disciplines. Each one targeting a different weakness in your aim.
            </p>
          </div>

          {/* Cards */}
          <div className="hub-cards">
            {/* Gridshot */}
            <a href="/train/gridshot" className="hub-card hub-card-gridshot">
              <div className="hub-card-top-bar" style={{ background: "linear-gradient(90deg, transparent, #00C8FF, transparent)" }} />
              <div className="hub-card-glow" style={{ background: "#00C8FF" }} />
              <div className="hub-card-icon" style={{ background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.18)" }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M6 26L26 6M26 6H18M26 6V14" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="23" r="4" stroke="#00C8FF" strokeWidth="2" fill="rgba(0,200,255,0.12)"/>
                </svg>
              </div>
              <div className="hub-card-tag" style={{ color: "#00C8FF" }}>Flick Training</div>
              <h2 className="hub-card-title">Gridshot</h2>
              <p className="hub-card-desc">3 targets. Always up. Destroy one, it respawns. Build explosive flick accuracy under pressure.</p>
              <ul className="hub-card-features">
                <li style={{ "--dot-color": "#00C8FF" } as React.CSSProperties}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00C8FF", flexShrink: 0 }} />
                  3 live targets — always on screen
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,200,255,0.4)", flexShrink: 0 }} />
                  60-second sessions
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(0,200,255,0.4)", flexShrink: 0 }} />
                  Hits/sec + accuracy grading
                </li>
              </ul>
              <button className="hub-card-cta" style={{ background: "linear-gradient(135deg, #00C8FF, #00ff88)", color: "#070710" }}>
                Start Gridshot →
              </button>
            </a>

            {/* Tracking */}
            <a href="/train/tracking" className="hub-card hub-card-tracking">
              <div className="hub-card-top-bar" style={{ background: "linear-gradient(90deg, transparent, #7C3AED, transparent)" }} />
              <div className="hub-card-glow" style={{ background: "#7C3AED" }} />
              <div className="hub-card-icon" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)" }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="10" stroke="#7C3AED" strokeWidth="2" fill="none"/>
                  <path d="M16 6 Q22 11 22 16 Q22 21 16 26 Q10 21 10 16 Q10 11 16 6Z" stroke="#7C3AED" strokeWidth="2" fill="rgba(124,58,237,0.12)"/>
                  <circle cx="16" cy="16" r="2" fill="#7C3AED"/>
                </svg>
              </div>
              <div className="hub-card-tag" style={{ color: "#7C3AED" }}>Tracking Arena</div>
              <h2 className="hub-card-title">Tracking</h2>
              <p className="hub-card-desc">One target moves in a smooth orbital path. Lock on and hold. Your score is time on target.</p>
              <ul className="hub-card-features">
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#7C3AED", flexShrink: 0 }} />
                  Smooth Lissajous movement
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(124,58,237,0.4)", flexShrink: 0 }} />
                  30-second sessions
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(124,58,237,0.4)", flexShrink: 0 }} />
                  On-target % grading
                </li>
              </ul>
              <button className="hub-card-cta" style={{ background: "linear-gradient(135deg, #7C3AED, #c026d3)", color: "#fff" }}>
                Start Tracking →
              </button>
            </a>

            {/* Reaction */}
            <a href="/train/reaction" className="hub-card hub-card-reaction">
              <div className="hub-card-top-bar" style={{ background: "linear-gradient(90deg, transparent, #FF3CAC, transparent)" }} />
              <div className="hub-card-glow" style={{ background: "#FF3CAC" }} />
              <div className="hub-card-icon" style={{ background: "rgba(255,60,172,0.08)", border: "1px solid rgba(255,60,172,0.18)" }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L16 12M16 20L16 28M4 16L12 16M20 16L28 16" stroke="#FF3CAC" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="16" cy="16" r="6" stroke="#FF3CAC" strokeWidth="2" fill="rgba(255,60,172,0.12)"/>
                  <circle cx="16" cy="16" r="2" fill="#FF3CAC"/>
                </svg>
              </div>
              <div className="hub-card-tag" style={{ color: "#FF3CAC" }}>Reaction Time</div>
              <h2 className="hub-card-title">Reaction</h2>
              <p className="hub-card-desc">A target flashes. You click. How fast are you really? 10 rounds of pure reaction testing.</p>
              <ul className="hub-card-features">
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF3CAC", flexShrink: 0 }} />
                  Random delay — no pattern gaming
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,60,172,0.4)", flexShrink: 0 }} />
                  10 rounds per session
                </li>
                <li>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,60,172,0.4)", flexShrink: 0 }} />
                  Best / avg / grade tracking
                </li>
              </ul>
              <button className="hub-card-cta" style={{ background: "linear-gradient(135deg, #FF3CAC, #ff6b35)", color: "#fff" }}>
                Start Reaction →
              </button>
            </a>
          </div>

          <p className="hub-footer-note">All training data is stored locally · No account needed</p>
        </div>
      </div>
    </>
  );
}
