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

  // Heal drops (enemy defeat loot)
  public healDrops: Phaser.Physics.Arcade.Sprite[] = [];

  // Direction arrow graphics (persistent single instances to prevent per-frame GC freezes)
  private dirArrowGraphic?: Phaser.GameObjects.Triangle;
  private dirArrowLabel?: Phaser.GameObjects.Text;

  // Target indicator marker for closest enemy in combat range
  private enemyTargetRing?: Phaser.GameObjects.Arc;
  private enemyTargetArrow?: Phaser.GameObjects.Triangle;

  // UI layer references
  public hud!: HUD;
  public dialogModal!: DialogModal;
  public quizModal!: QuizModal;
  public victoryModal!: VictoryModal;
  public touchControls!: TouchControls;

  private closestTarget: { type: 'npc' | 'object' | 'portal'; entity: NPC | Interactable | PortalDef } | null = null;

  // Minimap update throttle
  private minimapTick: number = 0;
  private readonly MINIMAP_UPDATE_MS = 200;

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
    this.healDrops = [];

    // World physics bounds
    const worldW = areaData.widthInTiles * 32;
    const worldH = areaData.heightInTiles * 32;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Obstacles group
    this.obstaclesGroup = this.physics.add.staticGroup();

    // Render map layout
    this.renderMapTiles(areaData);

    // Spawn player
    const startX = (data.startTileX ?? 12) * 32 + 16;
    const startY = (data.startTileY ?? 10) * 32 + 16;
    this.player = new Player(this, startX, startY);
    this.player.setDepth(10);

    // Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    // Colliders
    this.physics.add.collider(this.player, this.obstaclesGroup);

    // NPCs
    areaData.npcs.forEach(def => {
      const npc = new NPC(this, def);
      npc.setDepth(9);
      this.npcs.push(npc);
      this.physics.add.collider(this.player, npc);
    });

    // Interactables
    areaData.objects.forEach(def => {
      const obj = new Interactable(this, def);
      obj.setDepth(8);
      this.interactables.push(obj);
      this.physics.add.collider(this.player, obj);
    });

    // Enemies
    areaData.enemies.forEach(def => {
      const enemy = new Enemy(this, def);
      this.enemies.push(enemy);
      this.physics.add.collider(enemy, this.obstaclesGroup);
    });

    // Connect UI singletons
    this.initUI();

    // Touch controls
    this.player.setVirtualInput(this.touchControls.state);

    // Quest highlight rings on active NPCs
    this.addQuestHighlights();

    // Enemy target markers
    this.initEnemyTargetMarkers();

    // Direction arrow singleton (created once, updated per-frame)
    this.initDirectionArrow();

    // Keyboard shortcut B: Return to Base (Alun-Alun)
    const keyB = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    keyB?.on('down', () => {
      if (!this.isModalOpen && !this.isTransitioning) {
        this.returnToBase();
      }
    });
  }

  private initUI(): void {
    if (!this.hud) {
      this.hud = new HUD(
        () => this.restartGame(),
        () => this.returnToBase()
      );
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

        // If this tile is part of any portal doorway, give it clean stone path
        let isPortalTile = false;
        for (const p of areaData.portals) {
          const pw = p.width ?? 2;
          const ph = p.height ?? 2;
          if (x >= p.x && x < p.x + pw && y >= p.y && y < p.y + ph) {
            isPortalTile = true;
            break;
          }
        }

        const groundKey = (char === 'P' || isPortalTile) ? 'tile_path' : areaData.defaultTile;
        this.add.image(px, py, groundKey).setDepth(1);

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

    // Render illuminated doorway threshold and labels
    this.renderPortalDecorations(areaData);
  }

  private renderPortalDecorations(areaData: typeof AREA_MAPS[AreaKey]): void {
    areaData.portals.forEach(portal => {
      const pw = (portal.width ?? 2) * 32;
      const ph = (portal.height ?? 2) * 32;
      const cx = portal.x * 32 + pw / 2;
      const cy = portal.y * 32 + ph / 2;

      // Subtle glowing doorway threshold
      const mat = this.add.rectangle(cx, cy, pw - 4, ph - 4, 0x38bdf8, 0.15)
        .setStrokeStyle(1.5, 0x38bdf8, 0.7)
        .setDepth(2);

      this.tweens.add({
        targets: mat,
        alpha: 0.35,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Doorway direction label hint
      let labelY = cy - 22;
      if (portal.y === 0) labelY = cy + 24;
      if (portal.x === 0) labelY = cy - 20;

      this.add.text(cx, labelY, portal.label, {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '6px',
        color: '#fef08a',
        stroke: '#0f172a',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(15);
    });
  }

  /**
   * Draw a glowing ring under quest-active NPCs to help player navigate.
   */
  private addQuestHighlights(): void {
    const stage = GameState.questStage;

    this.npcs.forEach(npc => {
      let isTarget = false;
      if (npc.dataDef.id === 'npc_princess' &&
          (stage === QuestStage.TALK_TO_PRINCESS || stage === QuestStage.RETURN_TO_PRINCESS)) {
        isTarget = true;
      }
      if (npc.dataDef.id === 'npc_gatekeeper' && GameState.hasForestKey &&
          stage <= QuestStage.GATE_CHALLENGE) {
        isTarget = true;
      }

      if (isTarget) {
        const ring = this.add.circle(npc.x, npc.y, 18, 0xf5a623, 0.15)
          .setStrokeStyle(2, 0xf5a623, 0.8)
          .setDepth(7);
        this.tweens.add({
          targets: ring,
          scaleX: 1.25,
          scaleY: 1.25,
          alpha: 0.05,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });

    // Highlight crown altar in forest if it's the current goal
    if (stage === QuestStage.RETRIEVE_CROWN || stage === QuestStage.FOREST_EXPLORATION) {
      this.interactables.forEach(obj => {
        if (obj.dataDef.isCrownAltar) {
          const glow = this.add.circle(obj.x, obj.y, 20, 0xfbbf24, 0.2)
            .setStrokeStyle(2, 0xfbbf24, 0.9)
            .setDepth(7);
          this.tweens.add({
            targets: glow,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.05,
            duration: 700,
            yoyo: true,
            repeat: -1
          });
        }
      });
    }
  }

  update(_time: number, delta: number): void {
    if (this.isTransitioning) return;

    this.isModalOpen = this.dialogModal?.isOpen || this.quizModal?.isOpen || this.victoryModal?.isOpen;
    const canMove = !this.isModalOpen;

    const { attackTriggered, interactTriggered } = this.player.updatePlayer(canMove);

    // Update enemies with delta time for pattern timing (only when modal is closed)
    if (!this.isModalOpen) {
      this.updateEnemiesCombat(attackTriggered, delta);
      this.checkHealDropPickups();
    }

    // Interaction range check
    this.checkInteractionRange(interactTriggered);

    // Portal check
    this.checkPortals();

    // Minimap (throttled)
    this.minimapTick += delta;
    if (this.minimapTick >= this.MINIMAP_UPDATE_MS) {
      this.minimapTick = 0;
      const tileX = Math.floor(this.player.x / 32);
      const tileY = Math.floor(this.player.y / 32);
      const activeEnemies = this.enemies
        .filter(e => !e.getIsDead())
        .map(e => ({ x: e.x, y: e.y, isBoss: e.enemyDef.type === 'boss' }));
      this.hud?.updateMinimap(this.currentAreaKey, tileX, tileY, activeEnemies);
    }

    // Direction arrow to quest target
    this.updateDirectionArrow();

    // Update target marker on closest enemy
    this.updateEnemyTargeting();
  }

  private updateEnemiesCombat(attackTriggered: boolean, delta: number): void {
    const hitbox = this.player.getAttackHitbox();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.getIsDead()) {
        this.enemies.splice(i, 1);
        continue;
      }

      enemy.updateEnemy(this.player, delta);

      // Player sword → enemy
      if (hitbox && !enemy.getIsDead()) {
        if (this.physics.overlap(hitbox, enemy)) {
          enemy.takeDamage(this.player.x, this.player.y);
        }
      }

      // Enemy touches player
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

  private checkHealDropPickups(): void {
    for (let i = this.healDrops.length - 1; i >= 0; i--) {
      const drop = this.healDrops[i];
      if (!drop.active) {
        this.healDrops.splice(i, 1);
        continue;
      }
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, drop.x, drop.y);
      if (dist < 24) {
        const amount = (drop as unknown as { healAmount: number }).healAmount || 1;
        GameState.healPlayer(amount);
        AudioSystem.playCorrect();

        // Heal number popup
        const healText = this.add.text(this.player.x, this.player.y - 16, `+${amount}`, {
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: '#22c55e',
          stroke: '#000',
          strokeThickness: 2
        }).setDepth(30).setOrigin(0.5);
        this.tweens.add({
          targets: healText,
          y: healText.y - 20,
          alpha: 0,
          duration: 600,
          onComplete: () => healText.destroy()
        });

        drop.destroy();
        this.healDrops.splice(i, 1);
      }
    }
  }

  private initDirectionArrow(): void {
    const arrowSize = 12;
    this.dirArrowGraphic = this.add.triangle(
      0, 0,
      0, -arrowSize,
      arrowSize * 0.7, arrowSize * 0.7,
      -arrowSize * 0.7, arrowSize * 0.7,
      0xf5a623, 0.95
    ).setDepth(50).setScrollFactor(0).setVisible(false);
    this.dirArrowGraphic.setStrokeStyle(1.5, 0x7a5311, 0.8);

    this.dirArrowLabel = this.add.text(0, 0, '', {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '5px',
      color: '#fef08a',
      stroke: '#000',
      strokeThickness: 2
    }).setDepth(51).setScrollFactor(0).setOrigin(0.5).setVisible(false);
  }

  /**
   * Update direction arrow toward current quest target (zero GC allocation).
   */
  private updateDirectionArrow(): void {
    if (!this.dirArrowGraphic || !this.dirArrowLabel) return;

    if (this.isModalOpen) {
      this.clearDirectionArrows();
      return;
    }

    const target = this.getQuestTargetPosition();
    if (!target) {
      this.clearDirectionArrows();
      return;
    }

    const cam = this.cameras.main;
    const camCenterX = cam.scrollX + cam.width / (2 * cam.zoom);
    const camCenterY = cam.scrollY + cam.height / (2 * cam.zoom);

    const dx = target.x - camCenterX;
    const dy = target.y - camCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only show arrow when target is off-screen (dist > 120 world units)
    if (dist < 120) {
      this.clearDirectionArrows();
      return;
    }

    // Compute screen edge intersection
    const angle = Math.atan2(dy, dx);
    const padding = 38;
    const hw = cam.width / (2 * cam.zoom) - padding;
    const hh = cam.height / (2 * cam.zoom) - padding;

    let ex = camCenterX + Math.cos(angle) * hw;
    let ey = camCenterY + Math.sin(angle) * hh;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    if (cos * hh > sin * hw) {
      const scale = hw / Math.abs(Math.cos(angle));
      ex = camCenterX + Math.cos(angle) * scale;
      ey = camCenterY + Math.sin(angle) * scale;
    }

    // Convert to screen coordinates
    const screenX = (ex - cam.scrollX) * cam.zoom;
    const screenY = (ey - cam.scrollY) * cam.zoom;
    const arrowSize = 12;

    this.dirArrowGraphic
      .setPosition(screenX, screenY)
      .setRotation(angle + Math.PI / 2)
      .setVisible(true);

    const targetLabel = this.getQuestTargetLabel();
    if (this.dirArrowLabel.text !== targetLabel) {
      this.dirArrowLabel.setText(targetLabel);
    }
    this.dirArrowLabel
      .setPosition(screenX, screenY + arrowSize + 8)
      .setVisible(true);
  }

  private clearDirectionArrows(): void {
    this.dirArrowGraphic?.setVisible(false);
    this.dirArrowLabel?.setVisible(false);
  }

  private getQuestTargetPosition(): { x: number; y: number } | null {
    const stage = GameState.questStage;

    if (this.currentAreaKey === 'VILLAGE') {
      // Point to princess or gatekeeper NPC
      for (const npc of this.npcs) {
        if (npc.dataDef.id === 'npc_princess' &&
            (stage === QuestStage.TALK_TO_PRINCESS || stage === QuestStage.RETURN_TO_PRINCESS)) {
          return { x: npc.x, y: npc.y };
        }
        if (npc.dataDef.id === 'npc_gatekeeper' &&
            GameState.hasForestKey && stage <= QuestStage.GATE_CHALLENGE) {
          return { x: npc.x, y: npc.y };
        }
      }

      // Point to area portals based on quest
      if (stage === QuestStage.INVESTIGATE_AREAS && !GameState.hasForestKey) {
        // Point east toward Garden portal
        const gardenPortal = this.portals.find(p => p.targetArea === 'GARDEN');
        if (gardenPortal) return { x: gardenPortal.x * 32 + 16, y: gardenPortal.y * 32 + 16 };
      }
    }

    if (this.currentAreaKey === 'FOREST') {
      // Point to crown altar
      if (stage === QuestStage.RETRIEVE_CROWN || stage === QuestStage.FOREST_EXPLORATION) {
        const altar = this.interactables.find(o => o.dataDef.isCrownAltar);
        if (altar) return { x: altar.x, y: altar.y };
      }
    }

    return null;
  }

  private getQuestTargetLabel(): string {
    const stage = GameState.questStage;
    if (stage === QuestStage.TALK_TO_PRINCESS) return 'Putri';
    if (stage === QuestStage.RETURN_TO_PRINCESS) return 'Putri';
    if (stage === QuestStage.RETRIEVE_CROWN) return 'Mahkota';
    if (stage === QuestStage.FOREST_EXPLORATION) return 'Altar';
    if (GameState.hasForestKey) return 'Penjaga';
    return 'Taman';
  }

  private handlePlayerDefeated(): void {
    this.dialogModal.show({
      title: 'Prajurit Terluka!',
      avatarIcon: 'heal',
      message: 'Kamu kehabisan tenaga dalam pertempuran. Tabib istana telah merawatmu kembali ke kondisi prima di Alun-Alun!',
      buttonText: 'Bangkit Kembali',
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

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        this.closestTarget = { type: 'npc', entity: npc };
      }
    }

    for (const obj of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        this.closestTarget = { type: 'object', entity: obj };
      }
    }

    if (this.closestTarget) {
      const cam = this.cameras.main;
      const targetEntity = this.closestTarget.entity as Phaser.GameObjects.Sprite;
      const screenX = (targetEntity.x - cam.scrollX) * cam.zoom;
      const screenY = (targetEntity.y - cam.scrollY - 20) * cam.zoom;

      let promptText = 'Tekan [E] Bicara';
      if (this.closestTarget.type === 'object') {
        promptText = (this.closestTarget.entity as Interactable).dataDef.promptText || 'Tekan [E] Periksa';
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
      this.handleNPCInteraction(this.closestTarget.entity as NPC);
    } else if (this.closestTarget.type === 'object') {
      this.handleObjectInteraction(this.closestTarget.entity as Interactable);
    }
  }

  private handleNPCInteraction(npc: NPC): void {
    const def = npc.dataDef;

    if (def.id === 'npc_princess') {
      if (GameState.hasCrown) {
        GameState.completeQuest();
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `${GameState.playerName}! Kamu berhasil membawa kembali Mahkota Bintang! Kerajaan kita terselamatkan dan Festival Bintang akan segera dimulai! Terima kasih prajurit hebat!`,
          buttonText: 'Rayakan Kemenangan!',
          onContinue: () => { this.victoryModal.show(); }
        });
      } else if (GameState.questStage === QuestStage.TALK_TO_PRINCESS) {
        GameState.setQuestStage(QuestStage.INVESTIGATE_AREAS);
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `Selamat datang, Prajurit ${GameState.playerName}! Mahkota Bintang hilang dicuri monster di Hutan Rahasia. Cari petunjuk dari warga kerajaan di Taman (Timur) dan Dapur Istana (Utara) untuk menemukan Kunci Hutan!`,
          buttonText: 'Siap Laksanakan!'
        });
      } else {
        this.dialogModal.show({
          title: def.name,
          avatarIcon: def.avatarIcon,
          message: `Semangat Prajurit ${GameState.playerName}! Temukan Mahkota Bintang di altar suci Hutan Rahasia dan bawa kembali kepadaku sebelum Festival dimulai!`,
          buttonText: 'Lanjutkan Petualangan'
        });
      }
      return;
    }

    if (def.questionId) {
      const question = getQuestionById(def.questionId);
      if (question) {
        this.dialogModal.show({
          title: `${def.name} (${def.title})`,
          avatarIcon: def.avatarIcon,
          message: def.dialogueIntro,
          buttonText: 'Jawab Pertanyaan',
          onContinue: () => { this.quizModal.show(question); }
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

    if (def.isCrownAltar) {
      if (GameState.hasCrown) {
        this.dialogModal.show({
          title: 'Altar Mahkota Bintang',
          avatarIcon: 'altar',
          message: 'Altar batu suci. Mahkota Bintang telah kamu ambil! Segera bawa ke Putri Cahaya di Alun-Alun Istana!'
        });
        return;
      }

      if (!GameState.isQuestionAnswered('q_present_continuous')) {
        this.dialogModal.show({
          title: 'Altar Terkunci!',
          avatarIcon: 'lock',
          message: 'Mahkota Bintang dilindungi perisai sihir ungu kuno. Kamu harus membaca dan memecahkan mantra di Prasasti Kuno di dekat altar terlebih dahulu!'
        });
        return;
      }

      GameState.obtainCrown();
      AudioSystem.playCrownFound();
      this.dialogModal.show({
        title: 'MAHKOTA BINTANG DITEMUKAN!',
        avatarIcon: 'crown',
        message: 'Luar biasa! Kamu berhasil mengangkat Mahkota Bintang yang bersinar terang! Sekarang, kembalikan mahkota ini kepada Putri Cahaya di Alun-Alun Istana!',
        buttonText: 'Bawa Kembali ke Putri'
      });
      return;
    }

    if (def.id === 'obj_fountain_village') {
      GameState.healPlayer(5);
      AudioSystem.playCorrect();
      this.dialogModal.show({
        title: def.name,
        avatarIcon: 'fountain',
        message: 'Kamu meminum air mancur yang sejuk dan segar. Seluruh staminamu pulih kembali!'
      });
      return;
    }

    if (def.questionId) {
      const question = getQuestionById(def.questionId);
      if (question) {
        this.dialogModal.show({
          title: def.name,
          avatarIcon: 'search',
          message: def.examineText,
          buttonText: 'Pecahkan Teka-Teki',
          onContinue: () => { this.quizModal.show(question); }
        });
        return;
      }
    }

    this.dialogModal.show({
      title: def.name,
      avatarIcon: 'search',
      message: def.examineText
    });
  }

  private initEnemyTargetMarkers(): void {
    // Ground reticle ring under targeted enemy
    this.enemyTargetRing = this.add.circle(0, 0, 14, 0xef4444, 0.15)
      .setStrokeStyle(1.5, 0xef4444, 0.85)
      .setDepth(8)
      .setVisible(false);

    // Downward target triangle arrow above targeted enemy
    this.enemyTargetArrow = this.add.triangle(0, 0, -4, -6, 4, -6, 0, 2, 0xef4444, 0.95)
      .setDepth(22)
      .setVisible(false);

    // Subtle breathing pulse for targeting ring
    this.tweens.add({
      targets: this.enemyTargetRing,
      scaleX: 1.25,
      scaleY: 1.25,
      alpha: 0.05,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private updateEnemyTargeting(): void {
    if (!this.enemyTargetRing || !this.enemyTargetArrow) return;

    let nearestEnemy: Enemy | null = null;
    let minDistance = 130; // Max targeting range in world pixels

    for (const enemy of this.enemies) {
      if (enemy.getIsDead()) continue;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
      if (dist < minDistance) {
        minDistance = dist;
        nearestEnemy = enemy;
      }
    }

    if (nearestEnemy && !this.isModalOpen) {
      const isBoss = nearestEnemy.enemyDef.type === 'boss';
      this.enemyTargetRing.setPosition(nearestEnemy.x, nearestEnemy.y + 6);
      this.enemyTargetRing.setRadius(isBoss ? 20 : 13);
      this.enemyTargetRing.setVisible(true);

      const arrowY = nearestEnemy.y - (isBoss ? 28 : 22);
      this.enemyTargetArrow.setPosition(nearestEnemy.x, arrowY);
      this.enemyTargetArrow.setVisible(true);
    } else {
      this.enemyTargetRing.setVisible(false);
      this.enemyTargetArrow.setVisible(false);
    }
  }

  private checkPortals(): void {
    if (this.isTransitioning) return;

    const px = this.player.x;
    const py = this.player.y;

    for (const portal of this.portals) {
      const pW = portal.width ?? 2;
      const pH = portal.height ?? 2;

      const minX = portal.x * 32;
      const maxX = (portal.x + pW) * 32;
      const minY = portal.y * 32;
      const maxY = (portal.y + pH) * 32;

      // Generous trigger bounding box (covers the entire doorway width & height)
      // Player can walk through the left, center, or right of the doorway seamlessly
      const isOverlapX = px >= minX - 6 && px <= maxX + 6;
      const isOverlapY = py >= minY - 6 && py <= maxY + 6;

      if (isOverlapX && isOverlapY) {
        this.transitionToArea(portal.targetArea, portal.targetX, portal.targetY);
        break;
      }
    }
  }

  private transitionToArea(targetArea: AreaKey, targetTileX: number, targetTileY: number): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.clearDirectionArrows();
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

  public returnToBase(): void {
    if (this.isTransitioning) return;
    this.clearDirectionArrows();
    AudioSystem.playInteract();

    // Reset player state to prevent stuck/glitched states
    if (this.player) {
      this.player.isAttacking = false;
      this.player.isInvulnerable = false;
      this.player.setVelocity(0, 0);
    }

    // Teleport back to safe village square center without resetting progress
    this.transitionToArea('VILLAGE', 12, 10);
  }

  public restartGame(): void {
    this.clearDirectionArrows();
    GameState.reset();
    this.dialogModal?.close();
    this.quizModal?.close();
    this.victoryModal?.close();

    const regModal = (window as unknown as { registrationModal?: { show: () => void } }).registrationModal;
    if (regModal) regModal.show();

    this.scene.restart({
      areaKey: 'VILLAGE',
      startTileX: 12,
      startTileY: 10
    });
  }
}
