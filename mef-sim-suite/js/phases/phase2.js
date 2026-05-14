import { clamp } from '../utils.js';
import { updatePhase } from '../state.js';

let intervalId = null;

const materialFactor = { metal: 1, glass: 0.7, air: 0.45, water: 0.8, vacuum: 0.05 };
const modeFactor = { conduction: 1, convection: 0.85, radiation: 0.65 };

export function phase2Config(state) {
  const p = state.phase2;
  return {
    suiteTitle: 'MEF Simulation Suite',
    phaseTitle: 'Phase 2 · Energy Transfer',
    progressText: 'Predict → Test → Observe → Revise → Print',
    prompt: 'Compare conduction, convection, and radiation to explain how energy transfer depends on system conditions.',
    explanation: 'Different transfer modes move energy differently across matter and space, depending on medium and resistance.',
    controlsHtml: `
      <label for="transfer-mode">Transfer Mode</label>
      <select id="transfer-mode">
        <option value="conduction" ${p.transferMode === 'conduction' ? 'selected' : ''}>Conduction</option>
        <option value="convection" ${p.transferMode === 'convection' ? 'selected' : ''}>Convection</option>
        <option value="radiation" ${p.transferMode === 'radiation' ? 'selected' : ''}>Radiation</option>
      </select>
      <label for="energy-input">Energy Input: <span id="energy-input-value">${p.energyInput}</span></label>
      <input id="energy-input" type="range" min="0" max="100" value="${p.energyInput}" />
      <label for="material-type">Material / Medium</label>
      <select id="material-type">
        ${['metal', 'glass', 'air', 'water', 'vacuum'].map((m) => `<option value="${m}" ${p.materialType === m ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
      <label for="insulation-level">Insulation / Resistance: <span id="insulation-value">${p.insulationLevel}</span></label>
      <input id="insulation-level" type="range" min="0" max="100" value="${p.insulationLevel}" />
      <div class="row controls-live">
        <button class="primary" id="start-btn">Start</button>
        <button class="warn" id="pause-btn">Pause</button>
        <button class="stop" id="reset-btn">Reset</button>
      </div>
    `,
    statusCards: [
      { label: 'Mode', value: p.transferMode },
      { label: 'Rate', value: p.transferRate.toFixed(2) },
      { label: 'System', value: p.systemChange }
    ]
  };
}

function drawMode(ctx, canvas, state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#071a33';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { transferMode, transferRate, elapsedTime } = state;
  if (transferMode === 'conduction') {
    for (let i = 0; i < 14; i += 1) {
      for (let j = 0; j < 5; j += 1) {
        const x = 35 + i * 28;
        const y = 50 + j * 52 + Math.sin((elapsedTime + i + j) / 5) * (transferRate / 8);
        const heat = clamp((1 - i / 13) * 80 + transferRate, 20, 95);
        ctx.fillStyle = `hsl(25, 95%, ${heat / 1.5}%)`;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (transferMode === 'convection') {
    ctx.strokeStyle = 'rgba(36,201,255,0.85)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      const offset = i * 60;
      ctx.moveTo(80 + offset, 280);
      ctx.bezierCurveTo(30 + offset, 220, 150 + offset, 140, 90 + offset, 60);
      ctx.bezierCurveTo(70 + offset, 90, 25 + offset, 180, 80 + offset, 280);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = '#ffcf5d';
    ctx.beginPath(); ctx.arc(70, 170, 26, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 5; i += 1) {
      const y = 70 + i * 50;
      const wave = Math.sin((elapsedTime + i * 10) / 7) * 8;
      ctx.strokeStyle = `rgba(255, 194, 94, ${0.45 + transferRate / 180})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(105, y);
      ctx.quadraticCurveTo(210, y + wave, 320, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#5ec7ff';
    ctx.fillRect(350, 120, 100, 100);
  }
}

function updateMetrics(phase) {
  const base = modeFactor[phase.transferMode] * materialFactor[phase.materialType];
  const resistance = 1 - phase.insulationLevel / 120;
  const rate = clamp((phase.energyInput / 100) * base * resistance * 100, 0, 100);
  phase.transferRate = rate;
  phase.systemChange = rate > 66 ? 'Rapid change' : rate > 33 ? 'Moderate change' : 'Slow change';
  phase.mef.energy = rate;
  phase.mef.matter = clamp(materialFactor[phase.materialType] * 100, 0, 100);
  phase.mef.force = clamp(modeFactor[phase.transferMode] * 100 - phase.insulationLevel / 2, 0, 100);
}

export function bindPhase2(state) {
  const phase = state.phase2;
  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;
  canvas.width = canvas.clientWidth;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');

  const sync = () => {
    updatePhase('phase2', (draft) => updateMetrics(draft));
    drawMode(ctx, canvas, state.phase2);
  };

  document.getElementById('transfer-mode')?.addEventListener('change', (e) => {
    updatePhase('phase2', (d) => { d.transferMode = e.target.value; });
    sync();
  });
  document.getElementById('energy-input')?.addEventListener('input', (e) => {
    updatePhase('phase2', (d) => { d.energyInput = Number(e.target.value); });
    sync();
  });
  document.getElementById('material-type')?.addEventListener('change', (e) => {
    updatePhase('phase2', (d) => { d.materialType = e.target.value; });
    sync();
  });
  document.getElementById('insulation-level')?.addEventListener('input', (e) => {
    updatePhase('phase2', (d) => { d.insulationLevel = Number(e.target.value); });
    sync();
  });

  document.getElementById('start-btn')?.addEventListener('click', () => {
    updatePhase('phase2', (d) => { d.isRunning = true; });
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      updatePhase('phase2', (d) => { d.elapsedTime += 1; updateMetrics(d); });
      drawMode(ctx, canvas, state.phase2);
    }, 120);
  });

  document.getElementById('pause-btn')?.addEventListener('click', () => {
    updatePhase('phase2', (d) => { d.isRunning = false; });
    clearInterval(intervalId);
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    clearInterval(intervalId);
    updatePhase('phase2', (d) => {
      Object.assign(d, {
        transferMode: 'conduction', energyInput: 40, materialType: 'metal', insulationLevel: 20,
        elapsedTime: 0, isRunning: false, transferRate: 0, systemChange: 'Stable',
        mef: { matter: 0, energy: 0, force: 0 }
      });
    });
  });

  updateMetrics(phase);
  drawMode(ctx, canvas, phase);
}
