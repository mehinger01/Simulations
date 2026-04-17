export function TopBar({ suiteTitle, phaseTitle, progressText, activePhase }) {
  return `
    <div class="topbar row" role="banner">
      <div>
        <h1 class="title">${suiteTitle}</h1>
        <p class="subtitle">${phaseTitle}</p>
      </div>
      <nav class="phase-nav" aria-label="Phase navigation">
        <button data-phase-nav="phase1" aria-current="${activePhase === 'phase1'}">Phase 1</button>
        <button data-phase-nav="phase2" aria-current="${activePhase === 'phase2'}">Phase 2</button>
      </nav>
      <span class="pill">${progressText}</span>
    </div>
  `;
}
