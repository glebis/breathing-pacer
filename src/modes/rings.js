export const meta = { name: 'concentric rings', cool: false, order: 4 };

export function draw(p, phase, ctx, w, h) {
  const maxR = Math.min(w, h) * 0.4;
  const rings = 5;

  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < rings; i++) {
    const rp = (i + 1) / rings;
    const baseR = maxR * rp * 0.3;
    const expandR = maxR * rp * p * 0.7;
    const r = baseR + expandR;

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
    const alpha = (0.1 + (1 - rp) * 0.2) * (phase === 'inhale' ? p : 1 - p * 0.5);
    ctx.strokeStyle = i % 2 === 0
      ? `rgba(232, 93, 4, ${alpha})`
      : `rgba(255, 214, 10, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
