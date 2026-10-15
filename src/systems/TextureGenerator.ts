import Phaser from 'phaser';

/**
 * Creates high-quality retro pixel-art textures dynamically into Phaser's TextureManager.
 * Ensures zero missing assets, zero network latency, and 100% offline & Vercel deployment reliability.
 */
export class TextureGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    const tm = scene.textures;

    // Helper to create a canvas
    const createCanvas = (w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      return { canvas, ctx };
    };

    // ==========================================
    // 1. ENVIRONMENT TILES
    // ==========================================

    // Grass Tile (32x32)
    if (!tm.exists('tile_grass')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#489c44';
      ctx.fillRect(0, 0, 32, 32);
      // Highlights & blades of grass
      ctx.fillStyle = '#57b552';
      ctx.fillRect(4, 6, 2, 4);
      ctx.fillRect(18, 12, 2, 4);
      ctx.fillRect(10, 22, 2, 4);
      ctx.fillRect(24, 26, 2, 4);
      // Shadows
      ctx.fillStyle = '#3a8137';
      ctx.fillRect(6, 14, 2, 3);
      ctx.fillRect(22, 4, 2, 3);
      ctx.fillRect(14, 28, 2, 3);
      // Tiny flower
      ctx.fillStyle = '#ffdf59';
      ctx.fillRect(12, 8, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, 8, 1, 2);
      ctx.fillRect(14, 8, 1, 2);
      tm.addCanvas('tile_grass', canvas);
    }

    // Cobblestone Path Tile (32x32)
    if (!tm.exists('tile_path')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#c8b898';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#b4a080';
      // Stones
      const stones = [
        [2, 2, 12, 10], [16, 2, 14, 8],
        [2, 14, 8, 14], [12, 12, 16, 10],
        [20, 24, 10, 6], [10, 24, 8, 6]
      ];
      stones.forEach(([x, y, w, h]) => {
        ctx.fillStyle = '#9e8c6e';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#dfd2ba';
        ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
        ctx.fillStyle = '#827156';
        ctx.strokeRect(x, y, w, h);
      });
      tm.addCanvas('tile_path', canvas);
    }

    // Castle Stone Floor (32x32)
    if (!tm.exists('tile_castle_floor')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#7a8194';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#8e96ab';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillRect(17, 17, 14, 14);
      ctx.fillStyle = '#565c6e';
      ctx.strokeRect(0, 0, 32, 32);
      ctx.fillRect(15, 0, 2, 32);
      ctx.fillRect(0, 15, 32, 2);
      tm.addCanvas('tile_castle_floor', canvas);
    }

    // Castle Wall (32x32)
    if (!tm.exists('tile_castle_wall')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#434759';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#5d637a';
      // Brick row 1
      ctx.fillRect(1, 1, 14, 13);
      ctx.fillRect(17, 1, 14, 13);
      // Brick row 2
      ctx.fillRect(1, 17, 20, 13);
      ctx.fillRect(23, 17, 8, 13);
      // Highlights
      ctx.fillStyle = '#78809c';
      ctx.fillRect(2, 2, 12, 2);
      ctx.fillRect(18, 2, 12, 2);
      ctx.fillRect(2, 18, 18, 2);
      tm.addCanvas('tile_castle_wall', canvas);
    }

    // Forest Grass Tile (32x32)
    if (!tm.exists('tile_forest_grass')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#22553b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2d6d4c';
      ctx.fillRect(6, 6, 4, 4);
      ctx.fillRect(20, 18, 5, 5);
      // Mystic purple moss
      ctx.fillStyle = '#6b3f7a';
      ctx.fillRect(10, 22, 3, 3);
      ctx.fillRect(24, 8, 3, 3);
      // Blue glow spore
      ctx.fillStyle = '#46d6e6';
      ctx.fillRect(12, 14, 2, 2);
      tm.addCanvas('tile_forest_grass', canvas);
    }

    // Tree (64x64)
    if (!tm.exists('tile_tree')) {
      const { canvas, ctx } = createCanvas(64, 64);
      // Trunk
      ctx.fillStyle = '#593a20';
      ctx.fillRect(26, 36, 12, 26);
      ctx.fillStyle = '#7a5130';
      ctx.fillRect(28, 36, 4, 26);
      // Foliage back
      ctx.fillStyle = '#1c5e2d';
      ctx.beginPath();
      ctx.arc(32, 26, 26, 0, Math.PI * 2);
      ctx.fill();
      // Foliage mid
      ctx.fillStyle = '#2e8b42';
      ctx.beginPath();
      ctx.arc(30, 23, 21, 0, Math.PI * 2);
      ctx.fill();
      // Foliage highlights
      ctx.fillStyle = '#4ec466';
      ctx.beginPath();
      ctx.arc(26, 18, 14, 0, Math.PI * 2);
      ctx.fill();
      // Tiny apple
      ctx.fillStyle = '#e63946';
      ctx.fillRect(20, 25, 4, 4);
      ctx.fillRect(40, 22, 4, 4);
      tm.addCanvas('tile_tree', canvas);
    }

    // Mystic Forest Tree (64x64)
    if (!tm.exists('tile_forest_tree')) {
      const { canvas, ctx } = createCanvas(64, 64);
      ctx.fillStyle = '#31203b';
      ctx.fillRect(26, 36, 12, 26);
      ctx.fillStyle = '#45214a';
      ctx.beginPath();
      ctx.arc(32, 26, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6a2c70';
      ctx.beginPath();
      ctx.arc(30, 23, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b83b5e';
      ctx.beginPath();
      ctx.arc(26, 18, 14, 0, Math.PI * 2);
      ctx.fill();
      // Glowing purple fruit
      ctx.fillStyle = '#f08a5d';
      ctx.fillRect(22, 24, 4, 4);
      ctx.fillRect(38, 20, 4, 4);
      tm.addCanvas('tile_forest_tree', canvas);
    }

    // Water Tile (32x32)
    if (!tm.exists('tile_water')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#2f74c0';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#4b93e6';
      ctx.fillRect(2, 6, 12, 3);
      ctx.fillRect(18, 14, 10, 3);
      ctx.fillRect(6, 22, 14, 3);
      ctx.fillStyle = '#7ac0f8';
      ctx.fillRect(4, 7, 6, 1);
      ctx.fillRect(20, 15, 5, 1);
      tm.addCanvas('tile_water', canvas);
    }

    // Fountain (48x48)
    if (!tm.exists('obj_fountain')) {
      const { canvas, ctx } = createCanvas(48, 48);
      // Stone basin
      ctx.fillStyle = '#838996';
      ctx.beginPath();
      ctx.arc(24, 24, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a2aab8';
      ctx.beginPath();
      ctx.arc(24, 24, 18, 0, Math.PI * 2);
      ctx.fill();
      // Water
      ctx.fillStyle = '#3888e0';
      ctx.beginPath();
      ctx.arc(24, 24, 15, 0, Math.PI * 2);
      ctx.fill();
      // Center pedestal
      ctx.fillStyle = '#606775';
      ctx.fillRect(20, 16, 8, 16);
      ctx.fillStyle = '#b8e1fc';
      ctx.fillRect(22, 10, 4, 8);
      ctx.fillRect(20, 12, 8, 3);
      tm.addCanvas('obj_fountain', canvas);
    }

    // Wooden Fence (32x32)
    if (!tm.exists('tile_fence')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#8a5d3b';
      // Vertical posts
      ctx.fillRect(4, 4, 6, 24);
      ctx.fillRect(22, 4, 6, 24);
      // Horizontal rails
      ctx.fillStyle = '#b07a50';
      ctx.fillRect(0, 8, 32, 5);
      ctx.fillRect(0, 20, 32, 5);
      // Post tops
      ctx.fillStyle = '#caa179';
      ctx.fillRect(5, 4, 4, 3);
      ctx.fillRect(23, 4, 4, 3);
      tm.addCanvas('tile_fence', canvas);
    }

    // ==========================================
    // 2. CHARACTERS & NPCS (32x32)
    // ==========================================

    // Player (Royal Knight)
    if (!tm.exists('player')) {
      const { canvas, ctx } = createCanvas(32, 32);
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Boots
      ctx.fillStyle = '#2b2d42';
      ctx.fillRect(10, 24, 4, 6);
      ctx.fillRect(18, 24, 4, 6);
      // Blue Tunic & Armor
      ctx.fillStyle = '#2b6cb0';
      ctx.fillRect(10, 14, 12, 11);
      // Silver Chestplate
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(12, 15, 8, 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(13, 16, 6, 6);
      // Head / Face
      ctx.fillStyle = '#ffd1a4';
      ctx.fillRect(11, 7, 10, 8);
      // Eyes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(13, 10, 2, 2);
      ctx.fillRect(17, 10, 2, 2);
      // Silver Helmet & Red Plume
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(10, 4, 12, 4);
      ctx.fillStyle = '#e63946';
      ctx.fillRect(14, 1, 4, 4);
      ctx.fillRect(16, 0, 3, 2);
      // Sword at side
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(22, 14, 2, 11);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(21, 14, 4, 2);
      // Shield on left
      ctx.fillStyle = '#3182ce';
      ctx.fillRect(6, 15, 4, 8);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(7, 17, 2, 4);

      tm.addCanvas('player', canvas);
    }

    // Princess (Putri Cahaya)
    if (!tm.exists('npc_princess')) {
      const { canvas, ctx } = createCanvas(32, 32);
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Royal Gown (Pink & Gold)
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.moveTo(16, 13);
      ctx.lineTo(8, 28);
      ctx.lineTo(24, 28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fbcfe8';
      ctx.fillRect(14, 15, 4, 13);
      // Face
      ctx.fillStyle = '#ffe0c7';
      ctx.fillRect(11, 6, 10, 8);
      // Brown long hair
      ctx.fillStyle = '#78350f';
      ctx.fillRect(9, 6, 3, 14);
      ctx.fillRect(20, 6, 3, 14);
      ctx.fillRect(11, 4, 10, 3);
      // Eyes & smile
      ctx.fillStyle = '#451a03';
      ctx.fillRect(13, 9, 2, 2);
      ctx.fillRect(17, 9, 2, 2);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(15, 12, 2, 1);
      // Golden Tiara
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(11, 3, 10, 2);
      ctx.fillRect(15, 1, 2, 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(15, 3, 2, 1);
      tm.addCanvas('npc_princess', canvas);
    }

    // Gardener (Tukang Kebun Rama)
    if (!tm.exists('npc_gardener')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Green dungarees
      ctx.fillStyle = '#15803d';
      ctx.fillRect(11, 15, 10, 13);
      // Yellow shirt
      ctx.fillStyle = '#fde047';
      ctx.fillRect(9, 14, 14, 4);
      // Face
      ctx.fillStyle = '#ffd1a4';
      ctx.fillRect(12, 7, 8, 7);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(13, 9, 2, 2);
      ctx.fillRect(17, 9, 2, 2);
      // Straw hat
      ctx.fillStyle = '#d97706';
      ctx.fillRect(6, 5, 20, 3);
      ctx.fillRect(10, 2, 12, 4);
      // Watering can
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(22, 18, 5, 6);
      ctx.fillRect(27, 19, 3, 2);
      tm.addCanvas('npc_gardener', canvas);
    }

    // Chef (Koki Istana Budi)
    if (!tm.exists('npc_chef')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // White chef uniform & apron
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(10, 14, 12, 14);
      // Red neckerchief
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(14, 13, 4, 3);
      // Face
      ctx.fillStyle = '#ffd1a4';
      ctx.fillRect(11, 7, 10, 7);
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(13, 9, 2, 2);
      ctx.fillRect(17, 9, 2, 2);
      // Mustache
      ctx.fillStyle = '#78350f';
      ctx.fillRect(13, 12, 6, 2);
      // Tall Toque Blanche (Chef Hat)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 0, 12, 7);
      ctx.fillRect(8, 0, 16, 4);
      // Wooden spoon
      ctx.fillStyle = '#b45309';
      ctx.fillRect(22, 14, 2, 12);
      ctx.beginPath();
      ctx.ellipse(23, 14, 2, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      tm.addCanvas('npc_chef', canvas);
    }

    // Gatekeeper (Penjaga Gerbang Hutan)
    if (!tm.exists('npc_gatekeeper')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Heavy Steel Armor
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 13, 12, 15);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(12, 14, 8, 8);
      // Helmet with slit
      ctx.fillStyle = '#334155';
      ctx.fillRect(10, 4, 12, 9);
      ctx.fillStyle = '#f59e0b'; // glowing eyes slit
      ctx.fillRect(12, 8, 8, 2);
      // Large Spear
      ctx.fillStyle = '#78350f';
      ctx.fillRect(23, 1, 2, 28);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(22, 0, 4, 5);
      tm.addCanvas('npc_gatekeeper', canvas);
    }

    // Town Guard / Alun-alun Guard
    if (!tm.exists('npc_guard')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(16, 29, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Red royal coat
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(10, 14, 12, 14);
      // Gold buttons
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(15, 16, 2, 2);
      ctx.fillRect(15, 20, 2, 2);
      // Face
      ctx.fillStyle = '#ffd1a4';
      ctx.fillRect(11, 7, 10, 7);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(13, 9, 2, 2);
      ctx.fillRect(17, 9, 2, 2);
      // Guard Helmet
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 3, 12, 5);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(15, 1, 2, 3);
      tm.addCanvas('npc_guard', canvas);
    }

    // ==========================================
    // 3. ENEMIES
    // ==========================================

    // Slime Monster (24x24)
    if (!tm.exists('enemy_slime')) {
      const { canvas, ctx } = createCanvas(24, 24);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(12, 21, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Slime Body
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(4, 20);
      ctx.quadraticCurveTo(2, 10, 12, 5);
      ctx.quadraticCurveTo(22, 10, 20, 20);
      ctx.closePath();
      ctx.fill();
      // Highlight
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.ellipse(9, 10, 3, 2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      // Big cute eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(7, 12, 4, 5);
      ctx.fillRect(13, 12, 4, 5);
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(9, 14, 2, 3);
      ctx.fillRect(15, 14, 2, 3);
      tm.addCanvas('enemy_slime', canvas);
    }

    // Forest Guardian Boss (36x36)
    if (!tm.exists('enemy_boss')) {
      const { canvas, ctx } = createCanvas(36, 36);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(18, 32, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Horns
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, 4, 4, 8);
      ctx.fillRect(26, 4, 4, 8);
      // Dark Purple Body
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.arc(18, 20, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6d28d9';
      ctx.beginPath();
      ctx.arc(17, 18, 11, 0, Math.PI * 2);
      ctx.fill();
      // Glowing Red Menacing Eyes
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(11, 15, 4, 3);
      ctx.fillRect(21, 15, 4, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(12, 16, 2, 2);
      ctx.fillRect(22, 16, 2, 2);
      // Sharp fangs
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 22, 2, 3);
      ctx.fillRect(20, 22, 2, 3);
      tm.addCanvas('enemy_boss', canvas);
    }

    // ==========================================
    // 4. QUEST OBJECTS & ITEMS
    // ==========================================

    // Star Crown (Mahkota Bintang) (24x24)
    if (!tm.exists('item_crown')) {
      const { canvas, ctx } = createCanvas(24, 24);
      // Golden Crown
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(3, 19);
      ctx.lineTo(3, 10);
      ctx.lineTo(8, 14);
      ctx.lineTo(12, 6);
      ctx.lineTo(16, 14);
      ctx.lineTo(21, 10);
      ctx.lineTo(21, 19);
      ctx.closePath();
      ctx.fill();
      // Crown Base
      ctx.fillStyle = '#d97706';
      ctx.fillRect(3, 18, 18, 4);
      // Gems
      ctx.fillStyle = '#38bdf8'; // Blue sapphire
      ctx.fillRect(11, 14, 2, 2);
      ctx.fillStyle = '#ef4444'; // Red ruby
      ctx.fillRect(6, 17, 2, 2);
      ctx.fillRect(16, 17, 2, 2);
      // Star Glow
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(11, 3, 2, 3);
      ctx.fillRect(10, 4, 4, 1);
      tm.addCanvas('item_crown', canvas);
    }

    // Fruit Basket (24x24)
    if (!tm.exists('obj_fruit_basket')) {
      const { canvas, ctx } = createCanvas(24, 24);
      // Woven Basket
      ctx.fillStyle = '#92400e';
      ctx.fillRect(3, 11, 18, 11);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(4, 12, 16, 9);
      // Red apples & green leaves
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(8, 10, 4, 0, Math.PI * 2);
      ctx.arc(14, 8, 4, 0, Math.PI * 2);
      ctx.arc(18, 11, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(13, 4, 2, 2);
      ctx.fillRect(8, 6, 2, 2);
      tm.addCanvas('obj_fruit_basket', canvas);
    }

    // Sleeping Cat Statue / Cat (24x24)
    if (!tm.exists('obj_cat')) {
      const { canvas, ctx } = createCanvas(24, 24);
      ctx.fillStyle = '#ea580c'; // Orange tabby
      ctx.beginPath();
      ctx.ellipse(12, 14, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cat Head
      ctx.beginPath();
      ctx.arc(17, 11, 5, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(15, 6, 2, 3);
      ctx.fillRect(19, 6, 2, 3);
      // Sleeping closed eyes
      ctx.fillStyle = '#431407';
      ctx.fillRect(17, 11, 2, 1);
      // Curled Tail
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(6, 13, 3, 0, Math.PI);
      ctx.stroke();
      tm.addCanvas('obj_cat', canvas);
    }

    // Study Desk with Bag Underneath (32x32)
    if (!tm.exists('obj_desk')) {
      const { canvas, ctx } = createCanvas(32, 32);
      // Wooden desk top
      ctx.fillStyle = '#78350f';
      ctx.fillRect(3, 6, 26, 8);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(4, 7, 24, 6);
      // Legs
      ctx.fillStyle = '#592507';
      ctx.fillRect(4, 14, 3, 14);
      ctx.fillRect(25, 14, 3, 14);
      // Book on desk
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(8, 7, 6, 4);
      // School Bag UNDER table!
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(11, 19, 10, 8);
      ctx.fillStyle = '#f59e0b'; // Buckle
      ctx.fillRect(14, 21, 4, 3);
      tm.addCanvas('obj_desk', canvas);
    }

    // Kitchen Sink (32x32)
    if (!tm.exists('obj_sink')) {
      const { canvas, ctx } = createCanvas(32, 32);
      // Countertop
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(2, 6, 28, 24);
      // Basin
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(6, 10, 20, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(7, 11, 18, 12);
      // Water
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8, 14, 16, 7);
      // Silver Faucet
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(14, 3, 4, 8);
      ctx.fillRect(12, 3, 4, 3);
      tm.addCanvas('obj_sink', canvas);
    }

    // Living Room Sofa (36x24)
    if (!tm.exists('obj_sofa')) {
      const { canvas, ctx } = createCanvas(36, 24);
      // Red velvet sofa back
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(2, 2, 32, 10);
      // Cushions
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(3, 10, 30, 10);
      // Armrests
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(1, 6, 4, 15);
      ctx.fillRect(31, 6, 4, 15);
      // Gold trim
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4, 2, 28, 2);
      tm.addCanvas('obj_sofa', canvas);
    }

    // Ancient Forest Tablet (24x30)
    if (!tm.exists('obj_tablet')) {
      const { canvas, ctx } = createCanvas(24, 30);
      // Ancient stone
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(12, 10, 10, Math.PI, 0);
      ctx.lineTo(22, 28);
      ctx.lineTo(2, 28);
      ctx.closePath();
      ctx.fill();
      // Cracks & Glyphs
      ctx.fillStyle = '#38bdf8'; // Glowing rune
      ctx.fillRect(7, 12, 10, 2);
      ctx.fillRect(11, 9, 2, 8);
      ctx.fillRect(8, 18, 8, 2);
      ctx.fillRect(10, 22, 4, 2);
      tm.addCanvas('obj_tablet', canvas);
    }

    // Altar for Crown (32x32)
    if (!tm.exists('obj_altar')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 16, 24, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(2, 12, 28, 6);
      // Gold trim
      ctx.fillStyle = '#fbbf24';
      ctx.strokeRect(3, 13, 26, 4);
      // Magic blue pedestal light
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(12, 14, 8, 2);
      tm.addCanvas('obj_altar', canvas);
    }

    // Sword Swing Slash Effect (32x32)
    if (!tm.exists('fx_slash')) {
      const { canvas, ctx } = createCanvas(32, 32);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(16, 16, 12, -Math.PI / 4, Math.PI / 2);
      ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(16, 16, 12, -Math.PI / 4, Math.PI / 2);
      ctx.stroke();
      tm.addCanvas('fx_slash', canvas);
    }
  }
}
