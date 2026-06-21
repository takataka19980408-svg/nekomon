// quests.js — クエスト定義
// waves[]: { enemyId, interval(秒), startAt(秒) }

export const QUESTS = [
  {
    id: 'forest_1',
    name: '草の森 初級',
    description: '草属性の弱い魔物が棲む森。最初のクエスト。',
    icon: '🌿', attribute: 'grass', background: 'forest',
    enemyBaseHp: 300,
    waves: [{ enemyId:'leaf_slime', interval:3, startAt:3 }],
  },
  {
    id: 'forest_2',
    name: '草の森 中級',
    description: '草ゴブリンが現れる。しっかり準備を。',
    icon: '🌲', attribute: 'grass', background: 'forest',
    enemyBaseHp: 600,
    waves: [{ enemyId:'grass_goblin', interval:4, startAt:5 }],
  },
  {
    id: 'lake_1',
    name: '静かな湖',
    description: '水属性の生物が棲む湖。',
    icon: '💧', attribute: 'water', background: 'lake',
    enemyBaseHp: 500,
    waves: [{ enemyId:'water_fish', interval:3, startAt:4 }],
  },
];
