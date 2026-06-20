// state.js — ゲームグローバルステート・ヘルパー。
import { loadSave, writeSave, genId } from './storage.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { EGG_MAP, EGG_EXP_TABLE, HATCH_THRESHOLDS } from '../data/eggs.js';

// 属性相性テーブル: multiplier[attacker][defender]
export const ATTR_CHART = {
  fire:   { fire:1,   water:0.75, grass:1.5,  light:1,   dark:1,   dragon:1 },
  water:  { fire:1.5, water:1,    grass:0.75, light:1,   dark:1,   dragon:1 },
  grass:  { fire:0.75,water:1.5,  grass:1,    light:1,   dark:1,   dragon:1 },
  light:  { fire:1,   water:1,    grass:1,    light:1,   dark:1.5, dragon:1 },
  dark:   { fire:1,   water:1,    grass:1,    light:1.5, dark:1,   dragon:1 },
  dragon: { fire:1,   water:1,    grass:1,    light:1,   dark:1,   dragon:1 },
};

export function getAttrMultiplier(attackerAttr, defenderAttr) {
  return ATTR_CHART[attackerAttr]?.[defenderAttr] ?? 1;
}

// モンスターレベルボーナス (Lv1=1倍, Lv99=2.5倊)
export function monsterStatScale(level) {
  return 1 + (level - 1) * (1.5 / 98);
}

// 卵レベルから孵化可能形態を返す
export function maxHatchForm(eggLevel) {
  if (eggLevel >= HATCH_THRESHOLDS.form3) return 3;
  if (eggLevel >= HATCH_THRESHOLDS.form2) return 2;
  if (eggLevel >= HATCH_THRESHOLDS.form1) return 1;
  return 0;
}

// 卵の次のレベルまでの必要EXP
export function expToNextEggLevel(currentLevel) {
  if (currentLevel >= 50) return Infinity;
  return EGG_EXP_TABLE[currentLevel] - EGG_EXP_TABLE[currentLevel - 1];
}

let _state = null;

export function getState() {
  if (!_state) _state = loadSave();
  return _state;
}

export function saveState() {
  writeSave(_state);
}

// ポップした卵アイテムをボックスに追加
export function addEggToBox(eggId) {
  const s = getState();
  if (s.eggs.length >= 100) return false;
  s.eggs.push({ instanceId: genId(), eggId, level: 1, exp: 0 });
  saveState();
  return true;
}

// クエスト終了後の経験と卵ドロップ処理
export function applyQuestReward(quest, party) {
  const s = getState();
  const eggSlots = party.filter(p => p.type === 'egg').length;
  const totalExp = quest.expReward.base + eggSlots * quest.expReward.perEggSlot;

  // モンスター経験
  party.forEach(slot => {
    if (slot.type !== 'monster') return;
    const mon = s.monsters.find(m => m.instanceId === slot.instanceId);
    if (!mon || mon.level >= 99) return;
    mon.exp += totalExp;
    const needed = monsterExpForLevel(mon.level + 1);
    while (mon.level < 99 && mon.exp >= monsterExpForLevel(mon.level + 1)) {
      mon.exp -= monsterExpForLevel(mon.level + 1);
      mon.level++;
    }
  });

  // 卵経験
  party.forEach(slot => {
    if (slot.type !== 'egg') return;
    const egg = s.eggs.find(e => e.instanceId === slot.instanceId);
    if (!egg || egg.level >= 50) return;
    egg.exp += totalExp;
    while (egg.level < 50 && egg.exp >= EGG_EXP_TABLE[egg.level]) {
      egg.exp -= EGG_EXP_TABLE[egg.level];
      egg.level++;
    }
  });

  // 卵ドロップ
  const dropped = [];
  quest.eggDrops.forEach(drop => {
    if (Math.random() < drop.rate) {
      if (addEggToBox(drop.eggId)) dropped.push(drop.eggId);
    }
  });

  if (!s.clearedQuests.includes(quest.id)) s.clearedQuests.push(quest.id);
  saveState();
  return { totalExp, dropped };
}

// 卵を孵化しモンスターボックスに追加
export function hatchEgg(eggInstanceId, form) {
  const s = getState();
  const eggInst = s.eggs.find(e => e.instanceId === eggInstanceId);
  if (!eggInst) return null;
  const eggDef = EGG_MAP[eggInst.eggId];
  if (!eggDef) return null;
  const candidates = eggDef.hatchTable[`form${form}`];
  if (!candidates?.length) return null;
  const monsterId = candidates[Math.floor(Math.random() * candidates.length)];
  if (s.monsters.length >= 100) return null;
  const newMon = { instanceId: genId(), monsterId, level: 1, exp: 0 };
  s.monsters.push(newMon);
  s.eggs = s.eggs.filter(e => e.instanceId !== eggInstanceId);
  // 編成から孵化した卵を外す
  s.party = s.party.map(p =>
    p.type === 'egg' && p.instanceId === eggInstanceId
      ? { type: null, instanceId: null }
      : p
  );
  saveState();
  return { monsterId, monsterDef: MONSTER_MAP[monsterId] };
}

function monsterExpForLevel(lv) {
  return Math.floor(100 * lv * (1 + lv * 0.08));
}
