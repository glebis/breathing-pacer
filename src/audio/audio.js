let audioCtx = null;
let convolver = null;
let reverbGain = null;
let dryGain = null;
let masterGain = null;
let volume = 1.0;

// Sound modes
const SOUND_MODES = ['8bit', 'sonar', 'warm pad', 'heartbeat', 'silent'];
let soundModeIndex = 0;

export function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * 1.5;
  const impulse = audioCtx.createBuffer(2, length, sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }

  convolver = audioCtx.createConvolver();
  convolver.buffer = impulse;

  reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.35;

  dryGain = audioCtx.createGain();
  dryGain.gain.value = 0.7;

  masterGain = audioCtx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(audioCtx.destination);

  convolver.connect(reverbGain);
  reverbGain.connect(masterGain);
  dryGain.connect(masterGain);
}

export function ensureAudio() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, vol = 0.06, type = 'triangle') {
  if (!audioCtx || getSoundMode() === 'silent') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(dryGain);
  gain.connect(convolver);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration + 0.1);
}

// Sonar ping: sine wave with long decay and heavy reverb
function playSonarPing(freq, isHigh) {
  if (!audioCtx || getSoundMode() !== 'sonar') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  // Slight frequency drop for depth
  osc.frequency.exponentialRampToValueAtTime(freq * 0.95, audioCtx.currentTime + 0.8);

  const vol = isHigh ? 0.04 : 0.025;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
  // Long exponential decay
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

  osc.connect(gain);
  // Heavy reverb, less dry
  gain.connect(convolver);
  const sonarDry = audioCtx.createGain();
  sonarDry.gain.value = 0.15; // mostly wet
  gain.connect(sonarDry);
  sonarDry.connect(masterGain);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 2);
}

// ---- 8-bit sounds ----
function play8bitInhale(b) {
  playTone(220 + (b - 1) * 44, 0.18, 0.05, 'triangle');
}

function play8bitExhale(b) {
  playTone(415 - (b - 1) * 33, 0.22, 0.035, 'sine');
}

function play8bitTransition(isInhale) {
  const base = isInhale ? 330 : 262;
  playTone(base, 0.4, 0.03, 'triangle');
  setTimeout(() => playTone(base * 1.25, 0.35, 0.02, 'sine'), 60);
}

// ---- Sonar sounds ----
function playSonarInhale(b) {
  // Rising pings, higher each beat
  playSonarPing(280 + (b - 1) * 60, b === 1);
}

function playSonarExhale(b) {
  // Falling pings, lower each beat
  playSonarPing(500 - (b - 1) * 40, b === 1);
}

function playSonarTransition(isInhale) {
  playSonarPing(isInhale ? 220 : 180, true);
}

// ---- Warm pad sounds: major triads with sustained overtones ----
function playPadChord(notes, vol, duration) {
  if (!audioCtx) return;
  for (const freq of notes) {
    // Fundamental
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(vol * 0.7, audioCtx.currentTime + duration * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(convolver);
    gain.connect(dryGain);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration + 0.1);

    // Soft octave overtone
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);
    gain2.gain.setValueAtTime(0, audioCtx.currentTime);
    gain2.gain.linearRampToValueAtTime(vol * 0.15, audioCtx.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration * 0.7);
    osc2.connect(gain2);
    gain2.connect(convolver);
    osc2.start(audioCtx.currentTime);
    osc2.stop(audioCtx.currentTime + duration + 0.1);
  }
}

// C major ascending voicings for inhale
const PAD_INHALE_CHORDS = [
  [261.6, 329.6, 392.0],  // C major
  [293.7, 370.0, 440.0],  // D major
  [329.6, 415.3, 493.9],  // E major (passing)
  [349.2, 440.0, 523.3],  // F major
  [392.0, 493.9, 587.3],  // G major
];

// Descending for exhale
const PAD_EXHALE_CHORDS = [
  [392.0, 493.9, 587.3],  // G major
  [349.2, 440.0, 523.3],  // F major
  [329.6, 415.3, 493.9],  // E major
  [293.7, 370.0, 440.0],  // D major
  [261.6, 329.6, 392.0],  // C major
  [246.9, 311.1, 370.0],  // B major (resolve down)
];

function playPadInhale(b) {
  const chord = PAD_INHALE_CHORDS[(b - 1) % PAD_INHALE_CHORDS.length];
  playPadChord(chord, 0.025, 1.2);
}

function playPadExhale(b) {
  const chord = PAD_EXHALE_CHORDS[(b - 1) % PAD_EXHALE_CHORDS.length];
  playPadChord(chord, 0.02, 1.4);
}

function playPadTransition(isInhale) {
  const chord = isInhale ? [261.6, 329.6, 392.0] : [196.0, 246.9, 293.7];
  playPadChord(chord, 0.03, 1.8);
}

// ---- Heartbeat: low-frequency thump with double-beat ----
function playHeartThump(strong) {
  if (!audioCtx) return;
  const vol = strong ? 0.08 : 0.04;
  const freq = strong ? 55 : 45; // deep bass

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(dryGain);
  gain.connect(convolver);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);

  // Second beat (lub-DUB) - slightly delayed
  if (strong) {
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(65, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.12);
      gain2.gain.setValueAtTime(0, audioCtx.currentTime);
      gain2.gain.linearRampToValueAtTime(vol * 0.6, audioCtx.currentTime + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
      osc2.connect(gain2);
      gain2.connect(dryGain);
      gain2.connect(convolver);
      osc2.start(audioCtx.currentTime);
      osc2.stop(audioCtx.currentTime + 0.25);
    }, 120);
  }
}

function playHeartInhale(b) {
  playHeartThump(b === 1 || b === 3);
}

function playHeartExhale(b) {
  playHeartThump(b === 1 || b === 4);
}

function playHeartTransition(isInhale) {
  playHeartThump(true);
}

// ---- Public API dispatches by mode ----
export function playInhaleBeat(b) {
  const mode = getSoundMode();
  if (mode === '8bit') play8bitInhale(b);
  else if (mode === 'sonar') playSonarInhale(b);
  else if (mode === 'warm pad') playPadInhale(b);
  else if (mode === 'heartbeat') playHeartInhale(b);
}

export function playExhaleBeat(b) {
  const mode = getSoundMode();
  if (mode === '8bit') play8bitExhale(b);
  else if (mode === 'sonar') playSonarExhale(b);
  else if (mode === 'warm pad') playPadExhale(b);
  else if (mode === 'heartbeat') playHeartExhale(b);
}

export function playTransition(isInhale) {
  const mode = getSoundMode();
  if (mode === '8bit') play8bitTransition(isInhale);
  else if (mode === 'sonar') playSonarTransition(isInhale);
  else if (mode === 'warm pad') playPadTransition(isInhale);
  else if (mode === 'heartbeat') playHeartTransition(isInhale);
}

// ---- Sound mode cycling ----
export function getSoundMode() {
  return SOUND_MODES[soundModeIndex];
}

export function cycleSoundMode() {
  soundModeIndex = (soundModeIndex + 1) % SOUND_MODES.length;
  return SOUND_MODES[soundModeIndex];
}

export function getSoundModes() {
  return SOUND_MODES;
}

// ---- Volume ----
export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (masterGain) masterGain.gain.value = volume;
  return volume;
}

export function getVolume() {
  return volume;
}

export function toggleMute() {
  if (volume > 0) {
    volume = 0;
  } else {
    volume = 1.0;
  }
  if (masterGain) masterGain.gain.value = volume;
  return volume;
}
