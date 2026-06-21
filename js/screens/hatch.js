import { navigateTo } from '../core/router.js';
import { getState, hatchEgg, maxHatchForm } from '../core/state.js';
import { EGG_MAP } from '../data/eggs.js';
import { MONSTER_MAP } from '../data/monsters.js';

const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };

export function mount(el) {
  render(el);
}

function render(el) {
  const s = getState();
  const hatchable = s.eggs.filter(inst => maxHatchForm(inst.level) >= 1);
  const waiting   = s.eggs.filter(inst => maxHatchForm(inst.level) < 1);

  const hatchCards = hatchable.map(inst => {
    const def     = EGG_MAP[inst.eggId];
    if (!def) return '';
    const maxForm = maxHatchForm(inst.level);
    const formBtns = [1, 2, 3].map(f => {
      const ok = maxForm >= f;
      return `<button class="form-hatch-btn ${ok ? '' : 'disabled'}" data-iid="${inst.instanceId}" data-form="${f}" ${ok ? '' : 'disabled'}>
        第${f}形態孵化
      </button>`;
    }).join('');
    return `
      <div class="hatch-card" style="border-color:${def.color}">
        <div class="hatch-icon" style="background:${def.color}">🥚</div>
        <div class="hatch-info">
          <div class="hatch-name">${def.name}</div>
          <div class="hatch-lv">Lv ${inst.level}</div>
          <div class="hatch-forms">${formBtns}</div>
        </div>
      </div>`;
  }).join('');

  const waitingCards = waiting.map(inst => {
    const def = EGG_MAP[inst.eggId];
    if (!def) return '';
    return `
      <div class="hatch-card hatch-wait" style="border-color:${def.color}44">
        <div class="hatch-icon" style="background:${def.color}66">🥚</div>
        <div class="hatch-info">
          <div class="hatch-name">${def.name}</div>
          <div class="hatch-lv">Lv ${inst.level} → Lv10以上で孵化可</div>
        </div>
      </div>`;
  }).join('');

  el.innerHTML = `
    <div class="hatch-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>孵化</h2>
      </header>
      ${hatchable.length ? `<h3 class="section-label">孵化できる卵</h3>${hatchCards}` : ''}
      ${waiting.length   ? `<h3 class="section-label">成長中 (Lv10未満)</h3>${waitingCards}` : ''}
      ${!s.eggs.length   ? '<p class="empty-msg">卵がありません。クエストで入手しよう！</p>' : ''}
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo('home'));

  el.querySelectorAll('.form-hatch-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = hatchEgg(btn.dataset.iid, +btn.dataset.form);
      if (!result) { alert('孵化に失敗。モンスターボックスが満杯かもしれません。'); return; }
      showHatchAnim(el, result, () => render(el));
    });
  });
}

function showHatchAnim(el, result, cb) {
  const def = MONSTER_MAP[result.monsterId];
  const overlay = document.createElement('div');
  overlay.className = 'hatch-overlay';
  overlay.innerHTML = `
    <div class="hatch-anim-box">
      <div class="hatch-burst">${ATTR_EMOJI[def?.attribute] ?? '⭐'}</div>
      <div class="hatch-anim-name">${def?.name ?? '不明'}が誕生した！</div>
      <button class="btn btn-primary" id="hatch-ok">ボックスへ</button>
    </div>
  `;
  el.appendChild(overlay);
  overlay.querySelector('#hatch-ok').addEventListener('click', () => { overlay.remove(); cb(); });
}

export function unmount() {}
