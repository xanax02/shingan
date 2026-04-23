"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleField } from "./ParticleField";

function DashboardMockup() {
  const [accuracy] = useState(94.2);
  const [rt] = useState(187);

  // Circular SVG gauge
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (rt / 300); // map rt to stroke

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 540 }}>
      {/* Floating card: Rank */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card-blue"
        style={{
          position: "absolute",
          top: -30,
          right: -20,
          padding: "10px 16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 0 30px rgba(124, 58, 237, 0.3)",
          border: "1px solid rgba(124, 58, 237, 0.25)",
          background: "rgba(124, 58, 237, 0.12)",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💎</div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Current Rank</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Diamond III</div>
        </div>
      </motion.div>

      {/* Floating card: Improvement */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass-card"
        style={{
          position: "absolute",
          bottom: 20,
          left: -30,
          padding: "10px 16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 0 30px rgba(139, 255, 0, 0.2)",
          border: "1px solid rgba(139, 255, 0, 0.2)",
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(139, 255, 0, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#8BFF00" }}>↑</div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Weekly Improvement</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#8BFF00" }}>+18.4%</div>
        </div>
      </motion.div>

      {/* Floating card: Streak */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="glass-card"
        style={{
          position: "absolute",
          top: "40%",
          right: -40,
          padding: "10px 16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid rgba(255, 60, 172, 0.2)",
          background: "rgba(255, 60, 172, 0.05)",
          boxShadow: "0 0 20px rgba(255, 60, 172, 0.15)",
        }}
      >
        <div style={{ fontSize: 22 }}>🔥</div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Day Streak</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#FF3CAC" }}>7 Days</div>
        </div>
      </motion.div>

      {/* Main Dashboard Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{
          background: "rgba(11, 16, 32, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0, 200, 255, 0.15)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(0, 200, 255, 0.08), 0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Panel Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,200,255,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8BFF00", boxShadow: "0 0 8px #8BFF00", animation: "glow-pulse 2s infinite" }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.9)" }}>LIVE SESSION</span>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            <span>Mode: <span style={{ color: "#00C8FF", fontWeight: 600 }}>Flick</span></span>
            <span>12:34</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 0 }}>
          {/* Target Arena */}
          <div style={{ position: "relative", height: 220, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
            {/* Grid overlay */}
            <div className="grid-overlay" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />

            {/* Radial glow */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(0,200,255,0.04) 0%, transparent 70%)" }} />

            {/* Moving Target */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: -14,
                marginTop: -14,
                animation: "target-move 7s ease-in-out infinite",
                zIndex: 2,
              }}
            >
              <div style={{ position: "relative" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255, 60, 172, 0.9)", boxShadow: "0 0 20px rgba(255,60,172,0.8), 0 0 40px rgba(255,60,172,0.4)" }} />
                <div style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid rgba(255,60,172,0.5)", animation: "pulse-ring 2s ease-out infinite" }} />
              </div>
            </div>

            {/* Crosshair */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                animation: "crosshair-move 7s ease-in-out infinite",
                zIndex: 3,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" style={{ marginLeft: -15, marginTop: -15 }}>
                <circle cx="15" cy="15" r="6" stroke="#00C8FF" strokeWidth="1.5" fill="none" />
                <line x1="15" y1="0" x2="15" y2="9" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="15" y1="21" x2="15" y2="30" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="15" x2="9" y2="15" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="21" y1="15" x2="30" y2="15" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="15" cy="15" r="1.5" fill="#00C8FF" />
              </svg>
            </div>

            {/* Hit indicators */}
            {[
              { x: "20%", y: "30%", hit: true },
              { x: "70%", y: "25%", hit: true },
              { x: "35%", y: "70%", hit: false },
              { x: "80%", y: "65%", hit: true },
            ].map((dot, i) => (
              <div key={i} style={{ position: "absolute", left: dot.x, top: dot.y }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: dot.hit ? "#8BFF00" : "#FF3CAC", opacity: 0.7 }} />
              </div>
            ))}

            {/* Accuracy overlay */}
            <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em" }}>
              ACCURACY <span style={{ color: "#8BFF00", fontSize: 13 }}>{accuracy}%</span>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div style={{ width: 140, padding: "14px 12px", borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
            {/* Reaction Time Ring */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginBottom: 6 }}>REACT TIME</div>
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
                <circle
                  cx="48" cy="48" r={radius}
                  stroke="url(#rtGrad)" strokeWidth="6" fill="none"
                  strokeDasharray={`${dash} ${circ}`}
                  strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                />
                <defs>
                  <linearGradient id="rtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C8FF" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <text x="48" y="44" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800">{rt}</text>
                <text x="48" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">ms</text>
              </svg>
            </div>

            {/* Targets hit */}
            <div style={{ width: "100%", textAlign: "center", padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>TARGETS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#00C8FF", lineHeight: 1.2 }}>342</div>
            </div>

            {/* Shots taken */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>SHOTS</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>364</div>
            </div>
          </div>
        </div>

        {/* Performance Bars */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginBottom: 10 }}>PERFORMANCE TREND</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
            {[60, 72, 68, 80, 75, 88, 82, 91, 87, 94].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: 3,
                  background: i === 9 ? "linear-gradient(180deg, #00C8FF, #7C3AED)" : "rgba(255,255,255,0.08)",
                  transition: "height 0.3s ease",
                  boxShadow: i === 9 ? "0 0 10px rgba(0,200,255,0.4)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", marginBottom: 8 }}>LEADERBOARD</div>
          {[
            { rank: 1, name: "FlickGodX", score: 9847, you: false },
            { rank: 2, name: "AimRush", score: 9631, you: false },
            { rank: 3, name: "You", score: 8924, you: true },
          ].map((row) => (
            <div key={row.rank} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", borderBottom: row.rank < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <span style={{ width: 18, fontSize: 11, color: row.rank === 1 ? "#FFD700" : "rgba(255,255,255,0.4)", fontWeight: 700 }}>#{row.rank}</span>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: row.you ? "#00C8FF" : "rgba(255,255,255,0.8)" }}>{row.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: row.you ? "#00C8FF" : "rgba(255,255,255,0.6)" }}>{row.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const TRUST_BADGES = ["No Download Required", "Browser Native", "Instant Play", "Performance Analytics"];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -80]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 100,
        paddingBottom: 80,
      }}
    >
      {/* Background effects */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Grid */}
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />
        {/* Particles */}
        <ParticleField count={50} />
        {/* Radial glows */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        {/* Mouse reactive glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        />
      </div>

      <motion.div
        style={{ y: parallaxY, position: "relative", zIndex: 1, width: "100%" }}
        className="container-lg"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0, 200, 255, 0.08)",
                border: "1px solid rgba(0, 200, 255, 0.2)",
                borderRadius: 100,
                padding: "6px 14px",
                marginBottom: 28,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8BFF00", boxShadow: "0 0 8px #8BFF00" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#00C8FF", letterSpacing: "0.06em" }}>
                NEXT-GEN AIM TRAINING • BROWSER NATIVE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: "clamp(42px, 5.5vw, 76px)",
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                marginBottom: 24,
              }}
            >
              Train Faster.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00C8FF 0%, #7C3AED 50%, #FF3CAC 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "block",
                }}
              >
                Aim Smarter.
              </span>
              Win More.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: "clamp(15px, 1.5vw, 18px)",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              The most advanced browser-based aim trainer built for serious players.
              Improve flicks, tracking, reaction time, precision, and consistency
              using real performance analytics.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}
              id="hero-cta"
            >
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L15 8L8 15M1 8H15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Start Training Free
              </button>
              <button className="btn-secondary" style={{ fontSize: 16, padding: "14px 28px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <polygon points="6,3 13,8 6,13" fill="#fff" />
                </svg>
                Watch Demo
              </button>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
            >
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(transparent, #05070D)", pointerEvents: "none", zIndex: 2 }} />
    </section>
  );
}
