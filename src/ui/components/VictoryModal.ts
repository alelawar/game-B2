import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';
import { EDUCATIONAL_QUESTIONS } from '../../data/questions';

export class VictoryModal {
  private container: HTMLElement;
  private onRestartCallback: () => void;
  public isOpen: boolean = false;

  constructor(onRestartCallback: () => void) {
    this.onRestartCallback = onRestartCallback;
    this.container = document.createElement('div');
    this.container.className = 'modal-overlay';
    this.container.id = 'modal-victory';

    this.render();
    document.body.appendChild(this.container);
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="modal-box victory-box">
        <div style="font-size: 4rem; animation: floatCrown 1.5s infinite alternate ease-in-out;">👑</div>
        <h1 class="victory-title">KEMENANGAN KERAJAAN!</h1>
        <p style="font-size: 1.1rem; color: #fde047; font-weight: 700;">
          Mahkota Bintang Berhasil Dikembalikan kepada Putri Cahaya!
        </p>

        <div class="victory-score-pill">
          ⭐ Nilai Akhir: <span id="vic-score">100</span> / 100
        </div>

        <div class="victory-details" id="vic-details">
          <!-- Player summary will appear here -->
        </div>

        <div id="vic-topics" style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 6px;">
          <!-- Topic pills -->
        </div>

        <button class="btn-primary" id="vic-btn-restart" style="margin-top: 10px; font-size: 1.2rem;">
          🔄 Main Lagi (Play Again)
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    const btn = this.container.querySelector('#vic-btn-restart') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      this.close();
      this.onRestartCallback();
    });
  }

  public show(): void {
    this.isOpen = true;
    AudioSystem.playVictory();

    const scoreEl = this.container.querySelector('#vic-score') as HTMLElement;
    const detailsEl = this.container.querySelector('#vic-details') as HTMLElement;
    const topicsEl = this.container.querySelector('#vic-topics') as HTMLElement;

    const correctCount = GameState.getCorrectCount();
    const answeredCount = GameState.getAnsweredCount();
    const totalQuestions = EDUCATIONAL_QUESTIONS.length;

    scoreEl.textContent = String(GameState.score);

    let starRating = '⭐⭐⭐ Luar Biasa (Sempurna)!';
    if (GameState.score < 60) {
      starRating = '⭐ Tetap Semangat Berlatih!';
    } else if (GameState.score < 90) {
      starRating = '⭐⭐ Sangat Bagus!';
    }

    detailsEl.innerHTML = `
      <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
        Prajurit: <span style="color: #60a5fa;">${GameState.playerName}</span> &nbsp;|&nbsp; 
        Kelas: <span style="color: #60a5fa;">${GameState.playerGrade} SD</span>
      </div>
      <div>${starRating}</div>
      <div style="margin-top: 6px; color: #94a3b8; font-size: 0.9rem;">
        Menjawab benar <strong>${correctCount}</strong> dari <strong>${totalQuestions}</strong> pertanyaan materi Bahasa Inggris (Total dikerjakan: ${answeredCount}/${totalQuestions}).
      </div>
    `;

    // Render topics list
    topicsEl.innerHTML = '';
    EDUCATIONAL_QUESTIONS.forEach(q => {
      const state = GameState.answeredQuestions.get(q.id);
      const isCorrect = state?.correct;
      const isAnswered = state?.answered;

      const pill = document.createElement('span');
      pill.style.fontSize = '0.75rem';
      pill.style.padding = '3px 8px';
      pill.style.borderRadius = '10px';
      pill.style.fontWeight = '700';

      if (isCorrect) {
        pill.style.background = '#065f46';
        pill.style.color = '#a7f3d0';
        pill.textContent = `✓ ${q.topic}`;
      } else if (isAnswered) {
        pill.style.background = '#7f1d1d';
        pill.style.color = '#fca5a5';
        pill.textContent = `✗ ${q.topic}`;
      } else {
        pill.style.background = '#374151';
        pill.style.color = '#9ca3af';
        pill.textContent = `- ${q.topic}`;
      }

      topicsEl.appendChild(pill);
    });

    this.container.classList.add('active');
  }

  public close(): void {
    this.isOpen = false;
    this.container.classList.remove('active');
  }

  public destroy(): void {
    this.container.remove();
  }
}
