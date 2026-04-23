import { MODAL_Z_INDEX, OVERLAY_Z_INDEX } from "../utils/constants";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface TrackingHUDData {
  onTargetPct: number;    // 0-100, live percentage of time on target
  timeLeft: number;        // seconds remaining
  onTargetMs: number;      // raw ms on target so far
}

export interface TrackingSessionStats {
  onTargetPct: number;
  onTargetMs: number;
  totalMs: number;
  grade: string;
  gradeColor: string;
}

// ─── TrackingOverlay ───────────────────────────────────────────────────────

/**
 * TrackingOverlay — HTML-based HUD + result modal for the Tracking mode.
 */
export class TrackingOverlay {
  private root: HTMLDivElement;

  // HUD
  private hudPanel!: HTMLDivElement;
  private onTargetPctEl!: HTMLSpanElement;
  private timerEl!: HTMLDivElement;

  // Visual progress arc (SVG)
  private arcEl!: SVGCircleElement;

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

  updateHUD(data: TrackingHUDData): void {
    this.onTargetPctEl.textContent = `${Math.round(data.onTargetPct)}%`;
    this.updateTimer(data.timeLeft);
    // Update arc fill
    const circumference = 2 * Math.PI * 28;
    const offset = circumference * (1 - data.onTargetPct / 100);
    this.arcEl.style.strokeDashoffset = String(offset);
  }

  updateTimer(seconds: number): void {
    const s = Math.max(0, Math.ceil(seconds));
    this.timerEl.textContent = String(s);
    this.timerEl.style.color = s <= 10 ? "#ff4466" : "#c0f0ff";
    this.timerEl.style.textShadow =
      s <= 10 ? "0 0 24px #ff446688" : "0 0 16px rgba(0,200,255,0.4)";
  }

  showModal(stats: TrackingSessionStats, personalBest: number | null, isNewBest: boolean): void {
    this.buildModalContent(stats, personalBest, isNewBest);
    this.modal.style.display = "flex";
    void this.modal.offsetWidth;
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
    this.hudPanel.className = "tk-hud";

    // Radial progress arc
    const arcSize = 80;
    const r = 28;
    const cx = arcSize / 2;
    const cy = arcSize / 2;
    const circumference = 2 * Math.PI * r;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(arcSize));
    svg.setAttribute("height", String(arcSize));
    svg.setAttribute("viewBox", `0 0 ${arcSize} ${arcSize}`);
    svg.style.transform = "rotate(-90deg)";

    const trackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    trackCircle.setAttribute("cx", String(cx));
    trackCircle.setAttribute("cy", String(cy));
    trackCircle.setAttribute("r", String(r));
    trackCircle.setAttribute("fill", "none");
    trackCircle.setAttribute("stroke", "rgba(0,200,255,0.12)");
    trackCircle.setAttribute("stroke-width", "5");

    this.arcEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.arcEl.setAttribute("cx", String(cx));
    this.arcEl.setAttribute("cy", String(cy));
    this.arcEl.setAttribute("r", String(r));
    this.arcEl.setAttribute("fill", "none");
    this.arcEl.setAttribute("stroke", "#7C3AED");
    this.arcEl.setAttribute("stroke-width", "5");
    this.arcEl.setAttribute("stroke-linecap", "round");
    this.arcEl.style.strokeDasharray = String(circumference);
    this.arcEl.style.strokeDashoffset = String(circumference);
    this.arcEl.style.transition = "stroke-dashoffset 0.15s linear";

    svg.appendChild(trackCircle);
    svg.appendChild(this.arcEl);

    // Pct label in the center
    const center = document.createElement("div");
    center.className = "tk-hud__arc-wrap";
    center.appendChild(svg);

    this.onTargetPctEl = document.createElement("span");
    this.onTargetPctEl.className = "tk-hud__pct";
    this.onTargetPctEl.textContent = "0%";

    const label = document.createElement("span");
    label.className = "tk-hud__label";
    label.textContent = "ON TARGET";

    const inner = document.createElement("div");
    inner.className = "tk-hud__inner";
    inner.appendChild(center);
    inner.appendChild(this.onTargetPctEl);
    inner.appendChild(label);

    this.hudPanel.appendChild(inner);
    this.root.appendChild(this.hudPanel);
  }

  private buildTimer(): void {
    this.timerEl = document.createElement("div");
    this.timerEl.className = "tk-timer";
    this.timerEl.textContent = "30";
    this.root.appendChild(this.timerEl);
  }

  private buildModal(): void {
    this.modal = document.createElement("div");
    this.modal.className = "tk-modal-backdrop";
    this.modal.style.opacity = "0";
    this.modal.style.transform = "scale(0.95)";
    this.modal.style.transition = "opacity 0.35s ease, transform 0.35s ease";
    this.modal.style.display = "none";
    this.root.appendChild(this.modal);
  }

  private buildModalContent(
    stats: TrackingSessionStats,
    personalBest: number | null,
    isNewBest: boolean,
  ): void {
    const gradeColor = stats.gradeColor;

    this.modal.innerHTML = `
      <div class="tk-modal-card">
        <div class="tk-modal-header">
          <span class="tk-modal-title">SESSION COMPLETE</span>
          ${isNewBest ? '<span class="tk-modal-badge">🏆 NEW BEST</span>' : ""}
        </div>

        <div class="tk-modal-grade" style="color: ${gradeColor}; text-shadow: 0 0 40px ${gradeColor}88;">
          ${stats.grade}
        </div>

        <div class="tk-modal-stats">
          <div class="tk-stat-row">
            <span class="tk-stat-label">On-Target %</span>
            <span class="tk-stat-value" style="color: #7C3AED">${stats.onTargetPct.toFixed(1)}%</span>
          </div>
          <div class="tk-stat-row">
            <span class="tk-stat-label">Time on Target</span>
            <span class="tk-stat-value">${(stats.onTargetMs / 1000).toFixed(2)}s</span>
          </div>
          <div class="tk-stat-row">
            <span class="tk-stat-label">Session Length</span>
            <span class="tk-stat-value">${(stats.totalMs / 1000).toFixed(0)}s</span>
          </div>
          ${personalBest !== null ? `
          <div class="tk-stat-row tk-stat-row--divider">
            <span class="tk-stat-label">Personal Best (%)</span>
            <span class="tk-stat-value" style="color: #ffd700">${personalBest.toFixed(1)}%</span>
          </div>` : ""}
        </div>

        <div class="tk-modal-actions">
          <button class="tk-modal-btn tk-modal-btn--primary" id="tk-play-again">
            ↺ Play Again
          </button>
          <button class="tk-modal-btn tk-modal-btn--secondary" id="tk-go-home">
            ← Back
          </button>
        </div>
      </div>
    `;

    const playAgain = this.modal.querySelector<HTMLButtonElement>("#tk-play-again");
    const goHome    = this.modal.querySelector<HTMLButtonElement>("#tk-go-home");

    playAgain?.addEventListener("click", () => {
      this.hideModal();
      this.container.dispatchEvent(new CustomEvent("tk:restart"));
    });

    goHome?.addEventListener("click", () => {
      window.location.href = "/train";
    });
  }

  // ─── Styles ────────────────────────────────────────────────────────────────

  private injectStyles(): void {
    if (document.querySelector("#tk-styles")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "tk-styles";
    style.textContent = `
      /* ── HUD Panel ──────────────────────────────────────────── */
      .tk-hud {
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(7, 7, 20, 0.72);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 14px;
        padding: 16px 20px;
        pointer-events: none;
      }

      .tk-hud__inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }

      .tk-hud__arc-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tk-hud__pct {
        font-size: 18px;
        font-weight: 800;
        font-family: 'Inter', sans-serif;
        font-variant-numeric: tabular-nums;
        color: #c0f0ff;
        letter-spacing: -0.02em;
      }

      .tk-hud__label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.14em;
        color: rgba(124, 58, 237, 0.7);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      /* ── Timer ──────────────────────────────────────────────── */
      .tk-timer {
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
      .tk-modal-backdrop {
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

      .tk-modal-card {
        background: rgba(10, 10, 28, 0.95);
        border: 1px solid rgba(124, 58, 237, 0.25);
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
          0 0 0 1px rgba(124,58,237,0.1),
          0 32px 80px rgba(0,0,0,0.6),
          0 0 80px rgba(124,58,237,0.06) inset;
        animation: tk-modal-enter 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
      }

      @keyframes tk-modal-enter {
        from { transform: scale(0.88) translateY(20px); opacity: 0; }
        to   { transform: scale(1)    translateY(0);    opacity: 1; }
      }

      .tk-modal-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .tk-modal-title {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.22em;
        color: rgba(124, 58, 237, 0.65);
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .tk-modal-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 100px;
        background: linear-gradient(135deg, #ffd70022, #ffd70044);
        border: 1px solid rgba(255,215,0,0.4);
        color: #ffd700;
        letter-spacing: 0.05em;
        animation: tk-badge-glow 1.5s ease-in-out infinite alternate;
      }

      @keyframes tk-badge-glow {
        from { box-shadow: 0 0 8px rgba(255,215,0,0.3); }
        to   { box-shadow: 0 0 20px rgba(255,215,0,0.6); }
      }

      .tk-modal-grade {
        font-size: clamp(64px, 14vw, 96px);
        font-weight: 800;
        line-height: 1;
        margin: 12px 0 24px;
        font-family: 'Inter', sans-serif;
        animation: tk-grade-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
      }

      @keyframes tk-grade-pop {
        from { transform: scale(0.5); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
      }

      .tk-modal-stats {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-top: 1px solid rgba(124,58,237,0.15);
        border-bottom: 1px solid rgba(124,58,237,0.15);
        padding: 20px 0;
        margin-bottom: 28px;
      }

      .tk-stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tk-stat-row--divider {
        border-top: 1px solid rgba(124,58,237,0.1);
        padding-top: 10px;
        margin-top: 4px;
      }

      .tk-stat-label {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.04em;
        color: rgba(192, 240, 255, 0.45);
        font-family: 'Inter', sans-serif;
      }

      .tk-stat-value {
        font-size: 15px;
        font-weight: 700;
        color: #c0f0ff;
        font-variant-numeric: tabular-nums;
        font-family: 'Inter', sans-serif;
      }

      .tk-modal-actions {
        display: flex;
        gap: 12px;
        width: 100%;
      }

      .tk-modal-btn {
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

      .tk-modal-btn:hover  { transform: translateY(-2px); }
      .tk-modal-btn:active { transform: translateY(0) scale(0.97); }

      .tk-modal-btn--primary {
        background: linear-gradient(135deg, #7C3AED, #c026d3);
        color: #fff;
        box-shadow: 0 8px 24px rgba(124,58,237,0.4);
      }

      .tk-modal-btn--secondary {
        background: rgba(255,255,255,0.06);
        color: rgba(192,240,255,0.7);
        border: 1px solid rgba(124,58,237,0.2);
      }

      .tk-modal-btn--secondary:hover {
        background: rgba(255,255,255,0.1);
        color: #c0f0ff;
      }
    `;
    document.head.appendChild(style);
  }
}
