// quests.js — クエストデータ。enemyWaves・eggDrops は別データ参照。
// 追加: エントリを追加するだけでクエスト選択画面に表示される。

export const QUESTS = [
  {
    id: 'forest',
    name: '緑の森',
    description: '草属性の魔物が跋扈する森。草の卵が落ちることがある。',
    background: 'forest',
    attribute: 'grass',
    recommendedPower: 500,
    enemyBaseHp: 8000,
    enemyWaves: [
      { enemyId: 'grass_goblin', spawnAt: 3,  interval: 7,  count: 5 },
      { enemyId: 'grass_bear',   spawnAt: 18, interval: 12, count: 3 },
      { enemyId: 'grass_boss',   spawnAt: 45, interval: 0,  count: 1 },
    ],
    expReward: { base: 300, perEggSlot: 80 },
    eggDrops: [
      { eggId: 'grass_egg', rate: 0.6 },
    ],
  },
  {
    id: 'lake',
    name: '静かな湖',
    description: '水属性の生物が棲む湖。水の卵が落ちることがある。',
    background: 'lake',
    attribute: 'water',
    recommendedPower: 600,
    enemyBaseHp: 9000,
    enemyWaves: [
      { enemyId: 'water_fish', spawnAt: 3,  interval: 6,  count: 5 },
      { enemyId: 'water_crab', spawnAt: 20, interval: 13, count: 3 },
      { enemyId: 'water_boss', spawnAt: 50, interval: 0,  count: 1 },
    ],
    expReward: { base: 350, perEggSlot: 90 },
    eggDrops: [
      { eggId: 'water_egg', rate: 0.6 },
    ],
  },
  {
    id: 'volcano',
    name: '燃える火山',
    description: '火属性の魔物が棲む火山地帯。火の卵が落ちることがある。',
    background: 'volcano',
    attribute: 'fire',
    recommendedPower: 700,
    enemyBaseHp: 10000,
    enemyWaves: [
      { enemyId: 'fire_imp',   spawnAt: 3,  interval: 6,  count: 6 },
      { enemyId: 'fire_drake', spawnAt: 22, interval: 12, count: 3 },
      { enemyId: 'fire_boss',  spawnAt: 55, interval: 0,  count: 1 },
    ],
    expReward: { base: 400, perEggSlot: 100 },
    eggDrops: [
      { eggId: 'fire_egg', rate: 0.55 },
    ],
  },
  {
    id: 'sanctuary',
    name: '聖域の丘',
    description: '光属性の番人が守る聖域。光の卵が落ちることがある。',
    background: 'sanctuary',
    attribute: 'light',
    recommendedPower: 800,
    enemyBaseHp: 11000,
    enemyWaves: [
      { enemyId: 'light_sprite',  spawnAt: 3,  interval: 6,  count: 6 },
      { enemyId: 'light_paladin', spawnAt: 25, interval: 13, count: 3 },
      { enemyId: 'light_boss',    spawnAt: 60, interval: 0,  count: 1 },
    ],
    expReward: { base: 450, perEggSlot: 110 },
    eggDrops: [
      { eggId: 'light_egg', rate: 0.5 },
    ],
  },
  {
    id: 'underworld',
    name: '魔界の渓谷',
    description: '闇属性の悪魔が支配する渓谷。闇の卵が落ちることがある。',
    background: 'underworld',
    attribute: 'dark',
    recommendedPower: 900,
    enemyBaseHp: 12000,
    enemyWaves: [
      { enemyId: 'dark_shade',  spawnAt: 3,  interval: 5,  count: 7 },
      { enemyId: 'dark_knight', spawnAt: 28, interval: 12, count: 3 },
      { enemyId: 'dark_boss',   spawnAt: 65, interval: 0,  count: 1 },
    ],
    expReward: { base: 500, perEggSlot: 120 },
    eggDrops: [
      { eggId: 'dark_egg', rate: 0.45 },
    ],
  },
  {
    id: 'dragons_nest',
    name: '竜の巣',
    description: 'あらゆる属性を超えた竜が棲む最難関エリア。竜の卵が稀に落ちる。',
    background: 'dragons_nest',
    attribute: 'dragon',
    recommendedPower: 1500,
    enemyBaseHp: 20000,
    enemyWaves: [
      { enemyId: 'dragon_hatchling', spawnAt: 3,  interval: 10, count: 4 },
      { enemyId: 'dragon_hatchling', spawnAt: 20, interval: 8,  count: 5 },
      { enemyId: 'dragon_elder',     spawnAt: 50, interval: 0,  count: 1 },
    ],
    expReward: { base: 800, perEggSlot: 200 },
    eggDrops: [
      { eggId: 'dragon_egg', rate: 0.15 },
      { eggId: 'fire_egg',   rate: 0.3  },
      { eggId: 'dark_egg',   rate: 0.3  },
    ],
  },
];

export const QUEST_MAP = Object.fromEntries(QUESTS.map(q => [q.id, q]));
