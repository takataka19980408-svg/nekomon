import { navigateTo } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { EGG_MAP } from '../data/eggs.js';

const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };
const TYPE_LABEL = { attack:'攻', defense:'防' };

let _tab = 'monsters';

export function mount(el) { render(el); }

function render(el) {
  const s = getState();

  const monstersHTML = s.monsters.map(inst => {
    const def = MONSTER_MAP[inst.monsterId];
    if (!def) return '';
    const inParty = s.party.some(p => p.type === 'monster' && p.instanceId === inst.instanceId);
    return `
      <div class="box-card" style="border-color:${def.color}">
        <div class="box-card-icon" style="background:${def.color}">${ATTR_EMOJI[def.attribute]}</div>
        <div class="box-card-info">
          <div class="box-card-name">${def.name}</div>
          <div class="box-card-sub">${def.attribute} / ${TYPE_LABEL[def.type] ?? def.type} / 形態${def.form}</div>
          <div class="box-card-lv">Lv ${inst.level}</div>
        </div>
        ${inParty ? '<div class="box-card-badge">編成中</div>' : ''}
      </div>`;
  }).join('') || '<p class="empty-msg">モンスターがいません</p>';

  const eggsHTML = s.eggs.map(inst => {
    const def = EGG_MAP[inst.eggId];
    if (!def) return '';
    const inParty = s.party.some(p => p.type === 'egg' && p.instanceId === inst.instanceId);
    return `
      <div class="box-card" style="border-color:${def.color}">
        <div class="box-card-icon" style="background:${def.color}">🥚</div>
        <div class="box-card-info">
          <div class="box-card-name">${def.name}</div>
          <div class="box-card-sub">${def.attribute} / 孵化用</div>
          <div class="box-card-lv">Lv ${inst.level} / 50</div>
        </div>
        ${inParty ? '<div class="box-card-badge">編成中</div>' : ''}
      </div>`;
  }).join('') || '<p class="empty-msg">卵がありません。クエストで入手しよう！</p>';

  el.innerHTML = `
    <div class="box-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>📦 ボックス</h2>
      </header>
      <div class="tab-bar">
        <button class="tab-btn ${_tab === 'monsters' ? 'active' : ''}" data-tab="monsters">👾 モンスター (${s.monsters.length}/100)</button>
        <button class="tab-btn ${_tab === 'eggs' ? 'active' : ''}" data-tab="eggs">🥚 卵 (${s.eggs.length}/100)</button>
      </div>
      <div class="box-grid">${_tab === 'monsters' ? monstersHTML : eggsHTML}</div>
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo('home'));
  el.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { _tab = btn.dataset.tab; render(el); });
  });
}

export function unmount() {}
