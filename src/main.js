import { start, stop, nextMode, prevMode, isRunning } from './core/engine.js';

// ---- Events ----
document.getElementById('startScreen').addEventListener('click', start);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isRunning()) stop();
  } else if ((e.key === ' ' || e.key === 'Enter') && !isRunning()) {
    start();
  } else if (e.key === 'ArrowRight') {
    nextMode();
  } else if (e.key === 'ArrowLeft') {
    prevMode();
  }
});

let lastTap = 0;
document.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTap < 300 && isRunning()) stop();
  lastTap = now;
});
