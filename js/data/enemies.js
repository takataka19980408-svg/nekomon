// enemies.js — 敵キャラデータ。quests.js の enemyWaves から参照される。
// 追加: エントリを追加 → quests.js の enemyWaves に enemyId を追加するだけ。

export const ENEMIES = [
  // ── 草属性の敵 ───────────────────────────────────
  { id:'grass_goblin',   name:'グラスゴブリン',  attribute:'grass',
    stats:{ hp:600,  attack:120, defense:60,  attackInterval:2.5, moveSpeed:2.0, range:80  }, color:'#4CAF50' },
  { id:'grass_bear',     name:'モスベア',        attribute:'grass',
    stats:{ hp:2000, attack:250, defense:200, attackInterval:3.0, moveSpeed:1.5, range:90  }, color:'#2E7D32' },
  { id:'grass_boss',     name:'エンシェントビースト', attribute:'grass',
    stats:{ hp:6000, attack:400, defense:350, attackInterval:4.0, moveSpeed:1.0, range:100 }, color:'#1B5E20' },
  // ── 水属性の敵 ───────────────────────────────────
  { id:'water_fish',     name:'アクアフィッシュ', attribute:'water',
    stats:{ hp:550,  attack:110, defense:55,  attackInterval:2.3, moveSpeed:2.2, range:100 }, color:'#1565C0' },
  { id:'water_crab',     name:'タイダルクラブ',   attribute:'water',
    stats:{ hp:1800, attack:230, defense:220, attackInterval:3.2, moveSpeed:1.4, range:85  }, color:'#0D47A1' },
  { id:'water_boss',     name:'ディープシーキング', attribute:'water',
    stats:{ hp:5800, attack:380, defense:320, attackInterval:3.8, moveSpeed:0.9, range:110 }, color:'#01579B' },
  // ── 火属性の敵 ───────────────────────────────────
  { id:'fire_imp',       name:'フレイムインプ',   attribute:'fire',
    stats:{ hp:500,  attack:140, defense:50,  attackInterval:2.0, moveSpeed:2.5, range:95  }, color:'#E64A19' },
  { id:'fire_drake',     name:'ヴォルケイン',     attribute:'fire',
    stats:{ hp:2200, attack:280, defense:180, attackInterval:2.8, moveSpeed:1.8, range:110 }, color:'#BF360C' },
  { id:'fire_boss',      name:'インフェルノロード', attribute:'fire',
    stats:{ hp:6500, attack:450, defense:300, attackInterval:3.5, moveSpeed:1.2, range:120 }, color:'#870000' },
  // ── 光属性の敵 ───────────────────────────────────
  { id:'light_sprite',   name:'ホーリースプライト', attribute:'light',
    stats:{ hp:580,  attack:130, defense:65,  attackInterval:2.4, moveSpeed:2.1, range:120 }, color:'#F9A825' },
  { id:'light_paladin',  name:'堕天兵',           attribute:'light',
    stats:{ hp:1900, attack:260, defense:240, attackInterval:3.1, moveSpeed:1.5, range:100 }, color:'#F57F17' },
  { id:'light_boss',     name:'ファルスセラフ',    attribute:'light',
    stats:{ hp:6200, attack:420, defense:330, attackInterval:3.9, moveSpeed:1.0, range:130 }, color:'#E65100' },
  // ── 闇属性の敵 ───────────────────────────────────
  { id:'dark_shade',     name:'ダークシェイド',   attribute:'dark',
    stats:{ hp:520,  attack:150, defense:45,  attackInterval:1.9, moveSpeed:2.8, range:85  }, color:'#6A1B9A' },
  { id:'dark_knight',    name:'ヴォイドナイト',   attribute:'dark',
    stats:{ hp:2100, attack:300, defense:190, attackInterval:2.7, moveSpeed:1.9, range:95  }, color:'#4A148C' },
  { id:'dark_boss',      name:'ヴォイドエンペラー', attribute:'dark',
    stats:{ hp:7000, attack:500, defense:360, attackInterval:4.2, moveSpeed:0.8, range:110 }, color:'#38006B' },
  // ── 竜属性の敵 ───────────────────────────────────
  { id:'dragon_hatchling', name:'ドラゴンの幼体', attribute:'dragon',
    stats:{ hp:1500, attack:200, defense:150, attackInterval:2.5, moveSpeed:2.0, range:120 }, color:'#C62828' },
  { id:'dragon_elder',   name:'エルダードラゴン', attribute:'dragon',
    stats:{ hp:8000, attack:600, defense:500, attackInterval:5.0, moveSpeed:0.8, range:150 }, color:'#B71C1C' },
];

export const ENEMY_MAP = Object.fromEntries(ENEMIES.map(e => [e.id, e]));
