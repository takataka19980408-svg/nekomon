import { go } from '../core/router.js';
import { markCleared } from '../core/state.js';
import { MONSTERS } from '../data/monsters.js';
import { ENEMIES }  from '../data/enemies.js';
import { QUESTS }   from '../data/quests.js';

const COST_REGEN = 20;
const MAX_COST   = 500;

let _el, _canvas, _ctx, _raf, _bs, _quest, _questId;
let _CW, _CH, _GY, _ABX, _EBX, _UR;
let _onResize;

export function mount(el, params) {
  _el      = el;
  _questId = params?.questId ?? 'forest_1';
  _quest   = QUESTS.find(q => q.id === _questId);
  if (!_quest) { go('quest'); return; }

  el.innerHTML = `
    <div class="battle-wrap">
      <div class="battle-hud" id="bhud">
        <div class="hud-side enemy">
          <div class="hud-lbl">敵基地</div>
          <div class="hud-bar-bg"><div class="hud-bar" id="ehp" style="width:100%;background:#e74c3c"></div></div>
          <div class="hud-hp" id="ehp-n">${_quest.enemyBaseHp}</div>
        </div>
        <div class="hud-time" id="hud-t">0s</div>
        <div class="hud-side ally">
          <div class="hud-lbl">自基地</div>
          <div class="hud-bar-bg"><div class="hud-bar" id="ahp" style="width:100%;background:#27ae60"></div></div>
          <div class="hud-hp" id="ahp-n">300</div>
        </div>
      </div>
      <canvas id="bc"></canvas>
      <div class="battle-bottom">
        <div class="cost-row">
          <span class="cost-lbl">PT</span>
          <div class="cost-bar-bg"><div class="cost-bar" id="cbar" style="width:0%"></div></div>
          <span class="cost-txt" id="ctxt">0 / ${MAX_COST}</span>
        </div>
        <div class="deploy-row">
          <button class="d-btn dim" id="d0">
            <span class="d-icon">🔥</span>
            <span class="d-name">フレイムパピー</span>
            <span class="d-cost" id="d0c">100pt</span>
          </button>
        </div>
      </div>
      <div class="battle-ov hidden" id="bov">
        <div class="ov-box">
          <div class="ov-title" id="ovt"></div>
          <button class="btn btn-primary" id="ov-go">結果へ</button>
        </div>
      </div>
    </div>
  `;

  _canvas = el.querySelector('#bc');
  _ctx    = _canvas.getContext('2d');
  _onResize = () => _resize();
  window.addEventListener('resize', _onResize);
  setTimeout(_resize, 0);

  _bs = _initState();

  el.querySelector('#d0').addEventListener('click', _deploy);
  el.querySelector('#ov-go').addEventListener('click', () =>
    go('result', { questId: _questId, won: _bs.result === 'win' })
  );

  _raf = requestAnimationFrame(_loop);
}

function _resize() {
  if (!_canvas) return;
  _CW = _canvas.clientWidth  || (_el?.clientWidth  ?? 600);
  _CH = _canvas.clientHeight || (_el?.clientHeight ?? 300) - 100;
  _canvas.width  = _CW;
  _canvas.height = _CH;
  _GY  = _CH - 42;
  _EBX = 50;
  _ABX = _CW - 50;
  _UR  = Math.max(10, Math.min(_CW, _CH) * 0.038);
}

function _initState() {
  const w = _quest.waves[0];
  return {
    t:0, costF:0, cost:0,
    aBase: { hp:300, maxHp:300 },
    eBase: { hp:_quest.enemyBaseHp, maxHp:_quest.enemyBaseHp },
    allies:[], enemies:[],
    cd: [0],
    nextSpawn: w?.startAt ?? 3,
    wIdx: 0,
    parts: [],
    result: null,
    lastTs: null,
  };
}

function _loop(ts) {
  if (!_bs) return;
  if (_bs.lastTs === null) _bs.lastTs = ts;
  const dt = Math.min((ts - _bs.lastTs) / 1000, 0.05);
  _bs.lastTs = ts;
  if (!_bs.result) _update(dt);
  _draw();
  _raf = requestAnimationFrame(_loop);
}

function _update(dt) {
  const b = _bs;
  b.t += dt;

  // cost
  b.costF += COST_REGEN * dt;
  const g = b.costF | 0; b.costF -= g;
  b.cost = Math.min(b.cost + g, MAX_COST);

  // cooldowns
  for (let i = 0; i < b.cd.length; i++) b.cd[i] = Math.max(0, b.cd[i] - dt);

  // spawn enemies
  if (b.t >= b.nextSpawn) {
    const w = _quest.waves[b.wIdx % _quest.waves.length];
    _spawnEnemy(w.enemyId);
    b.nextSpawn += w.interval;
    b.wIdx++;
  }

  // tick
  b.allies .forEach(u => _tick(u, dt, b.enemies, b.eBase));
  b.enemies.forEach(u => _tick(u, dt, b.allies,  b.aBase));

  // death particles
  [...b.allies, ...b.enemies].forEach(u => {
    if (u.hp <= 0) _part(u.x, _GY - _UR, u.color);
  });
  b.allies  = b.allies .filter(u => u.hp > 0);
  b.enemies = b.enemies.filter(u => u.hp > 0);

  // particles
  b.parts.forEach(p => { p.y -= 30*dt; p.a -= dt*1.8; });
  b.parts = b.parts.filter(p => p.a > 0);

  // win/lose
  if (!b.result) {
    if (b.eBase.hp <= 0) {
      b.result = 'win';
      markCleared(_questId);
      _showOv('WIN! 🎉', 'win');
    } else if (b.aBase.hp <= 0) {
      b.result = 'lose';
      _showOv('LOSE... 💀', 'lose');
    }
  }

  _hud();
}

function _tick(u, dt, foes, foeBase) {
  u.atkt = Math.max(0, u.atkt - dt);

  let tgt = null, md = Infinity;
  foes.forEach(f => { const d = Math.abs(f.x - u.x); if (d < md) { tgt = f; md = d; } });

  if (tgt && md <= u.range) {
    if (u.atkt === 0) { tgt.hp -= u.atk; u.atkt = u.atkI; _part(tgt.x, _GY - _UR*2, '#FFD700'); }
  } else {
    const bd = Math.abs(u.tgtX - u.x);
    if (bd <= u.range) {
      if (u.atkt === 0) { foeBase.hp = Math.max(0, foeBase.hp - u.atk); u.atkt = u.atkI; _part(u.tgtX, _GY-60, '#FF5555'); }
    } else {
      u.x += u.dir * u.spd * dt;
    }
  }
}

function _spawnAlly(id) {
  const d = MONSTERS[id]; if (!d) return;
  _bs.allies.push({ x:_ABX - _UR*3, hp:d.stats.hp, maxHp:d.stats.hp, atk:d.stats.atk, range:d.stats.range, atkI:d.stats.atkInterval, spd:d.stats.speed, atkt:0, dir:-1, tgtX:_EBX, color:d.color });
}

function _spawnEnemy(id) {
  const d = ENEMIES[id]; if (!d) return;
  _bs.enemies.push({ x:_EBX + _UR*3, hp:d.stats.hp, maxHp:d.stats.hp, atk:d.stats.atk, range:d.stats.range, atkI:d.stats.atkInterval, spd:d.stats.speed, atkt:0, dir:+1, tgtX:_ABX, color:d.color });
}

function _deploy() {
  if (!_bs || _bs.result) return;
  const d = MONSTERS['flame_puppy']; if (!d) return;
  if (_bs.cost < d.stats.cost || _bs.cd[0] > 0) return;
  _spawnAlly('flame_puppy');
  _bs.cost -= d.stats.cost;
  _bs.cd[0] = d.stats.cooldown;
}

function _part(x, y, col) {
  _bs.parts.push({ x, y, color:col, a:1.0 });
}

function _showOv(text, cls) {
  const ov = _el?.querySelector('#bov');
  const t  = _el?.querySelector('#ovt');
  if (ov) ov.classList.remove('hidden');
  if (t)  { t.textContent = text; t.className = 'ov-title ' + cls; }
}

function _hud() {
  const b = _bs;
  const $ = id => document.getElementById(id);
  const setW = (el, v) => el && (el.style.width = (Math.max(0, Math.min(1,v))*100)+'%');
  setW($('ehp'), b.eBase.hp / b.eBase.maxHp);
  setW($('ahp'), b.aBase.hp / b.aBase.maxHp);
  setW($('cbar'), b.cost / MAX_COST);
  const eN = $('ehp-n'); if (eN) eN.textContent = Math.ceil(b.eBase.hp);
  const aN = $('ahp-n'); if (aN) aN.textContent = Math.ceil(b.aBase.hp);
  const ct = $('ctxt'); if (ct) ct.textContent = `${b.cost|0} / ${MAX_COST}`;
  const ht = $('hud-t'); if (ht) ht.textContent = `${b.t|0}s`;

  const btn = $('d0'), dc = $('d0c');
  if (btn) {
    btn.classList.remove('ready','dim','cd');
    const cd = b.cd[0];
    if (cd > 0) {
      btn.classList.add('cd');
      if (dc) dc.textContent = cd.toFixed(1)+'s';
    } else if (b.cost >= 100) {
      btn.classList.add('ready');
      if (dc) dc.textContent = '100pt';
    } else {
      btn.classList.add('dim');
      if (dc) dc.textContent = '100pt';
    }
  }
}

function _draw() {
  const ctx = _ctx;
  if (!ctx || !_CW || !_CH) return;

  // sky
  const sk = ctx.createLinearGradient(0,0,0,_GY);
  sk.addColorStop(0,'#3a6e3a'); sk.addColorStop(1,'#8ac47a');
  ctx.fillStyle = sk; ctx.fillRect(0,0,_CW,_GY);

  // ground
  ctx.fillStyle = '#5a3a10'; ctx.fillRect(0,_GY,_CW,_CH-_GY);
  ctx.fillStyle = '#3a6a1a'; ctx.fillRect(0,_GY,_CW,10);

  // bases
  _drawBase(ctx, _EBX, '#CC2222', _bs.eBase.hp/_bs.eBase.maxHp, '☠');
  _drawBase(ctx, _ABX, '#2244CC', _bs.aBase.hp/_bs.aBase.maxHp, '🏰');

  // units
  _bs.enemies.forEach(u => _drawUnit(ctx, u, true));
  _bs.allies .forEach(u => _drawUnit(ctx, u, false));

  // particles
  _bs.parts.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.a);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}

function _drawBase(ctx, x, col, ratio, icon) {
  const bw=28, bh=64, by=_GY-bh;
  ctx.fillStyle = col+'99'; ctx.fillRect(x-bw/2, by, bw, bh);
  ctx.strokeStyle = col; ctx.lineWidth=3; ctx.strokeRect(x-bw/2,by,bw,bh);
  ctx.font=`${bw*.9}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(icon, x, by+bh/2);
  // hp bar
  const bw2=54, bh2=6, bx2=x-bw2/2, by2=by-11;
  ctx.fillStyle='#1116'; ctx.fillRect(bx2,by2,bw2,bh2);
  ctx.fillStyle=ratio>0.5?'#44DD44':ratio>0.25?'#DDDD44':'#DD4444';
  ctx.fillRect(bx2,by2,bw2*Math.max(0,ratio),bh2);
}

function _drawUnit(ctx, u, isEnemy) {
  const r=_UR, y=_GY-r;
  ctx.save();
  ctx.fillStyle = u.color;
  if (isEnemy) {
    ctx.beginPath();
    ctx.moveTo(u.x, y-r); ctx.lineTo(u.x+r, y);
    ctx.lineTo(u.x, y+r); ctx.lineTo(u.x-r, y);
    ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(u.x, y, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=1.5; ctx.stroke();
  // hp bar
  const hw=r*2, hpR=u.hp/u.maxHp;
  ctx.fillStyle='#0007'; ctx.fillRect(u.x-r, y+r+2, hw, 4);
  ctx.fillStyle=hpR>0.5?'#44DD44':'#DD4444';
  ctx.fillRect(u.x-r, y+r+2, hw*Math.max(0,hpR), 4);
  ctx.restore();
}

export function unmount() {
  if (_raf) { cancelAnimationFrame(_raf); _raf=null; }
  if (_onResize) { window.removeEventListener('resize',_onResize); _onResize=null; }
  _canvas=null; _ctx=null; _bs=null; _el=null;
}
