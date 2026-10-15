import Phaser from 'phaser';
import { EnemyDef } from '../../data/maps';
import { AudioSystem } from '../../systems/AudioSystem';
import { GameState } from '../../systems/GameState';
import { Player } from './Player';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public enemyDef: EnemyDef;
  public currentHealth: number;
  private isDead: boolean = false;
  private isHurt: boolean = false;
  private aggroRange: number = 140;
  private moveSpeed: number = 45;

  constructor(scene: Phaser.Scene, def: EnemyDef) {
    const pixelX = def.x * 32 + 16;
    const pixelY = def.y * 32 + 16;
    const spriteKey = def.type === 'boss' ? 'enemy_boss' : 'enemy_slime';
    super(scene, pixelX, pixelY, spriteKey);

    this.enemyDef = def;
    this.currentHealth = def.health;

    if (def.type === 'boss') {
      this.moveSpeed = 35;
      this.aggroRange = 180;
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setSize(def.type === 'boss' ? 28 : 18, def.type === 'boss' ? 28 : 16);

    // Subtle squishy breathing tween
    scene.tweens.add({
      targets: this,
      scaleX: 1.08,
      scaleY: 0.92,
      duration: 600 + Math.random() * 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public updateEnemy(player: Player): void {
    if (this.isDead || this.isHurt) {
      return;
    }

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

    if (dist < this.aggroRange && dist > 18) {
      // Move toward player
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      this.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed);
      if (this.x < player.x) {
        this.setFlipX(true);
      } else {
        this.setFlipX(false);
      }
    } else {
      this.setVelocity(0, 0);
    }
  }

  public takeDamage(fromX: number, fromY: number): void {
    if (this.isDead || this.isHurt) return;

    this.isHurt = true;
    this.currentHealth -= 1;
    AudioSystem.playHit();

    // Knockback
    const angle = Phaser.Math.Angle.Between(fromX, fromY, this.x, this.y);
    this.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);

    // Flash Red
    this.setTint(0xff3333);
    this.scene.time.delayedCall(150, () => {
      this.clearTint();
      this.isHurt = false;
    });

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

    // Victory poof particles
    for (let i = 0; i < 6; i++) {
      const p = this.scene.add.text(this.x + (Math.random() - 0.5) * 20, this.y + (Math.random() - 0.5) * 20, '💨', {
        fontSize: '14px'
      }).setOrigin(0.5);

      this.scene.tweens.add({
        targets: p,
        y: p.y - 20,
        alpha: 0,
        duration: 400 + Math.random() * 200,
        onComplete: () => p.destroy()
      });
    }

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }

  public getIsDead(): boolean {
    return this.isDead;
  }
}
