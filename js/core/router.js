// router.js — 画面遷移管理。各screenモジュールは mount(el) と unmount() を実裃する。

let currentScreen = null;
let currentModule = null;

const SCREENS = {};

export function registerScreen(id, moduleFactory) {
  SCREENS[id] = moduleFactory;
}

export async function navigateTo(screenId, params = {}) {
  if (currentModule?.unmount) currentModule.unmount();

  // 全画面を隠す
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

  const factory = SCREENS[screenId];
  if (!factory) { console.error('Unknown screen:', screenId); return; }

  const el = document.getElementById(`screen-${screenId}`);
  if (!el) { console.error('Missing DOM for screen:', screenId); return; }

  currentScreen = screenId;
  el.classList.add('active');

  currentModule = await factory();
  if (currentModule?.mount) currentModule.mount(el, params);
}

export function getCurrentScreen() { return currentScreen; }
