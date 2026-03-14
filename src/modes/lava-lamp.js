export const meta = { name: 'lava lamp', cool: false, order: 20 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const bgPulse = 0.6 + 0.4 * Math.sin(t * 0.3 + p * Math.PI);
  ctx.fillStyle = `rgba(24, 6, 3, ${0.75 + bgPulse * 0.15})`;
  ctx.fillRect(0, 0, w, h);

  const blobCount = 6;
  const palette = [
    [255, 120, 40],
    [255, 90, 80],
    [255, 180, 60],
    [240, 75, 35],
    [255, 150, 90],
    [255, 210, 120],
  ];

  for (let i = 0; i < blobCount; i++) {
    const seed = i * 37.143;
    const riseLoop = (t * 0.055 + seed * 0.001 + p * 0.18) % 1;
    const centerY = h + 120 - riseLoop * (h + 200);
    const sway = Math.sin(t * 0.4 + seed) * 50 + Math.sin(t * 0.8 + seed * 2) * 30;
    const centerX = w * ((i + 1) / (blobCount + 1)) + sway;

    const inhaleBoost = phase === 'inhale' ? 1.15 : 0.9;
    const baseRadius = (80 + i * 8) * (0.6 + p * 0.9) * inhaleBoost;
    const pulsate = 1 + 0.2 * Math.sin(t * 1.2 + seed * 1.7);
    const radius = baseRadius * pulsate;

    const [r, g, b] = palette[i % palette.length];
    const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius * 1.2);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
    grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.65)`);
    grad.addColorStop(1, `rgba(${Math.max(0, r - 80)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)}, 0.05)`);
    ctx.fillStyle = grad;

    ctx.beginPath();
    const steps = 40;
    for (let s = 0; s <= steps; s++) {
      const angle = (s / steps) * Math.PI * 2;
      const wobble = 0.25 * Math.sin(angle * 3 + t * 1.2 + seed) + 0.15 * Math.sin(angle * 8 + seed * 2 + t * 2.4);
      const squash = 1 + 0.3 * Math.sin(p * Math.PI + seed);
      const rx = Math.cos(angle) * radius * (1 + wobble * 0.4);
      const ry = Math.sin(angle) * radius * squash * (1 + wobble * 0.2);
      const x = centerX + rx;
      const y = centerY + ry;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // faint glow overlay to mimic fluid fog
  const glow = ctx.createLinearGradient(0, 0, 0, h);
  glow.addColorStop(0, 'rgba(255, 200, 180, 0.02)');
  glow.addColorStop(0.5, `rgba(255, 150, 90, ${0.08 + p * 0.06})`);
  glow.addColorStop(1, 'rgba(15, 3, 0, 0.2)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}
