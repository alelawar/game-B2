import Phaser from 'phaser';
import { NPCDef } from '../../data/maps';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public dataDef: NPCDef;
  public badgeText: Phaser.GameObjects.Text;
  private defaultLabel: string;
  private isHighlighted: boolean = false;

  constructor(scene: Phaser.Scene, def: NPCDef) {
    const pixelX = def.x * 32 + 16;
    const pixelY = def.y * 32 + 16;
    super(scene, pixelX, pixelY, def.spriteKey);

    this.dataDef = def;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body for collisions

    this.setSize(24, 24);
    this.setOffset(4, 8);

    // Idle subtle breath bobbing
    scene.tweens.add({
      targets: this,
      y: pixelY - 2,
      duration: 1200 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Short name for floating dialog badge
    const shortName = def.name.split(' ')[0] || def.name;
    this.defaultLabel = `💬 ${shortName}`;

    // Overhead floating dialog indicator badge
    this.badgeText = scene.add.text(pixelX, pixelY - 24, this.defaultLabel, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '6px',
      color: '#fef08a',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5).setDepth(16);

    // Bobbing tween for the badge
    scene.tweens.add({
      targets: this.badgeText,
      y: pixelY - 28,
      duration: 1000 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public setHighlighted(highlighted: boolean): void {
    if (this.isHighlighted === highlighted) return;
    this.isHighlighted = highlighted;

    if (highlighted) {
      this.badgeText.setText('💬 [Bicara]');
      this.badgeText.setBackgroundColor('#f5a623');
      this.badgeText.setColor('#0f172a');
      this.badgeText.setScale(1.15);
    } else {
      this.badgeText.setText(this.defaultLabel);
      this.badgeText.setBackgroundColor('rgba(15, 23, 42, 0.9)');
      this.badgeText.setColor('#fef08a');
      this.badgeText.setScale(1.0);
    }
  }

  public destroy(fromScene?: boolean): void {
    if (this.badgeText) {
      this.badgeText.destroy();
    }
    super.destroy(fromScene);
  }
}
