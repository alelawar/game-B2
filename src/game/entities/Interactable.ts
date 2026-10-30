import Phaser from 'phaser';
import { ObjectDef } from '../../data/maps';

export class Interactable extends Phaser.Physics.Arcade.Sprite {
  public dataDef: ObjectDef;
  public badgeText: Phaser.GameObjects.Text;
  private defaultLabel: string;
  private isHighlighted: boolean = false;

  constructor(scene: Phaser.Scene, def: ObjectDef) {
    const pixelX = def.x * 32 + 16;
    const pixelY = def.y * 32 + 16;
    super(scene, pixelX, pixelY, def.spriteKey);

    this.dataDef = def;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static obstacle

    this.setSize(26, 26);
    this.setOffset(3, 3);

    // Contextual icon and short name
    let iconStr = '🔍';
    if (def.isCrownAltar) iconStr = '👑';
    else if (def.id.includes('fountain')) iconStr = '💧';
    else if (def.id.includes('sink')) iconStr = '🗝️';
    else if (def.id.includes('tablet')) iconStr = '✨';
    else if (def.id.includes('cat')) iconStr = '🐱';

    const shortName = def.name.split(' ')[0] || def.name;
    this.defaultLabel = `${iconStr} ${shortName}`;

    // Floating overhead badge
    this.badgeText = scene.add.text(pixelX, pixelY - 24, this.defaultLabel, {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '6px',
      color: '#e2e8f0',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      padding: { x: 5, y: 3 }
    }).setOrigin(0.5).setDepth(16);

    scene.tweens.add({
      targets: this.badgeText,
      y: pixelY - 28,
      duration: 1100 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public setHighlighted(highlighted: boolean): void {
    if (this.isHighlighted === highlighted) return;
    this.isHighlighted = highlighted;

    if (highlighted) {
      this.badgeText.setText('🔍 [Periksa]');
      this.badgeText.setBackgroundColor('#38bdf8');
      this.badgeText.setColor('#0f172a');
      this.badgeText.setScale(1.15);
    } else {
      this.badgeText.setText(this.defaultLabel);
      this.badgeText.setBackgroundColor('rgba(15, 23, 42, 0.9)');
      this.badgeText.setColor('#e2e8f0');
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
