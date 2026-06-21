// js/render/monsterSprites.js — Canvas 2D monster sprite drawings
// 属性×タイプごとに独自デザイン。form 1/2/3 でサイズ・遠光強化。

const EYE = '#0a0a20';

export function drawMonster(ctx, mx, my, r, unit, facingLeft) {
  const f = unit.form ?? 1;
  const rs = r * (1 + (f - 1) * 0.14);
  ctx.save();
  ctx.translate(mx, my);
  if (!facingLeft) ctx.scale(-1, 1);
  const key = `${unit.attribute}_${unit.type}`;
  const fn = SPRITES[key] ?? SPRITES[unit.attribute] ?? SPRITES.default;
  fn(ctx, rs, unit.color, f);
  ctx.restore();
}

function glow(ctx, r, c) {
  const g = ctx.createRadialGradient(0, 0, r * .5, 0, 0, r * 1.8);
  g.addColorStop(0, c + '44'); g.addColorStop(1, 'transparent');
  ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill();
}
function eyeDot(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = EYE; ctx.fill();
  ctx.beginPath(); ctx.arc(x - r * .3, y - r * .3, r * .4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
}
function ol(ctx, c = 'rgba(255,255,255,.22)', lw = 1.5) {
  ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke();
}

const SPRITES = {

  // 火 攻撃 — フレイムパピー系
  fire_attack(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // tail flame
    ctx.beginPath();
    ctx.moveTo(r * .78, r * .05);
    ctx.bezierCurveTo(r * 1.35, -r * .38, r * 1.5, r * .62, r * .9, r * .5);
    ctx.strokeStyle = f >= 2 ? '#FF9500' : '#FF6B35';
    ctx.lineWidth = r * .24; ctx.lineCap = 'round'; ctx.stroke();
    // body
    ctx.beginPath(); ctx.ellipse(0, r * .05, r * .82, r * .72, 0, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // flame ears
    ctx.beginPath(); ctx.moveTo(-r*.5,-r*.35); ctx.lineTo(-r*.28,-r*1.05); ctx.lineTo(-r*.04,-r*.4); ctx.closePath();
    ctx.fillStyle = '#FF9500'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(r*.06,-r*.38); ctx.lineTo(r*.3,-r*1.02); ctx.lineTo(r*.52,-r*.4); ctx.closePath();
    ctx.fillStyle = '#FFD000'; ctx.fill();
    // snout
    ctx.beginPath(); ctx.ellipse(-r*.2, r*.15, r*.3, r*.2, -.15, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9060'; ctx.fill();
    // nose
    ctx.beginPath(); ctx.arc(-r*.35, r*.12, r*.07, 0, Math.PI * 2);
    ctx.fillStyle = '#c03020'; ctx.fill();
    eyeDot(ctx, -r * .56, -r * .12, r * .17);
  },

  // 火 防御 — タートル系
  fire_defense(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // hexagonal shell
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 - Math.PI / 6;
      i ? ctx.lineTo(Math.cos(a)*r*.88, Math.sin(a)*r*.88) : ctx.moveTo(Math.cos(a)*r*.88, Math.sin(a)*r*.88);
    }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // shell pattern
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2;
      ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a)*r*.75, Math.sin(a)*r*.75);
    }
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; ctx.stroke();
    // lava cracks (form 2+)
    if (f >= 2) {
      ctx.beginPath(); ctx.moveTo(-r*.3,-r*.3); ctx.lineTo(r*.1,-r*.5); ctx.lineTo(r*.4,-r*.1);
      ctx.strokeStyle = '#FF6B35'; ctx.lineWidth = r*.06; ctx.stroke();
    }
    // head
    ctx.beginPath(); ctx.arc(-r*.82, -r*.08, r*.33, 0, Math.PI * 2);
    ctx.fillStyle = '#B04020'; ctx.fill(); ol(ctx);
    eyeDot(ctx, -r*.96, -r*.18, r*.13);
    // feet
    for (const [x, y] of [[-r*.3, r*.78], [r*.3, r*.78]]) {
      ctx.beginPath(); ctx.ellipse(x, y, r*.2, r*.12, 0, 0, Math.PI*2);
      ctx.fillStyle = '#B04020'; ctx.fill();
    }
  },

  // 水 攻撃 — 蛇系
  water_attack(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // body S-curve
    ctx.beginPath();
    ctx.moveTo(-r*.6, r*.4);
    ctx.bezierCurveTo(-r*.9, 0, -r*.4, -r*.7, r*.1, -r*.5);
    ctx.bezierCurveTo(r*.6, -r*.3, r*.9, r*.2, r*.7, r*.5);
    ctx.bezierCurveTo(r*.3, r*.9, -r*.2, r*.9, -r*.6, r*.4);
    ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // scales
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.arc(-r*.2 + i*r*.3, -r*.1, r*.2, 0, Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // fin
    ctx.beginPath(); ctx.moveTo(r*.5,-r*.3); ctx.lineTo(r*.82,-r*.84); ctx.lineTo(r*.66,-r*.08); ctx.closePath();
    ctx.fillStyle = '#2980B9'; ctx.fill();
    // head
    ctx.beginPath(); ctx.ellipse(-r*.62, r*.15, r*.28, r*.2, .3, 0, Math.PI*2);
    ctx.fillStyle = '#5DADE2'; ctx.fill();
    eyeDot(ctx, -r*.78, r*.05, r*.12);
  },

  // 水 防御 — カニ系
  water_defense(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // crab body
    ctx.beginPath(); ctx.ellipse(0, r*.1, r*.82, r*.58, 0, 0, Math.PI*2);
    ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // big left claw
    ctx.beginPath(); ctx.moveTo(-r*.78,-r*.08);
    ctx.bezierCurveTo(-r*1.5,-r*.6,-r*1.55,r*.45,-r*.88,r*.38); ctx.closePath();
    ctx.fillStyle = '#4A90D9'; ctx.fill(); ol(ctx);
    // small right claw
    ctx.beginPath(); ctx.moveTo(r*.7,-r*.05);
    ctx.bezierCurveTo(r*1.1,-r*.38,r*1.18,r*.28,r*.82,r*.28); ctx.closePath();
    ctx.fillStyle = '#4A90D9'; ctx.fill(); ol(ctx);
    // eye stalks
    for (const [ex, ey] of [[-r*.3,-r*.62],[r*.1,-r*.65]]) {
      ctx.beginPath(); ctx.moveTo(ex,-r*.08); ctx.lineTo(ex,ey);
      ctx.strokeStyle='#2471A3'; ctx.lineWidth=r*.12; ctx.stroke();
      eyeDot(ctx, ex, ey, r*.14);
    }
    // legs
    for (const [lx, ly] of [[-r*.5,r*.62],[0,r*.72],[r*.5,r*.62]]) {
      ctx.beginPath(); ctx.moveTo(lx,r*.32); ctx.lineTo(lx*1.3,ly);
      ctx.strokeStyle='#4A90D9'; ctx.lineWidth=r*.12; ctx.stroke();
    }
  },

  // 草 攻撃 — カマキリ系
  grass_attack(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // left blade arm
    ctx.beginPath(); ctx.moveTo(-r*.38,-r*.2); ctx.lineTo(-r*1.08,-r*.82); ctx.lineTo(-r*.78,-r*.06); ctx.closePath();
    ctx.fillStyle = '#1E8449'; ctx.fill(); ol(ctx);
    // right arm
    ctx.beginPath(); ctx.moveTo(r*.3,0); ctx.lineTo(r*.82,-r*.38); ctx.lineTo(r*.65,r*.1); ctx.closePath();
    ctx.fillStyle = '#1E8449'; ctx.fill();
    // body
    ctx.beginPath(); ctx.ellipse(0, r*.1, r*.42, r*.8, 0, 0, Math.PI*2);
    ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // head
    ctx.beginPath(); ctx.ellipse(-r*.08,-r*.7,r*.28,r*.2,.3,0,Math.PI*2);
    ctx.fillStyle = '#2ECC71'; ctx.fill();
    eyeDot(ctx, -r*.28, -r*.72, r*.14);
    eyeDot(ctx, r*.1, -r*.68, r*.11);
    // antennae
    ctx.beginPath();
    ctx.moveTo(-r*.08,-r*.88); ctx.lineTo(-r*.38,-r*1.3);
    ctx.moveTo(r*.06,-r*.86); ctx.lineTo(r*.28,-r*1.25);
    ctx.strokeStyle='#1E8449'; ctx.lineWidth=r*.1; ctx.lineCap='round'; ctx.stroke();
  },

  // 草 防御 — ドームドリ系
  grass_defense(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // dome shell
    ctx.beginPath();
    ctx.arc(0, 0, r*.88, Math.PI, 0);
    ctx.lineTo(r*.88, r*.4); ctx.arc(0, r*.4, r*.88, 0, Math.PI); ctx.closePath();
    ctx.fillStyle = c; ctx.fill(); ol(ctx);
    // moss bumps
    for (const [bx,by] of [[0,-r*.6],[-r*.45,-r*.32],[r*.45,-r*.32]]) {
      ctx.beginPath(); ctx.arc(bx,by,r*.18,0,Math.PI*2); ctx.fillStyle='#0E6B33'; ctx.fill();
    }
    // vine wrap (form 2+)
    if (f >= 2) {
      ctx.beginPath();
      ctx.moveTo(-r*.8, r*.2); ctx.bezierCurveTo(-r*.5,-r*.7,r*.7,-r*.7,r*.8,r*.2);
      ctx.strokeStyle='#145A32'; ctx.lineWidth=r*.08; ctx.stroke();
    }
    // head
    ctx.beginPath(); ctx.ellipse(-r*.85,r*.1,r*.28,r*.2,.1,0,Math.PI*2);
    ctx.fillStyle='#1E8449'; ctx.fill();
    eyeDot(ctx, -r*.98, r*.02, r*.11);
    // feet
    for (const [fx,fy] of [[-r*.4,r*.7],[r*.4,r*.7]]) {
      ctx.beginPath(); ctx.ellipse(fx,fy,r*.22,r*.13,0,0,Math.PI*2);
      ctx.fillStyle='#1E8449'; ctx.fill();
    }
  },

  // 光 攻撃 — ヒヨコ系
  light_attack(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, '#FFD700');
    // halo
    ctx.beginPath(); ctx.arc(-r*.18,-r*.82,r*.4,0,Math.PI*2);
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=r*.14; ctx.stroke();
    // wing
    ctx.beginPath();
    ctx.moveTo(-r*.68,r*.1); ctx.bezierCurveTo(-r*1.28,-r*.28,-r*1.18,r*.68,-r*.68,r*.5); ctx.closePath();
    ctx.fillStyle='#F9E79F'; ctx.fill(); ol(ctx);
    // body
    ctx.beginPath(); ctx.arc(0,r*.08,r*.76,0,Math.PI*2);
    ctx.fillStyle=c; ctx.fill(); ol(ctx);
    // beak
    ctx.beginPath(); ctx.moveTo(-r*.18,r*.2); ctx.lineTo(-r*.48,r*.28); ctx.lineTo(-r*.18,r*.4); ctx.closePath();
    ctx.fillStyle='#E67E22'; ctx.fill();
    eyeDot(ctx, -r*.32, -r*.1, r*.18);
    // tail feathers
    if (f >= 2) {
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.moveTo(r*.65,0); ctx.lineTo(r*(1.08+i*.08),r*(.28+i*.22));
        ctx.strokeStyle='#D4AC0D'; ctx.lineWidth=r*.13; ctx.lineCap='round'; ctx.stroke();
      }
    }
  },

  // 光 防御 — 天使系
  light_defense(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, '#F9E79F');
    // big wing
    ctx.beginPath();
    ctx.moveTo(-r*.58,-r*.08); ctx.bezierCurveTo(-r*1.45,-r*.78,-r*1.38,r*.75,-r*.58,r*.48); ctx.closePath();
    ctx.fillStyle='#F0F0FF'; ctx.fill(); ol(ctx);
    // body
    ctx.beginPath(); ctx.arc(0,r*.05,r*.72,0,Math.PI*2);
    ctx.fillStyle=c; ctx.fill(); ol(ctx);
    // shield
    ctx.beginPath();
    ctx.moveTo(-r*.28,-r*.18); ctx.lineTo(r*.48,-r*.18); ctx.lineTo(r*.48,r*.38);
    ctx.lineTo(r*.1,r*.68); ctx.lineTo(-r*.28,r*.38); ctx.closePath();
    ctx.fillStyle='#D5D8DC'; ctx.fill(); ol(ctx,'#fff',1.5);
    // cross
    ctx.beginPath(); ctx.moveTo(r*.1,-r*.08); ctx.lineTo(r*.1,r*.48);
    ctx.moveTo(-r*.12,r*.2); ctx.lineTo(r*.32,r*.2);
    ctx.strokeStyle='#fff'; ctx.lineWidth=r*.1; ctx.stroke();
    // halo
    ctx.beginPath(); ctx.arc(-r*.08,-r*.72,r*.33,0,Math.PI*2);
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=r*.12; ctx.stroke();
    eyeDot(ctx, -r*.52, r*.02, r*.14);
  },

  // 鞄 攻撃 — 猫系
  dark_attack(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // tail
    ctx.beginPath(); ctx.moveTo(r*.78,r*.12);
    ctx.bezierCurveTo(r*1.38,-r*.48,r*1.58,r*.68,r*1.02,r*.68);
    ctx.strokeStyle='#6C3483'; ctx.lineWidth=r*.22; ctx.lineCap='round'; ctx.stroke();
    // angular body
    ctx.beginPath();
    ctx.moveTo(-r*.88,r*.28); ctx.lineTo(-r*.68,-r*.28); ctx.lineTo(-r*.28,-r*.78);
    ctx.lineTo(r*.48,-r*.48); ctx.lineTo(r*.88,r*.08); ctx.lineTo(r*.68,r*.58);
    ctx.lineTo(-r*.48,r*.68); ctx.closePath();
    ctx.fillStyle=c; ctx.fill(); ol(ctx);
    // sharp ears
    ctx.beginPath(); ctx.moveTo(-r*.42,-r*.62); ctx.lineTo(-r*.58,-r*1.18); ctx.lineTo(-r*.12,-r*.72); ctx.closePath();
    ctx.fillStyle='#6C3483'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(r*.18,-r*.52); ctx.lineTo(r*.32,-r*1.08); ctx.lineTo(r*.55,-r*.48); ctx.closePath();
    ctx.fillStyle='#6C3483'; ctx.fill();
    // glowing eye
    ctx.beginPath(); ctx.arc(-r*.52,-r*.12,r*.18,0,Math.PI*2); ctx.fillStyle='#CC00FF'; ctx.fill();
    ctx.beginPath(); ctx.arc(-r*.52,-r*.12,r*.09,0,Math.PI*2); ctx.fillStyle='#FFD0FF'; ctx.fill();
    // shadow slash (form 2+)
    if (f >= 2) {
      ctx.beginPath(); ctx.moveTo(-r*.6,r*.5); ctx.lineTo(r*.4,-r*.4);
      ctx.strokeStyle='rgba(200,0,255,.4)'; ctx.lineWidth=r*.1; ctx.stroke();
    }
  },

  // 鞄 防御 — スパイクシェル系
  dark_defense(ctx, r, c, f) {
    if (f >= 3) glow(ctx, r, c);
    // spiked body
    ctx.beginPath(); ctx.arc(0,r*.05,r*.8,0,Math.PI*2);
    ctx.fillStyle=c; ctx.fill(); ol(ctx);
    // spikes
    for (const [x1,y1,x2,y2] of [
      [-r*.58,-r*.58,-r*.3,-r*1.18],
      [0,-r*.8,0,-r*1.32],
      [r*.58,-r*.58,r*.82,-r*1.08]
    ]) {
      ctx.beginPath();
      ctx.moveTo(x1-r*.12,y1); ctx.lineTo(x2,y2); ctx.lineTo(x1+r*.12,y1); ctx.closePath();
      ctx.fillStyle='#512E5F'; ctx.fill();
    }
    // dark core
    if (f >= 2) {
      ctx.beginPath(); ctx.arc(0,0,r*.48,0,Math.PI*2);
      ctx.fillStyle='rgba(80,0,80,.55)'; ctx.fill();
    }
    // eye
    ctx.beginPath(); ctx.arc(-r*.42,-r*.05,r*.18,0,Math.PI*2); ctx.fillStyle='#CC00FF'; ctx.fill();
    ctx.beginPath(); ctx.arc(-r*.42,-r*.05,r*.09,0,Math.PI*2); ctx.fillStyle='#FFD0FF'; ctx.fill();
    // chains (form 3)
    if (f >= 3) {
      for (const [a] of [[-.5],[.8],[1.8]]) {
        ctx.beginPath();
        ctx.arc(Math.cos(a)*r*.9, Math.sin(a)*r*.9, r*.12, 0, Math.PI*2);
        ctx.strokeStyle='#7D3C98'; ctx.lineWidth=r*.08; ctx.stroke();
      }
    }
  },

  // 站 — ネコドラゴン
  dragon(ctx, r, c, f) {
    glow(ctx, r, c);
    // wing
    ctx.beginPath();
    ctx.moveTo(r*.22,-r*.38); ctx.bezierCurveTo(r*1.0,-r*1.38,r*1.48,-r*.58,r*.98,r*.08);
    ctx.bezierCurveTo(r*.68,r*.3,r*.5,0,r*.22,-r*.08); ctx.closePath();
    ctx.fillStyle='#C0392B'; ctx.fill(); ol(ctx);
    // body
    ctx.beginPath(); ctx.arc(0,0,r*.78,0,Math.PI*2); ctx.fillStyle=c; ctx.fill(); ol(ctx);
    // cat ears
    ctx.beginPath(); ctx.moveTo(-r*.38,-r*.62); ctx.lineTo(-r*.58,-r*1.08); ctx.lineTo(-r*.1,-r*.68); ctx.closePath();
    ctx.fillStyle='#C0392B'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(r*.12,-r*.58); ctx.lineTo(r*.3,-r*.98); ctx.lineTo(r*.52,-r*.52); ctx.closePath();
    ctx.fillStyle='#C0392B'; ctx.fill();
    // fire breath
    ctx.beginPath(); ctx.moveTo(-r*.72,r*.05);
    ctx.bezierCurveTo(-r*1.28,-r*.18,-r*1.58,r*.38,-r*1.88,r*.18);
    ctx.strokeStyle='#FF6500'; ctx.lineWidth=r*.22; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r*.72,r*.15);
    ctx.bezierCurveTo(-r*1.18,r*.38,-r*1.45,r*.68,-r*1.68,r*.48);
    ctx.strokeStyle='#FFD000'; ctx.lineWidth=r*.12; ctx.stroke();
    // golden eye
    ctx.beginPath(); ctx.arc(-r*.48,-r*.08,r*.2,0,Math.PI*2); ctx.fillStyle='#FFD700'; ctx.fill();
    ctx.beginPath(); ctx.arc(-r*.48,-r*.08,r*.1,0,Math.PI*2); ctx.fillStyle='#0a0a0a'; ctx.fill();
    // tail
    ctx.beginPath(); ctx.moveTo(r*.68,r*.28);
    ctx.bezierCurveTo(r*1.18,r*.58,r*1.38,r*.98,r*.88,r*1.08);
    ctx.strokeStyle='#C0392B'; ctx.lineWidth=r*.22; ctx.lineCap='round'; ctx.stroke();
  },

  default(ctx, r, c) {
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fillStyle=c; ctx.fill(); ol(ctx);
    eyeDot(ctx, -r*.3, -r*.1, r*.18);
  },
};