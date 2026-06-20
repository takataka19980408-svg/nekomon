// skills.js — すべての技データ。skillId で monsters.js から参照される。
export const SKILLS = [
  // ── 火属性 ──────────────────────────────────────
  { id:'fire_strike_1',  name:'フレイムストライク', description:'小さな炎弾を放つ。',             chargeTime:15, damage:600,  type:'damage', effect:null,    effectDuration:null, range:200 },
  { id:'fire_strike_2',  name:'インフェルノブラスト',description:'強烈な炎の塊を叩きつける。',     chargeTime:18, damage:1200, type:'damage', effect:'burn',  effectDuration:3,    range:220 },
  { id:'fire_strike_3',  name:'ヴォルカンレイジ',   description:'周囲を溶岩で覆い尽くす。',       chargeTime:20, damage:2000, type:'damage', effect:'burn',  effectDuration:5,    range:250 },
  { id:'fire_wall_1',    name:'エンバーシールド',   description:'炎の壁で身を守る。',             chargeTime:18, damage:0,    type:'buff',   effect:'defend',effectDuration:4,    range:0   },
  { id:'fire_wall_2',    name:'マグマアーマー',     description:'溶岩を纏い防御力が上がる。',     chargeTime:20, damage:400,  type:'buff',   effect:'defend',effectDuration:5,    range:100 },
  { id:'fire_wall_3',    name:'ヴォルカンフォート', description:'要塞化し周囲を焼き払う。',       chargeTime:25, damage:800,  type:'buff',   effect:'defend',effectDuration:6,    range:150 },
  // ── 水属性 ──────────────────────────────────────
  { id:'water_strike_1', name:'アクアショット',     description:'水の弾を勢いよく放つ。',         chargeTime:15, damage:580,  type:'damage', effect:null,    effectDuration:null, range:210 },
  { id:'water_strike_2', name:'タイダルウェーブ',   description:'巨大な波で敵を薙ぎ払う。',       chargeTime:18, damage:1150, type:'damage', effect:'slow',  effectDuration:3,    range:230 },
  { id:'water_strike_3', name:'ティアマトの洪水',   description:'大海の力で全てを飲み込む。',     chargeTime:22, damage:1950, type:'damage', effect:'slow',  effectDuration:5,    range:260 },
  { id:'water_wall_1',   name:'リバーシェル',       description:'水流で身を包み守る。',           chargeTime:18, damage:0,    type:'buff',   effect:'defend',effectDuration:4,    range:0   },
  { id:'water_wall_2',   name:'タイダルシールド',   description:'潮流の盾で強固に守る。',         chargeTime:20, damage:300,  type:'buff',   effect:'defend',effectDuration:5,    range:80  },
  { id:'water_wall_3',   name:'オーシャンバスティオン',description:'深海の守りで全てを防ぐ。',  chargeTime:25, damage:600,  type:'buff',   effect:'defend',effectDuration:7,    range:120 },
  // ── 草属性 ──────────────────────────────────────
  { id:'grass_strike_1', name:'ヴァインスラッシュ', description:'鋭い蔓で斬りつける。',           chargeTime:14, damage:560,  type:'damage', effect:null,    effectDuration:null, range:180 },
  { id:'grass_strike_2', name:'ソーンレイン',       description:'無数の棘が降り注ぐ。',           chargeTime:17, damage:1100, type:'damage', effect:'poison',effectDuration:4,    range:240 },
  { id:'grass_strike_3', name:'グランドリーパー',   description:'大地が裂け根が全てを絡め取る。', chargeTime:22, damage:1900, type:'damage', effect:'poison',effectDuration:6,    range:270 },
  { id:'grass_wall_1',   name:'モスシールド',       description:'苔の鎧で体を覆う。',             chargeTime:17, damage:0,    type:'buff',   effect:'regen', effectDuration:5,    range:0   },
  { id:'grass_wall_2',   name:'アーバーガード',     description:'古木の皮で守りを固める。',       chargeTime:20, damage:200,  type:'buff',   effect:'regen', effectDuration:6,    range:60  },
  { id:'grass_wall_3',   name:'エンシェントルーツ', description:'太古の根が大地に根付く。',       chargeTime:25, damage:500,  type:'buff',   effect:'regen', effectDuration:8,    range:100 },
  // ── 光属性 ──────────────────────────────────────
  { id:'light_strike_1', name:'ホーリーライト',     description:'聖なる光の矢を放つ。',           chargeTime:16, damage:620,  type:'damage', effect:null,    effectDuration:null, range:220 },
  { id:'light_strike_2', name:'ソーラーフレア',     description:'太陽の炎で焼き尽くす。',         chargeTime:19, damage:1250, type:'damage', effect:'blind', effectDuration:3,    range:250 },
  { id:'light_strike_3', name:'オーロラジャッジメント',description:'天空の裁きが降り注ぐ。',     chargeTime:23, damage:2100, type:'damage', effect:'blind', effectDuration:5,    range:280 },
  { id:'light_wall_1',   name:'ホーリーバリア',     description:'聖なる壁で守る。',               chargeTime:18, damage:0,    type:'buff',   effect:'defend',effectDuration:4,    range:0   },
  { id:'light_wall_2',   name:'ガーディアンシールド',description:'守護の盾が攻撃を弾く。',       chargeTime:21, damage:350,  type:'buff',   effect:'defend',effectDuration:6,    range:90  },
  { id:'light_wall_3',   name:'ホーリーバスティオン',description:'聖域を作り出し全てを守る。',  chargeTime:26, damage:700,  type:'buff',   effect:'defend',effectDuration:8,    range:130 },
  // ── 闇属性 ──────────────────────────────────────
  { id:'dark_strike_1',  name:'シャドウクロー',     description:'暗闇の爪で切り裂く。',           chargeTime:14, damage:640,  type:'damage', effect:null,    effectDuration:null, range:190 },
  { id:'dark_strike_2',  name:'ナイトメアファング',  description:'悪夢の牙が魂を噛む。',           chargeTime:17, damage:1300, type:'damage', effect:'curse', effectDuration:4,    range:220 },
  { id:'dark_strike_3',  name:'ヴォイドリーパー',   description:'虚無が全てを刈り取る。',         chargeTime:21, damage:2200, type:'damage', effect:'curse', effectDuration:6,    range:260 },
  { id:'dark_wall_1',    name:'ダークシェル',       description:'闇の殻で身を包む。',             chargeTime:17, damage:0,    type:'buff',   effect:'dodge', effectDuration:4,    range:0   },
  { id:'dark_wall_2',    name:'アビスアーマー',     description:'深淵の鎧が攻撃を無効化する。',   chargeTime:20, damage:250,  type:'buff',   effect:'dodge', effectDuration:5,    range:70  },
  { id:'dark_wall_3',    name:'チェインオブヴォイド',description:'虚無の鎖で敵の攻撃を封じる。', chargeTime:25, damage:550,  type:'buff',   effect:'dodge', effectDuration:7,    range:110 },
  // ── 竜属性 ──────────────────────────────────────
  { id:'dragon_breath',  name:'ドラゴンブレス',     description:'全属性の息吹で全てを薙ぎ払う。', chargeTime:25, damage:2500, type:'damage', effect:'burn',  effectDuration:4,    range:300 },
];
