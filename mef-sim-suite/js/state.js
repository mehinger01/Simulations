const listeners = new Set();

const theme = {
  accentPrimary: '#24c9ff',
  accentSecondary: '#ffc25e',
  mutedText: '#aac0d9'
};

const basePhase = {
  hypothesisSubmitted: false,
  hypothesisText: '',
  observationsText: '',
  revisionText: '',
  mef: { matter: 0, energy: 0, force: 0 }
};

export const appState = {
  activePhase: 'phase1',
  theme,
  phase1: {
    ...basePhase,
    energyLevel: 25,
    isRunning: false,
    particles: [],
    speed: 0,
    collisionRate: 0
  },
  phase2: {
    ...basePhase,
    transferMode: 'conduction',
    energyInput: 40,
    materialType: 'metal',
    insulationLevel: 20,
    elapsedTime: 0,
    isRunning: false,
    transferRate: 0,
    systemChange: 'Stable'
  }
};

export const getState = () => appState;

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener(getState()));
}

export function updateState(updater) {
  updater(appState);
  emit();
}

export function updatePhase(phase, updater) {
  updateState((state) => {
    updater(state[phase]);
  });
}
