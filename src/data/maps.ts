export type AreaKey = 'VILLAGE' | 'GARDEN' | 'CASTLE' | 'FOREST';

export interface PortalDef {
  x: number; // tile x (left / top-most tile of portal)
  y: number; // tile y
  width?: number; // width in tiles (e.g. 2 for 2-tile wide door)
  height?: number; // height in tiles (e.g. 2 for 2-tile tall door)
  targetArea: AreaKey;
  targetX: number; // target tile x
  targetY: number; // target tile y
  label: string;
}

export interface NPCDef {
  id: string;
  name: string;
  title: string;
  spriteKey: string;
  x: number; // tile x
  y: number; // tile y
  questionId?: string;
  dialogueIntro: string;
  dialogueSolved: string;
  avatarIcon: string;
}

export interface ObjectDef {
  id: string;
  name: string;
  spriteKey: string;
  x: number; // tile x
  y: number; // tile y
  questionId?: string;
  promptText: string;
  examineText: string;
  isCrownAltar?: boolean;
}

export interface EnemyDef {
  id: string;
  type: 'slime' | 'boss';
  x: number;
  y: number;
  health: number;
}

export interface AreaData {
  key: AreaKey;
  name: string;
  widthInTiles: number;
  heightInTiles: number;
  defaultTile: string;
  portals: PortalDef[];
  npcs: NPCDef[];
  objects: ObjectDef[];
  enemies: EnemyDef[];
  // Blocked tiles (walls/obstacles) as sets or grid rows
  layout: string[];
}

export const AREA_MAPS: Record<AreaKey, AreaData> = {
  VILLAGE: {
    key: 'VILLAGE',
    name: 'Alun-Alun Istana Kerajaan (Village Square)',
    widthInTiles: 25,
    heightInTiles: 20,
    defaultTile: 'tile_grass',
    portals: [
      { x: 24, y: 10, width: 1, height: 2, targetArea: 'GARDEN', targetX: 2, targetY: 10.5, label: 'Taman Bunga Kerajaan ➡️' },
      { x: 12, y: 0, width: 2, height: 1, targetArea: 'CASTLE', targetX: 12.5, targetY: 17, label: '⬆️ Istana & Dapur' },
      { x: 12, y: 19, width: 2, height: 1, targetArea: 'FOREST', targetX: 12.5, targetY: 2, label: '⬇️ Hutan Rahasia' }
    ],
    npcs: [
      {
        id: 'npc_princess',
        name: 'Putri Cahaya',
        title: 'Putri Kerajaan Bintang',
        spriteKey: 'npc_princess',
        x: 12,
        y: 6,
        avatarIcon: '👑',
        dialogueIntro: 'Prajurit! Mahkota Bintang hilang dicuri monster di Hutan Rahasia! Temui warga kerajaan untuk mencari petunjuk dan kunci gerbang hutan!',
        dialogueSolved: 'Terima kasih, Prajurit pemberani! Festival Kerajaan Bintang kini terselamatkan berkat kecerdasan dan keberanianmu!'
      },
      {
        id: 'npc_guard_village',
        name: 'Penjaga Alun-alun',
        title: 'Prajurit Kerajaan',
        spriteKey: 'npc_guard',
        x: 7,
        y: 10,
        questionId: 'q_likes',
        avatarIcon: '🛡️',
        dialogueIntro: 'Salam prajurit! Sebelum memulai misi, mari kita uji kecakapan bahasa Inggrismu tentang kesukaan (Likes and Dislikes)!',
        dialogueSolved: 'Kerja bagus! Jangan lupa periksa keranjang buah di sebelah pasar untuk petunjuk selanjutnya!'
      }
    ],
    objects: [
      {
        id: 'obj_fruit_basket',
        name: 'Keranjang Buah Segar',
        spriteKey: 'obj_fruit_basket',
        x: 17,
        y: 10,
        questionId: 'q_numbers',
        promptText: 'Tekan [E] untuk Periksa Keranjang Buah',
        examineText: 'Sebuah keranjang penuh buah apel merah ranum. Ada tulisan angka dalam bahasa Inggris!'
      },
      {
        id: 'obj_fountain_village',
        name: 'Air Mancur Alun-alun',
        spriteKey: 'obj_fountain',
        x: 12,
        y: 11,
        promptText: 'Tekan [E] untuk Minum Air Segar',
        examineText: 'Air mancur istana yang jernih memulihkan staminamu! Airnya sangat segar.'
      }
    ],
    enemies: [
      { id: 'village_slime_1', type: 'slime', x: 3, y: 7, health: 2 },
      { id: 'village_slime_2', type: 'slime', x: 21, y: 7, health: 2 },
      { id: 'village_slime_3', type: 'slime', x: 4, y: 16, health: 2 },
      { id: 'village_slime_4', type: 'slime', x: 20, y: 16, health: 2 }
    ],
    layout: [
      'WWWWWWWWWWWW..WWWWWWWWWWW', // y=0 (North exit at 12)
      'W.......................W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W.......................W',
      'W..........PPP..........W',
      'W..........PPP..........W',
      'W..........PPP..........W',
      'W.......................W',
      'W.....PPPPP...PPPPP.....W',
      'W........................', // y=10 (East exit at 24)
      'W........................',
      'W.......................W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'WWWWWWWWWWWW..WWWWWWWWWWW'  // y=19 (South exit at 12)
    ]
  },

  GARDEN: {
    key: 'GARDEN',
    name: 'Taman Bunga Kerajaan (Royal Whispering Garden)',
    widthInTiles: 25,
    heightInTiles: 20,
    defaultTile: 'tile_grass',
    portals: [
      { x: 0, y: 10, width: 1, height: 2, targetArea: 'VILLAGE', targetX: 22, targetY: 10.5, label: '⬅️ Alun-Alun Istana' }
    ],
    npcs: [
      {
        id: 'npc_gardener',
        name: 'Tukang Kebun Rama',
        title: 'Pemelihara Taman',
        spriteKey: 'npc_gardener',
        x: 10,
        y: 7,
        questionId: 'q_hobbies',
        avatarIcon: '🌻',
        dialogueIntro: 'Halo! Selamat datang di taman bunga. Aku suka merawat bunga dan memiliki hobi yang menyenangkan!',
        dialogueSolved: 'Senang berbicara denganmu! Coba periksa patung kucing di dekat bunga dan meja belajar di gazebo!'
      }
    ],
    objects: [
      {
        id: 'obj_cat_garden',
        name: 'Patung Kucing Oranye',
        spriteKey: 'obj_cat',
        x: 17,
        y: 8,
        questionId: 'q_there_is',
        promptText: 'Tekan [E] untuk Periksa Kucing Taman',
        examineText: 'Seekor kucing manis sedang bersantai di taman. Ada teka-teki "There is / There are" terukir di dekatnya!'
      },
      {
        id: 'obj_desk_garden',
        name: 'Meja Belajar Gazebo',
        spriteKey: 'obj_desk',
        x: 14,
        y: 14,
        questionId: 'q_preposition',
        promptText: 'Tekan [E] untuk Periksa Meja Belajar',
        examineText: 'Meja kayu di bawah rindang gazebo. Ada tas sekolah di bawahnya yang memuat petunjuk tentang Dapur Istana!'
      }
    ],
    enemies: [
      { id: 'garden_slime_1', type: 'slime', x: 4, y: 7, health: 2 },
      { id: 'garden_slime_2', type: 'slime', x: 21, y: 6, health: 2 },
      { id: 'garden_slime_3', type: 'slime', x: 12, y: 3, health: 2 },
      { id: 'garden_slime_4', type: 'slime', x: 4, y: 13, health: 2 },
      { id: 'garden_slime_5', type: 'slime', x: 20, y: 12, health: 2 },
      { id: 'garden_slime_6', type: 'slime', x: 12, y: 17, health: 2 }
    ],
    layout: [
      'WWWWWWWWWWWWWWWWWWWWWWWWW',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W......FFFF...FFFF......W',
      'W......FFFF...FFFF......W',
      'W.......................W',
      'W.......................W',
      'W..........PPP..........W',
      'W..........PPP..........W',
      'W..........PPP..........W',
      '...........PPP..........W', // y=10 (West exit at 0)
      '...........PPP..........W',
      'W.......................W',
      'W.......................W',
      'W......FFFF...FFFF......W',
      'W......FFFF...FFFF......W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W.......................W',
      'WWWWWWWWWWWWWWWWWWWWWWWWW'
    ]
  },

  CASTLE: {
    key: 'CASTLE',
    name: 'Ruang Istana & Dapur (Castle Hall & Kitchen)',
    widthInTiles: 25,
    heightInTiles: 20,
    defaultTile: 'tile_castle_floor',
    portals: [
      { x: 12, y: 19, width: 2, height: 1, targetArea: 'VILLAGE', targetX: 12.5, targetY: 2, label: '⬇️ Alun-Alun Istana' }
    ],
    npcs: [
      {
        id: 'npc_chef',
        name: 'Koki Istana Budi',
        title: 'Kepala Dapur Kerajaan',
        spriteKey: 'npc_chef',
        x: 6,
        y: 8,
        questionId: 'q_meals',
        avatarIcon: '👨‍🍳',
        dialogueIntro: 'Selamat datang di Dapur Kerajaan! Jam istana sudah menunjukkan siang hari. Tahukah kamu nama waktu makan ini?',
        dialogueSolved: 'Aroma masakan lezat selalu ada di sini! Jangan lupa periksa wastafel dapur untuk mencari kunci hutan!'
      }
    ],
    objects: [
      {
        id: 'obj_sink_kitchen',
        name: 'Wastafel Dapur Istana',
        spriteKey: 'obj_sink',
        x: 4,
        y: 6,
        questionId: 'q_kitchen_activities',
        promptText: 'Tekan [E] untuk Periksa Wastafel Dapur',
        examineText: 'Bak cuci piring perak yang bersih berkilau. Di dalamnya tersimpan Kunci Hutan Rahasia!'
      },
      {
        id: 'obj_sofa_castle',
        name: 'Sofa Beludru Ruang Tamu',
        spriteKey: 'obj_sofa',
        x: 18,
        y: 7,
        questionId: 'q_living_room',
        promptText: 'Tekan [E] untuk Periksa Ruang Tamu',
        examineText: 'Sofa mewah tempat peristirahatan keluarga kerajaan. Ada kuis tentang perabotan ruang tamu!'
      }
    ],
    enemies: [
      { id: 'castle_slime_1', type: 'slime', x: 12, y: 4, health: 2 },
      { id: 'castle_slime_2', type: 'slime', x: 4, y: 12, health: 2 },
      { id: 'castle_slime_3', type: 'slime', x: 20, y: 12, health: 2 },
      { id: 'castle_slime_4', type: 'slime', x: 7, y: 15, health: 2 },
      { id: 'castle_slime_5', type: 'slime', x: 17, y: 15, health: 2 },
      { id: 'castle_slime_6', type: 'slime', x: 12, y: 11, health: 3 }
    ],
    layout: [
      'WWWWWWWWWWWWWWWWWWWWWWWWW',
      'W.......................W',
      'W...WWWWWW.....WWWWWW...W',
      'W...W...............W...W',
      'W...W...............W...W',
      'W...W...............W...W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'WWWWWWWWWWWW..WWWWWWWWWWW'  // y=19 (South exit at 12)
    ]
  },

  FOREST: {
    key: 'FOREST',
    name: 'Gerbang & Hutan Rahasia (Secret Forest & Crown Altar)',
    widthInTiles: 25,
    heightInTiles: 24,
    defaultTile: 'tile_forest_grass',
    portals: [
      { x: 12, y: 0, width: 2, height: 1, targetArea: 'VILLAGE', targetX: 12.5, targetY: 17, label: '⬆️ Alun-Alun Istana' }
    ],
    npcs: [
      {
        id: 'npc_gatekeeper',
        name: 'Penjaga Gerbang Hutan',
        title: 'Penjaga Batas Kerajaan',
        spriteKey: 'npc_gatekeeper',
        x: 12,
        y: 4,
        questionId: 'q_transportation',
        avatarIcon: '🛡️',
        dialogueIntro: 'Hutan Rahasia di depan sangat berbahaya! Jawab pertanyaanku tentang transportasi ke sekolah jika kamu ingin lewat!',
        dialogueSolved: 'Bagus sekali! Gerbang dibuka. Kalahkan monster di dalam dan kembalikan Mahkota Bintang!'
      }
    ],
    objects: [
      {
        id: 'obj_tablet_forest',
        name: 'Prasasti Kuno Hutan',
        spriteKey: 'obj_tablet',
        x: 12,
        y: 15,
        questionId: 'q_present_continuous',
        promptText: 'Tekan [E] untuk Membaca Prasasti Kuno',
        examineText: 'Batu prasasti bersinar ungu dengan mantra kuno Present Continuous. Mengaktifkannya akan mengungkap altar mahkota!'
      },
      {
        id: 'obj_crown_altar',
        name: 'Altar Mahkota Bintang',
        spriteKey: 'obj_altar',
        x: 12,
        y: 20,
        isCrownAltar: true,
        promptText: 'Tekan [E] untuk Mengambil Mahkota Bintang!',
        examineText: 'Mahkota Bintang berkilau terang memancarkan cahaya keemasan!'
      }
    ],
    enemies: [
      { id: 'slime_forest_north_1', type: 'slime', x: 7, y: 8, health: 2 },
      { id: 'slime_forest_north_2', type: 'slime', x: 17, y: 8, health: 2 },
      { id: 'slime_1', type: 'slime', x: 7, y: 11, health: 2 },
      { id: 'slime_2', type: 'slime', x: 17, y: 11, health: 2 },
      { id: 'slime_forest_mid', type: 'slime', x: 12, y: 10, health: 2 },
      { id: 'slime_forest_west_1', type: 'slime', x: 4, y: 15, health: 2 },
      { id: 'slime_forest_east_1', type: 'slime', x: 20, y: 15, health: 2 },
      { id: 'slime_mini_boss', type: 'boss', x: 6, y: 13, health: 3 },
      { id: 'slime_3', type: 'slime', x: 8, y: 17, health: 2 },
      { id: 'slime_forest_south_1', type: 'slime', x: 16, y: 17, health: 2 },
      { id: 'slime_forest_south_2', type: 'slime', x: 5, y: 19, health: 2 },
      { id: 'slime_forest_south_3', type: 'slime', x: 19, y: 19, health: 2 },
      { id: 'slime_altar_guard_1', type: 'slime', x: 8, y: 21, health: 2 },
      { id: 'slime_altar_guard_2', type: 'slime', x: 16, y: 21, health: 2 },
      { id: 'boss_guardian', type: 'boss', x: 12, y: 18, health: 5 }
    ],
    layout: [
      'WWWWWWWWWWWW..WWWWWWWWWWW', // y=0 entrance
      'W.......................W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'WWWWWWWWWWWW..WWWWWWWWWWW', // Gate line at y=4
      'W.......................W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W...TT.............TT...W',
      'W...TT.............TT...W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'W.......................W',
      'WWWWWWWWWWWWWWWWWWWWWWWWW'
    ]
  }
};
