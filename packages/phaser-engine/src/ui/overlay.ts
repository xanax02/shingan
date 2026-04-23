import type { SessionStats } from "../systems/MetricsSystem";
import { MODAL_Z_INDEX, OVERLAY_Z_INDEX } from "../utils/constants";

// ─── Types ─────────────────────────────────────────────────────────────────

export type StatusVariant = "idle" | "waiting" | "click" | "warning" | "result";

// ─── Overlay ───────────────────────────────────────────────────────────────

/**
 * ReactionOverlay — manages all HTML UI for the reaction trainer.
 *
 * Lives entirely in the DOM (not Phaser canvas) so we get:
 *   • Real glassmorphism via CSS backdrop-filter
 *   • CSS transitions and keyframe animations
 *   • Crisp text at any DPI without Phaser font loading
 *   • Zero impact on the Phaser render budget
 *
 * Architecture:
 *   The overlay root div is a sibling of the Phaser canvas container.
 *   All child elements are created and managed here — no JSX, no framework.
 *   React never touches these nodes; ReactionScene drives them via this class.
 *
 * Cleanup: destroy() removes the root from the DOM and nulls all refs.
 */
export class ReactionOverlay {
  private root: HTMLDivElement;

  // HUD elements
  private hudPanel!: HTMLDivElement;
  private roundEl!: HTMLSpanElement;
  private bestEl!: HTMLSpanElement;
  private avgEl!: HTMLSpanElement;
  private missesEl!: HTMLSpanElement;
  private streakEl!: HTMLSpanElement;

  // Center status
  private statusEl!: HTMLDivElement;

  // Start button
  private startBtn!: HTMLButtonElement;

  // Modal
  private modal!: HTMLDivElement;

  constructor(private readonly container: HTMLElement) {
    this.root = document.createElement("div");
    this.applyRootStyles();
    this.buildHUD();
    this.buildStatusDisplay();
    this.buildStartButton();
    this.buildModal();
    this.injectFontFace();
    container.appendChild(this.root);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  updateHUD(opts: {
    round: number;
    total: number;
    best: number | null;
    avg: number | null;
    misses: number;
    streak: number;
  }): void {
    this.roundEl.textContent = `${opts.round} / ${opts.total}`;
    this.bestEl.textContent = opts.best !== null ? `${opts.best}ms` : "—";
    this.avgEl.textContent = opts.avg !== null ? `${opts.avg}ms` : "—";
    this.missesEl.textContent = String(opts.misses);
    this.streakEl.textContent = opts.streak > 1 ? `🔥 ${opts.streak}` : "";
  }

  showStatus(text: string, variant: StatusVariant): void {
    this.statusEl.textContent = text;
    this.statusEl.className = "";
    this.statusEl.classList.add("rt-status", `rt-status--${variant}`);

    // Re-trigger animation by cloning the element
    const clone = this.statusEl.cloneNode(true) as HTMLDivElement;
    this.statusEl.replaceWith(clone);
    this.statusEl = clone;
  }

  hideStatus(): void {
    this.statusEl.textContent = "";
    this.statusEl.className = "rt-status";
  }

  showStartButton(onClick: () => void): void {
    this.startBtn.style.display = "flex";
    // Clone to remove previous listener
    const clone = this.startBtn.cloneNode(true) as HTMLButtonElement;
    this.startBtn.replaceWith(clone);
    this.startBtn = clone;
    this.startBtn.addEventListener("click", onClick, { once: true });
    void this.startBtn.offsetWidth; // force reflow for animation
    this.startBtn.style.opacity = "1";
    this.startBtn.style.transform = "translateY(0) scale(1)";
  }

  hideStartButton(): void {
    this.startBtn.style.opacity = "0";
    this.startBtn.style.transform = "translateY(8px) scale(0.95)";
    setTimeout(() => {
      this.startBtn.style.display = "none";
    }, 250);
  }

  showModal(stats: SessionStats, highScore: number | null, isNewBest: boolean): void {
    this.buildModalContent(stats, highScore, isNewBest);
    this.modal.style.display = "flex";
    void this.modal.offsetWidth; // reflow
    this.modal.style.opacity = "1";
    this.modal.style.transform = "scale(1)";
  }

  hideModal(): void {
    this.modal.style.opacity = "0";
    this.modal.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.modal.style.display = "none";
    }, 300);
  }

  destroy(): void {
    this.root.remove();
  }

  // ─── DOM Construction ──────────────────────────────────────────────────────

  private applyRootStyles(): void {
    const s = this.root.style;
    s.position = "absolute";
    s.inset = "0";
    s.zIndex = String(OVERLAY_Z_INDEX);
    s.pointerEvents = "none";
    s.fontFamily = "'Inter', 'Space Grotesk', system-ui, sans-serif";
    this.injectGlobalStyles();
  }

  private buildHUD(): void {
    this.hudPanel = document.createElement("div");
    this.hudPanel.className = "rt-hud";

    const rows: Array<[string, string, "roundEl" | "bestEl" | "avgEl" | "missesEl"]> = [
      ["ROUND", "—",  "roundEl"],
      ["BEST",  "—",  "bestEl"],
      ["AVG",   "—",  "avgEl"],
      ["MISSES","0",  "missesEl"],
    ];

    rows.forEach(([label, init, field]) => {
      const row = document.createElement("div");
      row.className = "rt-hud__row";

      const lbl = document.createElement("span");
      lbl.className = "rt-hud__label";
      lbl.textContent = label;

      const val = document.createElement("span");
      val.className = "rt-hud__value";
      val.textContent = init;
      this[field] = val;

      row.appendChild(lbl);
      row.appendChild(val);
      this.hudPanel.appendChild(row);
    });

    // Streak row
    this.streakEl = document.createElement("span");
    this.streakEl.className = "rt-hud__streak";
    this.hudPanel.appendChild(this.streakEl);

    this.root.appendChild(this.hudPanel);
  }

  private buildStatusDisplay(): void {
    this.statusEl = document.createElement("div");
    this.statusEl.className = "rt-status rt-status--idle";
    this.root.appendChild(this.statusEl);
  }

  private buildStartButton(): void {
    this.startBtn = document.createElement("button");
    this.startBtn.className = "rt-start-btn";
    this.startBtn.textContent = "▶  START";
    this.startBtn.style.pointerEvents = "auto";
    this.startBtn.style.opacity = "0";
    this.startBtn.style.transform = "translateY(16px) scale(0.96)";
    this.startBtn.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    this.startBtn.style.display = "none";
    this.root.appendChild(this.startBtn);
  }

  private buildModal(): void {
    this.modal = document.createElement("div");
    this.modal.className = "rt-modal-backdrop";
    this.modal.style.opacity = "0";
    this.modal.style.transform = "scale(0.95)";
    this.modal.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    this.modal.style.display = "none";
    this.root.appendChild(this.modal);
  }

  private buildModalContent(
    stats: SessionStats,
    highScore: number | null,
    isNewBest: boolean,
  ): void {
    const gradeColors: Record<string, string> = {
      S: "#ffd700",
      A: "#00ff88",
      B: "#00c8ff",
      C: "#ff9900",
      D: "#ff4466",
    };
    const gradeColor = gradeColors[stats.grade] ?? "#ffffff";
    const bestDisplay = stats.best === Infinity ? "—" : `${stats.best}ms`;
    const worstDisplay = stats.worst === 0 ? "—" : `${stats.worst}ms`;

    this.modal.innerHTML = `
      <div class="rt-modal-card">
        <div class="rt-modal-header">
          <span class="rt-modal-title">SESSION COMPLETE</span>
          ${isNewBest ? '<span class="rt-modal-badge">🏆 NEW BEST</span>' : ""}
        </div>

        <div class="rt-modal-grade" style="color: ${gradeColor}; text-shadow: 0 0 40px ${gradeColor}88;">
          ${stats.grade}
        </div>

        <div class="rt-modal-stats">
          <div class="rt-stat-row">
            <span class="rt-stat-label">Average</span>
            <span class="rt-stat-value">${stats.average}ms</span>
          </div>
          <div class="rt-stat-row">
            <span class="rt-stat-label">Best</span>
            <span class="rt-stat-value" style="color: #00ff88">${bestDisplay}</span>
          </div>
          <div class="rt-stat-row">
            <span class="rt-stat-label">Worst</span>
            <span class="rt-stat-value" style="color: #ff6688">${worstDisplay}</span>
          </div>
          <div class="rt-stat-row">
            <span class="rt-stat-label">False Starts</span>
            <span class="rt-stat-value">${stats.falseStarts}</span>
          </div>
          <div class="rt-stat-row">
            <span class="rt-stat-label">Accuracy</span>
            <span class="rt-stat-value">${stats.accuracy}%</span>
          </div>
          ${highScore !== null ? `
          <div class="rt-stat-row rt-stat-row--divider">
            <span class="rt-stat-label">Personal Best Avg</span>
            <span class="rt-stat-value" style="color: #ffd700">${highScore}ms</span>
          </div>` : ""}
        </div>

        <div class="rt-modal-actions">
          <button class="rt-modal-btn rt-modal-btn--primary" id="rt-play-again">
            ↺ Play Again
          </button>
          <button class="rt-modal-btn rt-modal-btn--secondary" id="rt-go-home">
            ← Back
          </button>
        </div>
      </div>
    `;

    // Wire buttons
    const playAgain = this.modal.querySelector<HTMLButtonElement>("#rt-play-again");
    const goHome    = this.modal.querySelector<HTMLButtonElement>("#rt-go-home");

    playAgain?.addEventListener("click", () => {
      this.hideModal();
      // ReactionScene listens to the 'rt:restart' custom event on the container
      this.container.dispatchEvent(new CustomEvent("rt:restart"));
    });

    goHome?.addEventListener("click", () => {
      window.location.href = "/";
    });
  }

  // ─── Style Injection ───────────────────────────────────────────────────────

  private injectFontFace(): void {
    if (document.querySelector("#rt-font")) return;
    const link = document.createElement("link");
    link.id = "rt-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap";
    document.head.appendChild(link);
  }

  private injectGlobalStyles(): void {
    if (document.querySelector("#rt-styles")) return;

    const style = document.createElement("style");
    style.id = "rt-styles";
    style.textContent = `
      /* ── HUD Panel ────────────────────────────────────────── */
      .rt-hud {
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(7, 7, 20, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 200, 255, 0.15);
        border-radius: 12px;
        padding: 14px 18px;
        min-width: 150px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }

      .rt-hud__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .rt-hud__label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: rgba(0, 200, 255, 0.5);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .rt-hud__value {
        font-size: 14px;
        font-weight: 600;
        color: #c0f0ff;
        font-family: 'Inter', sans-serif;
        font-variant-numeric: tabular-nums;
      }

      .rt-hud__streak {
        font-size: 13px;
        color: #ff9900;
        font-weight: 700;
        text-align: center;
        min-height: 16px;
        transition: opacity 0.2s;
      }

      /* ── Center Status Display ────────────────────────────── */
      .rt-status {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: clamp(20px, 4vw, 38px);
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        pointer-events: none;
        text-align: center;
        transition: color 0.15s ease;
        white-space: nowrap;
      }

      .rt-status--idle { color: transparent; }

      .rt-status--waiting {
        color: rgba(0, 200, 255, 0.28);
        animation: rt-pulse-dim 1.4s ease-in-out infinite;
      }

      .rt-status--click {
        color: #00ff88;
        text-shadow: 0 0 32px #00ff8899, 0 0 8px #00ff8866;
        animation: rt-pop-in 0.12s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      .rt-status--warning {
        color: #ff4466;
        text-shadow: 0 0 24px #ff446699;
        animation: rt-shake 0.3s ease forwards;
      }

      .rt-status--result {
        color: #c0f0ff;
        font-size: clamp(18px, 3.5vw, 32px);
        text-shadow: 0 0 20px rgba(0,200,255,0.4);
        animation: rt-pop-in 0.15s ease forwards;
      }

      @keyframes rt-pulse-dim {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }

      @keyframes rt-pop-in {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        to   { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
      }

      @keyframes rt-shake {
        0%   { transform: translate(calc(-50% - 10px), -50%); }
        20%  { transform: translate(calc(-50% + 10px), -50%); }
        40%  { transform: translate(calc(-50% - 6px),  -50%); }
        60%  { transform: translate(calc(-50% + 6px),  -50%); }
        80%  { transform: translate(calc(-50% - 3px),  -50%); }
        100% { transform: translate(-50%, -50%); }
      }

      /* ── Start Button ─────────────────────────────────────── */
      .rt-start-btn {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 48px;
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #070710;
        background: linear-gradient(135deg, #00c8ff 0%, #00ff88 100%);
        border: none;
        border-radius: 100px;
        cursor: pointer;
        box-shadow:
          0 0 0 1px rgba(0,200,255,0.3),
          0 8px 32px rgba(0,200,255,0.35),
          0 2px 8px rgba(0,0,0,0.4);
        transition:
          transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
          box-shadow 0.2s ease,
          opacity 0.25s ease;
        font-family: 'Space Grotesk', sans-serif;
      }

      .rt-start-btn:hover {
        transform: translateX(-50%) translateY(-2px) scale(1.04);
        box-shadow:
          0 0 0 1px rgba(0,200,255,0.5),
          0 12px 40px rgba(0,200,255,0.5),
          0 4px 12px rgba(0,0,0,0.5);
      }

      .rt-start-btn:active {
        transform: translateX(-50%) translateY(0) scale(0.97);
      }

      /* ── Modal ────────────────────────────────────────────── */
      .rt-modal-backdrop {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(7, 7, 16, 0.82);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        z-index: ${MODAL_Z_INDEX};
        pointer-events: auto;
      }

      .rt-modal-card {
        background: rgba(10, 10, 28, 0.95);
        border: 1px solid rgba(0, 200, 255, 0.2);
        border-radius: 20px;
        padding: 40px 48px;
        min-width: 320px;
        max-width: 480px;
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        box-shadow:
          0 0 0 1px rgba(0,200,255,0.08),
          0 32px 80px rgba(0,0,0,0.6),
          0 0 80px rgba(0,200,255,0.05) inset;
        animation: rt-modal-enter 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }

      @keyframes rt-modal-enter {
        from { transform: scale(0.88) translateY(20px); opacity: 0; }
        to   { transform: scale(1)    translateY(0);    opacity: 1; }
      }

      .rt-modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .rt-modal-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.22em;
        color: rgba(0, 200, 255, 0.55);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .rt-modal-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 100px;
        background: linear-gradient(135deg, #ffd70022, #ffd70044);
        border: 1px solid rgba(255,215,0,0.4);
        color: #ffd700;
        letter-spacing: 0.05em;
        animation: rt-badge-glow 1.5s ease-in-out infinite alternate;
      }

      @keyframes rt-badge-glow {
        from { box-shadow: 0 0 8px rgba(255,215,0,0.3); }
        to   { box-shadow: 0 0 20px rgba(255,215,0,0.6); }
      }

      .rt-modal-grade {
        font-size: clamp(64px, 14vw, 96px);
        font-weight: 800;
        line-height: 1;
        margin: 12px 0 24px;
        font-family: 'Inter', sans-serif;
        animation: rt-grade-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
      }

      @keyframes rt-grade-pop {
        from { transform: scale(0.5); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      .rt-modal-stats {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-top: 1px solid rgba(0,200,255,0.1);
        border-bottom: 1px solid rgba(0,200,255,0.1);
        padding: 20px 0;
        margin-bottom: 28px;
      }

      .rt-stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .rt-stat-row--divider {
        border-top: 1px solid rgba(0,200,255,0.08);
        padding-top: 10px;
        margin-top: 4px;
      }

      .rt-stat-label {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.04em;
        color: rgba(192, 240, 255, 0.45);
        font-family: 'Inter', sans-serif;
      }

      .rt-stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #c0f0ff;
        font-variant-numeric: tabular-nums;
        font-family: 'Inter', sans-serif;
      }

      .rt-modal-actions {
        display: flex;
        gap: 12px;
        width: 100%;
      }

      .rt-modal-btn {
        flex: 1;
        padding: 14px 20px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        font-family: 'Space Grotesk', sans-serif;
        border: none;
      }

      .rt-modal-btn:hover { transform: translateY(-2px); }
      .rt-modal-btn:active { transform: translateY(0) scale(0.97); }

      .rt-modal-btn--primary {
        background: linear-gradient(135deg, #00c8ff, #00ff88);
        color: #070710;
        box-shadow: 0 8px 24px rgba(0,200,255,0.3);
      }

      .rt-modal-btn--secondary {
        background: rgba(255,255,255,0.06);
        color: rgba(192,240,255,0.7);
        border: 1px solid rgba(0,200,255,0.15);
      }

      .rt-modal-btn--secondary:hover {
        background: rgba(255,255,255,0.1);
        color: #c0f0ff;
      }
    `;
    document.head.appendChild(style);
  }
}
