import { go } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';

export function mount(el) {
  const s       = getState();
  const mon     = s.monsters?.[0];
  const monDef  = mon ? MONSTERS[mon.monsterId] : null;
  const expNeed = mon ? mon.level * 50 : 50;
  const expPct  = mon ? Math.min(100, (mon.exp / expNeed) * 100) : 0;

  const monCard = monDef ? [
    '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;',
      'background:#141428;border:1.5px solid #2e2e5a;border-radius:10px;padding:10px 14px;flex-shrink:0;">',
      '<span style="font-size:28px;">' + monDef.icon + '</span>',
      '<div style="font-weight:700;color:#eee;font-size:12px;">' + monDef.name + '</div>',
      '<div style="font-size:10px;color:#888;">Lv ' + mon.level + '</div>',
      '<div style="width:80px;height:4px;background:#1a1a3a;border-radius:2px;overflow:hidden;">',
        '<div style="height:100%;width:' + expPct + '%;background:linear-gradient(90deg,#5a6aff,#8040ff);border-radius:2px;"></div>',
      '</div>',
      '<div style="font-size:9px;color:#555;">' + mon.exp + '/' + expNeed + ' EXP</div>',
    '</div>',
  ].join('') : '';

  el.style.cssText = 'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;background:#0d0d1a;';

  el.innerHTML = [
    '<style>@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}</style>',
    '<div style="display:flex;height:100%;align-items:center;justify-content:space-around;padding:10px 18px;gap:12px;">',

      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex-shrink:0;">',
        '<div style="font-size:36px;animation:fl 2.2s ease-in-out infinite;">🥚</div>',
        '<div style="font-size:18px;font-weight:900;letter-spacing:2px;color:#e8e8f0;">NEKOMON</div>',
        '<div style="font-size:9px;color:#444;letter-spacing:1px;">Ver 0.1</div>',
      '</div>',

      monCard,

      '<div style="display:flex;flex-direction:column;gap:7px;min-width:138px;">',
        '<button id="btn-q" style="width:100%;padding:12px;border:none;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#5a6aff,#8040ff);color:#fff;font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;">⚔️ クエスト</button>',
        '<div style="display:flex;gap:6px;">',
          '<button id="btn-b" style="flex:1;padding:9px 6px;border:1.5px solid #2e2e5a;border-radius:50px;font-size:11px;font-weight:700;cursor:pointer;background:transparent;color:#8888aa;font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;">📦 BOX</button>',
          '<button id="btn-e" style="flex:1;padding:9px 6px;border:1.5px solid #2e2e5a;border-radius:50px;font-size:11px;font-weight:700;cursor:pointer;background:transparent;color:#8888aa;font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;">🥚 卵</button>',
        '</div>',
        '<div style="font-size:9px;color:#333;text-align:center;">卵 ' + (s.eggs?.length ?? 0) + '/100  クリア ' + (s.clearedQuests?.length ?? 0) + '</div>',
      '</div>',

    '</div>',
  ].join('');

  el.querySelector('#btn-q').addEventListener('click', () => go('quest'));
  el.querySelector('#btn-b').addEventListener('click', () => go('box'));
  el.querySelector('#btn-e').addEventListener('click', () => go('eggs'));
}

export function unmount() {}
