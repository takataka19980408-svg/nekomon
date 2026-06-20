import { navigateTo } from '../core/router.js';
import { QUESTS } from '../data/quests.js';
import { getState } from '../core/state.js';

const BG_EMOJI = { forest:'ἳ2', lake:'ἰa', volcano:'ἰb', sanctuary:'✨', underworld:'Ὀ0', dragons_nest:'ὀ9' };
const ATTR_COLOR = { fire:'#FF6B35', water:'#3498DB', grass:'#27AE60', light:'#F1C40F', dark:'#8E44AD', dragon:'#E74C3C' };

export function mount(el) {
  const s = getState();
  const cards = QUESTS.map(q => {
    const cleared = s.clearedQuests.includes(q.id);
    return `
      <div class="quest-card" data-id="${q.id}" style="border-color:${ATTR_COLOR[q.attribute]}">
        <div class="quest-card-header" style="background:${ATTR_COLOR[q.attribute]}">
          <span class="quest-bg-emoji">${BG_EMOJI[q.background] ?? 'Ἵ5'}</span>
          <span class="quest-name">${q.name}</span>
          ${cleared ? '<span class="quest-cleared">✓クリア</span>' : ''}
        </div>
        <div class="quest-card-body">
          <p class="quest-desc">${q.description}</p>
          <div class="quest-stats">
            <span>⚡推奨戦力 ${q.recommendedPower}</span>
            <span>⭐EXP ${q.expReward.base}+</span>
          </div>
          <div class="quest-drops">
            ${q.eggDrops.map(d => `<span class="drop-tag">ᾕa ${d.rate*100|0}%</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="quest-wrap">
      <header class="screen-header">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>クエスト選択</h2>
      </header>
      <div class="quest-list">${cards}</div>
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => navigateTo('home'));
  el.querySelectorAll('.quest-card').forEach(card => {
    card.addEventListener('click', () => {
      const qid = card.dataset.id;
      navigateTo('formation', { questId: qid });
    });
  });
}

export function unmount() {}
