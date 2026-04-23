"use client";

import { motion } from "framer-motion";

const PLAYERS = [
  { rank: 1, username: "FlickGodX", score: 9847, tier: "Radiant", delta: "+124", badge: "🏆" },
  { rank: 2, username: "AimRush", score: 9631, tier: "Immortal", delta: "+88", badge: "⚡" },
  { rank: 3, username: "ZenithFPS", score: 9412, tier: "Diamond", delta: "+62", badge: "💎" },
  { rank: 4, username: "PixelHunter", score: 9218, tier: "Diamond", delta: "+41", badge: "💎" },
  { rank: 5, username: "You", score: 8924, tier: "Platinum", delta: "+210", badge: "🔥", isYou: true },
];

const TIER_COLORS: Record<string, string> = {
  Radiant: "#FF3CAC",
  Immortal: "#FF6B35",
  Diamond: "#00C8FF",
  Platinum: "#7C3AED",
};

const BADGES = [
  { label: "Flick God", desc: "99th percentile flick accuracy", color: "#FFD700", icon: "⚡" },
  { label: "Snap Master", desc: "Sub-200ms average reaction", color: "#00C8FF", icon: "🎯" },
  { label: "Iron Will", desc: "30-day training streak", color: "#FF3CAC", icon: "🔥" },
  { label: "Precision+", desc: "95% accuracy in 100+ shots", color: "#8BFF00", icon: "💎" },
];

export function CompetitiveSection() {
  return (
    <section id="rankings" className="section-padding" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 800, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,172,0.06) 0%, transparent 70%)" }} />

      <div className="container-lg" style={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,60,172,0.08)", border: "1px solid rgba(255,60,172,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#FF3CAC", letterSpacing: "0.08em" }}>🏆 GLOBAL RANKINGS</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Compete Globally.
            <span className="gradient-text" style={{ display: "block" }}>Dominate Locally.</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "16px auto 0" }}>
            Real-time global leaderboards. Every session counts toward your rank.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="glass-card" style={{ overflow: "hidden" }}>
              {/* Header */}
              <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,60,172,0.04)" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em" }}>GLOBAL LEADERBOARD</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8BFF00", boxShadow: "0 0 8px #8BFF00", animation: "glow-pulse 2s infinite" }} />
              </div>

              {/* Column headers */}
              <div style={{ padding: "10px 22px", display: "grid", gridTemplateColumns: "40px 1fr auto auto", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", fontWeight: 600 }}>
                <span>RANK</span><span>PLAYER</span><span>SCORE</span><span>DELTA</span>
              </div>

              {/* Rows */}
              {PLAYERS.map((p, i) => (
                <motion.div
                  key={p.username}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    padding: "14px 22px",
                    display: "grid",
                    gridTemplateColumns: "40px 1fr auto auto",
                    gap: 12,
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: p.isYou ? "rgba(0,200,255,0.05)" : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 800, color: p.rank === 1 ? "#FFD700" : "rgba(255,255,255,0.5)" }}>
                    {p.badge}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: p.isYou ? "#00C8FF" : "#fff" }}>
                      {p.username} {p.isYou && <span style={{ fontSize: 10, color: "#00C8FF", marginLeft: 6, fontWeight: 600 }}>YOU</span>}
                    </div>
                    <div style={{ fontSize: 11, color: TIER_COLORS[p.tier] ?? "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 2 }}>{p.tier}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: p.isYou ? "#00C8FF" : "#fff" }}>{p.score.toLocaleString()}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#8BFF00" }}>+{p.delta}</div>
                </motion.div>
              ))}

              <div style={{ padding: "16px 22px", textAlign: "center" }}>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Join Ranked Mode
                </button>
              </div>
            </div>
          </motion.div>

          {/* Badges + Tiers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Rank tiers */}
            <div className="glass-card" style={{ padding: "22px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 16 }}>RANK TIERS</div>
              {[
                { tier: "Radiant", color: "#FF3CAC", icon: "👑", req: "Top 0.1%" },
                { tier: "Immortal", color: "#FF6B35", icon: "⚡", req: "Top 1%" },
                { tier: "Diamond", color: "#00C8FF", icon: "💎", req: "Top 5%" },
                { tier: "Platinum", color: "#7C3AED", icon: "✨", req: "Top 15%" },
                { tier: "Gold", color: "#FFD700", icon: "🥇", req: "Top 30%" },
              ].map((tier) => (
                <div key={tier.tier} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 20 }}>{tier.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tier.color }}>{tier.tier}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{tier.req}</div>
                  </div>
                  <div style={{ height: 4, width: 80, borderRadius: 4, background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, right: tier.tier === "Radiant" ? "0%" : tier.tier === "Immortal" ? "20%" : tier.tier === "Diamond" ? "40%" : tier.tier === "Platinum" ? "60%" : "70%", background: tier.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Badges */}
            <div className="glass-card" style={{ padding: "22px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", marginBottom: 16 }}>ACHIEVEMENT BADGES</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {BADGES.map((b) => (
                  <div key={b.label} style={{ background: `${b.color}08`, border: `1px solid ${b.color}20`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{b.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: b.color, marginBottom: 3 }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
