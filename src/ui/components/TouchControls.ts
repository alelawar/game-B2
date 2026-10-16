import { Icons } from '../Icons';

export interface VirtualInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  attack: boolean;
  vector: { x: number; y: number };
}

export class TouchControls {
  private container: HTMLElement;
  public state: VirtualInputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    interact: false,
    attack: false,
    vector: { x: 0, y: 0 }
  };

  private joystickBase!: HTMLElement;
  private joystickKnob!: HTMLElement;
  private notchUp!: HTMLElement;
  private notchDown!: HTMLElement;
  private notchLeft!: HTMLElement;
  private notchRight!: HTMLElement;

  private isPointerDragging = false;
  private activePointerId: number | null = null;
  private baseCenterX = 0;
  private baseCenterY = 0;
  private maxRadius = 38;

  // Desktop keyboard tracking
  private activeKeys = new Set<string>();
  private keydownHandler?: (e: KeyboardEvent) => void;
  private keyupHandler?: (e: KeyboardEvent) => void;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'game-controls';

    this.render();
    document.body.appendChild(this.container);
    this.cacheElements();
    this.bindJoystickEvents();
    this.bindActionEvents();
    this.bindKeyboardSync();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="virtual-joystick-zone" id="joystick-zone">
        <div class="virtual-joystick" id="virtual-joystick">
          <div class="joystick-base" id="joystick-base">
            <div class="joystick-ring"></div>
            <div class="joystick-axis-marker axis-up" id="notch-up">▲</div>
            <div class="joystick-axis-marker axis-down" id="notch-down">▼</div>
            <div class="joystick-axis-marker axis-left" id="notch-left">◀</div>
            <div class="joystick-axis-marker axis-right" id="notch-right">▶</div>
            <div class="joystick-knob" id="joystick-knob">
              <div class="joystick-knob-core"></div>
            </div>
          </div>
        </div>
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

  private cacheElements(): void {
    this.joystickBase = this.container.querySelector('#joystick-base') as HTMLElement;
    this.joystickKnob = this.container.querySelector('#joystick-knob') as HTMLElement;
    this.notchUp = this.container.querySelector('#notch-up') as HTMLElement;
    this.notchDown = this.container.querySelector('#notch-down') as HTMLElement;
    this.notchLeft = this.container.querySelector('#notch-left') as HTMLElement;
    this.notchRight = this.container.querySelector('#notch-right') as HTMLElement;
  }

  private bindJoystickEvents(): void {
    const onPointerDown = (e: PointerEvent) => {
      // Don't hijack right-click
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      e.preventDefault();
      this.isPointerDragging = true;
      this.activePointerId = e.pointerId;

      this.joystickBase.classList.add('active-touch');
      this.joystickKnob.classList.add('dragging');

      try {
        this.joystickBase.setPointerCapture(e.pointerId);
      } catch {
        // Fallback if pointer capture fails
      }

      const rect = this.joystickBase.getBoundingClientRect();
      this.baseCenterX = rect.left + rect.width / 2;
      this.baseCenterY = rect.top + rect.height / 2;
      this.maxRadius = Math.max(28, rect.width / 2 - 16);

      this.updateJoystickPosition(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isPointerDragging || e.pointerId !== this.activePointerId) return;
      e.preventDefault();
      this.updateJoystickPosition(e.clientX, e.clientY);
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (e.pointerId !== this.activePointerId && this.activePointerId !== null) return;
      this.releaseJoystick();
    };

    this.joystickBase.addEventListener('pointerdown', onPointerDown);
    this.joystickBase.addEventListener('pointermove', onPointerMove);
    this.joystickBase.addEventListener('pointerup', onPointerEnd);
    this.joystickBase.addEventListener('pointercancel', onPointerEnd);
    this.joystickBase.addEventListener('lostpointercapture', () => this.releaseJoystick());
    window.addEventListener('pointerup', () => this.releaseJoystick());
    window.addEventListener('blur', () => this.reset());
  }

  private updateJoystickPosition(clientX: number, clientY: number): void {
    const rawDx = clientX - this.baseCenterX;
    const rawDy = clientY - this.baseCenterY;
    const distance = Math.hypot(rawDx, rawDy);

    let dx = rawDx;
    let dy = rawDy;

    if (distance > this.maxRadius) {
      dx = (rawDx / distance) * this.maxRadius;
      dy = (rawDy / distance) * this.maxRadius;
    }

    // Position knob
    this.joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;

    // Normalized vector (-1 to 1)
    const normX = this.maxRadius > 0 ? dx / this.maxRadius : 0;
    const normY = this.maxRadius > 0 ? dy / this.maxRadius : 0;

    this.state.vector.x = normX;
    this.state.vector.y = normY;

    // Digital flags
    this.state.up = normY < -0.3;
    this.state.down = normY > 0.3;
    this.state.left = normX < -0.3;
    this.state.right = normX > 0.3;

    this.updateNotches(this.state.up, this.state.down, this.state.left, this.state.right);
  }

  private releaseJoystick(): void {
    if (!this.isPointerDragging) return;
    this.isPointerDragging = false;
    this.activePointerId = null;

    this.joystickBase.classList.remove('active-touch');
    this.joystickKnob.classList.remove('dragging');

    // Smooth recoil
    this.joystickKnob.style.transform = 'translate(0px, 0px)';

    this.state.vector.x = 0;
    this.state.vector.y = 0;
    this.state.up = false;
    this.state.down = false;
    this.state.left = false;
    this.state.right = false;

    this.updateNotches(false, false, false, false);

    // If keyboard keys are still pressed, sync back to keyboard direction
    this.syncKeyboardToJoystick();
  }

  private updateNotches(up: boolean, down: boolean, left: boolean, right: boolean): void {
    this.notchUp?.classList.toggle('active', up);
    this.notchDown?.classList.toggle('active', down);
    this.notchLeft?.classList.toggle('active', left);
    this.notchRight?.classList.toggle('active', right);
  }

  private bindActionEvents(): void {
    const bindBtn = (id: string, key: 'attack' | 'interact') => {
      const el = this.container.querySelector(`#${id}`) as HTMLElement;
      if (!el) return;

      const triggerDown = (e: Event) => {
        e.preventDefault();
        this.state[key] = true;
        el.classList.add('pressed');
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(12); } catch { /* ignore */ }
        }
      };

      const triggerUp = (e: Event) => {
        e.preventDefault();
        this.state[key] = false;
        el.classList.remove('pressed');
      };

      el.addEventListener('pointerdown', triggerDown);
      el.addEventListener('pointerup', triggerUp);
      el.addEventListener('pointercancel', triggerUp);
      el.addEventListener('pointerleave', triggerUp);
    };

    bindBtn('touch-btn-attack', 'attack');
    bindBtn('touch-btn-interact', 'interact');
  }

  /**
   * Synchronizes desktop keyboard inputs (WASD / Arrows / Space / E)
   * so the analog stick and buttons visibly respond in real-time on desktop.
   */
  private bindKeyboardSync(): void {
    const isTyping = (target: EventTarget | null) => {
      return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    };

    this.keydownHandler = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      const code = e.code;
      let changed = false;

      if (code === 'KeyW' || code === 'ArrowUp') {
        this.activeKeys.add('up');
        changed = true;
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        this.activeKeys.add('down');
        changed = true;
      } else if (code === 'KeyA' || code === 'ArrowLeft') {
        this.activeKeys.add('left');
        changed = true;
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        this.activeKeys.add('right');
        changed = true;
      }

      // Visual feedback for action buttons on desktop
      if (code === 'Space') {
        const attackBtn = this.container.querySelector('#touch-btn-attack');
        attackBtn?.classList.add('pressed');
      } else if (code === 'KeyE') {
        const interactBtn = this.container.querySelector('#touch-btn-interact');
        interactBtn?.classList.add('pressed');
      }

      if (changed && !this.isPointerDragging) {
        this.syncKeyboardToJoystick();
      }
    };

    this.keyupHandler = (e: KeyboardEvent) => {
      const code = e.code;
      let changed = false;

      if (code === 'KeyW' || code === 'ArrowUp') {
        this.activeKeys.delete('up');
        changed = true;
      } else if (code === 'KeyS' || code === 'ArrowDown') {
        this.activeKeys.delete('down');
        changed = true;
      } else if (code === 'KeyA' || code === 'ArrowLeft') {
        this.activeKeys.delete('left');
        changed = true;
      } else if (code === 'KeyD' || code === 'ArrowRight') {
        this.activeKeys.delete('right');
        changed = true;
      }

      if (code === 'Space') {
        const attackBtn = this.container.querySelector('#touch-btn-attack');
        attackBtn?.classList.remove('pressed');
      } else if (code === 'KeyE') {
        const interactBtn = this.container.querySelector('#touch-btn-interact');
        interactBtn?.classList.remove('pressed');
      }

      if (changed && !this.isPointerDragging) {
        this.syncKeyboardToJoystick();
      }
    };

    window.addEventListener('keydown', this.keydownHandler);
    window.addEventListener('keyup', this.keyupHandler);
  }

  private syncKeyboardToJoystick(): void {
    if (this.isPointerDragging) return;

    const up = this.activeKeys.has('up');
    const down = this.activeKeys.has('down');
    const left = this.activeKeys.has('left');
    const right = this.activeKeys.has('right');

    let kx = (right ? 1 : 0) - (left ? 1 : 0);
    let ky = (down ? 1 : 0) - (up ? 1 : 0);

    if (kx !== 0 && ky !== 0) {
      kx *= 0.7071;
      ky *= 0.7071;
    }

    const rect = this.joystickBase.getBoundingClientRect();
    const radius = Math.max(28, (rect.width || 110) / 2 - 16);
    const targetX = kx * radius;
    const targetY = ky * radius;

    if (kx !== 0 || ky !== 0) {
      this.joystickBase.classList.add('active-key');
      this.joystickKnob.classList.add('key-moving');
      this.joystickKnob.style.transform = `translate(${targetX}px, ${targetY}px)`;
    } else {
      this.joystickBase.classList.remove('active-key');
      this.joystickKnob.classList.remove('key-moving');
      this.joystickKnob.style.transform = 'translate(0px, 0px)';
    }

    this.updateNotches(up, down, left, right);
  }

  public reset(): void {
    this.activeKeys.clear();
    this.releaseJoystick();
    this.state.up = this.state.down = this.state.left = this.state.right =
    this.state.interact = this.state.attack = false;
    this.state.vector.x = 0;
    this.state.vector.y = 0;
  }

  public destroy(): void {
    if (this.keydownHandler) window.removeEventListener('keydown', this.keydownHandler);
    if (this.keyupHandler) window.removeEventListener('keyup', this.keyupHandler);
    this.container.remove();
  }
}
