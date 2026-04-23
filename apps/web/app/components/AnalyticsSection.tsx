"use client";

import { motion } from "framer-motion";

function AccuracyChart() {
  const data = [72, 75, 73, 78, 80, 82, 79, 85, 88, 91, 89, 94];
  const w = 320, h = 100;
  const max = 100, min = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 10}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#accFill)" />
      <polyline points={pts} fill="none" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot glow */}
      <circle cx={w} cy={h - ((94 - min) / (max - min)) * h} r="5" fill="#00C8FF" style={{ filter: "drop-shadow(0 0 6px #00C8FF)" }} />
    </svg>
  );
}

function ReactionChart() {
  const data = [240, 225, 218, 210, 205, 198, 192, 188, 187, 185];
  const w = 320, h = 80;
  const max = 250, min = 170;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#FF3CAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="none" />
      <circle cx={w} cy={h - ((185 - min) / (max - min)) * h} r="5" fill="#FF3CAC" style={{ filter: "drop-shadow(0 0 6px #FF3CAC)" }} />
    </svg>
  );
}

function ConsistencyRing({ value }: { value: number }) {
  const r = 50, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
      <circle cx="60" cy="60" r={r} stroke="url(#conGrad)" strokeWidth="8" fill="none"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
      <defs>
        <linearGradient id="conGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8BFF00" />
          <stop offset="100%" stopColor="#00C8FF" />
        </linearGradient>
      </defs>
      <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">{value}%</text>
      <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">CONSISTENCY</text>
    </svg>
  );
}

const METRICS = [
  { label: "Accuracy", value: "94.2%", delta: "+12.8%", color: "#00C8FF" },
  { label: "Reaction Time", value: "187ms", delta: "-23ms", color: "#FF3CAC" },
  { label: "Targets/Min", value: "342", delta: "+68", color: "#7C3AED" },
  { label: "Miss Rate", value: "5.8%", delta: "-9.2%", color: "#8BFF00" },
];

export function AnalyticsSection() {
  return (
    <section id="analytics" className="section-padding" style={{ background: "#0B1020", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 70%)" }} />

      <div className="container-lg" style={{ position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="analytics-grid">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,255,0,0.08)", border: "1px solid rgba(139,255,0,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#8BFF00", letterSpacing: "0.08em" }}>📊 PERFORMANCE ANALYTICS</span>
            </div>

            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
              Your Weaknesses,{" "}
              <span className="gradient-text">Quantified.</span>
            </h2>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 36 }}>
              Train with real metrics instead of guessing. AimOS tracks every shot, every miss, and every improvement — giving you a data-backed roadmap to your peak performance.
            </p>

            {/* Metric pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 36 }}>
              {METRICS.map((m) => (
                <div key={m.label} className="glass-card" style={{ padding: "16px 18px", border: `1px solid ${m.color}18` }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.06em" }}>{m.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: m.color, opacity: 0.8, marginTop: 4, fontWeight: 600 }}>{m.delta} this week</div>
                </div>
              ))}
            </div>

            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12h12M2 8h8M2 4h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>
              View Full Analytics
            </button>
          </motion.div>

          {/* Right: Charts */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Accuracy trend */}
            <div className="glass-card" style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Accuracy Trend</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#00C8FF" }}>94.2%</span>
              </div>
              <AccuracyChart />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                <span>4 weeks ago</span><span>Now</span>
              </div>
            </div>

            {/* Reaction Time */}
            <div className="glass-card" style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Reaction Time</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: "#FF3CAC" }}>187ms ↓</span>
              </div>
              <ReactionChart />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                <span>240ms → 185ms over 10 sessions</span>
              </div>
            </div>

            {/* Consistency */}
            <div className="glass-card" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 28 }}>
              <ConsistencyRing value={87} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Consistency Score</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#8BFF00", letterSpacing: "-0.02em" }}>87%</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Top 12% globally</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
