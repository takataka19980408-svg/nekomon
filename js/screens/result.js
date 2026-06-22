import { go } from '../core/router.js';
import { getState, addExp, addEgg } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';
import { EGGS }     from '../data/eggs.js';
import { QUESTS }   from '../data/quests.js';

const WIN_EXP  = 50;
const EGG_RATE = 0.3;
const EGG_DROP = 'grass_egg';

const BTN_PRI = 'padding:13px 26px;border:none;border-radius:50px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;background:linear-gradient(135deg,#5a6aff,#8040ff);color:#fff;';
const BTN_OUT = 'padding:13px 26px;border:2px solid #5a6aff;border-radius:50px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;background:transparent;color:#5a6aff;';

export function mount(el, params) {
  const { questId, won } = params ?? {};
  const quest = QUESTS.find(q => q.id === questId);

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;overflow-y:auto;' +
    'background:#0d0d1a;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:16px;padding:24px;';

  if (!won) {
    el.innerHTML = [
      '<div style="font-size:64px;">💀</div>',
      '<div style="font-size:40px;font-weight:900;color:#e74c3c;">LOSE...</div>',
      '<div style="font-size:14px;color:#888;">' + (quest?.name ?? '') + '</div>',
      '<div style="display:flex;gap:12px;margin-top:12px;">',
        '<button id="btn-r" style="' + BTN_OUT + '">リトライ</button>',
        '<button id="btn-h" style="' + BTN_PRI + '">ホームへ</button>',
      '</div>',
    ].join('');
    el.querySelector('#btn-r').addEventListener('click', () => go('battle', { questId }));
    el.querySelector('#btn-h').addEventListener('click', () => go('home'));
    return;
  }

  // --- Win: apply rewards ---
  const s      = getState();
  const mon    = s.monsters[0];
  const monDef = mon ? MONSTERS[mon.monsterId] : null;

  const oldLv  = mon ? mon.level : 1;
  const oldExp = mon ? mon.exp   : 0;
  const levGained = mon ? addExp(mon.iid, WIN_EXP) : 0;
  const newLv  = mon ? mon.level : 1;
  const newExp = mon ? mon.exp   : 0;
  const expNeeded = newLv * 100;

  const gotEgg = (Math.random() < EGG_RATE) ? addEgg(EGG_DROP) : false;
  const eggDef = EGGS[EGG_DROP];

  const monRow = monDef ? [
    '<div style="display:flex;align-items:center;gap:12px;">',
      '<span style="font-size:32px;">' + monDef.icon + '</span>',
      '<div style="flex:1;">',
        '<div style="font-weight:700;color:#eee;">' + monDef.name + '</div>',
        '<div style="font-size:12px;color:#5a6aff;">+' + WIN_EXP + ' EXP</div>',
        levGained > 0
          ? '<div style="font-size:13px;color:#f5c518;font-weight:700;">Lv ' + oldLv + ' → ' + newLv + ' ✨ レベルアップ！</div>'
          : '<div style="font-size:11px;color:#555;">Lv ' + newLv + '   ' + newExp + ' / ' + expNeeded + ' EXP</div>',
      '</div>',
    '</div>',
  ].join('') : '';

  const eggRow = gotEgg ? [
    '<div style="display:flex;align-items:center;gap:12px;border-top:1px solid #2e2e5a;padding-top:12px;">',
      '<span style="font-size:32px;">' + eggDef.icon + '</span>',
      '<div>',
        '<div style="font-weight:700;color:#44CC44;">' + eggDef.name + ' をドロップ！</div>',
        '<div style="font-size:12px;color:#888;">卵ボックスに追加されました</div>',
      '</div>',
    '</div>',
  ].join('') : '';

  el.innerHTML = [
    '<div style="font-size:64px;">🏆</div>',
    '<div style="font-size:42px;font-weight:900;color:#f5c518;">WIN!</div>',
    '<div style="font-size:14px;color:#888;">' + (quest?.name ?? '') + '</div>',

    '<div style="background:#141428;border:2px solid #2e2e5a;border-radius:14px;padding:16px;width:100%;max-width:290px;display:flex;flex-direction:column;gap:12px;">',
      monRow,
      eggRow,
    '</div>',

    '<div style="display:flex;gap:12px;margin-top:8px;">',
      '<button id="btn-r" style="' + BTN_OUT + '">もう一度</button>',
      '<button id="btn-h" style="' + BTN_PRI + '">ホームへ</button>',
    '</div>',
  ].join('');

  el.querySelector('#btn-r').addEventListener('click', () => go('battle', { questId }));
  el.querySelector('#btn-h').addEventListener('click', () => go('home'));
}

export function unmount() {}
