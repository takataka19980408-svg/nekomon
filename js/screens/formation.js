import { navigateTo } from '../core/router.js';
import { getState, saveState } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { EGG_MAP } from '../data/eggs.js';
import { QUEST_MAP } from '../data/quests.js';

const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };

let _questId = null;
let _selectedSlot = null;

export function mount(el, params) {
  _questId = params?.questId ?? null;
  render(el);
}

function render(el) {
  const s = getState();
  const quest = _questId ? QUEST_MAP[_questId] : null;

  const slotHTML = s.party.map((slot, i) => {
    const active = _selectedSlot === i ? 'selected' : '';
    return `<div class="form-slot ${active}" data-idx="${i}">${slotContent(slot, s)}</div>`;
  }).join('');

  const monstersHTML = s.monsters.map(inst => {
    const def = MONSTER_MAP[inst.monsterId];
    if (!def) return '';
    const inParty = s.party.some(p => p.type === 'monster' && p.instanceId === inst.instanceId);
    return `<div class="box-item ${inParty ? 'in-party' : ''}" data-type="monster" data-iid="${inst.instanceId}" style="border-color:${def.color}">
      <div class="box-icon" style="background:${def.color}">${ATTR_EMOJI[def.attribute]}</div>
      <div class="box-info"><div class="box-name">${def.name}</div><div class="box-lv">Lv${inst.level}</div></div>
    </div>`;
  }).join('');

  const eggsHTML = s.eggs.map(inst => {
    const def = EGG_MAP[inst.eggId];
    if (!def) return '';
    const inParty = s.party.some(p => p.type === 'egg' && p.instanceId === inst.instanceId);
    return `<div class="box-item egg-item ${inParty ? 'in-party' : ''}" data-type="egg" data-iid="${inst.instanceId}" style="border-color:${def.color}">
      <div class="box-icon" style="background:${def.color}">🥚</div>
      <div class="box-info">
        <div class="box-name">${def.name}</div>
        <div class="box-lv">Lv${inst.level} <small>(孵化用)</small></div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = `
    <div class="form-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>${quest ? quest.name + ' 編成' : '編成'}</h2>
      </header>
      <section class="form-party">
        <h3 class="section-label">スロット（タップで選択）</h3>
        <div class="form-slots">${slotHTML}</div>
        <div class="form-hint">${
          _selectedSlot !== null
            ? '下からモンスター/卵を選択 ・ 同じスロットを再タップで解除'
            : 'スロットをタップしてモンスターまたは卵をセット'
        }</div>
      </section>
      <section class="form-box">
        <h3 class="section-label">👾 モンスター (${s.monsters.length})</h3>
        <div class="box-list">${monstersHTML || '<p class="empty-msg">モンスターがいません</p>'}</div>
        <h3 class="section-label">🥚 卵 (${s.eggs.length}) <small style="font-weight:normal;font-size:12px">孵化用・戦闘不参加</small></h3>
        <div class="box-list">${eggsHTML || '<p class="empty-msg">卵がありません</p>'}</div>
      </section>
      ${quest ? `<div class="form-footer"><button class="btn btn-primary btn-lg" id="btn-battle">⚔️ 出撃！</button></div>` : ''}
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo(_questId ? 'quest' : 'home'));

  el.querySelectorAll('.form-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const idx = +slot.dataset.idx;
      if (_selectedSlot === idx) {
        const s2 = getState();
        s2.party[idx] = { type: null, instanceId: null };
        saveState();
        _selectedSlot = null;
      } else {
        _selectedSlot = idx;
      }
      render(el);
    });
  });

  el.querySelectorAll('.box-item').forEach(item => {
    item.addEventListener('click', () => {
      if (_selectedSlot === null) return;
      const s2 = getState();
      const type = item.dataset.type;
      const iid  = item.dataset.iid;
      s2.party = s2.party.map((p, i) => {
        if (i === _selectedSlot) return { type, instanceId: iid };
        if (p.instanceId === iid) return { type: null, instanceId: null };
        return p;
      });
      saveState();
      _selectedSlot = null;
      render(el);
    });
  });

  const btnBattle = el.querySelector('#btn-battle');
  if (btnBattle) {
    btnBattle.addEventListener('click', () => {
      const s2 = getState();
      if (!s2.party.some(p => p.type === 'monster')) {
        alert('少なくとも1体モンスターを編成に入れてください');
        return;
      }
      navigateTo('battle', { questId: _questId });
    });
  }
}

function slotContent(slot, s) {
  if (!slot.type) return `<div class="slot-empty">➕ 空スロット</div>`;
  if (slot.type === 'monster') {
    const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
    const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
    if (!def) return `<div class="slot-empty">✕</div>`;
    return `<div class="slot-filled" style="background:${def.color}22">
      <div class="slot-icon-big" style="background:${def.color}">${ATTR_EMOJI[def.attribute]}</div>
      <div class="slot-detail"><div class="slot-name">${def.name}</div><div class="slot-lv">Lv${inst.level}</div></div>
    </div>`;
  }
  if (slot.type === 'egg') {
    const inst = s.eggs.find(e => e.instanceId === slot.instanceId);
    const def  = inst ? EGG_MAP[inst.eggId] : null;
    if (!def) return `<div class="slot-empty">✕</div>`;
    return `<div class="slot-filled" style="background:${def.color}22">
      <div class="slot-icon-big" style="background:${def.color}">🥚</div>
      <div class="slot-detail"><div class="slot-name">${def.name}</div><div class="slot-lv">Lv${inst.level} 孵化用</div></div>
    </div>`;
  }
  return '';
}

export function unmount() { _selectedSlot = null; }
