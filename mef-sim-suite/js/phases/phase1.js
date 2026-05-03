import { updatePhase } from '../state.js';
import { clamp, createParticles } from '../utils.js';

let rafId = null;
let lastCollisionRate = 0;

export function phase1Config(state) {
  const p = state.phase1;
  return {
    suiteTitle: 'MEF Simulation Suite',
    phaseTitle: 'Phase 1 · Particle Motion and Energy',
    progressText: 'Predict → Test → Observe → Revise → Print',
    prompt: 'Adjust energy and observe how particle motion and collisions change.',
    explanation: 'As energy increases, particles move faster and collide more often, showing system-level changes from microscopic motion.',
    controlsHtml: `
      <label for="energy-level">Energy Level: <span id="energy-value">${p.energyLevel}</span></label>
      <input id="energy-level" type="range" min="0" max="100" value="${p.energyLevel}" />
      <div class="row controls-live">
        <button class="primary" id="start-btn">Start</button>
        <button class="warn" id="pause-btn">Pause</button>
        <button class="stop" id="reset-btn">Reset</button>
      </div>
    `,
    statusCards: [
      { label: 'Speed', value: p.speed.toFixed(2) },
      { label: 'Collision Rate', value: p.collisionRate.toFixed(1) },
      { label: 'Energy', value: `${p.energyLevel}` }
    ]
  };
}

function energyScale(level) {
  return 0.4 + level / 35;
}

function ensureParticles(canvas, phaseState) {
  if (phaseState.particles.length) return;
  phaseState.particles = createParticles(30, canvas.width, canvas.height, energyScale(phaseState.energyLevel));
}

function tick(canvas, ctx, phaseState) {
  if (!phaseState.isRunning) return;
  const scale = energyScale(phaseState.energyLevel);
  let collisions = 0;

  ctx.fillStyle = 'rgba(7, 26, 51, 0.35)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of phaseState.particles) {
    p.x += p.vx * scale;
    p.y += p.vy * scale;
    if (p.x <= p.r || p.x >= canvas.width - p.r) { p.vx *= -1; collisions += 0.5; }
    if (p.y <= p.r || p.y >= canvas.height - p.r) { p.vy *= -1; collisions += 0.5; }
  }

  for (let i = 0; i < phaseState.particles.length; i += 1) {
    for (let j = i + 1; j < phaseState.particles.length; j += 1) {
      const a = phaseState.particles[i];
      const b = phaseState.particles[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < a.r + b.r) {
        [a.vx, b.vx] = [b.vx, a.vx];
        [a.vy, b.vy] = [b.vy, a.vy];
        collisions += 1;
      }
    }
  }

  for (const p of phaseState.particles) {
    const hue = clamp(190 + phaseState.energyLevel * 0.7, 180, 260);
    ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  lastCollisionRate = lastCollisionRate * 0.8 + collisions * 0.2;
  updatePhase('phase1', (draft) => {
    draft.speed = scale;
    draft.collisionRate = lastCollisionRate;
    draft.mef.energy = draft.energyLevel;
    draft.mef.force = clamp(lastCollisionRate * 3, 0, 100);
    draft.mef.matter = 70;
  });

  rafId = requestAnimationFrame(() => tick(canvas, ctx, phaseState));
}

export function bindPhase1(state) {
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;
  canvas.width = canvas.clientWidth;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');
  ensureParticles(canvas, state.phase1);

  if (rafId) cancelAnimationFrame(rafId);
  ctx.fillStyle = '#071a33';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const p of state.phase1.particles) {
    ctx.fillStyle = 'hsl(195, 88%, 66%)';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
  }

  document.getElementById('energy-level')?.addEventListener('input', (e) => {
    const value = Number(e.target.value);
    updatePhase('phase1', (draft) => { draft.energyLevel = value; draft.mef.energy = value; });
  });
  document.getElementById('start-btn')?.addEventListener('click', () => {
    if (state.phase1.isRunning) return;
    updatePhase('phase1', (draft) => { draft.isRunning = true; });
    tick(canvas, ctx, state.phase1);
  });
  document.getElementById('pause-btn')?.addEventListener('click', () => {
    updatePhase('phase1', (draft) => { draft.isRunning = false; });
    if (rafId) cancelAnimationFrame(rafId);
  });
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (rafId) cancelAnimationFrame(rafId);
    updatePhase('phase1', (draft) => {
      Object.assign(draft, { energyLevel: 25, isRunning: false, speed: 0, collisionRate: 0, particles: [] });
      draft.mef = { matter: 0, energy: 0, force: 0 };
    });
  });
}
