// main.js — エントリポイント。画面登録と初期化。
import { registerScreen, navigateTo } from './core/router.js';
import { getState, addEggToBox, saveState } from './core/state.js';

registerScreen('title',        () => import('./screens/title.js'));
registerScreen('home',         () => import('./screens/home.js'));
registerScreen('quest',        () => import('./screens/quest.js'));
registerScreen('formation',    () => import('./screens/formation.js'));
registerScreen('battle',       () => import('./screens/battle.js'));
registerScreen('result',       () => import('./screens/result.js'));
registerScreen('box',          () => import('./screens/box.js'));
registerScreen('hatch',        () => import('./screens/hatch.js'));
registerScreen('encyclopedia', () => import('./screens/encyclopedia.js'));

// 初回起動のみスターター卵をプレゼント
const s = getState();
if (s.monsters.length === 0 && s.eggs.length === 0) {
  addEggToBox('fire_egg');
  addEggToBox('grass_egg');
  saveState();
}

navigateTo('title');
