// eggs.js — 卵データ。hatchTable でレベルに応じた孵化先を指定。
// 追加: エントリを追加 → quests.js の eggDrops に eggId を追加するだけ。

export const EGGS = [
  {
    id: 'fire_egg',
    name: '炎の卵',
    attribute: 'fire',
    description: 'ほんのり温かい卵。炎を纏う化け物が生まれるらしい。',
    color: '#FF6B35',
    hatchTable: {
      form1: ['fire_atk_1', 'fire_def_1'],
      form2: ['fire_atk_2', 'fire_def_2'],
      form3: ['fire_atk_3', 'fire_def_3'],
    },
  },
  {
    id: 'water_egg',
    name: '水の卵',
    attribute: 'water',
    description: '冷たくてツルツルした卵。水の化け物が生まれるらしい。',
    color: '#3498DB',
    hatchTable: {
      form1: ['water_atk_1', 'water_def_1'],
      form2: ['water_atk_2', 'water_def_2'],
      form3: ['water_atk_3', 'water_def_3'],
    },
  },
  {
    id: 'grass_egg',
    name: '草の卵',
    attribute: 'grass',
    description: '葉っぱで包まれた卵。植物系の化け物が生まれるらしい。',
    color: '#27AE60',
    hatchTable: {
      form1: ['grass_atk_1', 'grass_def_1'],
      form2: ['grass_atk_2', 'grass_def_2'],
      form3: ['grass_atk_3', 'grass_def_3'],
    },
  },
  {
    id: 'light_egg',
    name: '光の卵',
    attribute: 'light',
    description: '金色に輝く卵。聖なる化け物が生まれるらしい。',
    color: '#F1C40F',
    hatchTable: {
      form1: ['light_atk_1', 'light_def_1'],
      form2: ['light_atk_2', 'light_def_2'],
      form3: ['light_atk_3', 'light_def_3'],
    },
  },
  {
    id: 'dark_egg',
    name: '闇の卵',
    attribute: 'dark',
    description: '黒く吸い込まれそうな卵。闇の化け物が生まれるらしい。',
    color: '#8E44AD',
    hatchTable: {
      form1: ['dark_atk_1', 'dark_def_1'],
      form2: ['dark_atk_2', 'dark_def_2'],
      form3: ['dark_atk_3', 'dark_def_3'],
    },
  },
  {
    id: 'dragon_egg',
    name: '竜の卵',
    attribute: 'dragon',
    description: 'ゴツゴツした大きな卵。なんとも言えない迫力がある。',
    color: '#E74C3C',
    hatchTable: {
      form1: ['dragon_1'],
      form2: ['dragon_1'],
      form3: ['dragon_1'],
    },
  },
];

export const EGG_MAP = Object.fromEntries(EGGS.map(e => [e.id, e]));

// 卵レベルごとの累積経験値テーブル（Lv1〜Lv50）
// generateEggExpTable() で自動生成。単調増加。
export function generateEggExpTable() {
  const table = [0]; // index = level, value = 累積EXP（Lv1=0）
  for (let lv = 2; lv <= 50; lv++) {
    const prev = table[lv - 1];
    const gain = Math.floor(50 * lv * (1 + lv * 0.05));
    table.push(prev + gain);
  }
  return table; // table[10] = Lv10到達に必要な累積EXP
}

export const EGG_EXP_TABLE = generateEggExpTable();

// 孵化可能レベル閾値
export const HATCH_THRESHOLDS = { form1: 10, form2: 30, form3: 50 };
