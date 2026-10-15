import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';

export class HUD {
  private container: HTMLElement;
  private unsubscribe: () => void;
  private onRestartCallback: () => void;
  private interactionBubble: HTMLElement;

  constructor(onRestartCallback: () => void) {
    this.onRestartCallback = onRestartCallback;
    this.container = document.createElement('div');
    this.container.id = 'game-hud';

    this.interactionBubble = document.createElement('div');
    this.interactionBubble.id = 'interaction-bubble';
    this.interactionBubble.innerText = 'Tekan [E]';

    this.render();
    document.body.appendChild(this.container);
    document.body.appendChild(this.interactionBubble);

    this.bindEvents();
    this.unsubscribe = GameState.subscribe(() => this.update());
    this.update();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="hud-group">
        <div class="hud-card hud-player-badge" id="hud-player-info">
          🛡️ <span id="hud-player-name">Prajurit</span> (Kls <span id="hud-player-grade">3</span>)
        </div>
        <div class="hud-card">
          <div class="hud-hearts" id="hud-hearts">
            <!-- Hearts will be generated here -->
          </div>
        </div>
      </div>

      <div class="hud-objective-banner" id="hud-objective">
        ${GameState.getQuestObjectiveText()}
      </div>

      <div class="hud-group">
        <div class="hud-card hud-score-card">
          ⭐ Skor: <span id="hud-score-val">0</span> / 100
        </div>
        <button class="hud-btn" id="hud-btn-sound" title="Toggle Suara">
          🔊
        </button>
        <button class="hud-btn" id="hud-btn-restart" title="Ulang Permainan">
          🔄
        </button>
      </div>

      <div id="controls-hint">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / Panah: Gerak &nbsp;|&nbsp; 
        <kbd>E</kbd>: Interaksi &nbsp;|&nbsp; 
        <kbd>Spasi</kbd>: Serang
      </div>
    `;
  }

  private bindEvents(): void {
    const soundBtn = this.container.querySelector('#hud-btn-sound') as HTMLButtonElement;
    const restartBtn = this.container.querySelector('#hud-btn-restart') as HTMLButtonElement;

    soundBtn.addEventListener('click', () => {
      const isMuted = AudioSystem.toggleMute();
      soundBtn.innerText = isMuted ? '🔇' : '🔊';
    });

    restartBtn.addEventListener('click', () => {
      if (confirm('Mulai ulang petualangan dari awal? Semua skor dan progres akan direset.')) {
        this.onRestartCallback();
      }
    });
  }

  public update(): void {
    const nameEl = this.container.querySelector('#hud-player-name');
    const gradeEl = this.container.querySelector('#hud-player-grade');
    const heartsEl = this.container.querySelector('#hud-hearts');
    const scoreEl = this.container.querySelector('#hud-score-val');
    const objEl = this.container.querySelector('#hud-objective');

    if (nameEl) nameEl.textContent = GameState.playerName || 'Prajurit';
    if (gradeEl) gradeEl.textContent = GameState.playerGrade;
    if (scoreEl) scoreEl.textContent = String(GameState.score);
    if (objEl) objEl.textContent = GameState.getQuestObjectiveText();

    if (heartsEl) {
      let heartsHtml = '';
      for (let i = 0; i < GameState.playerMaxHealth; i++) {
        const isFull = i < GameState.playerHealth;
        heartsHtml += `<span class="heart-icon ${isFull ? 'heart-full' : 'heart-empty'}">❤️</span>`;
      }
      heartsEl.innerHTML = heartsHtml;
    }
  }

  public showInteractionPrompt(x: number, y: number, text: string = 'Tekan [E]'): void {
    this.interactionBubble.innerText = text;
    this.interactionBubble.style.left = `${x}px`;
    this.interactionBubble.style.top = `${y}px`;
    this.interactionBubble.style.display = 'block';
  }

  public hideInteractionPrompt(): void {
    this.interactionBubble.style.display = 'none';
  }

  public destroy(): void {
    this.unsubscribe();
    this.container.remove();
    this.interactionBubble.remove();
  }
}
