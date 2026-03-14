export const meta = { name: 'cool diagonal', cool: true, order: 5 };

export function draw(p, phase, ctx, w, h) {
  const diag = Math.sqrt(w * w + h * h);

  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 4);

  const fullH = diag * 1.2;
  const fullW = diag * 1.2;
  const fillH = fullH * (0.05 + p * 0.9);

  const grad = ctx.createLinearGradient(0, fullH / 2 - fillH, 0, fullH / 2);
  grad.addColorStop(0, `rgba(58, 134, 255, 0.02)`);
  grad.addColorStop(0.5, `rgba(100, 180, 255, ${0.15 + p * 0.15})`);
  grad.addColorStop(1, `rgba(58, 134, 255, ${0.25 + p * 0.15})`);

  ctx.fillStyle = grad;
  ctx.fillRect(-fullW / 2, fullH / 2 - fillH, fullW, fillH);

  ctx.strokeStyle = `rgba(140, 210, 255, ${0.3 + p * 0.4})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-fullW / 2, fullH / 2 - fillH);
  ctx.lineTo(fullW / 2, fullH / 2 - fillH);
  ctx.stroke();

  ctx.restore();
}
