import { navigateTo } from '../core/router.js';
import { getState, getAttrMultiplier, monsterStatScale, applyQuestReward } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { QUEST_MAP } from '../data/quests.js';
import { ENEMY_MAP } from '../data/enemies.js';
import { SKILL_MAP } from '../data/skills.js';
import { drawMonster } from '../render/monsterSprites.js';

let CW = 800, CH = 300;
let GROUND_Y, ALLY_BASE_X, ENEMY_BASE_X, MON_RADIUS;
const COST_REGEN = 3;
const MAX_COST   = 100;
const BASE_HP    = 10000;

let _raf = null;
let _bs  = null;
let _canvas = null;
let _ctx    = null;
let _el     = null;
let _questId = null;

export function mount(el, params) {
  _el = el;
  _questId = params?.questId;
  const quest = QUEST_MAP[_questId];
  if (!quest) { navigateTo('home'); return; }

  el.innerHTML = `
    <div class="battle-wrap">
      <div class="battle-hud">
        <div class="hud-base enemy">
          <span class="hud-label">敵拠点</span>
          <div class="hud-bar-wrap"><div class="hud-bar enemy-bar" id="hud-enemy-hp"></div></div>
          <span class="hud-hp" id="hud-enemy-hp-text"></span>
        </div>
        <div class="hud-time" id="hud-time">0s</div>
        <div class="hud-base ally">
          <span class="hud-label">味方拠点</span>
          <div class="hud-bar-wrap"><div class="hud-bar ally-bar" id="hud-ally-hp"></div></div>
          <span class="hud-hp" id="hud-ally-hp-text"></span>
        </div>
      </div>
      <canvas id="battle-canvas"></canvas>
      <div class="battle-bottom">
        <div class="battle-cost">
          <span class="cost-label">コスト</span>
          <div class="cost-bar-wrap"><div class="cost-bar" id="cost-bar"></div></div>
          <span class="cost-val" id="cost-val"></span>
        </div>
        <div class="deploy-row" id="deploy-row"></div>
      </div>
    </div>
    <div class="battle-overlay hidden" id="battle-overlay">
      <div class="overlay-box">
        <div class="overlay-result" id="overlay-result"></div>
        <button class="btn btn-primary" id="btn-result">結果へ</button>
      </div>
    </div>
  `;

  _canvas = el.querySelector('#battle-canvas');
  _ctx = _canvas.getContext('2d');

  requestAnimationFrame(() => {
    initSizes();
    _bs = buildBattleState(quest);
    buildDeployUI(el);
    updateHUD();

    let last = performance.now();
    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      tick(dt);
      draw();
      if (!_bs.result) _raf = requestAnimationFrame(loop);
      else showResult();
    }
    _raf = requestAnimationFrame(loop);
  });
}

export function unmount() {
  if (_raf) cancelAnimationFrame(_raf);
  _raf = null; _bs = null; _canvas = null; _ctx = null; _el = null;
}

function initSizes() {
  const r = _canvas.getBoundingClientRect();
  CW = r.width  > 0 ? r.width  : 800;
  CH = r.height > 0 ? r.height : 260;
  _canvas.width  = CW;
  _canvas.height = CH;
  GROUND_Y     = CH - 52;
  ALLY_BASE_X  = CW - 52;
  ENEMY_BASE_X = 52;
  MON_RADIUS   = Math.max(20, Math.min(32, CH * 0.1));
}

function buildBattleState(quest) {
  return {
    quest,
    time: 0,
    cost: MAX_COST, costFrac: MAX_COST,
    allyBase:   { hp: BASE_HP, maxHp: BASE_HP },
    enemyBase:  { hp: quest.enemyBaseHp, maxHp: quest.enemyBaseHp },
    allies:     [],
    enemies:    [],
    spawnQueue: buildSpawnQueue(quest),
    particles:  [],
    result:     null,
  };
}

function buildSpawnQueue(quest) {
  const q = [];
  quest.enemyWaves.forEach(w => {
    for (let i = 0; i < w.count; i++)
      q.push({ enemyId: w.enemyId, at: w.spawnAt + i * w.interval });
  });
  return q.sort((a, b) => a.at - b.at);
}

function tick(dt) {
  if (_bs.result) return;
  _bs.time += dt;
  _bs.costFrac = Math.min(_bs.costFrac + COST_REGEN * dt, MAX_COST);
  _bs.cost = _bs.costFrac | 0;
  while (_bs.spawnQueue.length && _bs.spawnQueue[0].at <= _bs.time)
    spawnEnemy(_bs.spawnQueue.shift().enemyId);
  _bs.allies.forEach(u  => tickUnit(u, dt, _bs.enemies, _bs.enemyBase, false));
  _bs.enemies.forEach(u => tickUnit(u, dt, _bs.allies,  _bs.allyBase,  true));
  _bs.allies  = _bs.allies.filter(u => u.hp > 0);
  _bs.enemies = _bs.enemies.filter(u => u.hp > 0);
  _bs.particles = _bs.particles.filter(p => { p.life -= dt; return p.life > 0; });
  _bs.particles.forEach(p => { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 300*dt; });
  if (_bs.enemyBase.hp <= 0) _bs.result = 'win';
  if (_bs.allyBase.hp  <= 0) _bs.result = 'lose';
  updateHUD();
}

function tickUnit(u, dt, foes, foeBase, isEnemy) {
  u.attackTimer = Math.max(0, u.attackTimer - dt);
  const dir      = isEnemy ? 1 : -1;
  const foeBaseX = isEnemy ? ALLY_BASE_X : ENEMY_BASE_X;
  let target = null, minDist = Infinity;
  foes.forEach(f => {
    if (f.hp <= 0) return;
    const d = Math.abs(u.x - f.x);
    if (d < minDist) { minDist = d; target = f; }
  });
  const inRangeFoe  = target && minDist <= u.range;
  const inRangeBase = Math.abs(u.x - foeBaseX) <= u.range;
  if (inRangeFoe || inRangeBase) {
    if (u.attackTimer === 0) {
      dealDamage(u, inRangeFoe ? target : null, foeBase, isEnemy);
      u.attackTimer = u.attackInterval;
    }
    u.skillGauge = Math.min(100, u.skillGauge + dt * (100 / u.skillChargeTime));
  } else {
    u.x += dir * u.moveSpeed * dt * 80;
  }
}

function dealDamage(attacker, foeUnit, foeBase, isEnemy) {
  const dir = isEnemy ? 1 : -1;
  const hit = (target, isBase) => {
    const def  = isBase ? 0 : Math.max(0, target.defense);
    const mult = isBase ? 1 : getAttrMultiplier(attacker.attribute, target.attribute);
    const dmg  = Math.max(1, Math.round((attacker.attack - def * 0.3) * mult));
    target.hp  = Math.max(0, target.hp - dmg);
    spawnParticle(attacker.x + dir * 30, GROUND_Y - MON_RADIUS - 10, `-${dmg}`, mult > 1);
  };
  if (foeUnit) hit(foeUnit, false); else hit(foeBase, true);
}

function spawnEnemy(enemyId) {
  const def = ENEMY_MAP[enemyId];
  if (!def) return;
  _bs.enemies.push({
    attribute: def.attribute, type: def.type ?? 'attack', form: def.form ?? 1,
    x: ENEMY_BASE_X + 38,
    hp: def.stats.hp, maxHp: def.stats.hp,
    attack: def.stats.attack, defense: def.stats.defense,
    attackInterval: def.stats.attackInterval,
    moveSpeed: def.stats.moveSpeed, range: def.stats.range,
    attackTimer: 0, skillGauge: 0, skillChargeTime: 30,
    color: def.color, name: def.name,
  });
}

export function deployMonster(slotIdx) {
  if (!_bs) return false;
  const s = getState();
  const slot = s.party[slotIdx];
  if (!slot || slot.type !== 'monster') return false;
  const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
  const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
  if (!def) return false;
  if (_bs.cost < def.stats.cost) return false;
  const scale = monsterStatScale(inst.level);
  _bs.costFrac -= def.stats.cost;
  _bs.cost = _bs.costFrac | 0;
  _bs.allies.push({
    instanceId: inst.instanceId,
    attribute: def.attribute, type: def.type, form: def.form,
    x: ALLY_BASE_X - 38,
    hp: Math.round(def.stats.hp * scale), maxHp: Math.round(def.stats.hp * scale),
    attack: Math.round(def.stats.attack * scale), defense: Math.round(def.stats.defense * scale),
    attackInterval: def.stats.attackInterval,
    moveSpeed: def.stats.moveSpeed, range: def.stats.range,
    attackTimer: 0, skillGauge: 0,
    skillChargeTime: SKILL_MAP[def.skillId]?.chargeTime ?? 20,
    color: def.color, name: def.name,
  });
  updateDeployUI();
  return true;
}

function draw() {
  const ctx = _ctx;
  ctx.clearRect(0, 0, CW, CH);
  drawBackground(ctx);
  drawBases(ctx);
  _bs.enemies.forEach(u => drawUnit(ctx, u, true));
  _bs.allies.forEach(u  => drawUnit(ctx, u, false));
  _bs.particles.forEach(p => drawParticle(ctx, p));
}

const BG_COLORS = {
  forest: ['#0a2a0a','#1a4a1a'], lake: ['#060e20','#0a1a40'],
  volcano: ['#2a0800','#5a1500'], sanctuary: ['#1a1a00','#3a3a00'],
  underworld: ['#0a000a','#200020'], dragons_nest: ['#1a0800','#3a1500'],
};

function drawBackground(ctx) {
  const [c1, c2] = BG_COLORS[_bs.quest.background] ?? ['#0a0a1a','#1a1a3a'];
  const grad = ctx.createLinearGradient(0, 0, 0, CH);
  grad.addColorStop(0, c1); grad.addColorStop(1, c2);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, CW, CH);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(0, GROUND_Y, CW, CH - GROUND_Y);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CW, GROUND_Y); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < 5; i++) {
    const mx = CW * (0.1 + i * 0.2), mh = CH * (0.18 + (i%2)*0.08);
    ctx.beginPath(); ctx.moveTo(mx-mh*.8,GROUND_Y); ctx.lineTo(mx,GROUND_Y-mh); ctx.lineTo(mx+mh*.8,GROUND_Y); ctx.closePath(); ctx.fill();
  }
}

function drawBases(ctx) {
  const eR = _bs.enemyBase.hp / _bs.enemyBase.maxHp;
  const aR = _bs.allyBase.hp  / _bs.allyBase.maxHp;
  const bW = 44, bH = 68;
  ctx.fillStyle = '#7a1a1a';
  ctx.beginPath(); roundRect(ctx, ENEMY_BASE_X-bW/2, GROUND_Y-bH, bW, bH, 6); ctx.fill();
  drawHpBar(ctx, ENEMY_BASE_X-bW/2, GROUND_Y-bH-10, bW, eR, '#e74c3c');
  ctx.font = `${bW*.48}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('☠', ENEMY_BASE_X, GROUND_Y-bH*.5);
  ctx.fillStyle = '#1a3a7a';
  ctx.beginPath(); roundRect(ctx, ALLY_BASE_X-bW/2, GROUND_Y-bH, bW, bH, 6); ctx.fill();
  drawHpBar(ctx, ALLY_BASE_X-bW/2, GROUND_Y-bH-10, bW, aR, '#27ae60');
  ctx.font = `${bW*.48}px serif`;
  ctx.fillText('🏰', ALLY_BASE_X, GROUND_Y-bH*.5);
}

function drawUnit(ctx, u, isEnemy) {
  const y = GROUND_Y - MON_RADIUS;
  drawMonster(ctx, u.x, y, MON_RADIUS, u, !isEnemy);
  drawHpBar(ctx, u.x-MON_RADIUS, y-MON_RADIUS-9, MON_RADIUS*2, u.hp/u.maxHp, isEnemy ? '#e74c3c' : '#27ae60');
  if (!isEnemy && u.skillGauge >= 100) {
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(u.x, y, MON_RADIUS+6, 0, Math.PI*2); ctx.stroke();
  }
}

function drawHpBar(ctx, x, y, w, ratio, color) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x, y, w, 5);
  ctx.fillStyle = color; ctx.fillRect(x, y, w*Math.max(0,ratio), 5);
}

function drawParticle(ctx, p) {
  ctx.globalAlpha = Math.max(0, p.life/p.maxLife);
  ctx.font = `bold ${11+p.size}px sans-serif`;
  ctx.fillStyle = p.color; ctx.textAlign = 'center';
  ctx.fillText(p.text, p.x, p.y);
  ctx.globalAlpha = 1;
}

function spawnParticle(x, y, text, effective) {
  _bs.particles.push({
    x, y, vx: (Math.random()-.5)*60, vy: -100-Math.random()*60,
    life: 1.0, maxLife: 1.0,
    text, color: effective ? '#FFD700' : '#fff', size: effective ? 5 : 0,
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}

function updateHUD() {
  if (!_el || !_bs) return;
  const g = id => _el.querySelector(id);
  const setW = (el, v) => el && (el.style.width = `${v*100}%`);
  setW(g('#hud-ally-hp'),  _bs.allyBase.hp  / _bs.allyBase.maxHp);
  setW(g('#hud-enemy-hp'), _bs.enemyBase.hp / _bs.enemyBase.maxHp);
  setW(g('#cost-bar'), _bs.cost / MAX_COST);
  if (g('#hud-ally-hp-text'))  g('#hud-ally-hp-text').textContent  = _bs.allyBase.hp;
  if (g('#hud-enemy-hp-text')) g('#hud-enemy-hp-text').textContent = _bs.enemyBase.hp;
  if (g('#hud-time')) g('#hud-time').textContent = `${_bs.time|0}s`;
  if (g('#cost-val')) g('#cost-val').textContent  = _bs.cost;
  updateDeployUI();
}

function buildDeployUI(el) {
  const s = getState();
  const row = el.querySelector('#deploy-row');
  if (!row) return;
  row.innerHTML = s.party.map((slot, i) => {
    if (!slot.type) return `<div class="deploy-btn empty">＋<br><small>空き</small></div>`;
    if (slot.type === 'egg') return `<div class="deploy-btn egg-deploy">🥚<br><small>孵化用</small></div>`;
    const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
    const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
    if (!def) return `<div class="deploy-btn empty">＋<br><small>空き</small></div>`;
    return `<div class="deploy-btn not-enough" data-slot="${i}" data-cost="${def.stats.cost}">
      <canvas class="deploy-canvas" data-attr="${def.attribute}" data-type="${def.type}" data-form="${def.form}" data-color="${def.color}" width="52" height="52"></canvas>
      <span class="deploy-cost">${def.stats.cost}pt</span>
    </div>`;
  }).join('');

  row.querySelectorAll('.deploy-canvas').forEach(c => {
    const ctx2 = c.getContext('2d');
    const { attr, type, form, color } = c.dataset;
    drawMonster(ctx2, 26, 32, 20, { attribute: attr, type, form: +form, color }, true);
  });

  row.querySelectorAll('.deploy-btn[data-slot]').forEach(btn => {
    btn.addEventListener('click', () => deployMonster(+btn.dataset.slot));
  });
}

function updateDeployUI() {
  if (!_el || !_bs) return;
  const s = getState();
  _el.querySelectorAll('.deploy-btn[data-slot]').forEach(btn => {
    const slot = s.party[+btn.dataset.slot];
    if (!slot || slot.type !== 'monster') return;
    const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
    const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
    if (!def) return;
    const canAfford = _bs.cost >= def.stats.cost;
    btn.classList.toggle('ready',      canAfford);
    btn.classList.toggle('not-enough', !canAfford);
  });
}

function showResult() {
  if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  const overlay  = _el?.querySelector('#battle-overlay');
  const resultEl = _el?.querySelector('#overlay-result');
  if (!overlay || !resultEl) return;
  const isWin = _bs.result === 'win';
  resultEl.textContent = isWin ? '勝利！' : '敗北…';
  resultEl.className   = `overlay-result ${isWin ? 'win' : 'lose'}`;
  overlay.classList.remove('hidden');
  _el.querySelector('#btn-result').addEventListener('click', () => {
    const reward = isWin ? applyQuestReward(_bs.quest, getState().party) : { totalExp:0, dropped:[] };
    navigateTo('result', { win: isWin, reward, questId: _questId });
  });
}
