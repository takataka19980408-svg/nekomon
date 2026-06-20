// main.js — エントリポイント。画面を登録し初期化する。
import { registerScreen, navigateTo } from './core/router.js';
import { getState } from './core/state.js';

// 画面モジュールを遅延ロード登録
registerScreen('title',        () => import('./screens/title.js'));
registerScreen('home',         () => import('./screens/home.js'));
registerScreen('quest',        () => import('./screens/quest.js'));
registerScreen('formation',    () => import('./screens/formation.js'));
registerScreen('battle',       () => import('./screens/battle.js'));
registerScreen('result',       () => import('./screens/result.js'));
registerScreen('box',          () => import('./screens/box.js'));
registerScreen('hatch',        () => import('./screens/hatch.js'));
registerScreen('encyclopedia', () => import('./screens/encyclopedia.js'));

// 初回プレイイヤーにスターターモンスターをプレゼント
function initNewPlayer() {
  const s = getState();
  if (s.monsters.length === 0 && s.eggs.length === 0) {
    // 初回起動時のみ火卵・草卵をプレゼント
    const { addEggToBox } = await import('./core/state.js');
    // 非同期なので直接呼び出す
  }
}

// 実際に実行
navigateInitial();

async function navigateInitial() {
  // 初回起動: 火卵と草卵をプレゼント
  const s = getState();
  if (s.monsters.length === 0 && s.eggs.length === 0) {
    const { addEggToBox, saveState } = await import('./core/state.js');
    addEggToBox('fire_egg');
    addEggToBox('grass_egg');
    saveState();
  }
  navigateTo('title');
}
