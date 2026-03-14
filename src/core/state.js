export const state = {
  running: false,
  breathCount: 0,
  currentBeat: 0,
  beatInterval: null,
  phase: 'idle', // 'inhale' | 'exhale' | 'idle'
  phaseStart: 0,
  progress: 0,
  modeIndex: 0,
  animFrame: null,
};
