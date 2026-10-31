import { GameState, QuestStage } from "../../systems/GameState";
import { AudioSystem } from "../../systems/AudioSystem";
import { Icons, icon } from "../Icons";
import { AREA_MAPS, AreaKey } from "../../data/maps";

export class HUD {
  private container: HTMLElement;
  private unsubscribe: () => void;
  private onRestartCallback: () => void;
  private onReturnToBaseCallback: () => void;
  private interactionBubble: HTMLElement;
  private questLogPanel: HTMLElement;
  private minimapContainer: HTMLElement;
  private minimapCanvas: HTMLCanvasElement;
  private minimapCtx: CanvasRenderingContext2D;
  private controlsHint: HTMLElement;
  private questLogOpen: boolean = false;

  // Cached state to avoid 60 FPS DOM manipulation and layout thrashing
  private lastPromptText: string = "";
  private isBubbleVisible: boolean = false;
  private cachedCanvas: HTMLCanvasElement | null = null;
  private currentOnInteract?: () => void;

  constructor(
    onRestartCallback: () => void,
    onReturnToBaseCallback: () => void,
  ) {
    this.onRestartCallback = onRestartCallback;
    this.onReturnToBaseCallback = onReturnToBaseCallback;

    this.container = document.createElement("div");
    this.container.id = "game-hud";

    this.interactionBubble = document.createElement("div");
    this.interactionBubble.id = "interaction-bubble";
    this.interactionBubble.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.currentOnInteract) this.currentOnInteract();
    });

    this.questLogPanel = document.createElement("div");
    this.questLogPanel.id = "quest-log-panel";

    this.minimapContainer = document.createElement("div");
    this.minimapContainer.id = "minimap-container";
    this.minimapContainer.title = "Klik untuk minimize / expand peta";
    this.minimapContainer.addEventListener("click", () => {
      this.minimapContainer.classList.toggle("minimized");
    });

    this.minimapCanvas = document.createElement("canvas");
    this.minimapCanvas.width = 120;
    this.minimapCanvas.height = 100;
    this.minimapCtx = this.minimapCanvas.getContext("2d")!;
    this.minimapCtx.imageSmoothingEnabled = false;

    // Movement & controls hint bar (separate floating element at bottom-left)
    this.controlsHint = document.createElement("div");
    this.controlsHint.id = "controls-hint";
    this.controlsHint.innerHTML = `
      <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Gerak
      <kbd>E</kbd> Interaksi
      <kbd>Spasi</kbd> Serang
      <kbd>B</kbd> Base
    `;

    this.render();
    document.body.appendChild(this.container);
    document.body.appendChild(this.interactionBubble);
    document.body.appendChild(this.questLogPanel);
    document.body.appendChild(this.minimapContainer);
    document.body.appendChild(this.controlsHint);

    this.minimapContainer.appendChild(this.minimapCanvas);

    this.bindEvents();
    this.unsubscribe = GameState.subscribe(() => this.update());
    this.update();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="hud-group hud-group-left">
        <div class="hud-card hud-player-badge" id="hud-player-info">
          ${icon(Icons.shield(14, 14))}
          <span id="hud-player-name">Prajurit</span>
          <span class="hud-grade-label" style="opacity:0.6;">Kls</span>
          <span id="hud-player-grade">3</span>
        </div>
        <div class="hud-card hud-hearts-card">
          <div class="hud-hearts" id="hud-hearts"></div>
        </div>
      </div>

      <div class="hud-objective-banner" id="hud-objective"></div>

      <div class="hud-group hud-group-right">
        <div class="hud-card hud-score-card">
          ${icon(Icons.star(14, 14), "#fef08a")}
          <span id="hud-score-val">0</span><span style="opacity:0.6;">/100</span>
        </div>
        <button class="hud-btn" id="hud-btn-quest" title="Catatan Misi">
          ${icon(Icons.scroll(16, 16))}
        </button>
        <button class="hud-btn hud-btn-home" id="hud-btn-home" title="Kembali ke Alun-Alun (Base) [B]">
          ${Icons.home(16, 16)}
        </button>
        <button class="hud-btn" id="hud-btn-sound" title="Suara">
          ${Icons.volume(16, 16)}
        </button>
        <button class="hud-btn" id="hud-btn-restart" title="Ulang Petualangan">
          ${Icons.refresh(16, 16)}
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    const soundBtn = this.container.querySelector(
      "#hud-btn-sound",
    ) as HTMLButtonElement;
    const restartBtn = this.container.querySelector(
      "#hud-btn-restart",
    ) as HTMLButtonElement;
    const questBtn = this.container.querySelector(
      "#hud-btn-quest",
    ) as HTMLButtonElement;
    const homeBtn = this.container.querySelector(
      "#hud-btn-home",
    ) as HTMLButtonElement;

    soundBtn.addEventListener("click", () => {
      const isMuted = AudioSystem.toggleMute();
      soundBtn.innerHTML = isMuted
        ? Icons.volumeOff(16, 16)
        : Icons.volume(16, 16);
    });

    homeBtn?.addEventListener("click", () => {
      this.onReturnToBaseCallback();
    });

    restartBtn.addEventListener("click", () => {
      if (
        confirm(
          "Mulai ulang petualangan dari awal? Semua skor dan progres akan direset.",
        )
      ) {
        this.onRestartCallback();
      }
    });

    questBtn.addEventListener("click", () => {
      this.questLogOpen = !this.questLogOpen;
      this.questLogPanel.classList.toggle("open", this.questLogOpen);
      this.renderQuestLog();
    });
  }

  public update(): void {
    const nameEl = this.container.querySelector("#hud-player-name");
    const gradeEl = this.container.querySelector("#hud-player-grade");
    const heartsEl = this.container.querySelector("#hud-hearts");
    const scoreEl = this.container.querySelector("#hud-score-val");
    const objEl = this.container.querySelector("#hud-objective");

    if (nameEl) nameEl.textContent = GameState.playerName || "Prajurit";
    if (gradeEl) gradeEl.textContent = GameState.playerGrade;
    if (scoreEl) scoreEl.textContent = String(GameState.score);
    if (objEl)
      objEl.innerHTML = `${icon(Icons.compass(12, 12), "#38bdf8")} ${this.getObjectiveText()}`;

    if (heartsEl) {
      let html = "";
      for (let i = 0; i < GameState.playerMaxHealth; i++) {
        const isFull = i < GameState.playerHealth;
        html += `<span class="heart-icon ${isFull ? "heart-full" : "heart-empty"}">${isFull ? Icons.heartFull(16, 16) : Icons.heartEmpty(16, 16)}</span>`;
      }
      heartsEl.innerHTML = html;
    }

    if (this.questLogOpen) {
      this.renderQuestLog();
    }
  }

  private getObjectiveText(): string {
    switch (GameState.questStage) {
      case QuestStage.TALK_TO_PRINCESS:
        return "Temui Putri Cahaya di Alun-Alun Istana";
      case QuestStage.INVESTIGATE_AREAS:
        return !GameState.hasForestKey
          ? "Cari petunjuk di Taman (Timur) & Dapur (Utara)"
          : "Kunci ditemukan! Temui Penjaga Gerbang (Selatan)";
      case QuestStage.GATE_CHALLENGE:
        return "Jawab tantangan Penjaga Gerbang Hutan";
      case QuestStage.FOREST_EXPLORATION:
        if (
          !GameState.isQuestionAnswered("q_present_continuous") &&
          !GameState.isBossDefeated
        ) {
          return "Kalahkan Monster Penjaga & pecahkan Prasasti";
        } else if (!GameState.isQuestionAnswered("q_present_continuous")) {
          return "Pecahkan mantra di Prasasti Kuno Hutan";
        } else {
          return "Kalahkan Monster Penjaga Hutan (Boss)";
        }
      case QuestStage.RETRIEVE_CROWN:
        return "Altar terbuka! Ambil Mahkota Bintang di altar!";
      case QuestStage.RETURN_TO_PRINCESS:
        return "Bawa Mahkota Bintang kembali ke Putri Cahaya!";
      case QuestStage.COMPLETED:
        return "Misi Selesai! Kerajaan Terselamatkan!";
    }
  }

  private renderQuestLog(): void {
    const stage = GameState.questStage;

    const steps: { label: string; stage: number; done?: boolean }[] = [
      {
        label: "Temui Putri Cahaya",
        stage: QuestStage.TALK_TO_PRINCESS,
        done: stage > QuestStage.TALK_TO_PRINCESS,
      },
      {
        label: "Cari petunjuk di Taman & Dapur",
        stage: QuestStage.INVESTIGATE_AREAS,
        done: GameState.hasForestKey,
      },
      {
        label: "Dapatkan Kunci Hutan Rahasia",
        stage: -1,
        done: GameState.hasForestKey,
      },
      {
        label: "Jawab tantangan Penjaga Gerbang",
        stage: QuestStage.GATE_CHALLENGE,
        done: GameState.isQuestionAnswered("q_transportation"),
      },
      {
        label: "Pecahkan mantra Prasasti Kuno",
        stage: -2,
        done: GameState.isQuestionAnswered("q_present_continuous"),
      },
      {
        label: "Kalahkan Monster Penjaga Hutan",
        stage: -3,
        done: GameState.isBossDefeated,
      },
      {
        label: "Ambil Mahkota Bintang di altar",
        stage: QuestStage.RETRIEVE_CROWN,
        done: GameState.hasCrown,
      },
      {
        label: "Kembalikan ke Putri Cahaya",
        stage: QuestStage.RETURN_TO_PRINCESS,
        done: stage === QuestStage.COMPLETED,
      },
    ];

    let bodyHtml = "";
    steps.forEach((step) => {
      let cls = "";
      if (step.done) {
        cls = "done";
      } else if (step.stage === -1) {
        cls = stage >= QuestStage.INVESTIGATE_AREAS ? "active" : "";
      } else if (step.stage === -2 || step.stage === -3) {
        cls = stage >= QuestStage.FOREST_EXPLORATION ? "active" : "";
      } else if (stage === step.stage) {
        cls = "active";
      } else if (stage > step.stage && step.stage >= 0) {
        cls = "done";
      }

      const markerInner =
        cls === "done"
          ? Icons.checkCircle(10, 10)
          : cls === "active"
            ? `<span style="color:#38bdf8;">${Icons.arrowRight(10, 10)}</span>`
            : "";

      bodyHtml += `
        <div class="quest-step ${cls}">
          <div class="quest-step-marker">${markerInner}</div>
          <span>${step.label}</span>
        </div>
      `;
    });

    this.questLogPanel.innerHTML = `
      <div class="quest-log-header">
        ${icon(Icons.scroll(12, 12), "#fef08a")} CATATAN MISI
      </div>
      <div class="quest-log-body">
        ${bodyHtml}
        <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #1e293b; font-size: 0.7rem; color: #64748b;">
          Skor: ${GameState.score}/100 &middot; Dijawab: ${GameState.getAnsweredCount()}/10
        </div>
      </div>
    `;
  }

  public updateMinimap(
    currentArea: AreaKey,
    playerTileX: number,
    playerTileY: number,
    activeEnemies?: { x: number; y: number; isBoss: boolean }[],
  ): void {
    const area = AREA_MAPS[currentArea];
    const ctx = this.minimapCtx;
    const cw = this.minimapCanvas.width;
    const ch = this.minimapCanvas.height;
    const tw = cw / area.widthInTiles;
    const th = ch / area.heightInTiles;

    ctx.clearRect(0, 0, cw, ch);

    // Draw tiles
    for (let y = 0; y < area.layout.length; y++) {
      for (let x = 0; x < area.layout[y].length; x++) {
        const c = area.layout[y][x];
        if (c === "W") ctx.fillStyle = "#334155";
        else if (c === "T") ctx.fillStyle = "#15803d";
        else if (c === "F") ctx.fillStyle = "#78350f";
        else if (c === "P") ctx.fillStyle = "#92400e";
        else if (currentArea === "FOREST") ctx.fillStyle = "#0f3d2a";
        else if (currentArea === "CASTLE") ctx.fillStyle = "#374151";
        else ctx.fillStyle = "#166534";

        ctx.fillRect(x * tw, y * th, tw, th);
      }
    }

    // Draw active enemies (radar red dots)
    if (activeEnemies && activeEnemies.length > 0) {
      activeEnemies.forEach((e) => {
        ctx.fillStyle = e.isBoss ? "#f59e0b" : "#ef4444";
        const ex = (e.x / 32) * tw;
        const ey = (e.y / 32) * th;
        ctx.fillRect(ex - 1, ey - 1, tw + 1, th + 1);
      });
    }

    // Draw NPCs
    area.npcs.forEach((npc) => {
      const isQuestTarget = this.isNPCQuestTarget(npc.id);
      ctx.fillStyle = isQuestTarget ? "#f59e0b" : "#60a5fa";
      ctx.fillRect(npc.x * tw - 1, npc.y * th - 1, tw + 2, th + 2);
    });

    // Draw portals
    area.portals.forEach((p) => {
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(p.x * tw, p.y * th, tw, th);
    });

    // Draw player
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(playerTileX * tw - 1, playerTileY * th - 1, tw + 3, th + 3);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(playerTileX * tw - 1, playerTileY * th - 1, tw + 3, th + 3);
  }

  private isNPCQuestTarget(npcId: string): boolean {
    const stage = GameState.questStage;
    if (
      npcId === "npc_princess" &&
      (stage === QuestStage.TALK_TO_PRINCESS ||
        stage === QuestStage.RETURN_TO_PRINCESS)
    )
      return true;
    if (
      npcId === "npc_gatekeeper" &&
      GameState.hasForestKey &&
      !GameState.isQuestionAnswered("q_transportation")
    )
      return true;
    return false;
  }

  public showInteractionPrompt(
    x: number,
    y: number,
    text: string = "Tekan [E]",
    onInteract?: () => void
  ): void {
    this.currentOnInteract = onInteract;

    const isMobile = window.innerWidth <= 820 || "ontouchstart" in window;
    let displayText = text;
    if (isMobile) {
      const clean = text.replace(/Tekan \[E\]\s*(untuk\s*)?/gi, "").trim();
      displayText = clean ? `Sentuh untuk ${clean}` : "Sentuh untuk Bicara";
    }

    // Only rebuild innerHTML when the text actually changes!
    if (this.lastPromptText !== displayText) {
      this.lastPromptText = displayText;
      this.interactionBubble.innerHTML = `${icon(Icons.messageCircle(12, 12))} ${displayText}`;
    }

    if (!this.cachedCanvas || !this.cachedCanvas.isConnected) {
      this.cachedCanvas = document.querySelector("#game-canvas-container canvas") as HTMLCanvasElement | null;
    }

    if (this.cachedCanvas) {
      const rect = this.cachedCanvas.getBoundingClientRect();
      const realX = Math.round(rect.left + (x / 800) * rect.width);
      const realY = Math.round(rect.top + (y / 600) * rect.height);
      this.interactionBubble.style.left = `${realX}px`;
      this.interactionBubble.style.top = `${realY}px`;
    } else {
      this.interactionBubble.style.left = `${Math.round(x)}px`;
      this.interactionBubble.style.top = `${Math.round(y)}px`;
    }

    if (!this.isBubbleVisible) {
      this.isBubbleVisible = true;
      this.interactionBubble.style.display = "flex";
    }
  }

  public hideInteractionPrompt(): void {
    if (!this.isBubbleVisible) return;
    this.isBubbleVisible = false;
    this.interactionBubble.style.display = "none";
  }

  public destroy(): void {
    this.unsubscribe();
    this.container.remove();
    this.interactionBubble.remove();
    this.questLogPanel.remove();
    this.minimapContainer.remove();
    this.controlsHint.remove();
  }
}
