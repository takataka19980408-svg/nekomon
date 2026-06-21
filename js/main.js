import { registerScreen, navigateTo } from './core/router.js';

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

navigateToTitle();

function navigateToTitle() {
  navigateTo('title');
}
