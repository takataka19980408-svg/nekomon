import { go } from '../core/router.js';
import { QUESTS } from '../data/quests.js';

export function mount(el, params) {
  const { questId, won } = params ?? {};
  const quest = QUESTS.find(q => q.id === questId);

  el.innerHTML = `
    <div class="result-wrap">
      <div class="result-icon">${won ? '🏆' : '💀'}</div>
      <h2 class="result-title ${won ? 'win' : 'lose'}">${won ? 'WIN!' : 'LOSE...'}</h2>
      <p class="result-msg">${quest?.name ?? ''}</p>
      <div class="result-btns">
        <button class="btn btn-outline" id="btn-retry">リトライ</button>
        <button class="btn btn-primary" id="btn-home">ホームへ</button>
      </div>
    </div>
  `;

  el.querySelector('#btn-retry').addEventListener('click', () => go('battle', { questId }));
  el.querySelector('#btn-home').addEventListener('click',  () => go('home'));
}

export function unmount() {}
