import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { Interactable } from '../entities/Interactable';
import { Enemy } from '../entities/Enemy';
import { AREA_MAPS, AreaKey, PortalDef } from '../../data/maps';
import { GameState, QuestStage } from '../../systems/GameState';
import { AudioSystem } from '../../systems/AudioSystem';
import { getQuestionById } from '../../data/questions';
import { HUD } from '../../ui/components/HUD';
import { DialogModal } from '../../ui/components/DialogModal';
import { QuizModal } from '../../ui/components/QuizModal';
import { VictoryModal } from '../../ui/components/VictoryModal';
import { TouchControls } from '../../ui/components/TouchControls';

export class WorldScene extends Phaser.Scene {
  public player!: Player;
  private currentAreaKey: AreaKey = 'VILLAGE';
  private npcs: NPC[] = [];
  private interactables: Interactable[] = [];
  private enemies: Enemy[] = [];
  private obstaclesGroup!: Phaser.Physics.Arcade.StaticGroup;
  private portals: PortalDef[] = [];
  private isTransitioning: boolean = false;
  private isModalOpen: boolean = false;

  // UI layer references
  public hud!: HUD;
  public dialogModal!: DialogModal;
  public quizModal!: QuizModal;
  public victoryModal!: VictoryModal;
  public touchControls!: TouchControls;

  private closestTarget: { type: 'npc' | 'object' | 'portal'; entity: NPC | Interactable | PortalDef } | null = null;

  constructor() {
    super('WorldScene');
  }

  init(data: { areaKey?: AreaKey; startTileX?: number; startTileY?: number }): void {
    if (data.areaKey) {
      this.currentAreaKey = data.areaKey;
    }
  }

  create(data: { startTileX?: number; startTileY?: number }): void {
    const areaData = AREA_MAPS[this.currentAreaKey];
    this.portals = areaData.portals;
    this.isTransitioning = false;
    this.npcs = [];
    this.interactables = [];
    this.enemies = [];

    // Set world physics bounds
    const worldW = areaData.widthInTiles * 32;
    const worldH = areaData.heightInTiles * 32;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Build Obstacles Group
    this.obstaclesGroup = this.physics.add.staticGroup();

    // Render Map Layout
    this.renderMapTiles(areaData);

    // Spawn Player
    const startX = (data.startTileX ?? 12) * 32 + 16;
    const startY = (data.startTileY ?? 10) * 32 + 16;
    this.player = new Player(this, startX, startY);
    this.player.setDepth(10);

    // Camera Configuration
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Add Player-Obstacle collision
    this.physics.add.collider(this.player, this.obstaclesGroup);

    // Spawn NPCs
    areaData.npcs.forEach(def => {
      const npc = new NPC(this, def);
      npc.setDepth(9);
      this.npcs.push(npc);
      this.physics.add.collider(this.player, npc);
    });

    // Spawn Interactables
    areaData.objects.forEach(def => {
      const obj = new Interactable(this, def);
      obj.setDepth(8);
      this.interactables.push(obj);
      this.physics.add.collider(this.player, obj);
    });

    // Spawn Enemies (e.g. in Forest)
    areaData.enemies.forEach(def => {
      const enemy = new Enemy(this, def);
      enemy.setDepth(9);
      this.enemies.push(enemy);
      this.physics.add.collider(enemy, this.obstaclesGroup);
    });

    // Connect UI singletons
    this.initUI();

    // Pass touch controls to player
    this.player.setVirtualInput(this.touchControls.state);
  }

  private initUI(): void {
    const appEl = document.getElementById('app-container');
    if (!appEl) return;

    if (!this.hud) {
      this.hud = new HUD(() => this.restartGame());
    }
    if (!this.dialogModal) {
      this.dialogModal = new DialogModal();
    }
    if (!this.quizModal) {
      this.quizModal = new QuizModal();
    }
    if (!this.victoryModal) {
      this.victoryModal = new VictoryModal(() => this.restartGame());
    }
    if (!this.touchControls) {
      this.touchControls = new TouchControls();
    }
  }

  private renderMapTiles(areaData: typeof AREA_MAPS[AreaKey]): void {
    const rows = areaData.layout;
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const px = x * 32 + 16;
        const py = y * 32 + 16;

        // Base ground tile
        const groundKey = char === 'P' ? 'tile_path' : areaData.defaultTile;
        this.add.image(px, py, groundKey).setDepth(1);

        // Decorator / Obstacle tiles
        if (char === 'W') {
          const wallKey = this.currentAreaKey === 'CASTLE' ? 'tile_castle_wall' : 'tile_fence';
          const wall = this.obstaclesGroup.create(px, py, wallKey) as Phaser.Physics.Arcade.Sprite;
          wall.setDepth(5);
          wall.refreshBody();
        } else if (char === 'T') {
          const treeKey = this.currentAreaKey === 'FOREST' ? 'tile_forest_tree' : 'tile_tree';
          const tree = this.obstaclesGroup.create(px, py, treeKey) as Phaser.Physics.Arcade.Sprite;
          tree.setDepth(6);
          tree.setSize(24, 24);
          tree.setOffset(20, 36);
          tree.refreshBody();
        } else if (char === 'F') {
          const fence = this.obstaclesGroup.create(px, py, 'tile_fence') as Phaser.Physics.Arcade.Sprite;
          fence.setDepth(5);
          fence.refreshBody();
        }
      }
    }
  }

  update(): void {
    if (this.isTransitioning) return;

    this.isModalOpen = this.dialogModal?.isOpen || this.quizModal?.isOpen || this.victoryModal?.isOpen;
    const canMove = !this.isModalOpen;

    const { attackTriggered, interactTriggered } = this.player.updatePlayer(canMove);

    // Update Enemies AI & Combat
    this.updateEnemiesCombat(attackTriggered);

    // Check interaction range
    this.checkInteractionRange(interactTriggered);

    // Check Area Portals
    this.checkPortals();
  }

  private updateEnemiesCombat(attackTriggered: boolean): void {
    const hitbox = this.player.getAttackHitbox();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.getIsDead()) {
        this.enemies.splice(i, 1);
        continue;
      }

      enemy.updateEnemy(this.player);

      // Check player sword attack hitting enemy
      if (hitbox && !enemy.getIsDead()) {
        if (this.physics.overlap(hitbox, enemy)) {
          enemy.takeDamage(this.player.x, this.player.y);
        }
      }

      // Check enemy touching player
      if (!enemy.getIsDead() && !this.player.isInvulnerable) {
        if (this.physics.overlap(this.player, enemy)) {
          const isDead = this.player.takeDamage(enemy.x, enemy.y);
          if (isDead) {
            this.handlePlayerDefeated();
          }
        }
      }
    }
  }

  private handlePlayerDefeated(): void {
    this.dialogModal.show({
      title: 'Prajurit Terluka!',
      avatarIcon: '❤️‍🩹',
      message: 'Kamu kehabisan tenaga dalam pertempuran. Tabib istana telah merawatmu kembali ke kondisi prima di Alun-Alun!',
      buttonText: 'Bangkit Kembali 🛡️',
      onContinue: () => {
        GameState.respawnPlayer();
        this.transitionToArea('VILLAGE', 12, 10);
      }
    });
  }

  private checkInteractionRange(interactTriggered: boolean): void {
    if (this.isModalOpen) {
      this.hud?.hideInteractionPrompt();
      return;
    }

    let nearestDist = 52;
    this.closestTarget = null;

    // Check NPCs
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        this.closestTarget = { type: 'npc', entity: npc };
      }
    }

    // Check Interactables
    for (const obj of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        this.closestTarget = { type: 'object', entity: obj };
      }
    }

    if (this.closestTarget) {
      // Calculate screen position for HUD prompt bubble
      const cam = this.cameras.main;
      const targetEntity = this.closestTarget.entity as Phaser.GameObjects.Sprite;
      const screenX = (targetEntity.x - cam.scrollX) * cam.zoom;
      const screenY = (targetEntity.y - cam.scrollY - 20) * cam.zoom;

      let promptText = 'Tekan [E] untuk Bicara';
      if (this.closestTarget.type === 'object') {
        promptText = (this.closestTarget.entity as Interactable).dataDef.promptText || 'Tekan [E] untuk Periksa';
      }

      this.hud?.showInteractionPrompt(screenX, screenY, promptText);

      if (interactTriggered) {
        this.triggerInteraction();
      }
    } else {
      this.hud?.hideInteractionPrompt();
    }
  }

  private triggerInteraction(): void {
    if (!this.closestTarget) return;

    if (this.closestTarget.type === 'npc') {
      const npc = this.closestTarget.entity as NPC;
      this.handleNPCInteraction(npc);
    } else if (this.closestTarget.type === 'object') {
      const obj = this.closestTarget.entity as Interactable;
      this.handleObjectInteraction(obj);
    }
  }

  private handleNPCInteraction(npc: NPC): void {
    const def = npc.dataDef;

    // Special handling for Princess
    if (def.id === 'npc_princess') {
      if (GameState.hasCrown) {
        // Quest Completed!
        GameState.completeQuest();
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `${GameState.playerName}! Kamu berhasil membawa kembali Mahkota Bintang! Kerajaan kita terselamatkan dan Festival Bintang akan segera dimulai! Terima kasih prajurit hebat!`,
          buttonText: 'Rayakan Kemenangan! 🎉',
          onContinue: () => {
            this.victoryModal.show();
          }
        });
      } else if (GameState.questStage === QuestStage.TALK_TO_PRINCESS) {
        GameState.setQuestStage(QuestStage.INVESTIGATE_AREAS);
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `Selamat datang, Prajurit ${GameState.playerName}! Mahkota Bintang hilang dicuri monster di Hutan Rahasia. Cari petunjuk dari warga kerajaan di Taman (Timur) dan Dapur Istana (Utara) untuk menemukan Kunci Hutan!`,
          buttonText: 'Siap Laksanakan! ⚔️'
        });
      } else {
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `Semangat Prajurit ${GameState.playerName}! Temukan Mahkota Bintang di altar suci Hutan Rahasia dan bawa kembali kepadaku sebelum Festival dimulai!`,
          buttonText: 'Lanjutkan Petualangan ➡️'
        });
      }
      return;
    }

    // Standard NPC with or without educational question
    if (def.questionId) {
      const question = getQuestionById(def.questionId);
      if (question) {
        this.dialogModal.show({
          title: `${def.name} (${def.title})`,
          avatarIcon: def.avatarIcon,
          message: def.dialogueIntro,
          buttonText: 'Jawab Pertanyaan 📝',
          onContinue: () => {
            this.quizModal.show(question);
          }
        });
        return;
      }
    }

    this.dialogModal.show({
      title: def.name,
      avatarIcon: def.avatarIcon,
      message: def.dialogueIntro
    });
  }

  private handleObjectInteraction(obj: Interactable): void {
    const def = obj.dataDef;

    // Special handling for Crown Altar
    if (def.isCrownAltar) {
      if (GameState.hasCrown) {
        this.dialogModal.show({
          title: 'Altar Mahkota Bintang',
          avatarIcon: '✨',
          message: 'Altar batu suci. Mahkota Bintang telah kamu ambil! Segera bawa ke Putri Cahaya di Alun-Alun Istana!'
        });
        return;
      }

      // Check if monsters or tablet challenge are met
      if (!GameState.isQuestionAnswered('q_present_continuous')) {
        this.dialogModal.show({
          title: 'Altar Terkunci!',
          avatarIcon: '🔒',
          message: 'Mahkota Bintang dilindungi perisai sihir ungu kuno. Kamu harus membaca dan memecahkan mantra di Prasasti Kuno di dekat altar terlebih dahulu!'
        });
        return;
      }

      // Obtain crown!
      GameState.obtainCrown();
      AudioSystem.playCrownFound();
      this.dialogModal.show({
        title: '👑 MAHKOTA BINTANG DITEMUKAN!',
        avatarIcon: '🌟',
        message: 'Luar biasa! Kamu berhasil mengangkat Mahkota Bintang yang bersinar terang! Sekarang, kembalikan mahkota ini kepada Putri Cahaya di Alun-Alun Istana!',
        buttonText: 'Bawa Kembali ke Putri 👑'
      });
      return;
    }

    // Fountain health recovery object
    if (def.id === 'obj_fountain_village') {
      GameState.healPlayer(5);
      AudioSystem.playCorrect();
      this.dialogModal.show({
        title: def.name,
        avatarIcon: '⛲',
        message: 'Kamu meminum air mancur yang sejuk dan segar. Seluruh staminamu pulih kembali (Darah penuh: ❤️❤️❤️❤️❤️)!'
      });
      return;
    }

    // Objects with educational questions (Fruit basket, cat, desk, sink, sofa, tablet)
    if (def.questionId) {
      const question = getQuestionById(def.questionId);
      if (question) {
        this.dialogModal.show({
          title: def.name,
          avatarIcon: '🔍',
          message: def.examineText,
          buttonText: 'Pecahkan Teka-Teki 📝',
          onContinue: () => {
            this.quizModal.show(question);
          }
        });
        return;
      }
    }

    this.dialogModal.show({
      title: def.name,
      avatarIcon: '🔍',
      message: def.examineText
    });
  }

  private checkPortals(): void {
    const playerTileX = Math.floor(this.player.x / 32);
    const playerTileY = Math.floor(this.player.y / 32);

    for (const portal of this.portals) {
      if (playerTileX === portal.x && playerTileY === portal.y) {
        // Prevent passing south gate to forest if player hasn't unlocked key or talked to princess
        if (this.currentAreaKey === 'VILLAGE' && portal.targetArea === 'FOREST') {
          if (!GameState.hasForestKey && !GameState.isQuestionAnswered('q_transportation')) {
            // Let the gatekeeper challenge handle entry or show hint
            // Player is allowed into the gate corridor where Gatekeeper stands!
          }
        }

        this.transitionToArea(portal.targetArea, portal.targetX, portal.targetY);
        break;
      }
    }
  }

  private transitionToArea(targetArea: AreaKey, targetTileX: number, targetTileY: number): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    AudioSystem.playInteract();

    this.cameras.main.fadeOut(250, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.restart({
        areaKey: targetArea,
        startTileX: targetTileX,
        startTileY: targetTileY
      });
    });
  }

  public restartGame(): void {
    GameState.reset();
    this.dialogModal?.close();
    this.quizModal?.close();
    this.victoryModal?.close();

    const regModal = (window as unknown as { registrationModal?: { show: () => void } }).registrationModal;
    if (regModal) {
      regModal.show();
    }

    this.scene.restart({
      areaKey: 'VILLAGE',
      startTileX: 12,
      startTileY: 10
    });
  }
}
