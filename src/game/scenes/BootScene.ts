import Phaser from 'phaser';
import { TextureGenerator } from '../../systems/TextureGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    // Generate all procedural pixel textures
    TextureGenerator.generateAll(this);

    // Transition immediately to the main world scene
    this.scene.start('WorldScene', { areaKey: 'VILLAGE', startTileX: 12, startTileY: 10 });
  }
}
