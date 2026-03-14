export const meta = { name: 'ink drops', cool: true, order: 24 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, 'rgba(0, 9, 25, 1)');
  bg.addColorStop(1, 'rgba(0, 4, 18, 1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const drops = 6;
  for (let i = 0; i < drops; i++) {
    const seed = i * 1.9;
    const baseX = (w / (drops + 1)) * (i + 1);
    const drift = Math.sin(t * 0.2 + seed) * w * 0.05;
    const centerX = baseX + drift;
    const centerY = h * (0.2 + 0.6 * (i / drops)) + Math.cos(t * 0.25 + seed) * 30;
    const radius = Math.min(w, h) * (0.12 + 0.08 * (i / drops)) * (0.7 + p * 0.8);

    const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius);
    grad.addColorStop(0, `rgba(80, 190, 255, ${0.35 + 0.3 * p})`);
    grad.addColorStop(0.4, `rgba(0, 120, 220, ${0.25 + 0.2 * p})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // diffusion ripples
  const ripples = 9;
  for (let i = 0; i < ripples; i++) {
    const phaseShift = (i / ripples) * Math.PI * 2;
    const spread = Math.min(w, h) * (0.2 + i * 0.1) * (0.5 + p * 0.8);
    const alpha = 0.05 + 0.08 * Math.sin(t * 0.6 + phaseShift + p * Math.PI);
    ctx.strokeStyle = `rgba(90, 200, 255, ${Math.max(0, alpha)})`;
    ctx.lineWidth = 1.2 + Math.sin(t * 2 + i) * 0.4;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.5, spread, 0, Math.PI * 2);
    ctx.stroke();
  }

  // vertical ink tendrils
  const tendrilCount = 70;
  for (let i = 0; i < tendrilCount; i++) {
    const frac = i / tendrilCount;
    const startX = w * frac + Math.sin(t * 0.4 + frac * 40) * 8;
    const startY = h * 0.1 + Math.sin(t * 0.9 + frac * 20) * 5;
    const length = h * 0.6 + Math.sin(frac * 10 + t) * 40;
    const wobble = Math.sin(frac * 40 + t * 3) * 15;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(
      startX + wobble * 0.3,
      startY + length * 0.3,
      startX - wobble,
      startY + length * 0.7,
      startX + Math.sin(t * 0.6 + frac * 30) * 10,
      startY + length
    );
    ctx.strokeStyle = `rgba(50, 140, 220, ${0.08 + 0.15 * (1 - frac)})`;
    ctx.lineWidth = 0.8 + 0.4 * Math.sin(frac * 50 + t * 1.5);
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // floating particles
  const particles = 100;
  for (let i = 0; i < particles; i++) {
    const px = ((i * 139 + 31) % 1000) / 1000 * w + Math.sin(t * 0.3 + i) * 6;
    const py = ((i * 197 + 17) % 1000) / 1000 * h + Math.cos(t * 0.2 + i * 1.1) * 8;
    const fade = 0.02 + 0.1 * (0.5 + 0.5 * Math.sin(t * 1.7 + i * 4));
    ctx.fillStyle = `rgba(130, 210, 255, ${fade})`;
    ctx.beginPath();
    ctx.arc(px, py, 0.9 + (i % 4) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
