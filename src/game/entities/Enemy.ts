import Phaser from 'phaser';
import { EnemyDef } from '../../data/maps';
import { AudioSystem } from '../../systems/AudioSystem';
import { GameState } from '../../systems/GameState';
import { Player } from './Player';

type AttackPattern = 'chase' | 'charge' | 'circle' | 'lunge';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public enemyDef: EnemyDef;
  public currentHealth: number;
  public maxHealth: number;

  private isDead: boolean = false;
  private isHurt: boolean = false;
  private aggroRange: number = 140;
  private moveSpeed: number = 50;

  // HP bar graphics (Phaser objects)
  private hpBarBg!: Phaser.GameObjects.Rectangle;
  private hpBarFill!: Phaser.GameObjects.Rectangle;

  // Attack pattern state
  private pattern: AttackPattern;
  private patternTimer: number = 0;
  private patternInterval: number = 3000; // ms between pattern switches
  private isCharging: boolean = false;
  private chargeTargetX: number = 0;
  private chargeTargetY: number = 0;
  private circleAngle: number = 0;
  private attackCooldown: number = 0;
  private readonly ATTACK_COOLDOWN_MS = 1200;

  constructor(scene: Phaser.Scene, def: EnemyDef) {
    const pixelX = def.x * 32 + 16;
    const pixelY = def.y * 32 + 16;
    const spriteKey = def.type === 'boss' ? 'enemy_boss' : 'enemy_slime';
    super(scene, pixelX, pixelY, spriteKey);

    this.enemyDef = def;
    this.maxHealth = def.health;
    this.currentHealth = def.health;

    // Boss gets stronger stats
    if (def.type === 'boss') {
      this.moveSpeed = 40;
      this.aggroRange = 200;
      this.patternInterval = 2200;
    }

    // Pick an initial attack pattern randomly
    this.pattern = this.randomPattern();
    this.circleAngle = Math.random() * Math.PI * 2;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setSize(def.type === 'boss' ? 28 : 18, def.type === 'boss' ? 28 : 16);
    this.setDepth(9);

    // HP Bar (drawn above enemy in world space)
    const barW = def.type === 'boss' ? 36 : 24;
    this.hpBarBg = scene.add.rectangle(pixelX, pixelY - 18, barW, 5, 0x1e293b)
      .setDepth(20)
      .setStrokeStyle(1, 0x334155);
    this.hpBarFill = scene.add.rectangle(pixelX - barW / 2 + barW / 2, pixelY - 18, barW, 5, 0xef4444)
      .setDepth(21)
      .setOrigin(0.5, 0.5);

    // Breathing idle animation
    scene.tweens.add({
      targets: this,
      scaleX: 1.06,
      scaleY: 0.94,
      duration: 700 + Math.random() * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private randomPattern(): AttackPattern {
    const options: AttackPattern[] = ['chase', 'charge', 'circle', 'lunge'];
    return options[Math.floor(Math.random() * options.length)];
  }

  public updateEnemy(player: Player, delta: number): void {
    if (this.isDead || this.isHurt) {
      this.updateHpBar();
      return;
    }

    // Update attack cooldown
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    // Switch pattern periodically when in aggro range
    if (dist < this.aggroRange) {
      this.patternTimer += delta;
      if (this.patternTimer >= this.patternInterval) {
        this.patternTimer = 0;
        this.pattern = this.randomPattern();
        this.isCharging = false;
        // Brief visual flash on pattern switch
        this.setTint(0xffff00);
        this.scene.time.delayedCall(120, () => this.clearTint());
      }

      this.executePattern(player, dist, delta);
    } else {
      // Wander in place or stay
      this.setVelocity(0, 0);
    }

    this.updateHpBar();
    this.flipX = this.body!.velocity.x > 0;
  }

  private executePattern(player: Player, dist: number, delta: number): void {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    switch (this.pattern) {
      case 'chase':
        // Basic: always chase
        if (dist > 14) {
          this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
        } else {
          this.setVelocity(0, 0);
        }
        break;

      case 'charge':
        // Pause, then dash quickly toward player
        if (!this.isCharging) {
          // Pause & aim
          this.setVelocity(0, 0);
          if (this.patternTimer > this.patternInterval * 0.4) {
            // Begin charge
            this.isCharging = true;
            this.chargeTargetX = player.x;
            this.chargeTargetY = player.y;
            const chargeAngle = Phaser.Math.Angle.Between(this.x, this.y, this.chargeTargetX, this.chargeTargetY);
            this.setVelocity(Math.cos(chargeAngle) * this.moveSpeed * 3.2, Math.sin(chargeAngle) * this.moveSpeed * 3.2);
            // Visual: turn red briefly when charging
            this.setTint(0xff6600);
            this.scene.time.delayedCall(350, () => { this.clearTint(); this.isCharging = false; });
          }
        }
        break;

      case 'circle':
        // Orbit around player at medium distance
        this.circleAngle += delta * 0.0022;
        const orbitRadius = 55;
        const targetX = player.x + Math.cos(this.circleAngle) * orbitRadius;
        const targetY = player.y + Math.sin(this.circleAngle) * orbitRadius;
        const orbitAngle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const orbitDist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);
        if (orbitDist > 8) {
          this.setVelocity(Math.cos(orbitAngle) * this.moveSpeed * 0.9, Math.sin(orbitAngle) * this.moveSpeed * 0.9);
        } else {
          this.setVelocity(0, 0);
        }
        break;

      case 'lunge':
        // Zigzag approach: alternate left/right offset
        const zigzagOffset = Math.sin(this.patternTimer * 0.006) * 40;
        const perp = angle + Math.PI / 2;
        const lx = Math.cos(angle) * this.moveSpeed + Math.cos(perp) * zigzagOffset * 0.05;
        const ly = Math.sin(angle) * this.moveSpeed + Math.sin(perp) * zigzagOffset * 0.05;
        if (dist > 14) {
          this.setVelocity(lx, ly);
        } else {
          this.setVelocity(0, 0);
        }
        break;
    }
  }

  private updateHpBar(): void {
    if (!this.active) return;
    const barW = this.enemyDef.type === 'boss' ? 36 : 24;
    const ratio = Math.max(0, this.currentHealth / this.maxHealth);
    const fillW = barW * ratio;

    this.hpBarBg.setPosition(this.x, this.y - 18);
    this.hpBarFill.setPosition(this.x - barW / 2 + fillW / 2, this.y - 18);
    this.hpBarFill.width = fillW;

    // Color: green > yellow > red
    if (ratio > 0.6) this.hpBarFill.setFillStyle(0x22c55e);
    else if (ratio > 0.3) this.hpBarFill.setFillStyle(0xf59e0b);
    else this.hpBarFill.setFillStyle(0xef4444);
  }

  public takeDamage(fromX: number, fromY: number): void {
    if (this.isDead || this.isHurt) return;

    this.isHurt = true;
    this.currentHealth -= 1;
    AudioSystem.playHit();

    // Knockback
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.setVelocity(Math.cos(angle) * 130, Math.sin(angle) * 130);

    // Damage number popup
    const dmgText = this.scene.add.text(this.x + Phaser.Math.Between(-8, 8), this.y - 10, '-1', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '8px',
      color: '#ef4444',
      stroke: '#000',
      strokeThickness: 2
    }).setDepth(30).setOrigin(0.5);

    this.scene.tweens.add({
      targets: dmgText,
      y: dmgText.y - 18,
      alpha: 0,
      duration: 500,
      onComplete: () => dmgText.destroy()
    });

    // Flash white → red → clear
    this.setTint(0xffffff);
    this.scene.time.delayedCall(60, () => this.setTint(0xff3333));
    this.scene.time.delayedCall(180, () => {
      this.clearTint();
      this.isHurt = false;
    });

    this.updateHpBar();

    if (this.currentHealth <= 0) {
      this.defeat();
    }
  }

  private defeat(): void {
    this.isDead = true;
    this.setVelocity(0, 0);
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body) body.enable = false;

    GameState.monstersDefeated += 1;
    if (this.enemyDef.id === 'boss_guardian') {
      GameState.defeatBoss();
    }

    // Hide HP bar
    this.hpBarBg.destroy();
    this.hpBarFill.destroy();

    // Poof particles (colored squares, no emoji)
    const colors = [0x22c55e, 0x60a5fa, 0xf59e0b, 0xffffff];
    for (let i = 0; i < 8; i++) {
      const px = this.x + Phaser.Math.Between(-20, 20);
      const py = this.y + Phaser.Math.Between(-20, 20);
      const color = colors[i % colors.length];
      const particle = this.scene.add.rectangle(px, py, Phaser.Math.Between(4, 8), Phaser.Math.Between(4, 8), color)
        .setDepth(25);
      this.scene.tweens.add({
        targets: particle,
        x: px + Phaser.Math.Between(-30, 30),
        y: py - Phaser.Math.Between(20, 40),
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: 400 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Drop a heal crystal with probability
    const dropChance = this.enemyDef.type === 'boss' ? 1.0 : 0.4;
    if (Math.random() < dropChance) {
      this.spawnHealDrop();
    }

    // Defeat text for boss
    if (this.enemyDef.type === 'boss') {
      const bossDefeated = this.scene.add.text(this.x, this.y - 20, 'KALAH!', {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '10px',
        color: '#f59e0b',
        stroke: '#000',
        strokeThickness: 3
      }).setDepth(30).setOrigin(0.5);
      this.scene.tweens.add({
        targets: bossDefeated,
        y: bossDefeated.y - 30,
        alpha: 0,
        duration: 1200,
        onComplete: () => bossDefeated.destroy()
      });
    }

    // Shrink & disappear
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 280,
      onComplete: () => { this.destroy(); }
    });
  }

  private spawnHealDrop(): void {
    const texKey = 'item_heal_drop';
    if (!this.scene.textures.exists(texKey)) {
      const { canvas, ctx } = this.makeCanvas(12, 12);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(4, 0, 4, 12);
      ctx.fillRect(0, 4, 12, 4);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(5, 1, 2, 10);
      ctx.fillRect(1, 5, 10, 2);
      this.scene.textures.addCanvas(texKey, canvas);
    }

    const drop = this.scene.physics.add.sprite(this.x, this.y, texKey)
      .setDepth(7)
      .setScale(2);

    // Hover animation
    this.scene.tweens.add({
      targets: drop,
      y: drop.y - 6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Auto-destroy after 8 seconds
    this.scene.time.delayedCall(8000, () => {
      if (drop.active) {
        this.scene.tweens.add({
          targets: drop,
          alpha: 0,
          duration: 500,
          onComplete: () => drop.destroy()
        });
      }
    });

    // Store ref on the drop so WorldScene can pick it up
    (drop as unknown as { isHealDrop: boolean; healAmount: number }).isHealDrop = true;
    (drop as unknown as { isHealDrop: boolean; healAmount: number }).healAmount = this.enemyDef.type === 'boss' ? 3 : 1;

    // Register with scene for pickup
    const scene = this.scene as { healDrops?: Phaser.Physics.Arcade.Sprite[] };
    if (!scene.healDrops) scene.healDrops = [];
    scene.healDrops.push(drop);
  }

  private makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  public getIsDead(): boolean {
    return this.isDead;
  }

  public destroy(fromScene?: boolean): void {
    // Clean up HP bar if not already destroyed
    try { this.hpBarBg?.destroy(); } catch { /* */ }
    try { this.hpBarFill?.destroy(); } catch { /* */ }
    super.destroy(fromScene);
  }
}
