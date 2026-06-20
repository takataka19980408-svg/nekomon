import { navigateTo } from '../core/router.js';
import { MONSTERS } from '../data/monsters.js';
import { getState } from '../core/state.js';

const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };
const TYPE_LABEL = { attack:'攻撃型', defense:'防御型' };

let _filter = 'all';

export function mount(el) {
  render(el);
}

function render(el) {
  const s = getState();
  const owned = new Set(s.monsters.map(m => m.monsterId));

  const filtered = _filter === 'all' ? MONSTERS : MONSTERS.filter(m => m.attribute === _filter);

  const cards = filtered.map(def => {
    const isOwned = owned.has(def.id);
    return `
      <div class="enc-card ${isOwned ? '' : 'enc-locked'}" style="border-color:${isOwned ? def.color : '#444'}">
        <div class="enc-icon" style="background:${isOwned ? def.color : '#333'}">${isOwned ? ATTR_EMOJI[def.attribute] : '❓'}</div>
        <div class="enc-info">
          <div class="enc-name">${isOwned ? def.name : '???'}</div>
          <div class="enc-sub">${isOwned ? `${def.attribute} / ${TYPE_LABEL[def.type]} / 形態${def.form}` : '未入手'}</div>
          ${isOwned ? `<div class="enc-desc">${def.description}</div>` : ''}
          ${isOwned ? `<div class="enc-stats">
            HP:${def.stats.hp} ATK:${def.stats.attack} DEF:${def.stats.defense}
          </div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  const ATTRS = ['all','fire','water','grass','light','dark','dragon'];
  const filterBtns = ATTRS.map(a => `<button class="filter-btn ${_filter===a?'active':''}" data-attr="${a}">${a==='all'?'全て':ATTR_EMOJI[a]??a}</button>`).join('');

  el.innerHTML = `
    <div class="enc-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>図鑑 (${owned.size}/${MONSTERS.length})</h2>
      </header>
      <div class="filter-bar">${filterBtns}</div>
      <div class="enc-grid">${cards}</div>
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo('home'));
  el.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { _filter = btn.dataset.attr; render(el); });
  });
}

export function unmount() { _filter = 'all'; }
