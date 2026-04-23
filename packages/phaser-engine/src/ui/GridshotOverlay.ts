import { MODAL_Z_INDEX, OVERLAY_Z_INDEX } from "../utils/constants";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GridshotHUDData {
  hits: number;
  accuracy: number;    // 0-100
  hitsPerSec: number;
  timeLeft: number;    // seconds remaining
  total: number;       // total shots taken (hits + misses)
}

export interface GridshotSessionStats {
  hits: number;
  misses: number;
  accuracy: number;
  hitsPerSec: number;
  grade: string;
  gradeColor: string;
}

// ─── GridshotOverlay ───────────────────────────────────────────────────────

/**
 * GridshotOverlay — HTML-based HUD + result modal for the Gridshot mode.
 *
 * Rendered entirely in the DOM (not Phaser canvas) for glassmorphism,
 * CSS animations, and crisp text at any DPI.
 */
export class GridshotOverlay {
  private root: HTMLDivElement;

  // HUD elements
  private hudPanel!: HTMLDivElement;
  private hitsEl!: HTMLSpanElement;
  private accuracyEl!: HTMLSpanElement;
  private hitsPerSecEl!: HTMLSpanElement;
  private timerEl!: HTMLDivElement;

  // Modal
  private modal!: HTMLDivElement;

  constructor(private readonly container: HTMLElement) {
    this.root = document.createElement("div");
    this.applyRootStyles();
    this.buildHUD();
    this.buildTimer();
    this.buildModal();
    this.injectStyles();
    container.appendChild(this.root);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  updateHUD(data: GridshotHUDData): void {
    this.hitsEl.textContent = String(data.hits);
    this.accuracyEl.textContent = data.total === 0 ? "—" : `${data.accuracy}%`;
    this.hitsPerSecEl.textContent = data.hitsPerSec.toFixed(1);
    this.updateTimer(data.timeLeft);
  }

  updateTimer(seconds: number): void {
    const s = Math.max(0, Math.ceil(seconds));
    this.timerEl.textContent = String(s);
    // Flash red for last 10 seconds
    this.timerEl.style.color = s <= 10 ? "#ff4466" : "#c0f0ff";
    this.timerEl.style.textShadow =
      s <= 10 ? "0 0 24px #ff446688" : "0 0 16px rgba(0,200,255,0.4)";
  }

  showModal(stats: GridshotSessionStats, personalBest: number | null, isNewBest: boolean): void {
    this.buildModalContent(stats, personalBest, isNewBest);
    this.modal.style.display = "flex";
    void this.modal.offsetWidth; // reflow
    this.modal.style.opacity = "1";
    this.modal.style.transform = "scale(1)";
  }

  hideModal(): void {
    this.modal.style.opacity = "0";
    this.modal.style.transform = "scale(0.95)";
    setTimeout(() => { this.modal.style.display = "none"; }, 300);
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
  }

  private buildHUD(): void {
    this.hudPanel = document.createElement("div");
    this.hudPanel.className = "gs-hud";

    const rows: Array<[string, string, "hitsEl" | "accuracyEl" | "hitsPerSecEl"]> = [
      ["HITS",      "0",   "hitsEl"],
      ["ACCURACY",  "—",   "accuracyEl"],
      ["HITS/SEC",  "0.0", "hitsPerSecEl"],
    ];

    rows.forEach(([label, init, field]) => {
      const row = document.createElement("div");
      row.className = "gs-hud__row";

      const lbl = document.createElement("span");
      lbl.className = "gs-hud__label";
      lbl.textContent = label;

      const val = document.createElement("span");
      val.className = "gs-hud__value";
      val.textContent = init;
      this[field] = val;

      row.appendChild(lbl);
      row.appendChild(val);
      this.hudPanel.appendChild(row);
    });

    this.root.appendChild(this.hudPanel);
  }

  private buildTimer(): void {
    this.timerEl = document.createElement("div");
    this.timerEl.className = "gs-timer";
    this.timerEl.textContent = "60";
    this.root.appendChild(this.timerEl);
  }

  private buildModal(): void {
    this.modal = document.createElement("div");
    this.modal.className = "gs-modal-backdrop";
    this.modal.style.opacity = "0";
    this.modal.style.transform = "scale(0.95)";
    this.modal.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    this.modal.style.display = "none";
    this.root.appendChild(this.modal);
  }

  private buildModalContent(
    stats: GridshotSessionStats,
    personalBest: number | null,
    isNewBest: boolean,
  ): void {
    const gradeColor = stats.gradeColor;

    this.modal.innerHTML = `
      <div class="gs-modal-card">
        <div class="gs-modal-header">
          <span class="gs-modal-title">SESSION COMPLETE</span>
          ${isNewBest ? '<span class="gs-modal-badge">🏆 NEW BEST</span>' : ""}
        </div>

        <div class="gs-modal-grade" style="color: ${gradeColor}; text-shadow: 0 0 40px ${gradeColor}88;">
          ${stats.grade}
        </div>

        <div class="gs-modal-stats">
          <div class="gs-stat-row">
            <span class="gs-stat-label">Hits</span>
            <span class="gs-stat-value">${stats.hits}</span>
          </div>
          <div class="gs-stat-row">
            <span class="gs-stat-label">Misses</span>
            <span class="gs-stat-value" style="color: #ff6688">${stats.misses}</span>
          </div>
          <div class="gs-stat-row">
            <span class="gs-stat-label">Accuracy</span>
            <span class="gs-stat-value">${stats.accuracy}%</span>
          </div>
          <div class="gs-stat-row">
            <span class="gs-stat-label">Hits / Sec</span>
            <span class="gs-stat-value" style="color: #00c8ff">${stats.hitsPerSec.toFixed(2)}</span>
          </div>
          ${personalBest !== null ? `
          <div class="gs-stat-row gs-stat-row--divider">
            <span class="gs-stat-label">Personal Best (hits/s)</span>
            <span class="gs-stat-value" style="color: #ffd700">${personalBest.toFixed(2)}</span>
          </div>` : ""}
        </div>

        <div class="gs-modal-actions">
          <button class="gs-modal-btn gs-modal-btn--primary" id="gs-play-again">
            ↺ Play Again
          </button>
          <button class="gs-modal-btn gs-modal-btn--secondary" id="gs-go-home">
            ← Back
          </button>
        </div>
      </div>
    `;

    const playAgain = this.modal.querySelector<HTMLButtonElement>("#gs-play-again");
    const goHome    = this.modal.querySelector<HTMLButtonElement>("#gs-go-home");

    playAgain?.addEventListener("click", () => {
      this.hideModal();
      this.container.dispatchEvent(new CustomEvent("gs:restart"));
    });

    goHome?.addEventListener("click", () => {
      window.location.href = "/train";
    });
  }

  // ─── Style Injection ───────────────────────────────────────────────────────

  private injectStyles(): void {
    if (document.querySelector("#gs-styles")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "gs-styles";
    style.textContent = `
      /* ── HUD Panel ──────────────────────────────────────────── */
      .gs-hud {
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(7, 7, 20, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 200, 255, 0.15);
        border-radius: 12px;
        padding: 14px 18px;
        min-width: 160px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      }

      .gs-hud__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }

      .gs-hud__label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: rgba(0, 200, 255, 0.5);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .gs-hud__value {
        font-size: 14px;
        font-weight: 700;
        color: #c0f0ff;
        font-family: 'Inter', sans-serif;
        font-variant-numeric: tabular-nums;
      }

      /* ── Timer ──────────────────────────────────────────────── */
      .gs-timer {
        position: absolute;
        top: 20px;
        right: 24px;
        font-size: clamp(28px, 4vw, 48px);
        font-weight: 800;
        font-family: 'Inter', sans-serif;
        font-variant-numeric: tabular-nums;
        color: #c0f0ff;
        text-shadow: 0 0 16px rgba(0,200,255,0.4);
        letter-spacing: -0.02em;
        pointer-events: none;
        transition: color 0.4s ease, text-shadow 0.4s ease;
      }

      /* ── Modal ──────────────────────────────────────────────── */
      .gs-modal-backdrop {
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

      .gs-modal-card {
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
        animation: gs-modal-enter 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }

      @keyframes gs-modal-enter {
        from { transform: scale(0.88) translateY(20px); opacity: 0; }
        to   { transform: scale(1)    translateY(0);    opacity: 1; }
      }

      .gs-modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .gs-modal-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.22em;
        color: rgba(0, 200, 255, 0.55);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .gs-modal-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 100px;
        background: linear-gradient(135deg, #ffd70022, #ffd70044);
        border: 1px solid rgba(255,215,0,0.4);
        color: #ffd700;
        letter-spacing: 0.05em;
        animation: gs-badge-glow 1.5s ease-in-out infinite alternate;
      }

      @keyframes gs-badge-glow {
        from { box-shadow: 0 0 8px rgba(255,215,0,0.3); }
        to   { box-shadow: 0 0 20px rgba(255,215,0,0.6); }
      }

      .gs-modal-grade {
        font-size: clamp(64px, 14vw, 96px);
        font-weight: 800;
        line-height: 1;
        margin: 12px 0 24px;
        font-family: 'Inter', sans-serif;
        animation: gs-grade-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
      }

      @keyframes gs-grade-pop {
        from { transform: scale(0.5); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      .gs-modal-stats {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-top: 1px solid rgba(0,200,255,0.1);
        border-bottom: 1px solid rgba(0,200,255,0.1);
        padding: 20px 0;
        margin-bottom: 28px;
      }

      .gs-stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .gs-stat-row--divider {
        border-top: 1px solid rgba(0,200,255,0.08);
        padding-top: 10px;
        margin-top: 4px;
      }

      .gs-stat-label {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.04em;
        color: rgba(192, 240, 255, 0.45);
        font-family: 'Inter', sans-serif;
      }

      .gs-stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #c0f0ff;
        font-variant-numeric: tabular-nums;
        font-family: 'Inter', sans-serif;
      }

      .gs-modal-actions {
        display: flex;
        gap: 12px;
        width: 100%;
      }

      .gs-modal-btn {
        flex: 1;
        padding: 14px 20px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        font-family: 'Space Grotesk', sans-serif;
        border: none;
      }

      .gs-modal-btn:hover  { transform: translateY(-2px); }
      .gs-modal-btn:active { transform: translateY(0) scale(0.97); }

      .gs-modal-btn--primary {
        background: linear-gradient(135deg, #00c8ff, #00ff88);
        color: #070710;
        box-shadow: 0 8px 24px rgba(0,200,255,0.3);
      }

      .gs-modal-btn--secondary {
        background: rgba(255,255,255,0.06);
        color: rgba(192,240,255,0.7);
        border: 1px solid rgba(0,200,255,0.15);
      }

      .gs-modal-btn--secondary:hover {
        background: rgba(255,255,255,0.1);
        color: #c0f0ff;
      }
    `;
    document.head.appendChild(style);
  }
}
