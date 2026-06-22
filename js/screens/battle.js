import { go } from '../core/router.js';
import { markCleared } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';
import { ENEMIES }  from '../data/enemies.js';
import { QUESTS }   from '../data/quests.js';

const REGEN  = 20;
const MAX_PT = 500;
const BTN_H  = 80;

let _el, _cv, _ctx, _raf, _bs, _q, _qid;
let _W, _H, _GY, _ABX, _EBX, _UR;
let _onResize;

export function mount(el, params) {
  _el  = el;
  _qid = params?.questId ?? 'forest_1';
  _q   = QUESTS.find(q => q.id === _qid);
  if (!_q) { go('quest'); return; }

  el.style.cssText =
    'position:absolute;top:0;right:0;bottom:0;left:0;overflow:hidden;background:#0d0d1a;';

  el.innerHTML = [
    '<canvas id="_bc" style="position:absolute;top:0;left:0;display:block;pointer-events:none;"></canvas>',

    '<div id="_ba" style="position:absolute;bottom:0;left:0;right:0;height:' + BTN_H + 'px;',
      'background:rgba(0,0,0,.92);border-top:1px solid #333;',
      'display:flex;flex-direction:column;align-items:flex-start;',
      'justify-content:center;padding:4px 10px;gap:4px;">',

      '<div style="display:flex;align-items:center;gap:8px;width:100%;">',
        '<span style="font-size:10px;color:#888;font-weight:700;min-width:16px;">PT</span>',
        '<div style="flex:1;height:8px;background:#1a1a3a;border-radius:4px;overflow:hidden;">',
          '<div id="_cbar" style="height:100%;width:0%;background:linear-gradient(90deg,#5a6aff,#c040ff);border-radius:4px;"></div>',
        '</div>',
        '<span id="_ctxt" style="font-size:11px;font-weight:700;color:#c8c8ff;min-width:58px;text-align:right;">0 / 500</span>',
      '</div>',

      '<div style="display:flex;gap:6px;">',
        '<button id="_d0" style="',
          'width:68px;height:50px;border-radius:8px;',
          'border:2px solid #252550;background:#0f0f2a;',
          'cursor:pointer;display:flex;flex-direction:column;',
          'align-items:center;justify-content:center;gap:1px;padding:3px;',
          'font-family:inherit;-webkit-tap-highlight-color:transparent;touch-action:manipulation;',
          'opacity:0.35;color:#fff;">',
          '<span style="font-size:18px;line-height:1;">🔥</span>',
          '<span style="font-size:8px;font-weight:700;color:#cce;">フレイムパピー</span>',
          '<span id="_d0c" style="font-size:9px;font-weight:700;color:#8888cc;">100pt</span>',
        '</button>',
      '</div>',

    '</div>',

    '<div id="_ov" style="display:none;position:absolute;top:0;right:0;bottom:0;left:0;',
      'background:rgba(0,0,0,.82);align-items:center;justify-content:center;z-index:20;">',
      '<div style="text-align:center;padding:24px 28px;background:#141428;border-radius:16px;',
        'border:2px solid #3a3a6a;display:flex;flex-direction:column;gap:14px;min-width:160px;">',
        '<div id="_ovt" style="font-size:36px;font-weight:900;line-height:1;"></div>',
        '<button id="_ovgo" style="padding:11px 20px;border:none;border-radius:50px;',
          'font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;',
          '-webkit-tap-highlight-color:transparent;touch-action:manipulation;',
          'background:linear-gradient(135deg,#5a6aff,#8040ff);color:#fff;">結果へ</button>',
      '</div>',
    '</div>',
  ].join('');

  _cv  = el.querySelector('#_bc');
  _ctx = _cv.getContext('2d');

  _onResize = () => _resize();
  window.addEventListener('resize', _onResize);
  window.addEventListener('orientationchange', () => setTimeout(_onResize, 100));

  el.querySelector('#_d0').addEventListener('click', _deploy);
  el.querySelector('#_ovgo').addEventListener('click', () =>
    go('result', { questId: _qid, won: _bs?.result === 'win' })
  );

  requestAnimationFrame(() => {
    _resize();
    _bs  = _initState();
    _raf = requestAnimationFrame(_loop);
  });
}

function _resize() {
  // Match the #game container's 16:9 landscape sizing
  const vw = window.innerWidth  || 960;
  const vh = window.innerHeight || 540;
  _W = Math.round(Math.min(vw, vh * 16 / 9));
  _H = Math.round(Math.min(vh, vw *  9 / 16));
  if (_cv) { _cv.width = _W; _cv.height = _H; }
  _GY  = _H - BTN_H - 16;
  _EBX = 50;
  _ABX = _W - 50;
  _UR  = Math.max(8, Math.min(_W, _GY) * 0.04);
}

function _initState() {
  const w = _q.waves[0];
  return {
    t:0, ptF:0, pt:0,
    aBase:{ hp:300, max:300 },
    eBase:{ hp:_q.enemyBaseHp, max:_q.enemyBaseHp },
    allies:[], enemies:[],
    cd:[0],
    nextSpawn: w?.startAt ?? 3,
    wIdx:0,
    parts:[],
    result:null,
    last:null,
  };
}

function _loop(ts) {
  if (!_bs) return;
  if (_bs.last === null) _bs.last = ts;
  const dt = Math.min((ts - _bs.last) / 1000, 0.05);
  _bs.last = ts;
  if (!_bs.result) _update(dt);
  _draw();
  if (_bs.result) { _raf = null; return; }
  _raf = requestAnimationFrame(_loop);
}

function _update(dt) {
  const b = _bs;
  b.t += dt;

  b.ptF += REGEN * dt;
  const g = b.ptF | 0; b.ptF -= g;
  b.pt = Math.min(b.pt + g, MAX_PT);

  for (let i = 0; i < b.cd.length; i++) b.cd[i] = Math.max(0, b.cd[i] - dt);

  if (b.t >= b.nextSpawn) {
    const w = _q.waves[b.wIdx % _q.waves.length];
    _spawnEnemy(w.enemyId);
    b.nextSpawn += w.interval;
    b.wIdx++;
  }

  b.allies .forEach(u => _tick(u, dt, b.enemies, b.eBase));
  b.enemies.forEach(u => _tick(u, dt, b.allies,  b.aBase));

  [...b.allies, ...b.enemies].forEach(u => { if (u.hp <= 0) _part(u.x, _GY - _UR, u.col); });
  b.allies  = b.allies .filter(u => u.hp > 0);
  b.enemies = b.enemies.filter(u => u.hp > 0);

  b.parts.forEach(p => { p.y -= 28*dt; p.a -= dt*2; });
  b.parts = b.parts.filter(p => p.a > 0);

  if (!b.result) {
    if      (b.eBase.hp <= 0) { b.result='win';  markCleared(_qid); _showOv('WIN!',   '#f5c518'); }
    else if (b.aBase.hp <= 0) { b.result='lose'; _showOv('LOSE...','#e74c3c'); }
  }

  _domHud();
}

function _tick(u, dt, foes, foeBase) {
  u.atkt = Math.max(0, u.atkt - dt);
  let tgt = null, md = Infinity;
  foes.forEach(f => { const d = Math.abs(f.x - u.x); if (d < md) { tgt=f; md=d; } });
  if (tgt && md <= u.range) {
    if (u.atkt === 0) { tgt.hp -= u.atk; u.atkt = u.atkI; _part(tgt.x, _GY-_UR*2, '#FFD700'); }
  } else {
    const bd = Math.abs(u.tgtX - u.x);
    if (bd <= u.range) {
      if (u.atkt === 0) { foeBase.hp = Math.max(0, foeBase.hp-u.atk); u.atkt=u.atkI; _part(u.tgtX,_GY-50,'#FF5555'); }
    } else {
      u.x += u.dir * u.spd * dt;
    }
  }
}

function _spawnAlly(id) {
  const d = MONSTERS[id]; if (!d) return;
  _bs.allies.push({ x:_ABX-_UR*3, hp:d.stats.hp, max:d.stats.hp, atk:d.stats.atk, range:d.stats.range, atkI:d.stats.atkInterval, spd:d.stats.speed, atkt:0, dir:-1, tgtX:_EBX, col:d.color });
}

function _spawnEnemy(id) {
  const d = ENEMIES[id]; if (!d) return;
  _bs.enemies.push({ x:_EBX+_UR*3, hp:d.stats.hp, max:d.stats.hp, atk:d.stats.atk, range:d.stats.range, atkI:d.stats.atkInterval, spd:d.stats.speed, atkt:0, dir:+1, tgtX:_ABX, col:d.color });
}

function _deploy() {
  if (!_bs || _bs.result) return;
  const d = MONSTERS['flame_puppy']; if (!d) return;
  if (_bs.pt < d.stats.cost || _bs.cd[0] > 0) return;
  _spawnAlly('flame_puppy');
  _bs.pt   -= d.stats.cost;
  _bs.ptF   = _bs.pt;
  _bs.cd[0] = d.stats.cooldown;
}

function _part(x, y, col) { _bs?.parts.push({x,y,col,a:1}); }

function _showOv(txt, col) {
  const ov  = _el?.querySelector('#_ov');
  const ovt = _el?.querySelector('#_ovt');
  if (ov)  ov.style.display  = 'flex';
  if (ovt) { ovt.textContent = txt; ovt.style.color = col; }
}

function _domHud() {
  const b  = _bs;
  const $  = id => _el?.querySelector(id);
  const cb = $('#_cbar'), ct = $('#_ctxt'), d0 = $('#_d0'), dc = $('#_d0c');

  if (cb) cb.style.width = (b.pt / MAX_PT * 100) + '%';
  if (ct) ct.textContent = (b.pt|0) + ' / ' + MAX_PT;

  if (d0) {
    const cd = b.cd[0];
    if (cd > 0) {
      d0.style.opacity = '0.42'; d0.style.borderColor = '#2a4a7a'; d0.style.background = '#0a0f1a'; d0.style.boxShadow = 'none';
      if (dc) dc.textContent = cd.toFixed(1)+'s';
    } else if (b.pt >= 100) {
      d0.style.opacity = '1'; d0.style.borderColor = '#f5c518'; d0.style.background = '#1a1600'; d0.style.boxShadow = '0 0 8px rgba(245,197,24,.4)';
      if (dc) dc.textContent = '100pt';
    } else {
      d0.style.opacity = '0.35'; d0.style.borderColor = '#252550'; d0.style.background = '#0f0f2a'; d0.style.boxShadow = 'none';
      if (dc) dc.textContent = '100pt';
    }
  }
}

function _draw() {
  const ctx = _ctx;
  if (!ctx || !_W || !_H) return;

  const sk = ctx.createLinearGradient(0,0,0,_GY);
  sk.addColorStop(0,'#1a4a1a'); sk.addColorStop(1,'#6aa45a');
  ctx.fillStyle = sk; ctx.fillRect(0,0,_W,_GY);
  ctx.fillStyle = '#5a3a10'; ctx.fillRect(0,_GY,_W,_H-_GY);
  ctx.fillStyle = '#3a6a1a'; ctx.fillRect(0,_GY,_W,6);

  ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0,0,_W,34);
  _drawBar(ctx, 8, 6, _W/2-56, 9, _bs.eBase.hp/_bs.eBase.max, '#e74c3c', '敵基地');
  _drawBar(ctx, _W/2+48, 6, _W/2-56, 9, _bs.aBase.hp/_bs.aBase.max, '#27ae60', '自基地');
  ctx.fillStyle='#aaa'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText((_bs.t|0)+'s', _W/2, 11);

  _drawBase(ctx, _EBX, '#CC2222', _bs.eBase.hp/_bs.eBase.max, '☠');
  _drawBase(ctx, _ABX, '#2244CC', _bs.aBase.hp/_bs.aBase.max, '🏰');

  _bs.enemies.forEach(u => _drawUnit(ctx, u, true));
  _bs.allies .forEach(u => _drawUnit(ctx, u, false));

  _bs.parts.forEach(p => {
    ctx.save(); ctx.globalAlpha = Math.max(0,p.a);
    ctx.fillStyle = p.col;
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

function _drawBar(ctx, x, y, w, h, ratio, col, label) {
  ctx.fillStyle='#111a'; ctx.fillRect(x,y,w,h);
  ctx.fillStyle=col; ctx.fillRect(x,y,w*Math.max(0,ratio),h);
  ctx.fillStyle='#ccc'; ctx.font='bold 8px sans-serif';
  ctx.textAlign='left'; ctx.textBaseline='top';
  ctx.fillText(label, x, y+h+1);
}

function _drawBase(ctx, x, col, ratio, icon) {
  const bw=24, bh=52, by=_GY-bh;
  ctx.fillStyle=col+'99'; ctx.fillRect(x-bw/2,by,bw,bh);
  ctx.strokeStyle=col; ctx.lineWidth=2; ctx.strokeRect(x-bw/2,by,bw,bh);
  ctx.font=`${bw*.85}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(icon, x, by+bh/2);
  const bw2=42, bx2=x-21, by2=by-9;
  ctx.fillStyle='#111a'; ctx.fillRect(bx2,by2,bw2,5);
  ctx.fillStyle=ratio>0.5?'#44DD44':ratio>0.25?'#DDDD44':'#DD4444';
  ctx.fillRect(bx2,by2,bw2*Math.max(0,ratio),5);
}

function _drawUnit(ctx, u, isEnemy) {
  const r=_UR, y=_GY-r;
  ctx.save(); ctx.fillStyle=u.col;
  if (isEnemy) {
    ctx.beginPath();
    ctx.moveTo(u.x,y-r); ctx.lineTo(u.x+r,y); ctx.lineTo(u.x,y+r); ctx.lineTo(u.x-r,y);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(u.x,y,r,0,Math.PI*2); ctx.fill();
  }
  ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=1.5; ctx.stroke();
  const hw=r*2, hpR=u.hp/u.max;
  ctx.fillStyle='#0007'; ctx.fillRect(u.x-r,y+r+2,hw,3);
  ctx.fillStyle=hpR>.5?'#44DD44':'#DD4444'; ctx.fillRect(u.x-r,y+r+2,hw*Math.max(0,hpR),3);
  ctx.restore();
}

export function unmount() {
  if (_raf) { cancelAnimationFrame(_raf); _raf=null; }
  if (_onResize) {
    window.removeEventListener('resize', _onResize);
    window.removeEventListener('orientationchange', _onResize);
    _onResize=null;
  }
  _cv=null; _ctx=null; _bs=null; _el=null;
}
