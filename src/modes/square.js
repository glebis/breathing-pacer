export const meta = { name: 'breathing square', cool: false };

export function draw(p, phase, ctx, w, h) {
  const maxS = Math.min(w, h) * 0.55;
  const minS = maxS * 0.2;
  const s = minS + (maxS - minS) * p;

  ctx.clearRect(0, 0, w, h);

  const x = (w - s) / 2, y = (h - s) / 2;

  // Hard shadow - neobrutalist
  ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + p * 0.1})`;
  ctx.fillRect(x + 4, y + 4, s, s);

  ctx.fillStyle = phase === 'inhale'
    ? `rgba(232, 93, 4, ${0.12 + p * 0.18})`
    : `rgba(255, 214, 10, ${0.08 + (1 - p) * 0.12})`;
  ctx.fillRect(x, y, s, s);

  ctx.strokeStyle = `rgba(232, 93, 4, ${0.3 + p * 0.3})`;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, s, s);
}
