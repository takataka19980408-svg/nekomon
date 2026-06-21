import { navigateTo } from '../core/router.js';
import { getState } from '../core/state.js';

export function mount(el) {
  el.innerHTML = `
    <div class="title-bg">
      <div class="title-logo">
        <div class="title-logo-icon">🥚</div>
        <h1 class="title-logo-text">NEKOMON</h1>
        <p class="title-subtitle">モンスター卵孵化バトル</p>
      </div>
      <div class="title-monsters">
        <div class="title-monster float-anim" style="background:#FF6B35;animation-delay:0s">🔥</div>
        <div class="title-monster float-anim" style="background:#3498DB;animation-delay:.15s">💧</div>
        <div class="title-monster float-anim" style="background:#27AE60;animation-delay:.30s">🌿</div>
        <div class="title-monster float-anim" style="background:#F1C40F;animation-delay:.45s">✨</div>
        <div class="title-monster float-anim" style="background:#8E44AD;animation-delay:.60s">🌙</div>
      </div>
      <button class="btn btn-primary btn-xl" id="btn-start">
        &#x25B6; ゲームスタート
      </button>
      <p class="title-version">ver 0.1.0</p>
    </div>
  `;
  el.querySelector('#btn-start').addEventListener('click', () => {
    const s = getState();
    navigateTo(s.monsters.length === 0 ? 'starter' : 'home');
  });
}

export function unmount() {}
