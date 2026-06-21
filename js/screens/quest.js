import { navigateTo } from '../core/router.js';
import { QUESTS } from '../data/quests.js';
import { getState } from '../core/state.js';
import { ENEMY_MAP } from '../data/enemies.js';
import { EGG_MAP } from '../data/eggs.js';

const BG_EMOJI   = { forest:'🌲', lake:'🌊', volcano:'🌋', sanctuary:'✨', underworld:'💀', dragons_nest:'🐉' };
const ATTR_COLOR = { fire:'#FF6B35', water:'#3498DB', grass:'#27AE60', light:'#F1C40F', dark:'#8E44AD', dragon:'#E74C3C' };
const ATTR_EMOJI = { fire:'🔥', water:'💧', grass:'🌿', light:'✨', dark:'🌙', dragon:'🐉' };
const ATTR_NAME  = { fire:'炎', water:'水', grass:'草', light:'光', dark:'闇', dragon:'竜' };

export function mount(el) {
  const s = getState();

  const cards = QUESTS.map(q => {
    const cleared = s.clearedQuests.includes(q.id);
    const color   = ATTR_COLOR[q.attribute] ?? '#888';

    const enemyAttrs = [...new Set(
      q.enemyWaves.map(w => ENEMY_MAP[w.enemyId]?.attribute).filter(Boolean)
    )];
    const enemyHTML = enemyAttrs.map(a =>
      `<span class="quest-enemy-tag" title="${ATTR_NAME[a]}属性">${ATTR_EMOJI[a]} ${ATTR_NAME[a]}</span>`
    ).join('');

    const dropHTML = q.eggDrops.map(d => {
      const egg = EGG_MAP[d.eggId];
      return `<span class="drop-tag" style="border-color:${egg?.color ?? '#888'}">🥚 ${egg?.name ?? d.eggId} <b>${Math.round(d.rate * 100)}%</b></span>`;
    }).join('');

    return `
      <div class="quest-card" data-id="${q.id}" style="border-color:${color}">
        <div class="quest-card-header" style="background:${color}">
          <span class="quest-bg-emoji">${BG_EMOJI[q.background] ?? '🏕'}</span>
          <span class="quest-name">${q.name}</span>
          ${cleared ? '<span class="quest-cleared">✓ CLEAR</span>' : ''}
        </div>
        <div class="quest-card-body">
          <p class="quest-desc">${q.description}</p>
          <div class="quest-info-row">
            <span class="quest-info-label">出現する敵</span>
            <div class="quest-enemies">${enemyHTML || '<span style="color:var(--text-sub)">-</span>'}</div>
          </div>
          <div class="quest-info-row">
            <span class="quest-info-label">ドロップ卵</span>
            <div class="quest-drops">${dropHTML || '<span style="color:var(--text-sub);font-size:12px">なし</span>'}</div>
          </div>
          <div class="quest-info-row">
            <span class="quest-info-label">獲得EXP</span>
            <span>${q.expReward.base}+</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="quest-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>🗺️ クエスト選択</h2>
      </header>
      <div class="quest-list">${cards}</div>
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo('home'));
  el.querySelectorAll('.quest-card').forEach(card => {
    card.addEventListener('click', () => navigateTo('formation', { questId: card.dataset.id }));
  });
}

export function unmount() {}
