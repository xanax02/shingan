"use client";

import { motion } from "framer-motion";

const ROWS = [
  { feature: "Instant browser play", us: true, them: false },
  { feature: "No download / install", us: true, them: false },
  { feature: "Premium visual experience", us: true, them: false },
  { feature: "Deep performance analytics", us: true, them: false },
  { feature: "Global leaderboards", us: true, them: false },
  { feature: "Real-time heatmaps", us: true, them: false },
  { feature: "Cross-platform support", us: true, them: false },
  { feature: "Habit tracking & streaks", us: true, them: false },
];

export function ComparisonSection() {
  return (
    <section id="compare" className="section-padding" style={{ background: "#0B1020", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top left, rgba(0,200,255,0.04) 0%, transparent 50%)" }} />

      <div className="container-lg" style={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#00C8FF", letterSpacing: "0.08em" }}>⚔️ WHY AIMOST WINS</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            We&apos;re not just better.
            <span className="gradient-text" style={{ display: "block" }}>We&apos;re in a different league.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          <div className="glass-card" style={{ overflow: "hidden" }}>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>FEATURE</span>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Traditional</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Aim Trainers</div>
              </div>
              <div style={{ textAlign: "center", background: "rgba(0,200,255,0.06)", borderRadius: 8, padding: "4px 0", border: "1px solid rgba(0,200,255,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#00C8FF" }}>AimOS</div>
                <div style={{ fontSize: 11, color: "rgba(0,200,255,0.6)" }}>You are here</div>
              </div>
            </div>

            {ROWS.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 120px",
                  padding: "15px 24px",
                  borderBottom: i < ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{row.feature}</span>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {row.them ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8 14L16 6" stroke="#8BFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14M14 6L6 14" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "center", background: "rgba(0,200,255,0.04)" }}>
                  {row.us ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10L8 14L16 6" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="10" cy="10" r="9" stroke="rgba(0,200,255,0.2)" strokeWidth="1" fill="none" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6L14 14M14 6L6 14" stroke="#FF3CAC" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: "center", marginTop: 40 }}
          >
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
              Experience the Difference — Free
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
