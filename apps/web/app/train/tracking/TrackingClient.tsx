"use client";

import { useEffect, useRef } from "react";
import type { TrackingTrainerHandle } from "@repo/game-engine";

/**
 * TrackingClient — React boundary between Next.js and the Tracking Trainer.
 *
 * Mount layout:
 *   <wrapper>
 *     <canvas-container>   ← Phaser canvas mounts here
 *     <overlay-container>  ← HTML HUD + modal (managed by TrackingOverlay)
 *     <nav>                ← back link, always on top
 *   </wrapper>
 *
 * Note: cursor is kept visible (crosshair) — tracking mode requires
 * precise pointer awareness.
 */
export function TrackingClient() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<TrackingTrainerHandle | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!canvasRef.current || !overlayRef.current) return;

    let cancelled = false;

    void import("@repo/game-engine").then(({ createTrackingTrainer }) => {
      if (cancelled || !canvasRef.current || !overlayRef.current) return;

      handleRef.current = createTrackingTrainer(
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
      <style>{`
        html, body {
          overflow: hidden;
          margin: 0;
          padding: 0;
          background: #070710;
        }
        #tk-canvas canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
        #tk-canvas { cursor: crosshair; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#070710" }}>
        {/* Phaser canvas */}
        <div
          id="tk-canvas"
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

        {/* HTML overlay — HUD, modal */}
        <div
          ref={overlayRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />

        {/* Top nav */}
        <nav style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          background: "linear-gradient(180deg, rgba(7,7,16,0.9) 0%, rgba(7,7,16,0) 100%)",
          pointerEvents: "none",
        }}>
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
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(124,58,237,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(192,240,255,0.55)";
            }}
          >
            ← Training Hub
          </a>

          <span style={{
            marginLeft: "auto",
            fontSize: "11px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            color: "rgba(124,58,237,0.4)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            Tracking
          </span>
        </nav>
      </div>
    </>
  );
}
