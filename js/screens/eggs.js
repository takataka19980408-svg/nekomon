import { go } from '../core/router.js';
import { getState } from '../core/state.js';
import { EGGS } from '../data/eggs.js';

export function mount(el) {
  const s = getState();

  const listHTML = s.eggs?.length ? s.eggs.map(e => {
    const def = EGGS[e.eggId];
    return [
      '<div style="display:flex;align-items:center;gap:12px;background:#141428;border:1px solid #2e2e5a;border-radius:10px;padding:12px;">',
        '<span style="font-size:32px;">' + (def?.icon ?? '🥚') + '</span>',
        '<div>',
          '<div style="font-size:13px;font-weight:700;color:#eee;">' + (def?.name ?? e.eggId) + '</div>',
          '<div style="font-size:11px;color:#44CC44;">' + (def?.attribute ?? '') + ' 属性</div>',
        '</div>',
      '</div>',
    ].join('');
  }).join('') : '<p style="color:#555;font-size:14px;text-align:center;padding:30px;">卵がありません<br><small style="font-size:11px;">クエストに勝利するとドロップするかも</small></p>';

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;background:#0d0d1a;display:flex;flex-direction:column;';

  el.innerHTML = [
    '<div style="display:flex;align-items:center;gap:12px;padding:12px 15px;background:#141428;border-bottom:1px solid #2e2e5a;flex-shrink:0;">',
      '<button id="btn-back" style="width:36px;height:36px;border-radius:50%;border:2px solid #2e2e5a;background:#1e1e3a;color:#eee;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;flex-shrink:0;">❮</button>',
      '<h2 style="font-size:16px;font-weight:700;color:#eee;">🥚 卵ボックス (' + (s.eggs?.length ?? 0) + ' / 100)</h2>',
    '</div>',
    '<div style="flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;">',
      listHTML,
    '</div>',
  ].join('');

  el.querySelector('#btn-back').addEventListener('click', () => go('home'));
}

export function unmount() {}
