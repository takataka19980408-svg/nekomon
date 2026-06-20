// storage.js — localStorage CRUD。ゲームデータの永続化層。

const SAVE_KEY = 'nekomon_save';
const VERSION  = '1.0.0';

const DEFAULT_STATE = {
  version: VERSION,
  gold: 500,
  party: [
    { type: null, instanceId: null },
    { type: null, instanceId: null },
    { type: null, instanceId: null },
  ],
  monsters: [],  // [{ instanceId, monsterId, level, exp }]
  eggs:     [],  // [{ instanceId, eggId,     level, exp }]
  clearedQuests: [],
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const data = JSON.parse(raw);
    if (data.version !== VERSION) return migrate(data);
    return data;
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function writeSave(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  return structuredClone(DEFAULT_STATE);
}

function migrate(old) {
  // 将来のバージョンアップに対応する指定場所
  return { ...structuredClone(DEFAULT_STATE), ...old, version: VERSION };
}

// インスタンスID生成 — 小さくrandで充分ユニーク
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
