"use client";

import { motion } from "framer-motion";

const MODES = [
  {
    id: "flick",
    href: "/train/gridshot",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 26L26 6M26 6H18M26 6V14" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="23" r="4" stroke="#00C8FF" strokeWidth="2" fill="rgba(0,200,255,0.1)" />
      </svg>
    ),
    title: "Flick Training",
    tagline: "Zero in. Click. Repeat.",
    color: "#00C8FF",
    features: ["Random target spawn", "Speed + precision focus", "Click accuracy analytics"],
    chart: [55, 62, 58, 70, 65, 78, 82, 88, 91, 94],
    stat: "94% peak",
    statLabel: "accuracy",
  },
  {
    id: "tracking",
    href: "/train/tracking",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#7C3AED" strokeWidth="2" fill="none" />
        <path d="M16 6 Q22 11 22 16 Q22 21 16 26 Q10 21 10 16 Q10 11 16 6Z" stroke="#7C3AED" strokeWidth="2" fill="rgba(124,58,237,0.1)" />
        <circle cx="16" cy="16" r="2" fill="#7C3AED" />
      </svg>
    ),
    title: "Tracking Arena",
    tagline: "Lock on. Never let go.",
    color: "#7C3AED",
    features: ["Smooth moving targets", "Continuous aim control", "Micro-adjustment training"],
    chart: [40, 48, 45, 55, 60, 58, 67, 70, 72, 78],
    stat: "+28%",
    statLabel: "consistency",
  },
  {
    id: "reaction",
    href: "/train/reaction",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L16 12M16 20L16 28M4 16L12 16M20 16L28 16" stroke="#FF3CAC" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="6" stroke="#FF3CAC" strokeWidth="2" fill="rgba(255,60,172,0.1)" />
        <circle cx="16" cy="16" r="2" fill="#FF3CAC" />
      </svg>
    ),
    title: "Reaction Time",
    tagline: "Think fast. Click faster.",
    color: "#FF3CAC",
    features: ["Visual stimulus tests", "Speed response drills", "Latency breakdown metrics"],
    chart: [80, 75, 70, 68, 64, 60, 57, 53, 50, 47],
    stat: "187ms",
    statLabel: "avg reaction",
  },
];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 40;
  const w = 140;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`chartGrad${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrainingModesSection() {
  return (
    <section id="modes" className="section-padding" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at bottom, rgba(124,58,237,0.06) 0%, transparent 60%)" }} />

      <div className="container-lg" style={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#7C3AED", letterSpacing: "0.08em" }}>🎯 TRAINING MODES</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Choose your weapon.
            <span className="gradient-text" style={{ display: "block" }}>Sharpen your edge.</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "16px auto 0" }}>
            Three precision-engineered training disciplines, each targeting a different dimension of your aim.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.07)`,
                borderRadius: 20,
                padding: "32px 28px",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top glow line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${mode.color}, transparent)`, opacity: 0.6 }} />
              {/* Background glow */}
              <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${mode.color}08, transparent 70%)`, pointerEvents: "none" }} />

              {/* Icon */}
              <div style={{ width: 60, height: 60, borderRadius: 14, background: `${mode.color}10`, border: `1px solid ${mode.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                {mode.icon}
              </div>

              {/* Tagline + title */}
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: mode.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{mode.tagline}</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.01em" }}>{mode.title}</h3>

              {/* Features */}
              <ul style={{ listStyle: "none", marginBottom: 28, display: "flex", flexDirection: "column", gap: 8 }}>
                {mode.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 4" stroke={mode.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Chart + stat */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <MiniChart data={mode.chart} color={mode.color} />
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: mode.color, letterSpacing: "-0.02em" }}>{mode.stat}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.04em" }}>{mode.statLabel}</div>
                </div>
              </div>

              {/* CTA — navigates to game route */}
              <a
                href={mode.href}
                style={{
                  display: "block",
                  marginTop: 22,
                  width: "100%",
                  padding: "12px",
                  borderRadius: 10,
                  background: `${mode.color}12`,
                  border: `1px solid ${mode.color}25`,
                  color: mode.color,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  textDecoration: "none",
                  fontFamily: "inherit",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${mode.color}22`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px ${mode.color}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `${mode.color}12`;
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                }}
              >
                Start {mode.title} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
