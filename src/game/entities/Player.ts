import Phaser from 'phaser';
import { GameState } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';
import { VirtualInputState } from '../../ui/components/TouchControls';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public speed: number = 160;
  public facing: 'up' | 'down' | 'left' | 'right' = 'down';
  public isAttacking: boolean = false;
  public isInvulnerable: boolean = false;
  private attackHitbox: Phaser.GameObjects.Rectangle | null = null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
  };
  private virtualInput?: VirtualInputState;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(20, 20);
    this.setOffset(6, 12);

    this.setupInput();
  }

  public setVirtualInput(input: VirtualInputState): void {
    this.virtualInput = input;
  }

  private setupInput(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        w: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        e: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      };
    }
  }

  public updatePlayer(canMove: boolean = true): { attackTriggered: boolean; interactTriggered: boolean } {
    let attackTriggered = false;
    let interactTriggered = false;

    if (!canMove || this.isAttacking) {
      this.setVelocity(0, 0);
      return { attackTriggered, interactTriggered };
    }

    const up = this.cursors?.up.isDown || this.wasdKeys?.w.isDown || this.virtualInput?.up;
    const down = this.cursors?.down.isDown || this.wasdKeys?.s.isDown || this.virtualInput?.down;
    const left = this.cursors?.left.isDown || this.wasdKeys?.a.isDown || this.virtualInput?.left;
    const right = this.cursors?.right.isDown || this.wasdKeys?.d.isDown || this.virtualInput?.right;

    let vx = 0;
    let vy = 0;

    if (left) {
      vx -= this.speed;
      this.facing = 'left';
      this.setFlipX(true);
    } else if (right) {
      vx += this.speed;
      this.facing = 'right';
      this.setFlipX(false);
    }

    if (up) {
      vy -= this.speed;
      this.facing = 'up';
    } else if (down) {
      vy += this.speed;
      this.facing = 'down';
    }

    // Normalize diagonal speed
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.setVelocity(vx, vy);

    // Subtle walk bobbing
    if (vx !== 0 || vy !== 0) {
      const bob = Math.sin(this.scene.time.now / 120) * 1.5;
      this.setAngle(bob * 2);
    } else {
      this.setAngle(0);
    }

    // Attack triggers (Space or touch)
    if (
      Phaser.Input.Keyboard.JustDown(this.wasdKeys.space) ||
      (this.virtualInput && this.virtualInput.attack)
    ) {
      if (this.virtualInput) this.virtualInput.attack = false;
      attackTriggered = true;
      this.executeAttack();
    }

    // Interact triggers (E or touch)
    if (
      Phaser.Input.Keyboard.JustDown(this.wasdKeys.e) ||
      (this.virtualInput && this.virtualInput.interact)
    ) {
      if (this.virtualInput) this.virtualInput.interact = false;
      interactTriggered = true;
    }

    return { attackTriggered, interactTriggered };
  }

  public executeAttack(): void {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.setVelocity(0, 0);

    AudioSystem.playSwing();

    // Determine slash offset based on facing direction
    let offsetX = 0;
    let offsetY = 0;
    let angle = 0;

    switch (this.facing) {
      case 'up':
        offsetY = -24;
        angle = -90;
        break;
      case 'down':
        offsetY = 24;
        angle = 90;
        break;
      case 'left':
        offsetX = -24;
        angle = 180;
        break;
      case 'right':
        offsetX = 24;
        angle = 0;
        break;
    }

    // Slash visual sprite
    const slash = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, 'fx_slash');
    slash.setAngle(angle);
    slash.setDepth(this.depth + 1);

    this.scene.tweens.add({
      targets: slash,
      scaleX: 1.4,
      scaleY: 1.4,
      alpha: 0,
      duration: 180,
      onComplete: () => slash.destroy()
    });

    // Create attack collision sensor
    this.attackHitbox = this.scene.add.rectangle(this.x + offsetX, this.y + offsetY, 28, 28);
    this.scene.physics.add.existing(this.attackHitbox);
    const body = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    // End attack after 200ms
    this.scene.time.delayedCall(200, () => {
      if (this.attackHitbox) {
        this.attackHitbox.destroy();
        this.attackHitbox = null;
      }
      this.isAttacking = false;
    });
  }

  public getAttackHitbox(): Phaser.GameObjects.Rectangle | null {
    return this.attackHitbox;
  }

  public takeDamage(fromX: number, fromY: number): boolean {
    if (this.isInvulnerable) return false;

    this.isInvulnerable = true;
    AudioSystem.playPlayerHurt();

    const isDead = GameState.damagePlayer(1);

    // Knockback
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.setVelocity(Math.cos(angle) * 180, Math.sin(angle) * 180);

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.alpha = 1;
        this.isInvulnerable = false;
      }
    });

    return isDead;
  }
}
