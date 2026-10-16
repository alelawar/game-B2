import { EDUCATIONAL_QUESTIONS, QuestionItem } from '../data/questions';

export type PlayerGrade = '3' | '4';

export enum QuestStage {
  TALK_TO_PRINCESS = 0,    // Need to talk to Princess in Village Square
  INVESTIGATE_AREAS = 1,   // Explore Garden & Castle, collect clues & key
  GATE_CHALLENGE = 2,      // Answer Gatekeeper's question to enter Secret Forest
  FOREST_EXPLORATION = 3,  // Fight monsters in forest, find ancient tablet
  RETRIEVE_CROWN = 4,      // Collect the Star Crown
  RETURN_TO_PRINCESS = 5,  // Return crown to Princess
  COMPLETED = 6            // Victory achieved
}

export interface QuestionAnswerState {
  answered: boolean;
  correct: boolean;
  selectedOption: number;
  awardedScore: number;
}

export type StateListener = () => void;

class GameStateManager {
  private static instance: GameStateManager;

  public playerName: string = '';
  public playerGrade: PlayerGrade = '3';
  public playerMaxHealth: number = 5;
  public playerHealth: number = 5;
  public score: number = 0;
  public questStage: QuestStage = QuestStage.TALK_TO_PRINCESS;
  public hasCrown: boolean = false;
  public hasForestKey: boolean = false;
  public isBossDefeated: boolean = false;
  public monstersDefeated: number = 0;
  public totalMonstersInForest: number = 3;

  public answeredQuestions: Map<string, QuestionAnswerState> = new Map();
  private listeners: Set<StateListener> = new Set();

  private constructor() {
    this.reset();
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public initPlayer(name: string, grade: PlayerGrade): void {
    this.playerName = name.trim();
    this.playerGrade = grade;
    this.notify();
  }

  public reset(): void {
    this.playerName = this.playerName || 'Prajurit Bintang';
    this.playerGrade = this.playerGrade || '3';
    this.playerHealth = 5;
    this.playerMaxHealth = 5;
    this.score = 0;
    this.questStage = QuestStage.TALK_TO_PRINCESS;
    this.hasCrown = false;
    this.hasForestKey = false;
    this.isBossDefeated = false;
    this.monstersDefeated = 0;
    this.answeredQuestions.clear();

    EDUCATIONAL_QUESTIONS.forEach(q => {
      this.answeredQuestions.set(q.id, {
        answered: false,
        correct: false,
        selectedOption: -1,
        awardedScore: 0
      });
    });

    this.notify();
  }

  public answerQuestion(questionId: string, selectedOption: number): { isCorrect: boolean; pointsEarned: number } {
    const existing = this.answeredQuestions.get(questionId);
    if (existing && existing.answered) {
      // Question already answered; do not award points again!
      return { isCorrect: existing.correct, pointsEarned: 0 };
    }

    const question = EDUCATIONAL_QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      return { isCorrect: false, pointsEarned: 0 };
    }

    const isCorrect = selectedOption === question.correctIndex;
    const pointsEarned = isCorrect ? 10 : 0;

    this.score += pointsEarned;
    this.answeredQuestions.set(questionId, {
      answered: true,
      correct: isCorrect,
      selectedOption,
      awardedScore: pointsEarned
    });

    // Handle quest progression hooks based on specific educational interactions
    if (questionId === 'q_kitchen_activities') {
      this.hasForestKey = true;
      this.setQuestStage(QuestStage.GATE_CHALLENGE);
    } else if (questionId === 'q_transportation') {
      this.setQuestStage(QuestStage.FOREST_EXPLORATION);
    } else if (questionId === 'q_present_continuous') {
      this.checkAltarReady();
    }

    this.notify();
    return { isCorrect, pointsEarned };
  }

  public checkAltarReady(): void {
    if (this.isBossDefeated && this.isQuestionAnswered('q_present_continuous')) {
      if (this.questStage < QuestStage.RETRIEVE_CROWN) {
        this.setQuestStage(QuestStage.RETRIEVE_CROWN);
      }
    }
  }

  public defeatBoss(): void {
    this.isBossDefeated = true;
    this.checkAltarReady();
    this.notify();
  }

  public isQuestionAnswered(questionId: string): boolean {
    return this.answeredQuestions.get(questionId)?.answered ?? false;
  }

  public getAnsweredCount(): number {
    let count = 0;
    for (const [, state] of this.answeredQuestions) {
      if (state.answered) count++;
    }
    return count;
  }

  public getCorrectCount(): number {
    let count = 0;
    for (const [, state] of this.answeredQuestions) {
      if (state.correct) count++;
    }
    return count;
  }

  public damagePlayer(amount: number = 1): boolean {
    this.playerHealth = Math.max(0, this.playerHealth - amount);
    this.notify();
    return this.playerHealth <= 0;
  }

  public healPlayer(amount: number = 1): void {
    this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + amount);
    this.notify();
  }

  public respawnPlayer(): void {
    this.playerHealth = this.playerMaxHealth;
    this.notify();
  }

  public setQuestStage(stage: QuestStage): void {
    if (stage > this.questStage) {
      this.questStage = stage;
      this.notify();
    }
  }

  public obtainCrown(): void {
    this.hasCrown = true;
    this.setQuestStage(QuestStage.RETURN_TO_PRINCESS);
    this.notify();
  }

  public completeQuest(): void {
    this.setQuestStage(QuestStage.COMPLETED);
    this.notify();
  }

  public getQuestObjectiveText(): string {
    switch (this.questStage) {
      case QuestStage.TALK_TO_PRINCESS:
        return '👑 Temui Putri Cahaya di tengah Alun-Alun Istana!';
      case QuestStage.INVESTIGATE_AREAS:
        if (!this.hasForestKey) {
          return '🔍 Cari petunjuk di Taman (Timur) dan Dapur Istana (Utara) untuk menemukan Kunci Hutan!';
        } else {
          return '🗝️ Kunci Hutan ditemukan! Bicaralah pada Penjaga Gerbang Hutan (Selatan)!';
        }
      case QuestStage.GATE_CHALLENGE:
        return '🚪 Bicaralah pada Penjaga Gerbang Hutan (Selatan) dan pecahkan tantangannya!';
      case QuestStage.FOREST_EXPLORATION:
        return '⚔️ Jelajahi Hutan Rahasia, kalahkan Monster Penjaga Hutan, dan pecahkan Prasasti Kuno!';
      case QuestStage.RETRIEVE_CROWN:
        return '✨ Altar suci telah terbuka! Ambil Mahkota Bintang di altar!';
      case QuestStage.RETURN_TO_PRINCESS:
        return '👑 Bawa Mahkota Bintang kembali ke Putri Cahaya di Alun-Alun Istana!';
      case QuestStage.COMPLETED:
        return '🎉 Selamat! Mahkota Bintang telah kembali dan Kerajaan bersuka cita!';
    }
  }
}

export const GameState = GameStateManager.getInstance();
