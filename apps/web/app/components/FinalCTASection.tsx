"use client";

import { motion } from "framer-motion";
import { ParticleField } from "./ParticleField";

export function FinalCTASection() {
  return (
    <section
      id="final-cta"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "140px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ParticleField count={70} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, rgba(0,200,255,0.08) 40%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #05070D 0%, transparent 20%, transparent 80%, #05070D 100%)" }} />
        {/* Big glow orbs */}
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,255,0.15) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,172,0.12) 0%, transparent 70%)", animation: "float-slow 10s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,60,172,0.1)", border: "1px solid rgba(255,60,172,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF3CAC", boxShadow: "0 0 8px #FF3CAC" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#FF3CAC", letterSpacing: "0.08em" }}>START YOUR JOURNEY TODAY</span>
          </div>

          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Your Aim Tomorrow<br />
            Depends On What You{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C8FF 0%, #7C3AED 50%, #FF3CAC 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Train Today.
            </span>
          </h2>

          <p style={{ fontSize: "clamp(15px, 2vw, 19px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
            Join the next generation of players using data-backed aim training.
            No install. No excuses. Just improvement.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: 17, padding: "16px 40px" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1L17 9L9 17M1 9H17" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Start Free — No Account Needed
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: 17, padding: "16px 36px" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 9H17M9 1L17 9L9 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
              View Rankings
            </motion.button>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "🔒", label: "No account required" },
              { icon: "⚡", label: "Instant browser play" },
              { icon: "🎯", label: "Free forever tier" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
