import { INHALE_MS, EXHALE_MS } from './config.js';

const BREATH_MS = INHALE_MS + EXHALE_MS; // 11s per breath

// Presets: name, duration in seconds, description
export const PRESETS = {
  morning:      { label: 'morning',       seconds: 180, description: 'counter cortisol awakening response' },
  'pre-work':   { label: 'pre-work',      seconds: 300, description: 'combat initiation paralysis' },
  'content-urge': { label: 'content urge', seconds: 60,  description: 'instead of phone/YouTube' },
  evening:      { label: 'evening',        seconds: 300, description: 'wind down before sleep' },
  minimum:      { label: 'minimum dose',   seconds: 33,  description: '3 breaths' },
  custom:       { label: 'custom',         seconds: 120, description: 'your duration' },
};

// Load saved custom durations from localStorage
function loadSaved() {
  try {
    const saved = localStorage.getItem('breathing-pacer-presets');
    if (saved) {
      const parsed = JSON.parse(saved);
      for (const [key, sec] of Object.entries(parsed)) {
        if (PRESETS[key]) PRESETS[key].seconds = sec;
      }
    }
  } catch (e) { /* ignore */ }
}

function saveDurations() {
  const data = {};
  for (const [key, preset] of Object.entries(PRESETS)) {
    data[key] = preset.seconds;
  }
  localStorage.setItem('breathing-pacer-presets', JSON.stringify(data));
}

loadSaved();

// Timer state
let active = false;
let presetKey = null;
let targetSeconds = 0;
let startTime = 0;
let onComplete = null;

// DOM elements (created lazily)
let progressBar = null;
let timerText = null;

function ensureDOM() {
  if (progressBar) return;

  progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; bottom: 0; left: 0; height: 2px; width: 0%;
    background: rgba(255, 214, 10, 0.3); z-index: 20;
    transition: width 1s linear; pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  timerText = document.createElement('div');
  timerText.style.cssText = `
    position: fixed; bottom: 0.8rem; left: 50%; transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.1); font-family: 'Geist Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.15em; z-index: 20;
    pointer-events: none;
  `;
  document.body.appendChild(timerText);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}

export function startTimer(key, completeFn) {
  ensureDOM();
  presetKey = key;
  const preset = PRESETS[key] || PRESETS.custom;
  targetSeconds = preset.seconds;
  startTime = Date.now();
  active = true;
  onComplete = completeFn || null;

  progressBar.style.display = '';
  timerText.style.display = '';
  timerText.textContent = `${preset.label} · ${formatTime(targetSeconds)}`;

  updateTimer();
}

export function stopTimer() {
  active = false;
  if (progressBar) {
    progressBar.style.width = '0%';
    progressBar.style.display = 'none';
  }
  if (timerText) timerText.style.display = 'none';
}

function updateTimer() {
  if (!active) return;

  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = Math.max(0, targetSeconds - elapsed);
  const progress = Math.min(elapsed / targetSeconds, 1);

  progressBar.style.width = (progress * 100) + '%';
  timerText.textContent = formatTime(remaining);

  if (remaining <= 0) {
    active = false;
    timerText.textContent = 'done';
    setTimeout(() => {
      timerText.style.opacity = '0';
      setTimeout(() => { timerText.style.display = 'none'; timerText.style.opacity = ''; }, 800);
    }, 2000);
    if (onComplete) onComplete();
    return;
  }

  requestAnimationFrame(updateTimer);
}

export function adjustPreset(key, deltaSeconds) {
  if (PRESETS[key]) {
    PRESETS[key].seconds = Math.max(11, PRESETS[key].seconds + deltaSeconds);
    saveDurations();
    // If this preset is currently active, update the target
    if (active && presetKey === key) {
      targetSeconds = PRESETS[key].seconds;
    }
  }
}

export function isTimerActive() {
  return active;
}

export function getPresetList() {
  return Object.entries(PRESETS).map(([key, p]) => ({
    key,
    label: p.label,
    seconds: p.seconds,
    description: p.description,
  }));
}

export function setImmersiveColors(cool) {
  if (progressBar) {
    progressBar.style.background = cool
      ? 'rgba(100, 180, 240, 0.2)'
      : 'rgba(255, 214, 10, 0.3)';
  }
}
