// monsters.js — 完成版 31体定義
// Ver0.1 で実際に使うのは flame_puppy のみ
// 属性: fire/water/grass/light/dark/dragon
// type: attack/defense  form: 1/2/3  (dragon のみ form:1 で1体)

export const MONSTERS = {
  // ── Fire / Attack ──────────────────────────────
  flame_puppy:   { id:'flame_puppy',   name:'フレイムパピー',         attribute:'fire',  type:'attack',  form:1, icon:'🔥', color:'#FF6B35', stats:{hp:120, atk:25, range:40, atkInterval:1.2, speed:35, cost:100, cooldown:5  } },
  inferno_cat:   { id:'inferno_cat',   name:'インフェルノキャット',   attribute:'fire',  type:'attack',  form:2, icon:'🔥', color:'#FF4500', stats:{hp:280, atk:55, range:50, atkInterval:1.4, speed:30, cost:200, cooldown:8  } },
  vulcan_lord:   { id:'vulcan_lord',   name:'ヴォルカンロード',       attribute:'fire',  type:'attack',  form:3, icon:'🔥', color:'#CC2200', stats:{hp:550, atk:110,range:60, atkInterval:1.8, speed:25, cost:350, cooldown:12 } },
  // ── Fire / Defense ─────────────────────────────
  ember_turtle:  { id:'ember_turtle',  name:'エンバータートル',       attribute:'fire',  type:'defense', form:1, icon:'🛡️', color:'#E8632E', stats:{hp:400, atk:15, range:30, atkInterval:2.5, speed:15, cost:120, cooldown:7  } },
  magma_turtle:  { id:'magma_turtle',  name:'マグマタートル',         attribute:'fire',  type:'defense', form:2, icon:'🛡️', color:'#C0392B', stats:{hp:900, atk:28, range:35, atkInterval:3.0, speed:12, cost:240, cooldown:12 } },
  inferno_fort:  { id:'inferno_fort',  name:'インフェルノフォート',   attribute:'fire',  type:'defense', form:3, icon:'🛡️', color:'#8B0000', stats:{hp:1800,atk:50, range:40, atkInterval:3.5, speed:10, cost:400, cooldown:18 } },
  // ── Water / Attack ─────────────────────────────
  aqua_kit:      { id:'aqua_kit',      name:'アクアキット',           attribute:'water', type:'attack',  form:1, icon:'💧', color:'#4488FF', stats:{hp:100, atk:22, range:55, atkInterval:1.0, speed:38, cost:100, cooldown:5  } },
  tide_lynx:     { id:'tide_lynx',     name:'タイドリンクス',         attribute:'water', type:'attack',  form:2, icon:'💧', color:'#2255CC', stats:{hp:240, atk:48, range:65, atkInterval:1.2, speed:32, cost:200, cooldown:8  } },
  deep_emperor:  { id:'deep_emperor',  name:'ディープエンペラー',     attribute:'water', type:'attack',  form:3, icon:'💧', color:'#001F7A', stats:{hp:480, atk:95, range:75, atkInterval:1.5, speed:28, cost:350, cooldown:12 } },
  // ── Water / Defense ────────────────────────────
  foam_crab:     { id:'foam_crab',     name:'フォームクラブ',         attribute:'water', type:'defense', form:1, icon:'🛡️', color:'#5599FF', stats:{hp:380, atk:12, range:30, atkInterval:2.8, speed:14, cost:120, cooldown:7  } },
  tidal_crab:    { id:'tidal_crab',    name:'タイダルクラブ',         attribute:'water', type:'defense', form:2, icon:'🛡️', color:'#0044AA', stats:{hp:850, atk:24, range:35, atkInterval:3.2, speed:11, cost:240, cooldown:12 } },
  levia_shell:   { id:'levia_shell',   name:'レヴィアタンシェル',     attribute:'water', type:'defense', form:3, icon:'🛡️', color:'#002266', stats:{hp:1700,atk:42, range:40, atkInterval:3.8, speed:9,  cost:400, cooldown:18 } },
  // ── Grass / Attack ─────────────────────────────
  leaf_bunny:    { id:'leaf_bunny',    name:'リーフバニー',           attribute:'grass', type:'attack',  form:1, icon:'🌿', color:'#44CC44', stats:{hp:90,  atk:20, range:45, atkInterval:0.9, speed:40, cost:100, cooldown:5  } },
  vine_hare:     { id:'vine_hare',     name:'ヴァインヘア',           attribute:'grass', type:'attack',  form:2, icon:'🌿', color:'#228822', stats:{hp:210, atk:44, range:55, atkInterval:1.1, speed:34, cost:200, cooldown:8  } },
  ancient_beast: { id:'ancient_beast', name:'エンシェントビースト',   attribute:'grass', type:'attack',  form:3, icon:'🌿', color:'#114411', stats:{hp:420, atk:88, range:65, atkInterval:1.4, speed:28, cost:350, cooldown:12 } },
  // ── Grass / Defense ────────────────────────────
  moss_bear:     { id:'moss_bear',     name:'モスベア',               attribute:'grass', type:'defense', form:1, icon:'🛡️', color:'#66BB66', stats:{hp:420, atk:14, range:28, atkInterval:2.6, speed:16, cost:120, cooldown:7  } },
  forest_bear:   { id:'forest_bear',   name:'フォレストベア',         attribute:'grass', type:'defense', form:2, icon:'🛡️', color:'#338833', stats:{hp:950, atk:26, range:32, atkInterval:3.1, speed:13, cost:240, cooldown:12 } },
  guardian_tree: { id:'guardian_tree', name:'ガーディアンツリー',     attribute:'grass', type:'defense', form:3, icon:'🛡️', color:'#115511', stats:{hp:1900,atk:46, range:38, atkInterval:3.6, speed:8,  cost:400, cooldown:18 } },
  // ── Light / Attack ─────────────────────────────
  holy_sprite:   { id:'holy_sprite',   name:'ホーリースプライト',     attribute:'light', type:'attack',  form:1, icon:'✨', color:'#FFD700', stats:{hp:110, atk:23, range:60, atkInterval:1.1, speed:36, cost:100, cooldown:5  } },
  radiant_fox:   { id:'radiant_fox',   name:'ラディアントフォックス', attribute:'light', type:'attack',  form:2, icon:'✨', color:'#FFA500', stats:{hp:260, atk:50, range:70, atkInterval:1.3, speed:30, cost:200, cooldown:8  } },
  seraph_lord:   { id:'seraph_lord',   name:'セラフロード',           attribute:'light', type:'attack',  form:3, icon:'✨', color:'#CC8800', stats:{hp:510, atk:100,range:80, atkInterval:1.6, speed:26, cost:350, cooldown:12 } },
  // ── Light / Defense ────────────────────────────
  shield_angel:  { id:'shield_angel',  name:'シールドエンジェル',     attribute:'light', type:'defense', form:1, icon:'🛡️', color:'#FFEE88', stats:{hp:390, atk:13, range:32, atkInterval:2.7, speed:15, cost:120, cooldown:7  } },
  holy_paladin:  { id:'holy_paladin',  name:'ホーリーパラディン',     attribute:'light', type:'defense', form:2, icon:'🛡️', color:'#DDAA00', stats:{hp:880, atk:25, range:38, atkInterval:3.2, speed:12, cost:240, cooldown:12 } },
  divine_sent:   { id:'divine_sent',   name:'ディバインセンチネル',   attribute:'light', type:'defense', form:3, icon:'🛡️', color:'#886600', stats:{hp:1750,atk:44, range:45, atkInterval:3.7, speed:9,  cost:400, cooldown:18 } },
  // ── Dark / Attack ──────────────────────────────
  shadow_imp:    { id:'shadow_imp',    name:'シャドウインプ',         attribute:'dark',  type:'attack',  form:1, icon:'🌙', color:'#9944CC', stats:{hp:95,  atk:28, range:38, atkInterval:0.95,speed:42, cost:100, cooldown:5  } },
  void_panther:  { id:'void_panther',  name:'ヴォイドパンサー',       attribute:'dark',  type:'attack',  form:2, icon:'🌙', color:'#6622AA', stats:{hp:220, atk:60, range:46, atkInterval:1.1, speed:36, cost:200, cooldown:8  } },
  void_emperor:  { id:'void_emperor',  name:'ヴォイドエンペラー',     attribute:'dark',  type:'attack',  form:3, icon:'🌙', color:'#330077', stats:{hp:440, atk:120,range:55, atkInterval:1.4, speed:30, cost:350, cooldown:12 } },
  // ── Dark / Defense ─────────────────────────────
  dark_golem:    { id:'dark_golem',    name:'ダークゴーレム',         attribute:'dark',  type:'defense', form:1, icon:'🛡️', color:'#774499', stats:{hp:450, atk:16, range:28, atkInterval:2.5, speed:14, cost:120, cooldown:7  } },
  void_titan:    { id:'void_titan',    name:'ヴォイドタイタン',       attribute:'dark',  type:'defense', form:2, icon:'🛡️', color:'#552277', stats:{hp:1000,atk:30, range:33, atkInterval:3.0, speed:11, cost:240, cooldown:12 } },
  abyssal_guard: { id:'abyssal_guard', name:'アビサルガード',         attribute:'dark',  type:'defense', form:3, icon:'🛡️', color:'#220044', stats:{hp:2000,atk:54, range:40, atkInterval:3.5, speed:8,  cost:400, cooldown:18 } },
  // ── Dragon (1体) ───────────────────────────────
  dragon_king:   { id:'dragon_king',   name:'ドラゴンキング',         attribute:'dragon',type:'attack',  form:1, icon:'🐉', color:'#CC2244', stats:{hp:800, atk:150,range:70, atkInterval:2.5, speed:20, cost:450, cooldown:20 } },
};
// 合計 31体: fire×6, water×6, grass×6, light×6, dark×6, dragon×1
