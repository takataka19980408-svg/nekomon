// monsters.js — 31体のモンスター定義。属性・タイプ・形態で分類。
// 追加: このファイルに新エントリを追加するだけで図鑑・孵化・バトルに反映される。

export const MONSTERS = [
  // ════════════════════════════════════
  //  火属性 攻撃型
  // ════════════════════════════════════
  {
    id:'fire_atk_1', name:'フレイムパピー', attribute:'fire', type:'attack', form:1,
    description:'炎を操る子犬の獣。とにかく素早いが紙装甲。',
    stats:{ hp:800,  attack:280, defense:80,  attackInterval:1.8, moveSpeed:3.5, range:100, cost:80  },
    skillId:'fire_strike_1', color:'#FF6B35',
  },
  {
    id:'fire_atk_2', name:'インフェルノキャット', attribute:'fire', type:'attack', form:2,
    description:'炎を纏い戦う中型の獣。攻撃力が一段と増した。',
    stats:{ hp:1800, attack:520, defense:150, attackInterval:2.0, moveSpeed:3.0, range:120, cost:160 },
    skillId:'fire_strike_2', color:'#FF4500',
  },
  {
    id:'fire_atk_3', name:'ヴォルカンロード', attribute:'fire', type:'attack', form:3,
    description:'火山の化身。一撃の重さは大地をも揺るがす。',
    stats:{ hp:3200, attack:900, defense:200, attackInterval:2.5, moveSpeed:2.8, range:140, cost:280 },
    skillId:'fire_strike_3', color:'#CC2200',
  },
  // ════════════════════════════════════
  //  火属性 防御型
  // ════════════════════════════════════
  {
    id:'fire_def_1', name:'エンバータートル', attribute:'fire', type:'defense', form:1,
    description:'炎の甲羅を持つカメ。のろいが丈夫。',
    stats:{ hp:2500, attack:140, defense:300, attackInterval:3.5, moveSpeed:1.5, range:80,  cost:120 },
    skillId:'fire_wall_1', color:'#E8632E',
  },
  {
    id:'fire_def_2', name:'マグマタートル', attribute:'fire', type:'defense', form:2,
    description:'溶岩の殻を纏う。触れるだけで火傷する。',
    stats:{ hp:5000, attack:220, defense:600, attackInterval:4.0, moveSpeed:1.2, range:80,  cost:240 },
    skillId:'fire_wall_2', color:'#C0392B',
  },
  {
    id:'fire_def_3', name:'ヴォルカンシールド', attribute:'fire', type:'defense', form:3,
    description:'生きた溶岩の要塞。壁として最高峰の存在。',
    stats:{ hp:9000, attack:320, defense:1100,attackInterval:5.0, moveSpeed:1.0, range:80,  cost:400 },
    skillId:'fire_wall_3', color:'#922B21',
  },
  // ════════════════════════════════════
  //  水属性 攻撃型
  // ════════════════════════════════════
  {
    id:'water_atk_1', name:'アクアサーペント', attribute:'water', type:'attack', form:1,
    description:'水流を操る小さな蛇。遠距離から素早く攻撃する。',
    stats:{ hp:750,  attack:270, defense:70,  attackInterval:1.7, moveSpeed:3.8, range:130, cost:75  },
    skillId:'water_strike_1', color:'#3498DB',
  },
  {
    id:'water_atk_2', name:'タイダルウルフ', attribute:'water', type:'attack', form:2,
    description:'潮流を纏うオオカミ。突進力が高い。',
    stats:{ hp:1700, attack:510, defense:140, attackInterval:1.9, moveSpeed:3.3, range:150, cost:155 },
    skillId:'water_strike_2', color:'#2980B9',
  },
  {
    id:'water_atk_3', name:'ティアマトサーペント', attribute:'water', type:'attack', form:3,
    description:'深海の大蛇。その尾の一振りで船を沈める。',
    stats:{ hp:3000, attack:880, defense:190, attackInterval:2.4, moveSpeed:3.0, range:170, cost:270 },
    skillId:'water_strike_3', color:'#1A5276',
  },
  // ════════════════════════════════════
  //  水属性 防御型
  // ════════════════════════════════════
  {
    id:'water_def_1', name:'リバークラブ', attribute:'water', type:'defense', form:1,
    description:'川に棲む硬いカニ。ハサミでしっかり守る。',
    stats:{ hp:2400, attack:130, defense:280, attackInterval:3.3, moveSpeed:1.6, range:75,  cost:115 },
    skillId:'water_wall_1', color:'#5DADE2',
  },
  {
    id:'water_def_2', name:'タイダルクラブ', attribute:'water', type:'defense', form:2,
    description:'大海のカニ。甲羅は砲弾も弾く。',
    stats:{ hp:4800, attack:210, defense:580, attackInterval:3.8, moveSpeed:1.3, range:75,  cost:230 },
    skillId:'water_wall_2', color:'#2471A3',
  },
  {
    id:'water_def_3', name:'オーシャンフォートレス', attribute:'water', type:'defense', form:3,
    description:'深海の要塞。その防御は海底と同じく底無し。',
    stats:{ hp:8800, attack:300, defense:1050,attackInterval:4.8, moveSpeed:1.0, range:75,  cost:390 },
    skillId:'water_wall_3', color:'#1B4F72',
  },
  // ════════════════════════════════════
  //  草属性 攻撃型
  // ════════════════════════════════════
  {
    id:'grass_atk_1', name:'リーフマンティ', attribute:'grass', type:'attack', form:1,
    description:'蔓を武器にするカマキリ型の獣。素早く連続攻撃する。',
    stats:{ hp:780,  attack:260, defense:75,  attackInterval:1.6, moveSpeed:3.6, range:110, cost:78  },
    skillId:'grass_strike_1', color:'#27AE60',
  },
  {
    id:'grass_atk_2', name:'ソーンウルフ', attribute:'grass', type:'attack', form:2,
    description:'棘の毛並みを持つオオカミ。接触するだけで敵を傷つける。',
    stats:{ hp:1750, attack:500, defense:145, attackInterval:1.9, moveSpeed:3.2, range:125, cost:158 },
    skillId:'grass_strike_2', color:'#1E8449',
  },
  {
    id:'grass_atk_3', name:'グランドリーパー', attribute:'grass', type:'attack', form:3,
    description:'大地に根を張る死神。その鎌は大木すら両断する。',
    stats:{ hp:3100, attack:870, defense:185, attackInterval:2.3, moveSpeed:2.9, range:145, cost:275 },
    skillId:'grass_strike_3', color:'#145A32',
  },
  // ════════════════════════════════════
  //  草属性 防御型
  // ════════════════════════════════════
  {
    id:'grass_def_1', name:'モスバック', attribute:'grass', type:'defense', form:1,
    description:'背中に苔を生やした亀のような生物。じっくり戦う。',
    stats:{ hp:2300, attack:125, defense:270, attackInterval:3.2, moveSpeed:1.7, range:78,  cost:112 },
    skillId:'grass_wall_1', color:'#2ECC71',
  },
  {
    id:'grass_def_2', name:'アーバースキン', attribute:'grass', type:'defense', form:2,
    description:'樹皮の鎧を持つ獣。毒に免疫がある。',
    stats:{ hp:4600, attack:200, defense:560, attackInterval:3.7, moveSpeed:1.4, range:78,  cost:225 },
    skillId:'grass_wall_2', color:'#1A8A47',
  },
  {
    id:'grass_def_3', name:'エンシェントトリー', attribute:'grass', type:'defense', form:3,
    description:'千年生きた樹の精霊。その根は大地に深く刻まれている。',
    stats:{ hp:8600, attack:290, defense:1020,attackInterval:4.7, moveSpeed:0.9, range:78,  cost:385 },
    skillId:'grass_wall_3', color:'#0E6B33',
  },
  // ════════════════════════════════════
  //  光属性 攻撃型
  // ════════════════════════════════════
  {
    id:'light_atk_1', name:'ホーリーチック', attribute:'light', type:'attack', form:1,
    description:'聖なるひよこ。遠距離から光の矢を放つ。',
    stats:{ hp:820,  attack:300, defense:85,  attackInterval:1.9, moveSpeed:3.3, range:150, cost:82  },
    skillId:'light_strike_1', color:'#F1C40F',
  },
  {
    id:'light_atk_2', name:'ソーラーファルコン', attribute:'light', type:'attack', form:2,
    description:'太陽を宿す鷹。光速の突撃が必殺技。',
    stats:{ hp:1900, attack:540, defense:160, attackInterval:2.1, moveSpeed:3.1, range:170, cost:165 },
    skillId:'light_strike_2', color:'#D4AC0D',
  },
  {
    id:'light_atk_3', name:'オーロラセラフ', attribute:'light', type:'attack', form:3,
    description:'天空の天使。その裁きは闇すら切り裂く。',
    stats:{ hp:3400, attack:950, defense:210, attackInterval:2.6, moveSpeed:2.7, range:200, cost:290 },
    skillId:'light_strike_3', color:'#9A7D0A',
  },
  // ════════════════════════════════════
  //  光属性 防御型
  // ════════════════════════════════════
  {
    id:'light_def_1', name:'シールドエンジェル', attribute:'light', type:'defense', form:1,
    description:'小さな守護天使。小さいが信頼できる盾。',
    stats:{ hp:2600, attack:145, defense:310, attackInterval:3.6, moveSpeed:1.5, range:85,  cost:125 },
    skillId:'light_wall_1', color:'#F9E79F',
  },
  {
    id:'light_def_2', name:'フォートレスガーディアン', attribute:'light', type:'defense', form:2,
    description:'聖域を守る鎧天使。光の盾は魔を弾く。',
    stats:{ hp:5200, attack:230, defense:620, attackInterval:4.1, moveSpeed:1.2, range:85,  cost:250 },
    skillId:'light_wall_2', color:'#D5D8DC',
  },
  {
    id:'light_def_3', name:'ホーリーバスティオン', attribute:'light', type:'defense', form:3,
    description:'聖なる要塞。この壁を越える闇は存在しない。',
    stats:{ hp:9200, attack:340, defense:1150,attackInterval:5.2, moveSpeed:0.9, range:85,  cost:415 },
    skillId:'light_wall_3', color:'#ABB2B9',
  },
  // ════════════════════════════════════
  //  闇属性 攻撃型
  // ════════════════════════════════════
  {
    id:'dark_atk_1', name:'シャドウキット', attribute:'dark', type:'attack', form:1,
    description:'闇に溶け込む子猫。速すぎて目視できない。',
    stats:{ hp:760,  attack:310, defense:75,  attackInterval:1.6, moveSpeed:4.0, range:95,  cost:76  },
    skillId:'dark_strike_1', color:'#8E44AD',
  },
  {
    id:'dark_atk_2', name:'ナイトウルフ', attribute:'dark', type:'attack', form:2,
    description:'夜を駆ける黒狼。牙は敵の防御を貫く。',
    stats:{ hp:1750, attack:560, defense:140, attackInterval:1.8, moveSpeed:3.5, range:110, cost:160 },
    skillId:'dark_strike_2', color:'#6C3483',
  },
  {
    id:'dark_atk_3', name:'ヴォイドリーパー', attribute:'dark', type:'attack', form:3,
    description:'虚無から生まれた死神。その存在自体が呪い。',
    stats:{ hp:3100, attack:980, defense:180, attackInterval:2.2, moveSpeed:3.2, range:130, cost:285 },
    skillId:'dark_strike_3', color:'#4A235A',
  },
  // ════════════════════════════════════
  //  闇属性 防御型
  // ════════════════════════════════════
  {
    id:'dark_def_1', name:'ダークシェル', attribute:'dark', type:'defense', form:1,
    description:'闇の殻を持つ生物。見えない壁で守る。',
    stats:{ hp:2450, attack:135, defense:290, attackInterval:3.4, moveSpeed:1.6, range:80,  cost:118 },
    skillId:'dark_wall_1', color:'#A569BD',
  },
  {
    id:'dark_def_2', name:'アビスシールド', attribute:'dark', type:'defense', form:2,
    description:'深淵の盾持ち。攻撃をすり抜けることがある。',
    stats:{ hp:4900, attack:215, defense:590, attackInterval:3.9, moveSpeed:1.3, range:80,  cost:235 },
    skillId:'dark_wall_2', color:'#7D3C98',
  },
  {
    id:'dark_def_3', name:'チェインドウォーデン', attribute:'dark', type:'defense', form:3,
    description:'無限の鎖で全てを縛る番人。倒すことは絶望に近い。',
    stats:{ hp:9100, attack:320, defense:1080,attackInterval:5.0, moveSpeed:1.0, range:80,  cost:400 },
    skillId:'dark_wall_3', color:'#512E5F',
  },
  // ════════════════════════════════════
  //  竜属性（進化なし、単体）
  // ════════════════════════════════════
  {
    id:'dragon_1', name:'ネコドラゴン', attribute:'dragon', type:'attack', form:1,
    description:'全属性に等倍ダメージを与える謎の竜猫。他に進化はない。',
    stats:{ hp:5000, attack:700, defense:400, attackInterval:3.0, moveSpeed:2.5, range:200, cost:300 },
    skillId:'dragon_breath', color:'#E74C3C',
  },
];

// モンスターをIDで素早く引くためのマップ
export const MONSTER_MAP = Object.fromEntries(MONSTERS.map(m => [m.id, m]));
