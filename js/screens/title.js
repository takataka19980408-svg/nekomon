import { navigateTo } from '../core/router.js';

export function mount(el) {
  el.innerHTML = `
    <div class="title-bg">
      <div class="title-logo">
        <div class="title-logo-icon">&#x1F95A;</div>
        <h1 class="title-logo-text">NEKOMON</h1>
        <p class="title-subtitle">モンスター卵孵化バトル</p>
      </div>
      <div class="title-monsters">
        <div class="title-monster float-anim" style="background:#FF6B35;animation-delay:0s">ὒ5</div>
        <div class="title-monster float-anim" style="background:#3498DB;animation-delay:.15s">Ὂ7</div>
        <div class="title-monster float-anim" style="background:#27AE60;animation-delay:.30s">ἳf</div>
        <div class="title-monster float-anim" style="background:#F1C40F;animation-delay:.45s">✨</div>
        <div class="title-monster float-anim" style="background:#8E44AD;animation-delay:.60s">ἱ9</div>
      </div>
      <button class="btn btn-primary btn-xl" id="btn-start">
        &#x25B6; ゲームスタート
      </button>
      <p class="title-version">ver 0.1.0</p>
    </div>
  `;
  el.querySelector('#btn-start').addEventListener('click', () => navigateTo('home'));
}

export function unmount() {}
