import { go } from '../core/router.js';
import { getState } from '../core/state.js';
import { QUESTS } from '../data/quests.js';

export function mount(el) {
  const s = getState();
  const listHTML = QUESTS.map(q => {
    const cleared = s.clearedQuests.includes(q.id);
    return `
      <div class="card q-card" data-id="${q.id}">
        <div class="q-icon">${q.icon}</div>
        <div class="q-info">
          <div class="q-name">${q.name}${cleared ? ' ✅' : ''}</div>
          <div class="q-desc">${q.description}</div>
        </div>
        <button class="btn btn-primary q-btn">出撃</button>
      </div>
    `;
  }).join('');

  el.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%">
      <header class="hdr">
        <button class="btn-back" id="btn-back">❮</button>
        <h2>クエスト</h2>
      </header>
      <div class="quest-list">${listHTML}</div>
    </div>
  `;

  el.querySelector('#btn-back').addEventListener('click', () => go('home'));
  el.querySelectorAll('.q-card').forEach(card => {
    card.addEventListener('click', () => go('battle', { questId: card.dataset.id }));
  });
  el.querySelectorAll('.q-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.q-card');
      go('battle', { questId: card.dataset.id });
    });
  });
}

export function unmount() {}
