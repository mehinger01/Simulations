import { getState, subscribe, updatePhase, updateState } from './state.js';
import { initRouter } from './router.js';
import { TopBar } from './components/topbar.js';
import { HypothesisBox } from './components/hypothesisBox.js';
import { ControlsPanel } from './components/controlsPanel.js';
import { ObservationBox } from './components/observationBox.js';
import { RevisionBox } from './components/revisionBox.js';
import { MEFTracker } from './components/mefTracker.js';
import { SummaryPreview } from './components/summaryPreview.js';
import { sectionCard } from './components/sidebar.js';
import { printSummary } from './print.js';
import { phase1Config, bindPhase1 } from './phases/phase1.js';
import { phase2Config, bindPhase2 } from './phases/phase2.js';

const app = document.getElementById('app');

const phaseMeta = {
  phase1: {
    hypothesisPrompt: 'What do you think will happen to particle motion when energy increases?',
    observationPrompt: 'What did you observe?',
    revisionPrompt: 'Based on what you observed, revise your explanation of how energy affects particle motion.'
  },
  phase2: {
    hypothesisPrompt: 'How does energy move through different materials or systems?',
    observationPrompt: 'What differences did you observe between transfer types?',
    revisionPrompt: 'How does energy transfer differently depending on the system?'
  }
};

function render() {
  const state = getState();
  const active = state.activePhase;
  const phaseState = state[active];
  const config = active === 'phase1' ? phase1Config(state) : phase2Config(state);

  app.innerHTML = `
    <main class="suite">
      ${TopBar({ ...config, activePhase: active })}
      <section class="main-grid">
        <aside class="panel left-panel">
          ${HypothesisBox({ promptText: phaseMeta[active].hypothesisPrompt, placeholderText: 'Enter your prediction...', submitLabel: 'Submit Hypothesis', value: phaseState.hypothesisText })}
          ${ControlsPanel({ disabled: !phaseState.hypothesisSubmitted, bodyHtml: config.controlsHtml })}
          ${ObservationBox({ promptText: phaseMeta[active].observationPrompt, placeholderText: 'Record your observations...', value: phaseState.observationsText })}
          ${RevisionBox({ promptText: phaseMeta[active].revisionPrompt, placeholderText: 'Revise your explanation...', value: phaseState.revisionText })}
          <button class="primary print-btn" id="print-summary-btn">Generate Summary</button>
        </aside>
        <section class="panel center-panel">
          <header>
            <h2 class="title">${config.phaseTitle}</h2>
            <p class="subtitle">${config.prompt}</p>
          </header>
          <div class="canvas-wrap"><canvas id="sim-canvas" aria-label="Simulation visualization"></canvas></div>
          <div class="status-grid">
            ${config.statusCards.map((c) => `<article class="card"><p class="subtitle">${c.label}</p><strong>${c.value}</strong></article>`).join('')}
          </div>
        </section>
        <aside class="panel right-panel">
          ${MEFTracker({ matterValue: phaseState.mef.matter, energyValue: phaseState.mef.energy, forceValue: phaseState.mef.force })}
          ${sectionCard('Phase Explanation', config.explanation)}
          ${SummaryPreview({ hypothesis: phaseState.hypothesisText, observations: phaseState.observationsText, revision: phaseState.revisionText, phaseMeta: config.phaseTitle })}
        </aside>
      </section>
    </main>
  `;

  bindCommonHandlers(active);
  if (active === 'phase1') bindPhase1(state);
  if (active === 'phase2') bindPhase2(state);
}

function bindCommonHandlers(activePhase) {
  const phaseState = getState()[activePhase];
  document.querySelectorAll('[data-phase-nav]').forEach((btn) => {
    btn.addEventListener('click', () => { window.location.hash = btn.dataset.phaseNav; });
  });

  document.getElementById('hypothesis-submit')?.addEventListener('click', () => {
    const text = document.getElementById('hypothesis-input').value.trim();
    updatePhase(activePhase, (draft) => {
      draft.hypothesisText = text;
      draft.hypothesisSubmitted = text.length > 0;
    });
  });

  document.getElementById('observation-input')?.addEventListener('input', (e) => {
    updatePhase(activePhase, (draft) => { draft.observationsText = e.target.value; });
  });

  document.getElementById('revision-input')?.addEventListener('input', (e) => {
    updatePhase(activePhase, (draft) => { draft.revisionText = e.target.value; });
  });

  document.getElementById('print-summary-btn')?.addEventListener('click', () => {
    printSummary({
      suiteTitle: 'MEF Simulation Suite',
      phaseTitle: activePhase === 'phase1' ? 'Phase 1: Particle Motion and Energy' : 'Phase 2: Energy Transfer',
      mode: activePhase === 'phase2' ? phaseState.transferMode : '',
      hypothesis: phaseState.hypothesisText,
      observations: phaseState.observationsText,
      revision: phaseState.revisionText
    });
  });
}

subscribe(render);
initRouter();
updateState(() => {});
