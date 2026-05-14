import { updateState } from './state.js';

export function initRouter() {
  const setFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'phase1' || hash === 'phase2') {
      updateState((state) => { state.activePhase = hash; });
    }
  };
  window.addEventListener('hashchange', setFromHash);
  setFromHash();
}
