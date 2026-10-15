import Phaser from 'phaser';
import './ui/styles.css';
import { gameConfig } from './game/config';
import { RegistrationModal } from './ui/components/RegistrationModal';

let gameInstance: Phaser.Game | null = null;

function initApp(): void {
  // Setup Registration Modal
  const regModal = new RegistrationModal(() => {
    if (!gameInstance) {
      gameInstance = new Phaser.Game(gameConfig);
    }
  });

  (window as unknown as { registrationModal: RegistrationModal }).registrationModal = regModal;
}

window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
