import { go } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';

export function mount(el) {
  const s = getState();

  const listHTML = s.monsters?.length ? s.monsters.map(m => {
    const def    = MONSTERS[m.monsterId];
    const expPct = Math.min(100, (m.exp / (m.level * 100)) * 100);
    return [
      '<div style="display:flex;align-items:center;gap:12px;background:#141428;border:1px solid #2e2e5a;border-radius:10px;padding:12px;">',
        '<span style="font-size:34px;">' + (def?.icon ?? '?') + '</span>',
        '<div style="flex:1;">',
          '<div style="font-size:14px;font-weight:700;color:#eee;">' + (def?.name ?? m.monsterId) + '</div>',
          '<div style="font-size:12px;color:#888;">Lv ' + m.level + '</div>',
          '<div style="margin-top:4px;height:5px;background:#1a1a3a;border-radius:3px;overflow:hidden;">',
            '<div style="height:100%;width:' + expPct + '%;background:linear-gradient(90deg,#5a6aff,#8040ff);border-radius:3px;"></div>',
          '</div>',
          '<div style="font-size:10px;color:#555;margin-top:2px;">' + m.exp + ' / ' + (m.level * 100) + ' EXP</div>',
        '</div>',
      '</div>',
    ].join('');
  }).join('') : '<p style="color:#555;font-size:14px;text-align:center;padding:30px;">モンスターがいません</p>';

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;background:#0d0d1a;display:flex;flex-direction:column;';

  el.innerHTML = [
    '<div style="display:flex;align-items:center;gap:12px;padding:12px 15px;background:#141428;border-bottom:1px solid #2e2e5a;flex-shrink:0;">',
      '<button id="btn-back" style="width:36px;height:36px;border-radius:50%;border:2px solid #2e2e5a;background:#1e1e3a;color:#eee;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;flex-shrink:0;">❮</button>',
      '<h2 style="font-size:16px;font-weight:700;color:#eee;">📦 モンスターボックス (' + (s.monsters?.length ?? 0) + ')</h2>',
    '</div>',
    '<div style="flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;">',
      listHTML,
    '</div>',
  ].join('');

  el.querySelector('#btn-back').addEventListener('click', () => go('home'));
}

export function unmount() {}
