"use client";

import { useEffect, useRef } from "react";
import type { ReactionTrainerHandle } from "@repo/game-engine";

/**
 * ReactionClient — React boundary between Next.js and the Reaction Trainer.
 *
 * Mount layout:
 *
 *   <wrapper>                   ← fullscreen fixed, overflow hidden
 *     <canvas-container>        ← Phaser canvas mounts here
 *     <overlay-container>       ← HTML HUD + modal mount here (z-index: 100)
 *     <nav>                     ← back link, always on top
 *   </wrapper>
 *
 * Rules:
 *   ✓ No game logic in this file.
 *   ✓ No state updates after mount (no re-renders during gameplay).
 *   ✓ Phaser is dynamically imported (browser-only).
 *   ✓ Both canvas and overlay containers are cleaned up on unmount.
 */
export function ReactionClient() {
  const canvasRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef  = useRef<ReactionTrainerHandle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!canvasRef.current || !overlayRef.current) return;

    let cancelled = false;

    void import("@repo/game-engine").then(({ createReactionTrainer }) => {
      if (cancelled || !canvasRef.current || !overlayRef.current) return;

      handleRef.current = createReactionTrainer(
        canvasRef.current,
        overlayRef.current,
        { targetFps: 144 },
      );
    });

    return () => {
      cancelled = true;
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, []);

  return (
    <>
      {/* ── Global styles ────────────────────────────────────── */}
      <style>{`
        html, body {
          overflow: hidden;
          margin: 0;
          padding: 0;
          background: #070710;
        }
        /* Phaser canvas fills its container */
        #rt-canvas canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
        /* Crosshair: default pointer for reaction trainer */
        #rt-canvas {
          cursor: default;
        }
      `}</style>

      {/* ── Wrapper ──────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          background: "#070710",
        }}
      >
        {/* Phaser canvas */}
        <div
          id="rt-canvas"
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* HTML overlay — HUD, status text, modal */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none", // overlay.ts enables pointer-events selectively
          }}
        />

        {/* Top nav — always on top */}
        <nav
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            background:
              "linear-gradient(180deg, rgba(7,7,16,0.9) 0%, rgba(7,7,16,0) 100%)",
            pointerEvents: "none",
          }}
        >
          <a
            href="/train"
            style={{
              color: "rgba(192,240,255,0.55)",
              fontSize: "13px",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              letterSpacing: "0.05em",
              textDecoration: "none",
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(255,60,172,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(192,240,255,0.55)";
            }}
          >
            ← Training Hub
          </a>

          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              color: "rgba(255,60,172,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Reaction
          </span>
        </nav>
      </div>
    </>
  );
}
