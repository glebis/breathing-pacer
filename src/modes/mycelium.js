export const meta = { name: 'mycelium pulse', cool: false, order: 23 };

export function draw(p, phase, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const t = Date.now() * 0.001;
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, 'rgba(20, 8, 0, 1)');
  bg.addColorStop(1, 'rgba(6, 2, 0, 1)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const centerX = w * 0.5 + Math.sin(t * 0.1) * w * 0.03;
  const centerY = h * (0.35 + 0.1 * Math.sin(t * 0.12));
  const branches = 40;

  const palette = [
    [255, 190, 90],
    [255, 160, 60],
    [255, 220, 150],
    [255, 120, 40],
    [255, 210, 120],
  ];

  for (let i = 0; i < branches; i++) {
    const seed = i * 2.7;
    const angle = (i / branches) * Math.PI * 2 + Math.sin(seed + t * 0.3) * 0.4;
    const length = Math.min(w, h) * (0.2 + 0.5 * Math.sin(t * 0.4 + seed));
    const segments = 20;
    let x = centerX;
    let y = centerY;

    const [r, g, b] = palette[i % palette.length];

    for (let s = 0; s < segments; s++) {
      const frac = s / segments;
      const jitter = Math.sin(seed * 3.4 + frac * 8 + t * 1.3) * 0.6;
      const curvature = Math.sin(frac * 2 + seed) * 0.4 + jitter;
      const step = (length / segments) * (0.8 + 0.4 * frac);
      const nx = x + Math.cos(angle + curvature * 0.2) * step;
      const ny = y + Math.sin(angle + curvature * 0.2) * step;

      const glow = 0.15 + 0.35 * Math.pow(1 - frac, 1.5) * (0.5 + 0.5 * Math.sin(t * 2 + seed));
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${glow})`;
      ctx.lineWidth = (2.5 - frac * 2) * (0.7 + p * 0.5);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // nodes growing outward
      const nodeCount = 3;
      for (let n = 0; n < nodeCount; n++) {
        const offset = (n - 1) * 0.6;
        const branchAngle = angle + curvature * 0.3 + offset * 0.7;
        const bx = nx + Math.cos(branchAngle) * step * 0.4;
        const by = ny + Math.sin(branchAngle) * step * 0.4;
        const alpha = 0.02 + 0.2 * (1 - frac) * (0.6 + p * 0.4);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r}, ${g - 20}, ${b - 20}, ${alpha})`;
        ctx.moveTo(nx, ny);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // glowing spores
      const sporeAlpha = Math.max(0, 0.3 - frac * 0.25) * (0.3 + p * 0.7);
      if (sporeAlpha > 0.05) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${255}, ${170 + s % 50}, ${60 + s % 40}, ${sporeAlpha})`;
        ctx.arc(nx, ny, 1.3 + (1 - frac) * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      x = nx;
      y = ny;
    }
  }

  // pulsating root circle
  const rootRadius = Math.min(w, h) * (0.1 + 0.05 * Math.sin(t * 1.2) + p * 0.05);
  const rootGrad = ctx.createRadialGradient(centerX, centerY, rootRadius * 0.2, centerX, centerY, rootRadius * 1.1);
  rootGrad.addColorStop(0, `rgba(255, 190, 120, ${0.5 + p * 0.3})`);
  rootGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rootGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, rootRadius, 0, Math.PI * 2);
  ctx.fill();
}
