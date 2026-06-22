const _reg = {};
let _mod = null;

export function register(id, loader) {
  _reg[id] = loader;
}

export async function go(id, params = {}) {
  try {
    _mod?.unmount?.();
    _mod = null;
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const factory = _reg[id];
    if (!factory) return;
    const el = document.getElementById('screen-' + id);
    if (!el) return;
    el.classList.add('active');
    _mod = await factory();
    _mod?.mount?.(el, params);
  } catch(e) {
    console.error('[router]', id, e);
    if (id !== 'home') go('home');
  }
}
