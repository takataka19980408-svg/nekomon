import { go } from '../core/router.js';
import { getState, addExp, addEgg } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';
import { EGGS }     from '../data/eggs.js';
import { QUESTS }   from '../data/quests.js';

const WIN_EXP  = 300;
const EGG_RATE = 0.3;
const EGG_DROP = 'grass_egg';

const S_PRI = 'padding:11px 22px;border:none;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;background:linear-gradient(135deg,#5a6aff,#8040ff);color:#fff;';
const S_OUT = 'padding:11px 22px;border:2px solid #5a6aff;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;background:transparent;color:#5a6aff;';

export function mount(el, params) {
  const { questId, won } = params ?? {};
  const quest = QUESTS.find(q => q.id === questId);

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;' +
    'background:#0d0d1a;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:10px;padding:16px;';

  let rewardHTML = '';
  if (won) {
    try {
      const s       = getState();
      const mon     = s.monsters[0];
      const monDef  = mon ? MONSTERS[mon.monsterId] : null;
      const oldLv   = mon ? mon.level : 1;
      const levGained = mon ? addExp(mon.iid, WIN_EXP) : 0;
      const newLv   = mon ? mon.level : 1;
      const newExp  = mon ? mon.exp   : 0;
      const expNeeded = newLv * 50;
      const gotEgg  = (Math.random() < EGG_RATE) && addEgg(EGG_DROP);
      const eggDef  = EGGS[EGG_DROP];

      const lvRow = levGained > 0
        ? '<div style="font-size:13px;color:#f5c518;font-weight:900;margin-top:4px;">⭐ Lv ' + oldLv + ' → Lv ' + newLv + ' レベルアップ！</div>'
        : '<div style="font-size:10px;color:#777;margin-top:2px;">Lv ' + newLv + '  次まで ' + (expNeeded - newExp) + ' EXP</div>';

      const monRow = monDef ? [
        '<div style="display:flex;align-items:center;gap:10px;">',
          '<span style="font-size:28px;">' + monDef.icon + '</span>',
          '<div>',
            '<div style="font-weight:700;color:#eee;font-size:13px;">' + monDef.name + '</div>',
            '<div style="font-size:13px;font-weight:800;color:#5a6aff;">+' + WIN_EXP + ' EXP</div>',
            lvRow,
          '</div>',
        '</div>',
      ].join('') : '';

      const eggRow = (gotEgg && eggDef) ? [
        '<div style="display:flex;align-items:center;gap:10px;border-top:1px solid #2e2e5a;padding-top:8px;">',
          '<span style="font-size:26px;">' + eggDef.icon + '</span>',
          '<div>',
            '<div style="font-weight:700;color:#44CC44;font-size:12px;">' + eggDef.name + ' ドロップ！</div>',
            '<div style="font-size:10px;color:#888;">卵ボックスに追加</div>',
          '</div>',
        '</div>',
      ].join('') : '';

      rewardHTML = [
        '<div style="background:#141428;border:1.5px solid #2e2e5a;border-radius:12px;',
          'padding:12px;width:100%;max-width:270px;display:flex;flex-direction:column;gap:8px;">',
          monRow,
          eggRow,
        '</div>',
      ].join('');
    } catch(e) {
      rewardHTML = '';
    }
  }

  el.innerHTML = [
    '<div style="font-size:48px;">' + (won ? '🏆' : '💀') + '</div>',
    '<div style="font-size:32px;font-weight:900;color:' + (won ? '#f5c518' : '#e74c3c') + ';">' + (won ? 'WIN!' : 'LOSE...') + '</div>',
    quest ? '<div style="font-size:11px;color:#888;">' + quest.name + '</div>' : '',
    rewardHTML,
    '<div style="display:flex;gap:10px;margin-top:6px;">',
      '<button id="btn-r" style="' + S_OUT + '">' + (won ? 'もう一度' : 'リトライ') + '</button>',
      '<button id="btn-h" style="' + S_PRI + '">ホームへ</button>',
    '</div>',
  ].join('');

  el.querySelector('#btn-r').addEventListener('click', () => go('battle', { questId }));
  el.querySelector('#btn-h').addEventListener('click', () => go('home'));
}

export function unmount() {}
