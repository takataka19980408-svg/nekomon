import { go } from '../core/router.js';

export function mount(el) {
  el.innerHTML = `
    <div class="stub-wrap">
      <div class="stub-icon">🥚</div>
      <p>卵ボックス</p>
      <p style="font-size:11px">Ver0.1 では未実装</p>
      <button class="btn btn-outline" id="btn-back">戻る</button>
    </div>
  `;
  el.querySelector('#btn-back').addEventListener('click', () => go('home'));
}

export function unmount() {}
