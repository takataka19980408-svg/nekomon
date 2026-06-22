const KEY = 'nekomon_v01';

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

const DEFAULT = {
  version: '0.1',
  clearedQuests: [],
  monsters: [
    { iid:'init_fp', monsterId:'flame_puppy', level:1, exp:0 }
  ],
  eggs: [],
};

let _s = null;

export function getState() {
  if (!_s) {
    try {
      const raw = localStorage.getItem(KEY);
      _s = raw ? JSON.parse(raw) : structuredClone(DEFAULT);
      if (!_s.monsters) _s.monsters = structuredClone(DEFAULT.monsters);
      if (!_s.eggs)     _s.eggs     = [];
      if (!_s.clearedQuests) _s.clearedQuests = [];
    } catch { _s = structuredClone(DEFAULT); }
  }
  return _s;
}

export function saveState() {
  localStorage.setItem(KEY, JSON.stringify(_s));
}

export function markCleared(questId) {
  const s = getState();
  if (!s.clearedQuests.includes(questId)) s.clearedQuests.push(questId);
  saveState();
}

// Add EXP to a monster instance. Returns levels gained.
export function addExp(iid, amount) {
  const s   = getState();
  const mon = s.monsters.find(m => m.iid === iid);
  if (!mon) return 0;
  mon.exp += amount;
  let gained = 0;
  while (mon.level < 99 && mon.exp >= mon.level * 50) {
    mon.exp -= mon.level * 50;
    mon.level++;
    gained++;
  }
  saveState();
  return gained;
}

// Add an egg to the box. Returns true on success.
export function addEgg(eggId) {
  const s = getState();
  if (s.eggs.length >= 100) return false;
  s.eggs.push({ iid: genId(), eggId });
  saveState();
  return true;
}
