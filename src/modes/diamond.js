export const meta = { name: 'diamond', cool: false, order: 3 };

export function draw(p, phase, ctx, w, h) {
  const maxS = Math.min(w, h) * 0.35;
  const minS = maxS * 0.15;
  const s = minS + (maxS - minS) * p;

  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(Math.PI / 4);

  ctx.fillStyle = phase === 'inhale'
    ? `rgba(232, 93, 4, ${0.15 + p * 0.2})`
    : `rgba(255, 214, 10, ${0.1 + (1 - p) * 0.15})`;
  ctx.fillRect(-s / 2, -s / 2, s, s);

  ctx.strokeStyle = `rgba(255, 214, 10, ${0.25 + p * 0.35})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(-s / 2, -s / 2, s, s);

  ctx.restore();
}
