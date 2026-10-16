import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';
import { EDUCATIONAL_QUESTIONS } from '../../data/questions';
import { Icons, icon } from '../Icons';

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
        <div class="victory-crown-wrap">
          ${Icons.crown(56, 56)}
        </div>

        <h1 class="victory-title">KEMENANGAN KERAJAAN!</h1>

        <p style="font-size: 0.85rem; color: #fde047; font-weight: 700; font-family: var(--font-body);">
          Mahkota Bintang Berhasil Dikembalikan kepada Putri Cahaya!
        </p>

        <div class="victory-score-pill">
          ${icon(Icons.star(16, 16), '#fef08a')}
          Nilai Akhir: <span id="vic-score">0</span> / 100
        </div>

        <div class="star-rating" id="vic-stars"></div>

        <div class="victory-details" id="vic-details"></div>

        <div class="victory-topics" id="vic-topics"></div>

        <button class="btn-primary" id="vic-btn-restart" style="margin-top: 8px;">
          ${icon(Icons.refresh(16, 16))} Main Lagi (Play Again)
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
    const starsEl = this.container.querySelector('#vic-stars') as HTMLElement;
    const detailsEl = this.container.querySelector('#vic-details') as HTMLElement;
    const topicsEl = this.container.querySelector('#vic-topics') as HTMLElement;

    const correctCount = GameState.getCorrectCount();
    const answeredCount = GameState.getAnsweredCount();
    const totalQuestions = EDUCATIONAL_QUESTIONS.length;

    scoreEl.textContent = String(GameState.score);

    // Star rating (1–3 stars)
    let starCount = 1;
    let ratingText = 'Tetap Semangat Berlatih!';
    if (GameState.score >= 90) {
      starCount = 3;
      ratingText = 'Sempurna! Luar Biasa!';
    } else if (GameState.score >= 60) {
      starCount = 2;
      ratingText = 'Sangat Bagus!';
    }

    let starsHtml = '';
    for (let i = 0; i < 3; i++) {
      starsHtml += `<span class="${i < starCount ? '' : 'star-empty'}">${Icons.star(22, 22)}</span>`;
    }
    starsEl.innerHTML = starsHtml;

    detailsEl.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        ${icon(Icons.shield(16, 16), '#60a5fa')}
        <strong style="color: #60a5fa;">${GameState.playerName}</strong>
        <span style="color: #475569;">|</span>
        <span style="color: #60a5fa;">Kelas ${GameState.playerGrade} SD</span>
      </div>
      <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 4px;">${ratingText}</div>
      <div style="color: #94a3b8; font-size: 0.82rem;">
        Menjawab benar <strong style="color: #f1f5f9;">${correctCount}</strong> dari
        <strong style="color: #f1f5f9;">${totalQuestions}</strong> pertanyaan Bahasa Inggris
        (dikerjakan: ${answeredCount}/${totalQuestions}).
      </div>
    `;

    // Topic pills
    topicsEl.innerHTML = '';
    EDUCATIONAL_QUESTIONS.forEach(q => {
      const state = GameState.answeredQuestions.get(q.id);
      const isCorrect = state?.correct;
      const isAnswered = state?.answered;

      const pill = document.createElement('span');
      pill.className = `topic-pill ${isCorrect ? 'correct' : isAnswered ? 'wrong' : 'unanswered'}`;

      if (isCorrect) {
        pill.innerHTML = `${icon(Icons.checkCircle(10, 10))} ${q.topic}`;
      } else if (isAnswered) {
        pill.innerHTML = `${icon(Icons.xCircle(10, 10))} ${q.topic}`;
      } else {
        pill.innerHTML = `${icon(Icons.info(10, 10))} ${q.topic}`;
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
