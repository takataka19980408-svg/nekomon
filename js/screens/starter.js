import { navigateTo } from '../core/router.js';
import { getState, addMonsterToBox, addEggToBox } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';

const STARTERS = [
  { id: 'fire_atk_1',  emoji: '🔥', attr: 'ほのお', hint: '高速・高火力タイプ' },
  { id: 'water_atk_1', emoji: '💧', attr: 'みず',   hint: 'バランス型・遠距離' },
  { id: 'grass_atk_1', emoji: '🌿', attr: 'くさ',   hint: '素早い・連続攻撃型' },
];

export function mount(el) {
  const s = getState();
  if (s.monsters.length > 0) { navigateTo('home'); return; }

  const cards = STARTERS.map(st => {
    const def = MONSTER_MAP[st.id];
    return `
      <div class="starter-card" data-id="${st.id}">
        <div class="starter-icon" style="background:${def.color}">${st.emoji}</div>
        <div class="starter-name">${def.name}</div>
        <div class="starter-attr">${st.attr}タイプ</div>
        <div class="starter-hint">${st.hint}</div>
        <div class="starter-stats">
          <span>HP ${def.stats.hp}</span>
          <span>攻 ${def.stats.attack}</span>
          <span>速 ${def.stats.moveSpeed}</span>
        </div>
        <button class="btn btn-primary starter-btn" style="background:${def.color};border-color:${def.color}">この子にする！</button>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div class="starter-wrap">
      <div class="starter-header">
        <h1 class="starter-title">最初の仓間を<br>選んでください！</h1>
        <p class="starter-sub">この子と一緒にバトルへ挑もう</p>
      </div>
      <div class="starter-cards">${cards}</div>
      <p class="starter-footnote">🥚 選んだ後、烎と草の卵もプレゼントされます</p>
    </div>
  `;

  el.querySelectorAll('.starter-card').forEach(card => {
    card.querySelector('.starter-btn').addEventListener('click', () => {
      addMonsterToBox(card.dataset.id);
      addEggToBox('fire_egg');
      addEggToBox('grass_egg');
      navigateTo('home');
    });
  });
}

export function unmount() {}
