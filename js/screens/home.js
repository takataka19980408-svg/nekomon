import { navigateTo } from '../core/router.js';
import { getState } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { EGG_MAP, EGG_EXP_TABLE, HATCH_THRESHOLDS } from '../data/eggs.js';

const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };

export function mount(el) {
  render(el);
}

function render(el) {
  const s = getState();

  const partyHTML = s.party.map(slot => {
    if (!slot.type) {
      return `<div class="hps-slot hps-empty" data-nav="formation">
        <div class="hps-icon-wrap empty">＋</div>
        <div class="hps-label">空きスロット</div>
      </div>`;
    }
    if (slot.type === 'monster') {
      const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
      const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
      if (!def) return '';
      return `<div class="hps-slot" data-nav="formation">
        <div class="hps-icon-wrap" style="background:${def.color}">${ATTR_EMOJI[def.attribute]}</div>
        <div class="hps-name">${def.name}</div>
        <div class="hps-lv">Lv ${inst.level}</div>
        <div class="hps-type">${def.type === 'attack' ? '「攻」' : '「守」'}</div>
      </div>`;
    }
    if (slot.type === 'egg') {
      const inst = s.eggs.find(e => e.instanceId === slot.instanceId);
      const def  = inst ? EGG_MAP[inst.eggId] : null;
      if (!def) return '';
      const cap  = EGG_EXP_TABLE[Math.min(inst.level, 50)] ?? 1;
      const pct  = Math.min(100, Math.round((inst.exp / cap) * 100));
      const nextLv = inst.level >= HATCH_THRESHOLDS.form3 ? '孵化可！' :
                     inst.level >= HATCH_THRESHOLDS.form2 ? 'Lv50→第3形態' :
                     inst.level >= HATCH_THRESHOLDS.form1 ? 'Lv30→第2形態' :
                     `Lv10で孵化可`;
      return `<div class="hps-slot hps-egg" data-nav="hatch">
        <div class="hps-icon-wrap" style="background:${def.color}">🥚</div>
        <div class="hps-name">${def.name}</div>
        <div class="hps-lv">Lv ${inst.level}</div>
        <div class="hps-bar-wrap"><div class="hps-bar" style="width:${pct}%;background:${def.color}"></div></div>
        <div class="hps-next">${nextLv}</div>
      </div>`;
    }
    return '';
  }).join('');

  const hasMonster = s.party.some(p => p.type === 'monster');

  el.innerHTML = `
    <div class="home-wrap">
      <header class="home-header">
        <h2 class="home-title">NEKOMON</h2>
        <div class="home-gold">💰 ${s.gold}</div>
      </header>

      <section class="home-party-section">
        <div class="section-label">現在の編成</div>
        <div class="home-party-slots">${partyHTML}</div>
        <div style="padding:0 16px 12px;">
          <button class="btn btn-outline" style="width:100%" id="btn-edit">✏️ 編成を変更する</button>
        </div>
      </section>

      <section class="home-actions">
        ${hasMonster
          ? `<button class="btn btn-primary btn-xl" id="btn-quest">⚔️ クエストへ出発！</button>`
          : `<div class="home-no-monster">
               <p>モンスターを編成してから出発しよう！</p>
               <button class="btn btn-primary btn-lg" id="btn-quest-disabled" disabled>⚔️ クエストへ出発</button>
             </div>`
        }
      </section>

      <nav class="home-subnav">
        <button class="home-nav-btn" id="btn-box">📦<br><small>ボックス</small></button>
        <button class="home-nav-btn" id="btn-hatch">🥚<br><small>孵化</small></button>
        <button class="home-nav-btn" id="btn-enc">📖<br><small>図鑑</small></button>
      </nav>
    </div>
  `;

  el.querySelector('#btn-quest')?.addEventListener('click',  () => navigateTo('quest'));
  el.querySelector('#btn-edit').addEventListener('click',    () => navigateTo('formation'));
  el.querySelector('#btn-box').addEventListener('click',     () => navigateTo('box'));
  el.querySelector('#btn-hatch').addEventListener('click',   () => navigateTo('hatch'));
  el.querySelector('#btn-enc').addEventListener('click',     () => navigateTo('encyclopedia'));

  el.querySelectorAll('.hps-slot[data-nav]').forEach(slot => {
    slot.addEventListener('click', () => navigateTo(slot.dataset.nav));
  });
}

export function unmount() {}
