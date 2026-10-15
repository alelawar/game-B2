import { AudioSystem } from '../../systems/AudioSystem';

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
          <div class="dialog-avatar" id="dialog-avatar">👑</div>
          <div>
            <h2 class="dialog-name" id="dialog-title">Putri Cahaya</h2>
            <div style="font-size: 0.8rem; color: #94a3b8;">Kerajaan Bintang</div>
          </div>
        </div>
        <div class="dialog-content" id="dialog-message">
          Prajurit! Mahkota Bintang hilang!
        </div>
        <div class="dialog-actions">
          <button class="btn-primary" id="dialog-btn-continue" style="padding: 10px 24px; font-size: 1rem;">
            Lanjutkan ➡️
          </button>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    const btn = this.container.querySelector('#dialog-btn-continue') as HTMLButtonElement;
    btn.addEventListener('click', () => {
      this.close();
      if (this.onContinueCallback) {
        this.onContinueCallback();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (this.isOpen && (e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === ' ')) {
        e.preventDefault();
        this.close();
        if (this.onContinueCallback) {
          this.onContinueCallback();
        }
      }
    });
  }

  public show(data: DialogData): void {
    this.isOpen = true;
    this.onContinueCallback = data.onContinue;

    const avatarEl = this.container.querySelector('#dialog-avatar') as HTMLElement;
    const titleEl = this.container.querySelector('#dialog-title') as HTMLElement;
    const msgEl = this.container.querySelector('#dialog-message') as HTMLElement;
    const btn = this.container.querySelector('#dialog-btn-continue') as HTMLButtonElement;

    if (avatarEl) avatarEl.textContent = data.avatarIcon || '💬';
    if (titleEl) titleEl.textContent = data.title;
    if (msgEl) msgEl.textContent = data.message;
    if (btn) btn.textContent = data.buttonText || 'Lanjutkan ➡️';

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
