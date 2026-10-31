import { QuestionItem } from '../../data/questions';
import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';
import { Icons, icon } from '../Icons';

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
          <span class="quiz-topic-tag" id="quiz-topic">Topik</span>
          <span style="font-family: var(--font-pixel); font-size: 0.4rem; color: #f5a623;" id="quiz-context-title">
            Kuis
          </span>
        </div>

        <div id="quiz-dialogue-intro" style="font-size: 0.82rem; color: #94a3b8; margin-top: 6px; font-style: italic;"></div>

        <div class="quiz-question-text" id="quiz-question">
          Question?
        </div>

        <div class="quiz-options" id="quiz-options-list"></div>

        <div class="quiz-feedback" id="quiz-feedback">
          <div class="quiz-feedback-title" id="feedback-title"></div>
          <div class="quiz-feedback-text" id="feedback-explanation"></div>
          <div class="quiz-feedback-text" id="feedback-clue" style="color: #38bdf8; font-weight: 700; margin-top: 3px;"></div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
          <button class="btn-primary" id="quiz-btn-continue" style="display: none; padding: 9px 18px; font-size: 0.85rem;">
            ${icon(Icons.arrowRight(14, 14))} Lanjutkan
          </button>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    const continueBtn = this.container.querySelector('#quiz-btn-continue') as HTMLButtonElement;
    continueBtn.addEventListener('click', () => {
      this.close();
      if (this.onFinishCallback) this.onFinishCallback();
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
        if (this.onFinishCallback) this.onFinishCallback();
        return;
      }

      if (!this.answeredCurrent) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') this.handleOptionSelect(0);
        else if (e.key === '2' || e.key === 'b' || e.key === 'B') this.handleOptionSelect(1);
        else if (e.key === '3' || e.key === 'c' || e.key === 'C') this.handleOptionSelect(2);
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          this.close();
          if (this.onFinishCallback) this.onFinishCallback();
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

    topicEl.textContent = question.topic;
    contextEl.textContent = question.contextTitle;
    const introEl = this.container.querySelector('#quiz-dialogue-intro') as HTMLElement;
    if (introEl) introEl.textContent = question.dialogueIntro;
    questionEl.textContent = question.question;

    feedbackEl.classList.remove('show');
    continueBtn.style.display = 'none';

    // Retrieve previous answer state for this question
    const answerState = GameState.getQuestionAnswerState(question.id);
    const isAlreadyAnswered = answerState?.answered ?? false;
    const userSelectedOption = answerState?.selectedOption ?? -1;
    const isUserCorrect = answerState?.correct ?? false;

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C'];

    question.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';

      let tagHtml = '';

      if (isAlreadyAnswered) {
        btn.disabled = true;

        if (index === userSelectedOption) {
          // Highlight the user's actual chosen answer
          btn.classList.add('user-selected');
          if (isUserCorrect) {
            btn.classList.add('correct');
            tagHtml = `<span class="quiz-option-tag tag-correct">${icon(Icons.checkCircle(12, 12))} Jawaban Kamu</span>`;
          } else {
            btn.classList.add('wrong');
            tagHtml = `<span class="quiz-option-tag tag-wrong">${icon(Icons.xCircle(12, 12))} Jawaban Kamu</span>`;
          }
        } else if (index === question.correctIndex && !isUserCorrect) {
          // Show the correct answer as educational key reference
          btn.classList.add('correct');
          tagHtml = `<span class="quiz-option-tag tag-key">${icon(Icons.checkCircle(12, 12))} Kunci Benar</span>`;
        }
      } else {
        btn.addEventListener('click', () => this.handleOptionSelect(index));
      }

      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[index]}</span>
        <span class="quiz-option-text" style="flex: 1; text-align: left;">${optText}</span>
        ${tagHtml}
      `;

      optionsContainer.appendChild(btn);
    });

    if (isAlreadyAnswered) {
      this.answeredCurrent = true;
      this.showFeedbackUI(isUserCorrect, true);
      continueBtn.style.display = 'inline-flex';
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

      if (idx === selectedIndex) {
        btn.classList.add('user-selected');
        if (isCorrect) {
          btn.classList.add('correct');
          btn.insertAdjacentHTML('beforeend', `<span class="quiz-option-tag tag-correct">${icon(Icons.checkCircle(12, 12))} Jawaban Kamu</span>`);
        } else {
          btn.classList.add('wrong');
          btn.insertAdjacentHTML('beforeend', `<span class="quiz-option-tag tag-wrong">${icon(Icons.xCircle(12, 12))} Jawaban Kamu</span>`);
        }
      } else if (idx === this.currentQuestion!.correctIndex && !isCorrect) {
        btn.classList.add('correct');
        btn.insertAdjacentHTML('beforeend', `<span class="quiz-option-tag tag-key">${icon(Icons.checkCircle(12, 12))} Kunci Benar</span>`);
      }
    });

    if (this.currentQuestion.id === 'q_kitchen_activities') {
      AudioSystem.playKeyFound();
    } else {
      isCorrect ? AudioSystem.playCorrect() : AudioSystem.playIncorrect();
    }

    this.showFeedbackUI(isCorrect, false);

    const continueBtn = this.container.querySelector('#quiz-btn-continue') as HTMLButtonElement;
    continueBtn.style.display = 'inline-flex';
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
      if (isCorrect) {
        feedbackEl.style.borderLeftColor = '#22c55e';
        titleEl.style.color = '#22c55e';
        titleEl.innerHTML = `${icon(Icons.checkCircle(16, 16), '#22c55e')} Pertanyaan ini sudah kamu selesaikan dengan Benar! (+10 Poin)`;
      } else {
        feedbackEl.style.borderLeftColor = '#ef4444';
        titleEl.style.color = '#f87171';
        titleEl.innerHTML = `${icon(Icons.alertTriangle(16, 16), '#f87171')} Pertanyaan ini sudah pernah dijawab (Jawabanmu belum tepat)`;
      }
    } else if (isCorrect) {
      feedbackEl.style.borderLeftColor = '#22c55e';
      titleEl.style.color = '#22c55e';
      titleEl.innerHTML = `${icon(Icons.checkCircle(16, 16), '#22c55e')} Hebat Sekali! Jawaban Benar! (+10 Poin)`;
    } else {
      feedbackEl.style.borderLeftColor = '#ef4444';
      titleEl.style.color = '#f87171';
      titleEl.innerHTML = `${icon(Icons.lightbulb(16, 16), '#f87171')} Belum Tepat! (0 Poin)`;
    }

    expEl.textContent = this.currentQuestion.explanation;
    clueEl.innerHTML = `${icon(Icons.compass(12, 12), '#38bdf8')} ${this.currentQuestion.clueText}`;
  }

  public close(): void {
    this.isOpen = false;
    this.container.classList.remove('active');
  }

  public destroy(): void {
    this.container.remove();
  }
}
