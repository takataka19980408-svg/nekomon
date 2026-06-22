import { register, go } from './core/router.js';

register('home',         () => import('./screens/home.js'));
register('quest',        () => import('./screens/quest.js'));
register('battle',       () => import('./screens/battle.js'));
register('result',       () => import('./screens/result.js'));
register('box',          () => import('./screens/box.js'));
register('eggs',         () => import('./screens/eggs.js'));
register('hatch',        () => import('./screens/hatch.js'));
register('encyclopedia', () => import('./screens/encyclopedia.js'));

go('home');
