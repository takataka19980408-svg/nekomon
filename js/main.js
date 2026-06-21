import { registerScreen, navigateTo } from './core/router.js';

// ── ビューポート高さ補正 (アドレスバー対策) ──
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 200));

// ── 横画面ロック ──
// Screen Orientation API でロックできた場合: 常に横画面 → 誘導画面不要
// ロックできない場合 (iPhone Safari など): CSS が縦画面時に誘導画面を表示
async function tryLandscape() {
  if (!screen.orientation?.lock) return;
  try {
    await screen.orientation.lock('landscape');
    document.documentElement.classList.add('orientation-locked');
  } catch {
    // ロック不可 — CSS (@media portrait) が誘導画面を制御
  }
}
tryLandscape();
document.addEventListener('touchstart', tryLandscape, { once: true });
document.addEventListener('click',      tryLandscape, { once: true });

registerScreen('title',        () => import('./screens/title.js'));
registerScreen('starter',      () => import('./screens/starter.js'));
registerScreen('home',         () => import('./screens/home.js'));
registerScreen('quest',        () => import('./screens/quest.js'));
registerScreen('formation',    () => import('./screens/formation.js'));
registerScreen('battle',       () => import('./screens/battle.js'));
registerScreen('result',       () => import('./screens/result.js'));
registerScreen('box',          () => import('./screens/box.js'));
registerScreen('hatch',        () => import('./screens/hatch.js'));
registerScreen('encyclopedia', () => import('./screens/encyclopedia.js'));

navigiateTo('title');
