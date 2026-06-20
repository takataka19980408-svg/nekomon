import { navigateTo } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { EGG_MAP } from '../data/eggs.js';

const ATTR_EMOJI = { fire:'ὒ5', water:'Ὂ7', grass:'ἳf', light:'✨', dark:'ἱ9', dragon:'ὀ9' };

export function mount(el) {
  const s = getState();
  const partyDisplay = s.party.map(slot => {
    if (!slot.type) return `<div class="party-slot empty">➕</div>`;
    if (slot.type === 'monster') {
      const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
      const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
      if (!def) return `<div class="party-slot empty">➕</div>`;
      return `<div class="party-slot" style="border-color:${def.color}">
        <div class="slot-icon" style="background:${def.color}">${ATTR_EMOJI[def.attribute]}</div>
        <div class="slot-name">${def.name}</div>
        <div class="slot-lv">Lv${inst.level}</div>
      </div>`;
    }
    if (slot.type === 'egg') {
      const inst = s.eggs.find(e => e.instanceId === slot.instanceId);
      const def  = inst ? EGG_MAP[inst.eggId] : null;
      if (!def) return `<div class="party-slot empty">➕</div>`;
      return `<div class="party-slot egg-slot" style="border-color:${def.color}">
        <div class="slot-icon" style="background:${def.color}">ᾕa</div>
        <div class="slot-name">${def.name}</div>
        <div class="slot-lv">Lv${inst.level}</div>
      </div>`;
    }
    return `<div class="party-slot empty">➕</div>`;
  }).join('');

  el.innerHTML = `
    <div class="home-wrap">
      <header class="home-header">
        <h2 class="home-title">NEKOMON</h2>
        <div class="home-gold">Ὃ0 ${s.gold}</div>
      </header>
      <section class="home-party-section">
        <h3 class="section-label">編成</h3>
        <div class="party-row">${partyDisplay}</div>
      </section>
      <nav class="home-menu">
        <button class="menu-btn" id="btn-quest">
          <span class="menu-icon">⚔</span>
          <span class="menu-label">クエスト</span>
        </button>
        <button class="menu-btn" id="btn-formation">
          <span class="menu-icon">Ὄb</span>
          <span class="menu-label">編成</span>
        </button>
        <button class="menu-btn" id="btn-box">
          <span class="menu-icon">὎6</span>
          <span class="menu-label">ボックス</span>
        </button>
        <button class="menu-btn" id="btn-hatch">
          <span class="menu-icon">ᾕa</span>
          <span class="menu-label">孵化</span>
        </button>
        <button class="menu-btn" id="btn-encyclopedia">
          <span class="menu-icon">Ὅ6</span>
          <span class="menu-label">図鑑</span>
        </button>
      </nav>
    </div>
  `;

  el.querySelector('#btn-quest').addEventListener('click', () => navigateTo('quest'));
  el.querySelector('#btn-formation').addEventListener('click', () => navigateTo('formation'));
  el.querySelector('#btn-box').addEventListener('click', () => navigateTo('box'));
  el.querySelector('#btn-hatch').addEventListener('click', () => navigateTo('hatch'));
  el.querySelector('#btn-encyclopedia').addEventListener('click', () => navigateTo('encyclopedia'));
}

export function unmount() {}
