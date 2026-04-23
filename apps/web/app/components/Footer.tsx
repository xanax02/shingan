"use client";

import { motion } from "framer-motion";

const LINKS = {
  Product: ["Flick Training", "Tracking Arena", "Reaction Time", "Analytics", "Rankings"],
  Community: ["Discord", "Twitter / X", "Leaderboards", "Blog"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer style={{ background: "#040609", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "64px 24px 32px" }}>
      <div className="container-lg">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #00C8FF, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(0, 200, 255, 0.3)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" fill="#fff" />
                  <line x1="10" y1="2" x2="10" y2="6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="14" x2="10" y2="18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="2" y1="10" x2="6" y2="10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="10" x2="18" y2="10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", background: "linear-gradient(135deg, #fff 0%, #00C8FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                AimOS
              </span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              The next-generation browser-based aim training platform built for competitive gamers who demand data-driven improvement.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Discord", icon: "💬" },
                { label: "Twitter", icon: "𝕏" },
                { label: "YouTube", icon: "▶" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    transition: "background 0.2s, border-color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(0,200,255,0.1)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,200,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([cat, links]) => (
            <div key={cat}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>
                {cat}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#00C8FF")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
            © 2026 AimOS. All rights reserved. Built for serious players.
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8BFF00", boxShadow: "0 0 8px #8BFF00" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
