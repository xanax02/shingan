"use client";

import { useEffect, useRef } from "react";
import type { AimTrainerHandle } from "@repo/game-engine";

/**
 * TrainClient — the React boundary between Next.js and the Phaser runtime.
 *
 * Rules enforced here:
 *   ✓ No game logic. This file is infrastructure only.
 *   ✓ No state updates after mount (would trigger re-renders = performance hit)
 *   ✓ No prop drilling of Phaser objects into React children
 *   ✓ Engine is mounted/destroyed in useEffect to respect SSR safely
 *
 * Mount flow:
 *   1. React renders a fullscreen <div> (zero visible content yet)
 *   2. useEffect fires client-side only
 *   3. Phaser boots inside containerRef.current
 *   4. Returns cleanup: calls handle.destroy() on unmount
 *
 * The container div's background matches the Phaser canvas background (#070710)
 * so there is zero flash between the React paint and the first Phaser frame.
 */
export function TrainClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<AimTrainerHandle | null>(null);

  useEffect(() => {
    // Guard: should never fire on server, but defensive check for SSR edge cases
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    // Dynamic import so Phaser (a browser-only library) is never bundled
    // into the server-side render pass. This is the only import pattern
    // that is safe for Phaser in Next.js App Router.
    let cancelled = false;

    void import("@repo/game-engine").then(({ createAimTrainer }) => {
      if (cancelled || !containerRef.current) return;

      handleRef.current = createAimTrainer(containerRef.current, {
        debug: true,
        targetFps: 144,
      });
    });

    return () => {
      cancelled = true;
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, []); // Intentionally empty — engine mounts once, never re-mounts

  return (
    <>
      {/* Global style: hide scrollbars, lock viewport */}
      <style>{`
        html, body {
          overflow: hidden;
          margin: 0;
          padding: 0;
          background: #070710;
          cursor: none;
        }
        /* Ensure Phaser canvas fills its container pixel-perfectly */
        #aim-trainer-canvas canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>

      {/* Back nav — minimal, doesn't interfere with game canvas */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          background: "linear-gradient(180deg, rgba(7,7,16,0.95) 0%, rgba(7,7,16,0) 100%)",
          pointerEvents: "none",
        }}
      >
        <a
          href="/"
          style={{
            color: "rgba(192,240,255,0.6)",
            fontSize: "13px",
            fontFamily: "var(--font-space, 'Space Grotesk', sans-serif)",
            letterSpacing: "0.05em",
            textDecoration: "none",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(0,200,255,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(192,240,255,0.6)";
          }}
        >
          ← AimOS
        </a>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            fontFamily: "var(--font-space, 'Space Grotesk', sans-serif)",
            color: "rgba(0,200,255,0.35)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Training Arena
        </span>
      </nav>

      {/* Phaser canvas container — fullscreen, no overflow */}
      <div
        id="aim-trainer-canvas"
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100dvw",
          height: "100dvh",
          overflow: "hidden",
          background: "#070710",
          cursor: "none",
        }}
      />
    </>
  );
}
