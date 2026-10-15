import { QuestionItem } from '../../data/questions';
import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';

export class QuizModal {
  private container: HTMLElement;
  private currentQuestion: QuestionItem | null = null;
  private onFinishCallback?: () => void;
  public isOpen: boolean = false;
  private answeredCurrent: boolean = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'modal-overlay';
    this.container.id = 'modal-quiz';

    this.render();
    document.body.appendChild(this.container);
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="modal-box">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="quiz-topic-tag" id="quiz-topic">Topic: Vocabulary</span>
          <span style="font-size: 0.85rem; font-weight: 700; color: #f59e0b;" id="quiz-context-title">
            Kuis Bahasa Inggris
          </span>
        </div>

        <div class="quiz-question-text" id="quiz-question">
          Question goes here?
        </div>

        <div class="quiz-options" id="quiz-options-list">
          <!-- 3 options rendered here -->
        </div>

        <div class="quiz-feedback" id="quiz-feedback">
          <div class="quiz-feedback-title" id="feedback-title">🎉 Benar! (+10 Poin)</div>
          <div class="quiz-feedback-text" id="feedback-explanation">Penjelasan jawaban di sini.</div>
          <div class="quiz-feedback-text" id="feedback-clue" style="color: #38bdf8; font-weight: 700; margin-top: 4px;">
            Petunjuk: ...
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
          <button class="btn-primary" id="quiz-btn-continue" style="display: none; padding: 10px 24px;">
            Lanjutkan Petualangan ➡️
          </button>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    const continueBtn = this.container.querySelector('#quiz-btn-continue') as HTMLButtonElement;
    continueBtn.addEventListener('click', () => {
      this.close();
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (!this.answeredCurrent) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') {
          this.handleOptionSelect(0);
        } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
          this.handleOptionSelect(1);
        } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
          this.handleOptionSelect(2);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          this.close();
          if (this.onFinishCallback) {
            this.onFinishCallback();
          }
        }
      }
    });
  }

  public show(question: QuestionItem, onFinish?: () => void): void {
    this.currentQuestion = question;
    this.onFinishCallback = onFinish;
    this.isOpen = true;
    this.answeredCurrent = false;

    const topicEl = this.container.querySelector('#quiz-topic') as HTMLElement;
    const contextEl = this.container.querySelector('#quiz-context-title') as HTMLElement;
    const questionEl = this.container.querySelector('#quiz-question') as HTMLElement;
    const optionsContainer = this.container.querySelector('#quiz-options-list') as HTMLElement;
    const feedbackEl = this.container.querySelector('#quiz-feedback') as HTMLElement;
    const continueBtn = this.container.querySelector('#quiz-btn-continue') as HTMLButtonElement;

    topicEl.textContent = `Topik: ${question.topic}`;
    contextEl.textContent = question.contextTitle;
    questionEl.textContent = question.question;

    feedbackEl.classList.remove('show');
    continueBtn.style.display = 'none';

    // Check if this question was already answered before
    const isAlreadyAnswered = GameState.isQuestionAnswered(question.id);

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C'];

    question.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[index]}</span>
        <span>${optText}</span>
      `;

      if (isAlreadyAnswered) {
        btn.disabled = true;
        if (index === question.correctIndex) {
          btn.classList.add('correct');
        }
      } else {
        btn.addEventListener('click', () => this.handleOptionSelect(index));
      }

      optionsContainer.appendChild(btn);
    });

    if (isAlreadyAnswered) {
      this.answeredCurrent = true;
      this.showFeedbackUI(true, true);
      continueBtn.style.display = 'inline-block';
    }

    this.container.classList.add('active');
    AudioSystem.playInteract();
  }

  private handleOptionSelect(selectedIndex: number): void {
    if (!this.currentQuestion || this.answeredCurrent) return;
    this.answeredCurrent = true;

    const { isCorrect } = GameState.answerQuestion(this.currentQuestion.id, selectedIndex);

    const optionButtons = this.container.querySelectorAll('.quiz-option-btn') as NodeListOf<HTMLButtonElement>;
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === this.currentQuestion!.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      AudioSystem.playCorrect();
    } else {
      AudioSystem.playIncorrect();
    }

    this.showFeedbackUI(isCorrect, false);

    const continueBtn = this.container.querySelector('#quiz-btn-continue') as HTMLButtonElement;
    continueBtn.style.display = 'inline-block';
    continueBtn.focus();
  }

  private showFeedbackUI(isCorrect: boolean, isPreviouslyAnswered: boolean): void {
    if (!this.currentQuestion) return;

    const feedbackEl = this.container.querySelector('#quiz-feedback') as HTMLElement;
    const titleEl = this.container.querySelector('#feedback-title') as HTMLElement;
    const expEl = this.container.querySelector('#feedback-explanation') as HTMLElement;
    const clueEl = this.container.querySelector('#feedback-clue') as HTMLElement;

    feedbackEl.classList.add('show');

    if (isPreviouslyAnswered) {
      feedbackEl.style.borderLeftColor = '#3b82f6';
      titleEl.style.color = '#60a5fa';
      titleEl.textContent = 'ℹ️ Pertanyaan ini sudah pernah dijawab sebelumnya!';
    } else if (isCorrect) {
      feedbackEl.style.borderLeftColor = '#10b981';
      titleEl.style.color = '#34d399';
      titleEl.textContent = '🎉 Hebat Sekali! Jawabanmu Benar! (+10 Poin)';
    } else {
      feedbackEl.style.borderLeftColor = '#ef4444';
      titleEl.style.color = '#f87171';
      titleEl.textContent = '💡 Belum Tepat! (0 Poin)';
    }

    expEl.textContent = this.currentQuestion.explanation;
    clueEl.textContent = this.currentQuestion.clueText;
  }

  public close(): void {
    this.isOpen = false;
    this.container.classList.remove('active');
  }

  public destroy(): void {
    this.container.remove();
  }
}
