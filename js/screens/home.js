import { go } from '../core/router.js';
import { getState } from '../core/state.js';

export function mount(el) {
  const s = getState();
  el.innerHTML = `
    <div class="home-wrap">
      <div class="home-logo">
        <div class="home-egg">🥚</div>
        <h1>NEKOMON</h1>
        <p>Ver 0.1</p>
      </div>
      <nav class="home-nav">
        <button class="btn btn-primary" id="btn-quest" style="width:100%;padding:16px;font-size:17px">⚔️ クエスト</button>
        <div class="home-row">
          <button class="btn btn-outline" id="btn-box">📦 ボックス</button>
          <button class="btn btn-outline" id="btn-eggs">🥚 卵</button>
          <button class="btn btn-outline" id="btn-hatch">🐣 孵化</button>
          <button class="btn btn-outline" id="btn-enc">📖 図鑑</button>
        </div>
      </nav>
      <div style="color:var(--sub);font-size:12px">クリア済み: ${s.clearedQuests.length} クエスト</div>
    </div>
  `;
  el.querySelector('#btn-quest').addEventListener('click', () => go('quest'));
  el.querySelector('#btn-box').addEventListener('click',   () => go('box'));
  el.querySelector('#btn-eggs').addEventListener('click',  () => go('eggs'));
  el.querySelector('#btn-hatch').addEventListener('click', () => go('hatch'));
  el.querySelector('#btn-enc').addEventListener('click',   () => go('encyclopedia'));
}

export function unmount() {}
