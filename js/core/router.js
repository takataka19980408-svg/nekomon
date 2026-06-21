const _reg = {};
let _mod = null;

export function register(id, loader) {
  _reg[id] = loader;
}

export async function go(id, params = {}) {
  _mod?.unmount?.();
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const factory = _reg[id];
  if (!factory) { console.error('[router] unknown screen:', id); return; }
  const el = document.getElementById(`screen-${id}`);
  if (!el)      { console.error('[router] missing DOM for:', id); return; }
  el.classList.add('active');
  _mod = await factory();
  _mod?.mount?.(el, params);
}
