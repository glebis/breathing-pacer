import { INHALE_BEATS, EXHALE_BEATS, BEAT_MS, INHALE_MS, EXHALE_MS } from './config.js';
import { MODES } from '../modes/index.js';
import { ensureAudio, playInhaleBeat, playExhaleBeat, playTransition } from '../audio/audio.js';

// ---- DOM ----
const fill = document.getElementById('fill');
const fillLine = document.getElementById('fillLine');
const label = document.getElementById('label');
const counter = document.getElementById('counter');
const beatNum = document.getElementById('beatNum');
const pulseDot = document.getElementById('pulseDot');
const modeIndicator = document.getElementById('modeIndicator');
const startScreen = document.getElementById('startScreen');
const canvas = document.getElementById('vizCanvas');
const ctx = canvas.getContext('2d');

// ---- State ----
let running = false;
let breathCount = 0;
let currentBeat = 0;
let beatInterval = null;
let phase = 'idle';
let phaseStart = 0;
let modeIndex = 0;
let animFrame = null;

// ---- Canvas ----
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

// ---- Mode Management ----
function isCoolMode() {
  return MODES[modeIndex].cool;
}

function setMode(i) {
  modeIndex = ((i % MODES.length) + MODES.length) % MODES.length;
  const mode = MODES[modeIndex];
  modeIndicator.textContent = mode.name;

  const cool = isCoolMode();
  document.body.style.background = cool ? '#050a1a' : '#1a0a00';
  label.style.color = cool ? 'rgba(120, 200, 255, 0.5)' : 'rgba(255, 214, 10, 0.5)';
  beatNum.style.color = cool ? 'rgba(100, 180, 240, 0.25)' : 'rgba(255, 214, 10, 0.25)';

  if (mode.type === 'fill') {
    fill.style.display = 'block';
    canvas.style.display = 'none';
    if (mode.applyStyle) mode.applyStyle(fill, fillLine);
  } else {
    fill.style.display = 'none';
    canvas.style.display = 'block';
  }
}

// ---- Animation Loop ----
function animate() {
  if (!running) return;

  const mode = MODES[modeIndex];
  if (mode.type === 'canvas') {
    const now = Date.now();
    const elapsed = now - phaseStart;
    const dur = phase === 'inhale' ? INHALE_MS : EXHALE_MS;
    const progress = Math.min(elapsed / dur, 1);

    const eased = phase === 'inhale'
      ? 1 - Math.pow(1 - progress, 3)
      : Math.pow(progress, 2);

    const p = phase === 'inhale' ? eased : 1 - eased;

    resizeCanvas();
    mode.draw(p, phase, ctx, window.innerWidth, window.innerHeight);
  }

  animFrame = requestAnimationFrame(animate);
}

// ---- Beat / Phase Logic ----
function flashDot() {
  pulseDot.classList.add('on');
  setTimeout(() => pulseDot.classList.remove('on'), 200);
}

function flashBeat() {
  beatNum.classList.add('flash');
  setTimeout(() => beatNum.classList.remove('flash'), 200);
}

function startBeatCounter(totalBeats, onBeat) {
  currentBeat = 0;
  clearInterval(beatInterval);
  currentBeat = 1;
  onBeat(currentBeat, totalBeats);

  beatInterval = setInterval(() => {
    currentBeat++;
    if (currentBeat <= totalBeats) {
      onBeat(currentBeat, totalBeats);
    } else {
      clearInterval(beatInterval);
    }
  }, BEAT_MS);
}

function inhale() {
  if (!running) return;
  phase = 'inhale';
  phaseStart = Date.now();

  label.textContent = 'in';
  label.style.opacity = '1';

  const mode = MODES[modeIndex];
  if (mode.type === 'fill') {
    fill.style.setProperty('--duration', INHALE_MS + 'ms');
    fill.style.height = '82%';
  }

  playTransition(true);

  startBeatCounter(INHALE_BEATS, (b) => {
    beatNum.textContent = b;
    flashDot();
    flashBeat();
    playInhaleBeat(b);
  });

  setTimeout(() => { if (running) exhale(); }, INHALE_MS);
}

function exhale() {
  if (!running) return;
  phase = 'exhale';
  phaseStart = Date.now();

  label.textContent = 'out';

  const mode = MODES[modeIndex];
  if (mode.type === 'fill') {
    fill.style.setProperty('--duration', EXHALE_MS + 'ms');
    fill.style.height = '4%';
  }

  playTransition(false);

  startBeatCounter(EXHALE_BEATS, (b) => {
    beatNum.textContent = b;
    flashDot();
    flashBeat();
    playExhaleBeat(b);
  });

  setTimeout(() => {
    if (running) {
      breathCount++;
      counter.textContent = `${breathCount}`;
      inhale();
    }
  }, EXHALE_MS);
}

// ---- Public API ----
export function start() {
  ensureAudio();

  startScreen.classList.add('hidden');
  running = true;
  breathCount = 0;
  counter.textContent = '';
  phase = 'idle';

  setMode(modeIndex);
  resizeCanvas();
  animate();

  setTimeout(inhale, 600);
}

export function stop() {
  running = false;
  phase = 'idle';
  clearInterval(beatInterval);
  cancelAnimationFrame(animFrame);

  fill.style.setProperty('--duration', '800ms');
  fill.style.height = '0%';
  label.textContent = '';
  counter.textContent = '';
  beatNum.textContent = '';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startScreen.classList.remove('hidden');
}

export function nextMode() {
  setMode(modeIndex + 1);
}

export function prevMode() {
  setMode(modeIndex - 1);
}

export function isRunning() {
  return running;
}

// ---- Init ----
window.addEventListener('resize', resizeCanvas);
setMode(0);
