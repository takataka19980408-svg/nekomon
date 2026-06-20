import { navigateTo } from '../core/router.js';
import { EGG_MAP } from '../data/eggs.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { QUEST_MAP } from '../data/quests.js';

export function mount(el, params) {
  const { win, reward, questId } = params ?? {};
  const quest = questId ? QUEST_MAP[questId] : null;

  const droppedHTML = (reward?.dropped ?? []).map(eggId => {
    const def = EGG_MAP[eggId];
    return def
      ? `<div class="drop-item" style="border-color:${def.color}">🥚 ${def.name}</div>`
      : '';
  }).join('');

  el.innerHTML = `
    <div class="result-wrap ${win ? 'result-win' : 'result-lose'}">
      <div class="result-title">${win ? '🏆 勝利！' : '💥 敗北…'}</div>
      <div class="result-body">
        ${quest ? `<p class="result-quest">「${quest.name}」</p>` : ''}
        ${win ? `
          <div class="result-row"><span>経験値</span><strong>+${reward?.totalExp ?? 0} EXP</strong></div>
          <div class="result-drops">
            <p class="result-drops-label">ドロップ</p>
            ${droppedHTML || '<p class="empty-msg">なし</p>'}
          </div>
        ` : ''}
      </div>
      <div class="result-btns">
        ${questId ? `<button class="btn btn-outline" id="btn-retry">🔄 リトライ</button>` : ''}
        <button class="btn btn-primary" id="btn-home">🏠 ホーム</button>
      </div>
    </div>
  `;

  el.querySelector('#btn-home').addEventListener('click', () => navigateTo('home'));
  el.querySelector('#btn-retry')?.addEventListener('click', () => navigateTo('formation', { questId }));
}

export function unmount() {}
