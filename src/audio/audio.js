let audioCtx = null;
let convolver = null;
let reverbGain = null;
let dryGain = null;

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

  convolver.connect(reverbGain);
  reverbGain.connect(audioCtx.destination);
  dryGain.connect(audioCtx.destination);
}

export function ensureAudio() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, volume = 0.06, type = 'triangle') {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(dryGain);
  gain.connect(convolver);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration + 0.1);
}

export function playInhaleBeat(b) {
  playTone(220 + (b - 1) * 44, 0.18, 0.05, 'triangle');
}

export function playExhaleBeat(b) {
  playTone(415 - (b - 1) * 33, 0.22, 0.035, 'sine');
}

export function playTransition(isInhale) {
  const base = isInhale ? 330 : 262;
  playTone(base, 0.4, 0.03, 'triangle');
  setTimeout(() => playTone(base * 1.25, 0.35, 0.02, 'sine'), 60);
}
