"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

const STATS = [
  { value: 50, suffix: "K+", label: "Sessions Played", color: "#00C8FF" },
  { value: 1, suffix: "M+", label: "Targets Hit", color: "#7C3AED" },
  { value: 18, suffix: "%", label: "Avg Reaction Improvement", color: "#8BFF00" },
  { value: 128, suffix: "K+", label: "Players Ranked", color: "#FF3CAC" },
];

const TESTIMONIALS = [
  { username: "ShadowFlick92", tier: "Diamond", comment: "My reaction time dropped from 240ms to 187ms in 3 weeks. The analytics actually show you where you're losing.", avatar: "SF", color: "#00C8FF" },
  { username: "TapBurst", tier: "Platinum", comment: "Best browser aim trainer by a mile. The flick training mode is elite — feels like Aim Lab but faster to start.", avatar: "TB", color: "#7C3AED" },
  { username: "NeonTracker", tier: "Gold", comment: "Tracking arena changed how I play. My micro-adjustments are way more consistent after 2 weeks of use.", avatar: "NT", color: "#8BFF00" },
  { username: "HeadshotZen", tier: "Radiant", comment: "The heatmap data is insane. I finally know exactly which angles I'm weak at. No other tool does this in-browser.", avatar: "HZ", color: "#FF3CAC" },
];

const TIER_COLORS: Record<string, string> = {
  Diamond: "#00C8FF",
  Platinum: "#7C3AED",
  Gold: "#FFD700",
  Radiant: "#FF3CAC",
};

function sectionVariant(delay = 0) {
  return {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
  };
}

export function SocialProofSection() {
  return (
    <section id="social-proof" className="section-padding" style={{ background: "#0B1020", position: "relative", overflow: "hidden" }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="container-lg" style={{ position: "relative" }}>
        {/* Headline */}
        <motion.div
          variants={sectionVariant()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,255,0,0.08)", border: "1px solid rgba(139,255,0,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8BFF00", boxShadow: "0 0 8px #8BFF00" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#8BFF00", letterSpacing: "0.08em" }}>COMMUNITY GROWTH</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Trusted by competitive players
            <span className="gradient-text-blue" style={{ display: "block" }}>leveling up daily</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 80 }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={sectionVariant(i * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="glass-card"
              style={{
                padding: "32px 24px",
                textAlign: "center",
                border: `1px solid ${stat.color}18`,
                boxShadow: `0 0 30px ${stat.color}08`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              whileHover={{ y: -6, boxShadow: `0 0 50px ${stat.color}20` }}
            >
              <div style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 900, color: stat.color, lineHeight: 1, letterSpacing: "-0.02em", textShadow: `0 0 30px ${stat.color}60` }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 10, fontWeight: 500, letterSpacing: "0.02em" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.username}
              variants={sectionVariant(0.15 + i * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="glass-card"
              whileHover={{ y: -4 }}
              style={{ padding: "24px", border: `1px solid ${t.color}12`, transition: "transform 0.2s ease" }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[...Array(5)].map((_, si) => (
                  <svg key={si} width="14" height="14" viewBox="0 0 14 14" fill={t.color}>
                    <path d="M7 1l1.5 4h4.5l-3.5 2.5 1.5 4L7 9.5l-3.5 2 1.5-4L1.5 5H6z" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 20 }}>
                "{t.comment}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}40, ${t.color}10)`, border: `1.5px solid ${t.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{t.username}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: TIER_COLORS[t.tier] }}>{t.tier}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
