import { AudioSystem } from '../../systems/AudioSystem';
import { Icons, icon } from '../Icons';

export interface DialogData {
  title: string;
  avatarIcon: string;
  message: string;
  buttonText?: string;
  onContinue?: () => void;
}

export class DialogModal {
  private container: HTMLElement;
  private onContinueCallback?: () => void;
  public isOpen: boolean = false;
  private openTimestamp: number = 0;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'modal-overlay';
    this.container.id = 'modal-dialog';

    this.render();
    document.body.appendChild(this.container);
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="modal-box">
        <div class="dialog-header">
          <div class="dialog-avatar" id="dialog-avatar"></div>
          <div>
            <h2 class="dialog-name" id="dialog-title">NPC</h2>
            <div class="dialog-subtitle">Kerajaan Bintang</div>
          </div>
        </div>
        <div class="dialog-content" id="dialog-message">
          ...
        </div>
        <div class="dialog-actions">
          <button class="btn-primary" id="dialog-btn-continue" style="padding: 9px 18px; font-size: 0.85rem;">
            ${icon(Icons.arrowRight(14, 14))} Lanjutkan
          </button>
        </div>
      </div>
    `;
  }

  private triggerContinue(): void {
    const cb = this.onContinueCallback;
    this.onContinueCallback = undefined;
    this.close();
    if (cb) {
      cb();
    }
  }

  private bindEvents(): void {
    const btn = this.container.querySelector('#dialog-btn-continue') as HTMLButtonElement;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.triggerContinue();
    });

    window.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;

      // Ignore input within 180ms of opening to avoid instant skip from the interaction keypress
      if (Date.now() - this.openTimestamp < 180) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === ' ') {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.triggerContinue();
      }
    });
  }

  public show(data: DialogData): void {
    this.isOpen = true;
    this.openTimestamp = Date.now();
    this.onContinueCallback = data.onContinue;

    const avatarEl = this.container.querySelector('#dialog-avatar') as HTMLElement;
    const titleEl = this.container.querySelector('#dialog-title') as HTMLElement;
    const msgEl = this.container.querySelector('#dialog-message') as HTMLElement;
    const btn = this.container.querySelector('#dialog-btn-continue') as HTMLButtonElement;

    if (avatarEl) {
      let iconSvg = Icons.messageCircle(28, 28);
      let iconColor = '#f5a623';
      if (data.avatarIcon === 'key') {
        iconSvg = Icons.key(28, 28);
        iconColor = '#facc15';
      } else if (data.avatarIcon === 'crown') {
        iconSvg = Icons.crown(28, 28);
        iconColor = '#fbbf24';
      } else if (data.avatarIcon === 'lock') {
        iconSvg = Icons.lock(28, 28);
        iconColor = '#ef4444';
      } else if (data.avatarIcon === 'sword') {
        iconSvg = Icons.sword(28, 28);
        iconColor = '#f87171';
      } else if (data.avatarIcon === 'heal' || data.avatarIcon === 'fountain') {
        iconSvg = Icons.droplet(28, 28);
        iconColor = '#38bdf8';
      } else if (data.avatarIcon === 'search') {
        iconSvg = Icons.search(28, 28);
        iconColor = '#38bdf8';
      }
      avatarEl.innerHTML = icon(iconSvg, iconColor);
    }
    if (titleEl) titleEl.textContent = data.title;
    if (msgEl) msgEl.textContent = data.message;
    if (btn) btn.innerHTML = `${icon(Icons.arrowRight(14, 14))} ${data.buttonText || 'Lanjutkan'}`;

    this.container.classList.add('active');
    AudioSystem.playInteract();
  }

  public close(): void {
    this.isOpen = false;
    this.container.classList.remove('active');
  }

  public destroy(): void {
    this.container.remove();
  }
}
