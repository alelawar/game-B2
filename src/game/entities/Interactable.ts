import Phaser from 'phaser';
import { ObjectDef } from '../../data/maps';

export class Interactable extends Phaser.Physics.Arcade.Sprite {
  public dataDef: ObjectDef;

  constructor(scene: Phaser.Scene, def: ObjectDef) {
    const pixelX = def.x * 32 + 16;
    const pixelY = def.y * 32 + 16;
    super(scene, pixelX, pixelY, def.spriteKey);

    this.dataDef = def;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static obstacle

    this.setSize(26, 26);
    this.setOffset(3, 3);

    // Floating sparkle indicator for interactive objects
    const sparkle = scene.add.text(pixelX, pixelY - 18, '✨', {
      fontSize: '12px'
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: sparkle,
      y: pixelY - 24,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
