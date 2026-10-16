import { Icons } from '../Icons';

export interface VirtualInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  attack: boolean;
}

export class TouchControls {
  private container: HTMLElement;
  public state: VirtualInputState = {
    up: false, down: false, left: false, right: false,
    interact: false, attack: false
  };

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'mobile-controls';

    this.render();
    document.body.appendChild(this.container);
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="touch-dpad">
        <div></div>
        <button class="dpad-btn" id="dpad-up" title="Atas">${Icons.arrowUp(20, 20)}</button>
        <div></div>
        <button class="dpad-btn" id="dpad-left" title="Kiri">${Icons.arrowLeft(20, 20)}</button>
        <div style="background: rgba(11,17,32,0.4); border-radius: 2px;"></div>
        <button class="dpad-btn" id="dpad-right" title="Kanan">${Icons.arrowRight(20, 20)}</button>
        <div></div>
        <button class="dpad-btn" id="dpad-down" title="Bawah">${Icons.arrowDown(20, 20)}</button>
        <div></div>
      </div>

      <div class="touch-actions">
        <button class="action-btn" id="touch-btn-interact" title="Interaksi (E)">
          E
        </button>
        <button class="action-btn attack-btn" id="touch-btn-attack" title="Serang (Spasi)">
          ${Icons.sword(22, 22)}
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    const bindBtn = (id: string, key: keyof VirtualInputState) => {
      const el = this.container.querySelector(`#${id}`) as HTMLElement;
      if (!el) return;

      el.addEventListener('pointerdown', (e) => { e.preventDefault(); this.state[key] = true; });
      el.addEventListener('pointerup',   (e) => { e.preventDefault(); this.state[key] = false; });
      el.addEventListener('pointercancel', (e) => { e.preventDefault(); this.state[key] = false; });
      el.addEventListener('pointerleave', (e) => { e.preventDefault(); this.state[key] = false; });
    };

    bindBtn('dpad-up',    'up');
    bindBtn('dpad-down',  'down');
    bindBtn('dpad-left',  'left');
    bindBtn('dpad-right', 'right');
    bindBtn('touch-btn-interact', 'interact');
    bindBtn('touch-btn-attack',   'attack');
  }

  public reset(): void {
    this.state.up = this.state.down = this.state.left = this.state.right =
    this.state.interact = this.state.attack = false;
  }

  public destroy(): void {
    this.container.remove();
  }
}
