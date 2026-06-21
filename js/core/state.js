// state.js — game save data
// Ver0.1: minimal. Expanded in later versions for monsters, eggs, party.

const KEY = 'nekomon_v01';

const DEFAULT = {
  version: '0.1',
  clearedQuests: [],
  // party, monsters, eggs added in Ver0.2+
};

let _s = null;

export function getState() {
  if (!_s) {
    try {
      const raw = localStorage.getItem(KEY);
      _s = raw ? JSON.parse(raw) : structuredClone(DEFAULT);
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
