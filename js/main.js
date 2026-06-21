import { register, go } from './core/router.js';

function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 200));

async function lockLandscape() {
  if (!screen.orientation?.lock) return;
  try {
    await screen.orientation.lock('landscape');
    document.documentElement.classList.add('locked');
  } catch { /* CSS @media portrait handles fallback */ }
}
lockLandscape();
document.addEventListener('touchstart', lockLandscape, { once: true });
document.addEventListener('click',      lockLandscape, { once: true });

register('home',         () => import('./screens/home.js'));
register('quest',        () => import('./screens/quest.js'));
register('battle',       () => import('./screens/battle.js'));
register('result',       () => import('./screens/result.js'));
register('box',          () => import('./screens/box.js'));
register('eggs',         () => import('./screens/eggs.js'));
register('hatch',        () => import('./screens/hatch.js'));
register('encyclopedia', () => import('./screens/encyclopedia.js'));

go('home');
