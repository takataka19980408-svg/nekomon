// enemies.js — 敵キャラ定義
// Ver0.1: leaf_slime のみ使用

export const ENEMIES = {
  // ── Ver0.1 ────────────────────────────────────
  leaf_slime: {
    id:'leaf_slime', name:'リーフスライム', attribute:'grass',
    icon:'🟢', color:'#55CC55',
    stats:{ hp:60, atk:12, range:30, atkInterval:1.5, speed:20 },
  },
  // ── 草系 ──────────────────────────────────────
  grass_goblin: {
    id:'grass_goblin', name:'グラスゴブリン', attribute:'grass',
    icon:'👺', color:'#4CAF50',
    stats:{ hp:200, atk:30, range:40, atkInterval:1.8, speed:28 },
  },
  grass_boss: {
    id:'grass_boss', name:'フォレストキング', attribute:'grass',
    icon:'👾', color:'#1B5E20',
    stats:{ hp:1500, atk:80, range:50, atkInterval:2.5, speed:15 },
  },
  // ── 水系 ──────────────────────────────────────
  water_fish: {
    id:'water_fish', name:'アクアフィッシュ', attribute:'water',
    icon:'🐟', color:'#1565C0',
    stats:{ hp:180, atk:28, range:55, atkInterval:1.5, speed:32 },
  },
  water_crab: {
    id:'water_crab', name:'タイダルクラブ', attribute:'water',
    icon:'🦀', color:'#0D47A1',
    stats:{ hp:600, atk:55, range:45, atkInterval:2.2, speed:18 },
  },
  // ── 火系 ──────────────────────────────────────
  fire_imp: {
    id:'fire_imp', name:'フレイムインプ', attribute:'fire',
    icon:'😈', color:'#E64A19',
    stats:{ hp:160, atk:35, range:45, atkInterval:1.3, speed:35 },
  },
  // ── 闇系 ──────────────────────────────────────
  dark_shade: {
    id:'dark_shade', name:'ダークシェイド', attribute:'dark',
    icon:'👻', color:'#6A1B9A',
    stats:{ hp:140, atk:40, range:40, atkInterval:1.2, speed:38 },
  },
  // ── 竜系 ──────────────────────────────────────
  dragon_hatchling: {
    id:'dragon_hatchling', name:'ドラゴンの幼体', attribute:'dragon',
    icon:'🐲', color:'#C62828',
    stats:{ hp:500, atk:70, range:60, atkInterval:2.0, speed:25 },
  },
};
