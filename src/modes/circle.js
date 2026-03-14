export const meta = { name: 'expanding circle', cool: false, order: 1 };

export function draw(p, phase, ctx, w, h) {
  const maxR = Math.min(w, h) * 0.38;
  const minR = maxR * 0.15;
  const r = minR + (maxR - minR) * p;

  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
  ctx.fillStyle = phase === 'inhale'
    ? `rgba(232, 93, 4, ${0.15 + p * 0.2})`
    : `rgba(255, 214, 10, ${0.1 + (1 - p) * 0.15})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 214, 10, ${0.2 + p * 0.3})`;
  ctx.lineWidth = 2;
  ctx.stroke();
}
