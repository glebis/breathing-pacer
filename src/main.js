import { start, stop, nextMode, prevMode, isRunning, setModeByName, toggleImmersive } from './core/engine.js';
import { setVolume, getVolume, toggleMute } from './audio/audio.js';
import { getPresetList, adjustPreset } from './core/timer.js';

// ---- Preset keyboard map: 1-6 to start with preset ----
const presetKeys = ['1', '2', '3', '4', '5', '6'];
const presets = getPresetList();

// ---- URL param support: ?preset=morning ----
const params = new URLSearchParams(location.search);
const autoPreset = params.get('preset');

// ---- Events ----
document.getElementById('startScreen').addEventListener('click', () => {
  start(autoPreset || null);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isRunning()) stop();
  } else if ((e.key === ' ' || e.key === 'Enter') && !isRunning()) {
    start(autoPreset || null);
  } else if (e.key === 'ArrowRight') {
    nextMode();
  } else if (e.key === 'ArrowLeft') {
    prevMode();
  } else if (e.key === '>' || (e.shiftKey && e.key === '.')) {
    toggleImmersive();
  } else if (e.key === 'm' || e.key === 'M') {
    toggleMute();
  } else if (e.key === 'ArrowUp') {
    setVolume(getVolume() + 0.1);
  } else if (e.key === 'ArrowDown') {
    setVolume(getVolume() - 0.1);
  } else if (!isRunning() && presetKeys.includes(e.key)) {
    // Number keys 1-6 start with preset
    const idx = parseInt(e.key) - 1;
    if (idx < presets.length) {
      start(presets[idx].key);
    }
  }
});

let lastTap = 0;
document.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTap < 300 && isRunning()) stop();
  lastTap = now;
});

// Show preset hints on start screen
const startScreen = document.getElementById('startScreen');
const presetHints = document.createElement('div');
presetHints.style.cssText = `
  margin-top: 1.5rem; font-size: 0.65rem; color: rgba(255, 255, 255, 0.1);
  letter-spacing: 0.1em; line-height: 1.8;
`;
presetHints.innerHTML = presets
  .map((p, i) => `<span style="color: rgba(232, 93, 4, 0.25)">${i + 1}</span> ${p.label} (${Math.floor(p.seconds / 60)}m${p.seconds % 60 ? p.seconds % 60 + 's' : ''})`)
  .join(' &nbsp;·&nbsp; ');
startScreen.appendChild(presetHints);
