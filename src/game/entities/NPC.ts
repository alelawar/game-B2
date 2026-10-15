import Phaser from 'phaser';
import { NPCDef } from '../../data/maps';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public dataDef: NPCDef;

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
  }
}
