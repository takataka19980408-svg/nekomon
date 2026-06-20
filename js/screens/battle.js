import { navigateTo } from '../core/router.js';
import { getState, getAttrMultiplier, monsterStatScale, applyQuestReward } from '../core/state.js';
import { MONSTER_MAP } from '../data/monsters.js';
import { QUEST_MAP } from '../data/quests.js';
import { ENEMY_MAP } from '../data/enemies.js';
import { SKILL_MAP } from '../data/skills.js';

const CANVAS_W = 800;
const CANVAS_H = 300;
const ALLY_BASE_X  = CANVAS_W - 60;
const ENEMY_BASE_X = 60;
const GROUND_Y = CANVAS_H - 60;
const COST_REGEN = 3;     // per second
const MAX_COST   = 100;
const BASE_HP    = 10000;
const MON_RADIUS = 28;

let _raf = null;
let _bs  = null;  // battle state
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
        <div class="hud-base ally">
          <span class="hud-label">味方</span>
          <div class="hud-bar-wrap"><div class="hud-bar ally-bar" id="hud-ally-hp"></div></div>
          <span class="hud-hp" id="hud-ally-hp-text"></span>
        </div>
        <div class="hud-time" id="hud-time">0s</div>
        <div class="hud-base enemy">
          <span class="hud-label">敵</span>
          <div class="hud-bar-wrap"><div class="hud-bar enemy-bar" id="hud-enemy-hp"></div></div>
          <span class="hud-hp" id="hud-enemy-hp-text"></span>
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
  _canvas.width  = CANVAS_W;
  _canvas.height = CANVAS_H;
  _ctx = _canvas.getContext('2d');

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
}

export function unmount() {
  if (_raf) cancelAnimationFrame(_raf);
  _raf = null; _bs = null; _canvas = null; _ctx = null; _el = null;
}

// ── State builder ──
function buildBattleState(quest) {
  const s = getState();
  const allyDefs = s.party.filter(p => p.type === 'monster').map(p => ({
    slot: p,
    inst: s.monsters.find(m => m.instanceId === p.instanceId),
  })).filter(x => x.inst);

  return {
    quest,
    time: 0,
    cost: MAX_COST,
    costFrac: MAX_COST,
    allyBase:  { hp: BASE_HP, maxHp: BASE_HP },
    enemyBase: { hp: quest.enemyBaseHp, maxHp: quest.enemyBaseHp },
    allies:    [],
    enemies:   [],
    spawnQueue: buildSpawnQueue(quest),
    allyDefs,
    particles: [],
    result:    null,
  };
}

function buildSpawnQueue(quest) {
  const q = [];
  quest.enemyWaves.forEach(wave => {
    for (let i = 0; i < wave.count; i++) {
      q.push({ enemyId: wave.enemyId, at: wave.spawnAt + i * wave.interval });
    }
  });
  return q.sort((a, b) => a.at - b.at);
}

// ── Tick logic ──
function tick(dt) {
  if (_bs.result) return;
  _bs.time += dt;

  // コスト回復
  _bs.costFrac = Math.min(_bs.costFrac + COST_REGEN * dt, MAX_COST);
  _bs.cost = _bs.costFrac | 0;

  // 敵スポーン
  while (_bs.spawnQueue.length && _bs.spawnQueue[0].at <= _bs.time) {
    const sq = _bs.spawnQueue.shift();
    spawnEnemy(sq.enemyId);
  }

  // 各ユニット更新
  _bs.allies.forEach(u => tickUnit(u, dt, _bs.enemies, _bs.allyBase, _bs.enemyBase, false));
  _bs.enemies.forEach(u => tickUnit(u, dt, _bs.allies, _bs.enemyBase, _bs.allyBase, true));

  // 死亡処理
  _bs.allies  = _bs.allies.filter(u => u.hp > 0);
  _bs.enemies = _bs.enemies.filter(u => u.hp > 0);

  // パーティクル更新
  _bs.particles = _bs.particles.filter(p => { p.life -= dt; return p.life > 0; });
  _bs.particles.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt; });

  // 勝敗判定
  if (_bs.enemyBase.hp <= 0) _bs.result = 'win';
  if (_bs.allyBase.hp  <= 0) _bs.result = 'lose';

  updateHUD();
}

function tickUnit(u, dt, foes, myBase, foeBase, isEnemy) {
  u.attackTimer = Math.max(0, u.attackTimer - dt);
  u.skillTimer  = Math.max(0, u.skillTimer  - dt);

  const dir = isEnemy ? -1 : 1;
  const foeBaseX = isEnemy ? ALLY_BASE_X : ENEMY_BASE_X;

  // 最寄りの敵を探す
  let target = null;
  let minDist = Infinity;
  foes.forEach(f => {
    if (f.hp <= 0) return;
    const dist = Math.abs(u.x - f.x);
    if (dist < minDist) { minDist = dist; target = f; }
  });

  const inRangeOfFoe  = target && minDist <= u.range;
  const inRangeOfBase = Math.abs(u.x - foeBaseX) <= u.range;

  if (inRangeOfFoe || inRangeOfBase) {
    // 攻撃
    if (u.attackTimer === 0) {
      const dmgTarget = inRangeOfFoe ? target : null;
      dealDamage(u, dmgTarget, foeBase, isEnemy);
      u.attackTimer = u.attackInterval;
    }
    // 必殺技チャージ
    u.skillGauge = Math.min(100, u.skillGauge + dt * (100 / u.skillChargeTime));
  } else {
    // 移動
    u.x += dir * u.moveSpeed * dt * 80;
  }
}

function dealDamage(attacker, foeUnit, foeBase, isEnemy) {
  const rawAtk = Math.max(1, attacker.attack);
  const dir = isEnemy ? -1 : 1;

  const applyTo = (target, isBase) => {
    let def = isBase ? 0 : Math.max(0, target.defense);
    let mult = isBase ? 1 : getAttrMultiplier(attacker.attribute, target.attribute);
    let dmg  = Math.max(1, Math.round((rawAtk - def * 0.3) * mult));
    target.hp = Math.max(0, target.hp - dmg);
    spawnHitParticles(attacker.x + dir * 30, GROUND_Y - MON_RADIUS, dmg, mult > 1);
  };

  if (foeUnit) applyTo(foeUnit, false);
  else applyTo(foeBase, true);
}

function spawnEnemy(enemyId) {
  const def = ENEMY_MAP[enemyId];
  if (!def) return;
  _bs.enemies.push({
    id: enemyId,
    attribute: def.attribute,
    x: ENEMY_BASE_X + 30,
    hp: def.stats.hp, maxHp: def.stats.hp,
    attack: def.stats.attack,
    defense: def.stats.defense,
    attackInterval: def.stats.attackInterval,
    moveSpeed: def.stats.moveSpeed,
    range: def.stats.range,
    attackTimer: 0,
    skillGauge: 0,
    skillChargeTime: 30,
    skillTimer: 0,
    color: def.color,
    name: def.name,
    uid: Math.random(),
  });
}

// ── Deploy (player taps) ──
export function deployMonster(slotIdx) {
  if (!_bs) return;
  const s = getState();
  const slot = s.party[slotIdx];
  if (!slot || slot.type !== 'monster') return;
  const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
  const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
  if (!def) return;

  const cost = def.stats.cost;
  if (_bs.cost < cost) return;

  const scale = monsterStatScale(inst.level);
  _bs.costFrac -= cost;
  _bs.cost = _bs.costFrac | 0;

  _bs.allies.push({
    instanceId: inst.instanceId,
    monsterId:  inst.monsterId,
    attribute:  def.attribute,
    x: ALLY_BASE_X - 30,
    hp: Math.round(def.stats.hp * scale), maxHp: Math.round(def.stats.hp * scale),
    attack:   Math.round(def.stats.attack   * scale),
    defense:  Math.round(def.stats.defense  * scale),
    attackInterval: def.stats.attackInterval,
    moveSpeed: def.stats.moveSpeed,
    range:     def.stats.range,
    attackTimer: 0,
    skillGauge: 0,
    skillChargeTime: (SKILL_MAP[def.skillId]?.chargeTime ?? 20),
    skillTimer: 0,
    color: def.color,
    name: def.name,
    uid: Math.random(),
  });

  updateDeployUI();
}

// ── Draw ──
function draw() {
  const ctx = _ctx;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  drawBackground(ctx);
  drawBases(ctx);
  _bs.enemies.forEach(u => drawUnit(ctx, u, true));
  _bs.allies.forEach(u  => drawUnit(ctx, u, false));
  _bs.particles.forEach(p => drawParticle(ctx, p));
}

function drawBackground(ctx) {
  const bg = _bs.quest.background;
  const colors = {
    forest:      ['#1a4a1a','#2d6e2d'],
    lake:        ['#0a2a4a','#1a4a7a'],
    volcano:     ['#4a1a00','#7a2d00'],
    sanctuary:   ['#4a4a1a','#7a7a1a'],
    underworld:  ['#1a001a','#2d002d'],
    dragons_nest:['#2d1a00','#4a2d00'],
  };
  const [c1, c2] = colors[bg] ?? ['#1a1a2e','#2d2d5a'];
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 地面
  ctx.fillStyle = '#00000033';
  ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
}

function drawBases(ctx) {
  // 敵拠点
  const eHpRatio = _bs.enemyBase.hp / _bs.enemyBase.maxHp;
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(ENEMY_BASE_X - 25, GROUND_Y - 70, 50, 70);
  ctx.fillStyle = `hsl(${120*eHpRatio},80%,50%)`;
  ctx.fillRect(ENEMY_BASE_X - 20, GROUND_Y - 80, 40 * eHpRatio, 8);

  // 味方拠点
  const aHpRatio = _bs.allyBase.hp / _bs.allyBase.maxHp;
  ctx.fillStyle = '#2980b9';
  ctx.fillRect(ALLY_BASE_X - 25, GROUND_Y - 70, 50, 70);
  ctx.fillStyle = `hsl(${120*aHpRatio},80%,50%)`;
  ctx.fillRect(ALLY_BASE_X - 20, GROUND_Y - 80, 40 * aHpRatio, 8);
}

function drawUnit(ctx, u, isEnemy) {
  const y = GROUND_Y - MON_RADIUS;
  const hpRatio = u.hp / u.maxHp;

  // 本体
  ctx.beginPath();
  ctx.arc(u.x, y, MON_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = u.color;
  ctx.fill();
  ctx.strokeStyle = isEnemy ? '#ff4444' : '#44ff88';
  ctx.lineWidth = 2;
  ctx.stroke();

  // HPバー
  ctx.fillStyle = '#000a';
  ctx.fillRect(u.x - MON_RADIUS, y - MON_RADIUS - 10, MON_RADIUS * 2, 6);
  ctx.fillStyle = `hsl(${120*hpRatio},80%,50%)`;
  ctx.fillRect(u.x - MON_RADIUS, y - MON_RADIUS - 10, MON_RADIUS * 2 * hpRatio, 6);

  // 展示文字 (絵文字代わり)
  ctx.font = `${MON_RADIUS}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(attrEmoji(u.attribute), u.x, y);

  // 必殺技ゲージ
  if (!isEnemy && u.skillGauge >= 100) {
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(u.x, y, MON_RADIUS + 4, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawParticle(ctx, p) {
  ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
  ctx.font = `bold ${12 + p.size}px sans-serif`;
  ctx.fillStyle = p.color;
  ctx.textAlign = 'center';
  ctx.fillText(p.text, p.x, p.y);
  ctx.globalAlpha = 1;
}

function spawnHitParticles(x, y, dmg, isEffective) {
  _bs.particles.push({
    x, y, vx: (Math.random()-0.5)*60, vy: -120 - Math.random()*60,
    life: 1.0, maxLife: 1.0,
    text: `-${dmg}`,
    color: isEffective ? '#FFD700' : '#ffffff',
    size: isEffective ? 6 : 0,
  });
}

function attrEmoji(attr) {
  return {fire:'🔥',water:'💧',grass:'🌿',light:'✨',dark:'🌙',dragon:'🐉'}[attr] ?? '⭐';
}

// ── HUD ──
function updateHUD() {
  if (!_el) return;
  const aRatio = _bs.allyBase.hp  / _bs.allyBase.maxHp;
  const eRatio = _bs.enemyBase.hp / _bs.enemyBase.maxHp;
  const aBar  = _el.querySelector('#hud-ally-hp');
  const eBar  = _el.querySelector('#hud-enemy-hp');
  const aText = _el.querySelector('#hud-ally-hp-text');
  const eText = _el.querySelector('#hud-enemy-hp-text');
  const timeEl= _el.querySelector('#hud-time');
  const costBar= _el.querySelector('#cost-bar');
  const costVal= _el.querySelector('#cost-val');
  if (aBar)  aBar.style.width  = `${aRatio*100}%`;
  if (eBar)  eBar.style.width  = `${eRatio*100}%`;
  if (aText) aText.textContent = _bs.allyBase.hp;
  if (eText) eText.textContent = _bs.enemyBase.hp;
  if (timeEl) timeEl.textContent = `${_bs.time|0}s`;
  if (costBar) costBar.style.width = `${_bs.cost}%`;
  if (costVal) costVal.textContent = _bs.cost;
}

function buildDeployUI(el) {
  const s = getState();
  const row = el.querySelector('#deploy-row');
  if (!row) return;
  row.innerHTML = s.party.map((slot, i) => {
    if (!slot.type) return `<div class="deploy-btn empty" data-slot="${i}">✕</div>`;
    if (slot.type === 'egg') {
      return `<div class="deploy-btn egg-deploy" data-slot="${i}">🥚<br><small>孵化中</small></div>`;
    }
    const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
    const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
    if (!def) return `<div class="deploy-btn empty" data-slot="${i}">✕</div>`;
    return `<div class="deploy-btn" data-slot="${i}" style="border-color:${def.color}">
      <div style="font-size:20px">${attrEmoji(def.attribute)}</div>
      <small>${def.stats.cost}コスト</small>
    </div>`;
  }).join('');

  row.querySelectorAll('.deploy-btn:not(.empty):not(.egg-deploy)').forEach(btn => {
    btn.addEventListener('click', () => deployMonster(+btn.dataset.slot));
  });
}

function updateDeployUI() {
  if (!_el) return;
  const row = _el.querySelector('#deploy-row');
  if (!row) return;
  // コスト不足のボタンの視覚的フィードバックだけ更新
  const s = getState();
  row.querySelectorAll('.deploy-btn').forEach(btn => {
    const idx = +btn.dataset.slot;
    const slot = s.party[idx];
    if (!slot || slot.type !== 'monster') return;
    const inst = s.monsters.find(m => m.instanceId === slot.instanceId);
    const def  = inst ? MONSTER_MAP[inst.monsterId] : null;
    if (!def) return;
    btn.classList.toggle('not-enough', _bs.cost < def.stats.cost);
  });
}

function showResult() {
  if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  const overlay = _el?.querySelector('#battle-overlay');
  const resultEl = _el?.querySelector('#overlay-result');
  if (!overlay || !resultEl) return;

  const isWin = _bs.result === 'win';
  resultEl.textContent = isWin ? '勝利！' : '敗北…';
  resultEl.className = `overlay-result ${isWin ? 'win' : 'lose'}`;
  overlay.classList.remove('hidden');

  _el.querySelector('#btn-result').addEventListener('click', () => {
    const quest = _bs.quest;
    const party = getState().party;
    const reward = isWin ? applyQuestReward(quest, party) : { totalExp:0, dropped:[] };
    navigateTo('result', { win: isWin, reward, questId: _questId });
  });
}
