import { registerScreen, navigateTo } from './core/router.js';

// Fix 100vh on mobile (address bar eats viewport)
function setAppHeight() {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 150));

// Auto-lock to landscape on Android/Chrome; iOS requires PWA install
function tryLandscape() {
  if (screen.orientation?.lock) {
    screen.orientation.lock('landscape').catch(() => {});
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

navigateTo('title');
