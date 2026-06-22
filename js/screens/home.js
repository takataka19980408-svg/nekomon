import { go } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';

export function mount(el) {
  const s      = getState();
  const mon    = s.monsters?.[0];
  const monDef = mon ? MONSTERS[mon.monsterId] : null;

  const expPct     = mon ? Math.min(100, (mon.exp / (mon.level * 100)) * 100) : 0;
  const expNeeded  = mon ? mon.level * 100 : 100;

  const monCard = monDef ? [
    '<div style="display:flex;align-items:center;gap:12px;background:#141428;border:2px solid #2e2e5a;border-radius:12px;padding:14px;width:100%;max-width:300px;">',
      '<span style="font-size:38px;">' + monDef.icon + '</span>',
      '<div style="flex:1;">',
        '<div style="font-weight:700;color:#eee;font-size:14px;">' + monDef.name + '</div>',
        '<div style="font-size:12px;color:#888;">Lv ' + mon.level + '</div>',
        '<div style="margin-top:5px;height:6px;background:#1a1a3a;border-radius:3px;overflow:hidden;">',
          '<div style="height:100%;width:' + expPct + '%;background:linear-gradient(90deg,#5a6aff,#8040ff);border-radius:3px;"></div>',
        '</div>',
        '<div style="font-size:10px;color:#555;margin-top:2px;">' + mon.exp + ' / ' + expNeeded + ' EXP</div>',
      '</div>',
    '</div>',
  ].join('') : '<div style="font-size:13px;color:#555;">モンスターなし</div>';

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;background:#0d0d1a;';

  el.innerHTML = [
    '<style>@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}</style>',
    '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;gap:18px;">',

      '<div style="text-align:center;">',
        '<div style="font-size:64px;animation:fl 2.2s ease-in-out infinite;">🥚</div>',
        '<h1 style="font-size:30px;font-weight:900;letter-spacing:3px;color:#e8e8f0;margin-top:6px;">NEKOMON</h1>',
        '<p style="font-size:11px;color:#8888aa;letter-spacing:1px;margin-top:2px;">Ver 0.1</p>',
      '</div>',

      monCard,

      '<div style="font-size:11px;color:#444;">🥚 卵ボックス: ' + (s.eggs?.length ?? 0) + ' / 100</div>',

      '<div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:300px;">',
        '<button id="btn-q" style="width:100%;padding:16px;border:none;border-radius:50px;font-size:17px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#5a6aff,#8040ff);color:#fff;font-family:inherit;-webkit-tap-highlight-color:transparent;">⚔️ クエスト</button>',
        '<div style="display:flex;gap:10px;">',
          '<button id="btn-b" style="flex:1;padding:11px;border:2px solid #2e2e5a;border-radius:50px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#8888aa;font-family:inherit;-webkit-tap-highlight-color:transparent;">📦 ボックス</button>',
          '<button id="btn-e" style="flex:1;padding:11px;border:2px solid #2e2e5a;border-radius:50px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:#8888aa;font-family:inherit;-webkit-tap-highlight-color:transparent;">🥚 卵</button>',
        '</div>',
      '</div>',

      '<div style="font-size:11px;color:#333;">クリア済み: ' + (s.clearedQuests?.length ?? 0) + ' クエスト</div>',

    '</div>',
  ].join('');

  el.querySelector('#btn-q').addEventListener('click', () => go('quest'));
  el.querySelector('#btn-b').addEventListener('click', () => go('box'));
  el.querySelector('#btn-e').addEventListener('click', () => go('eggs'));
}

export function unmount() {}
