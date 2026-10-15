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
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    attack: false
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
        <button class="dpad-btn" id="dpad-up">⬆️</button>
        <div></div>
        <button class="dpad-btn" id="dpad-left">⬅️</button>
        <div></div>
        <button class="dpad-btn" id="dpad-right">➡️</button>
        <div></div>
        <button class="dpad-btn" id="dpad-down">⬇️</button>
        <div></div>
      </div>

      <div class="touch-actions">
        <button class="action-btn" id="touch-btn-interact" title="Interaksi (E)">
          E
        </button>
        <button class="action-btn attack-btn" id="touch-btn-attack" title="Serang (Spasi)">
          ⚔️
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    const bindBtn = (id: string, key: keyof VirtualInputState) => {
      const el = this.container.querySelector(`#${id}`) as HTMLElement;
      if (!el) return;

      const setVal = (val: boolean) => {
        this.state[key] = val;
      };

      el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        setVal(true);
      });
      el.addEventListener('pointerup', (e) => {
        e.preventDefault();
        setVal(false);
      });
      el.addEventListener('pointercancel', (e) => {
        e.preventDefault();
        setVal(false);
      });
      el.addEventListener('pointerleave', (e) => {
        e.preventDefault();
        setVal(false);
      });
    };

    bindBtn('dpad-up', 'up');
    bindBtn('dpad-down', 'down');
    bindBtn('dpad-left', 'left');
    bindBtn('dpad-right', 'right');
    bindBtn('touch-btn-interact', 'interact');
    bindBtn('touch-btn-attack', 'attack');
  }

  public reset(): void {
    this.state.up = false;
    this.state.down = false;
    this.state.left = false;
    this.state.right = false;
    this.state.interact = false;
    this.state.attack = false;
  }

  public destroy(): void {
    this.container.remove();
  }
}
